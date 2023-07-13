import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import pkg from "pg";
const { Client } = pkg;

import dbConfig from "../connections/postgresConnection.js";
import driver from "../connections/neo4j.js";
import jwt from "jsonwebtoken";

// <-- USER AUTH FUNCTIONS -->

// Creating new User entry
const createUser = (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      req.userId = uid;
      assignCookies(req, res);
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};

// Sign In with Email and Pass
const signIn = (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;
      req.userId = uid;
      assignCookies(req, res);
    })
    .catch((error) => {
      res.status(401).json({ error: error.message });
    });
};

// Check if user logged In
const checkLogin = (req, res) => {
  if (req.cookies && req.cookies.token) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

// Check if user logged In
const assignCookies = (req, res) => {
  const { uid } = req.body;
  const token = jwt.sign({ id: uid }, process.env.JWT_SECRET);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(201)
    .json({ uid });
};

// <-- End of USER AUTH FUNCTIONS -->

// <-- DATABASE FUNCTIONS -->

// Database check for user information
const uidDatabaseCheck = async (req, res) => {
  const { uid } = req.body;
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const query = "SELECT check_uid_exists($1)";
    const values = [uid];
    const result = await client.query(query, values);
    if (result.rows[0].check_uid_exists) {
      res.status(200).json({ status: "OK" });
    } else {
      res.status(404).json({ error: "User information not found" });
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.end();
  }
};

// Database Entry for User
const registerUser = async (req, res) => {
  const {
    uid,
    email,
    profImgURL,
    userName,
    name,
    bio,
    hobbies,
    occupation,
    education,
  } = req.body;
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

// <-- End of DATABASE FUNCTIONS -->

export {
  createUser,
  registerUser,
  checkLogin,
  assignCookies,
  signIn,
  uidDatabaseCheck,
};
