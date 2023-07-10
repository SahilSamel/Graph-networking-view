import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import pkg from 'pg';
const {Client} = pkg;
import dbConfig from "../connections/postgresConnection.js"
import driver from "../connections/neo4j.js";
import jwt from "jsonwebtoken";

// Database Entry for User
const registerUser = async (
  uid,
  profImgURL,
  userName,
  name,
  email,
  bio,
  hobbies,
  occupation,
  education
) => {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const session = driver.session();
    await session.run(
      "CREATE (:User {userId: $uid, userName: $userName, profImgURL: $profImgURL}) ",
      { uid, userName, profImgURL }
    );
    console.log("User saved successfully.");

    const query = "SELECT create_user($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    const values = [
      `${uid}`,
      `${profImgURL}`,
      `${userName}`,
      `${name}`,
      `${email}`,
      `${bio}`,
      `${hobbies}`,
      `${occupation}`,
      `${education}`,
    ];
    const result = await client.query(query, values);

    console.log(result.rows[0].create_user);
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    client.end();
  }
};

// Check if user handle already in use
const checkUserNameExists = async (userName) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const query = "SELECT check_user_exists($1)";
    const values = [userName];
    const result = await client.query(query, values);
    console.log(result.rows[0].check_user_exists);
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    client.end();
  }
};

// Creating new User entry
const createUser = (req, res) => {
  const auth = getAuth();
  const {
    email,
    password,
    profImgURL,
    userName,
    name,
    bio,
    hobbies,
    occupation,
    education,
  } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created successfully:");
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      console.log("Token created successfully:");
      const uid = user.uid;

      registerUser(
        uid,
        profImgURL,
        userName,
        name,
        email,
        bio,
        hobbies,
        occupation,
        education
      ); // Make mongo and neo4j entry
      res.status(201).json({ token, uid }); // Pass auth token as response
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