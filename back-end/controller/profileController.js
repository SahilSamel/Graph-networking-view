import pkg from "pg";
const { Client } = pkg;
import dbConfig from "../connections/postgresConnection.js";
import driver from "../connections/neo4j.js";

// <-- USER PROFILE FUNCTIONALITIES -->

// Get user profile
const getProfile = async (req, res) => {
  const userId = req.userId.id;
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const query = "SELECT * FROM get_user_info($1)";
    const values = [userId];
    const result = await client.query(query, values);

    const profile = result.rows[0];
    console.log(profile);
    res.status(200).json(profile);
    
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Error retrieving profile" });
  } finally {
    client.end();
  }
};





// Check if there is a relation
const getIfConnected = async (req, res) => {
  const userId = req.userId.id;
  const { n_commName, n_userId } = req.body;

  const session = driver.session();

  try {
    if (n_commName) {
      const query = `
        MATCH (u:User {userId: $userId})-[:Member_Of]-(c:Community {commName: $n_commName})
        RETURN COUNT(*) AS count
      `;
      const result = await session.run(query, { userId, n_commName });
      const count = result.records[0].get('count').toNumber();
      res.status(200).json({ isConnected: count > 0 });
    } else if (n_userId) {
      const query = `
        MATCH (u1:User {userId: $userId})-[r:CONNECTED]-(u2:User {userId: $n_userId})
        RETURN COUNT(*) AS count
      `;
      const result = await session.run(query, { userId, n_userId });
      const count = result.records[0].get('count').toNumber();
      res.status(200).json({ isConnected: count > 0 });
    } else {
      res.status(400).json({ error: "Invalid request parameters" });
    }
  } catch (error) {
    console.error("Error checking connection:", error.message);
    res.status(500).json({ error: "Error checking connection" });
  } finally {
    session.close();
  }
};

// Edit user profile
const editProfile = async (req, res) => {

  const {
    uid,
    profImgURL,
    userName,
    name,
    email,
    bio,
    hobbies,
    occupation,
    education,

  } = req.body;
  const client = new Client(dbConfig);
  try{
    await client.connect();
    const session = driver.session();
    const currentProfile = getProfile(req,res);
    if(currentProfile.profImgURL !== profImgURL || currentProfile.userName !== userName){
      await session.run(
        "MATCH (u:User {userId: $uid}) SET u.profImgURL = $profImgURL, u.userName = $userName",
        { uid, profImgURL, userName }
      );
    }
    
    const query = "SELECT edit_user($1, $2, $3, $4, $5, $6, $7, $8, $9)";
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
    console.log(result.rows[0].edit_user);
    res.status(200).json({ status: "OK" });
  
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Error editing profile" });
  }finally{
    client.end();
  }

};


export { getProfile, getIfConnected, editProfile };
