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

    res.status(200);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Error retrieving profile" });
  } finally {
    client.end();
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


export { getProfile,editProfile };
