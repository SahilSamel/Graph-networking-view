import pkg from "pg";
const { Client } = pkg;
import dbConfig from "../connections/postgresConnection.js";

const getProfile = async (req, res) => {
    const userId = req.userId.id;
    const client = new Client(dbConfig);
  
    try {
      await client.connect();
  
      const query = "SELECT * FROM get_user_info($1)";
      const values = [userId];
      const result = await client.query(query, values);
  
      const profile = result.rows[0];
  
      res.status(200).json({ profile });
    } catch (error) {
      console.error("An error occurred:", error.message);
      res.status(500).json({ error: "Error retrieving profile" });
    } finally {
      client.end();
    }
  };

export {getProfile};