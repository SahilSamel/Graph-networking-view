import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import driver from "../connections/neo4j.js"
import client from "../connections/postgresConnection.js";
import jwt from "jsonwebtoken";
// Database Entry for User
const registerUser = (uid,email,userName,profImgURL) => {
  const session = driver.session(); // neo4j session creation

  session
    .run("CREATE (:User {userId: $uid,userName: $userName,profImgURL:$profImgURL}) ", { uid,userName,profImgURL }) // Create query for Neo4j Cypher
    // .then(() => {
    //       console.log("User saved successfully.");
    //       client.connect();

    //       try {
    //         const query = 'SELECT register_user($1, $2)';
    //         const values = [`${userName}`, `${email}`];
    //         const result = client.query(query, values);
    //         // Handle successful function execution
    //         console.log(result.rows[0].register_user); // Access the return value if applicable
    //       } catch (error) {
    //         console.error('An error occurred:', error.message);
    //       }
          
    //       // Disconnect from the database
    //       client.end();

    // })
    .catch((error) => {
      console.log("Error creating node:", error);
    })
    .finally(() => {
      session.close(); // Close the Neo4j session
    });
};

// Creating new User entry
const createUser = (req, res) => {
  const auth = getAuth();
  const { email, password, userName,profImgURL} = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      console.log("Token created successfully:", token);
      const uid = user.uid;

      registerUser(uid,email,userName,profImgURL); // Make mongo and neo4j entry
      res.status(201).json({ token, uid}); // Pass auth token as response
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};

const signIn = (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;

      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Set to true when using HTTPS
        sameSite: 'none',
      }).status(201).json({ token, uid });
    })
    .catch((error) => {
      res.status(401).json({ error:error.message});
    });
};


export {createUser,signIn};