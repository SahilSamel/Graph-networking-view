import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import driver from "../connections/neo4j.js"
import client from "../connections/postgresConnection.js";
// Database Entry for User
const registerUser = (uid,email,userName) => {
  const session = driver.session(); // neo4j session creation

  session
    .run("CREATE (:User {uid: $uid})", { uid,userName }) // Create query for Neo4j Cypher
    .then(() => {
          console.log("User saved successfully.");
          client.connect();

          try {
            const query = 'SELECT register_user($1, $2)';
            const values = [`${userName}`, `${email}`];
            const result = client.query(query, values);
            // Handle successful function execution
            console.log(result.rows[0].register_user); // Access the return value if applicable
          } catch (error) {
            console.error('An error occurred:', error.message);
          }
          
          // Disconnect from the database
          client.end();

    })
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
  const { email, password, userName } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;

      registerUser(uid,email,userName); // Make mongo and neo4j entry
      res.status(201).json({ token, uid, userHandle }); // Pass auth token as response
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};


export {createUser};