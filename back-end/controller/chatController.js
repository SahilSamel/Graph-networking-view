import pkg from "pg";
const { Client } = pkg;
import dbConfig from "../connections/postgresConnection.js";
import driver from "../connections/neo4j.js";

const getProfileFromId = async (req, res) => {
    const userId = req.body.nodeid;
    console.log(userId);  
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
  export {getProfileFromId};