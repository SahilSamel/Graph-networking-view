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

  const getProfileFromCommName = async (req, res) => {
    const commName = req.body.commName;
    const session = driver.session();
    console.log("backend",commName);
    try {
      const result = await session.run(
        'MATCH (c:Community {commName: $commName}) RETURN c',
        { commName }
      );
  
      // Check if the query result contains any records
      if (result.records.length === 0) {
        res.status(404).json({ error: "Community profile not found" });
        return;
      }
  
      // Extract the community profile object from the result
      const communityProfile = result.records[0].get('c').properties;
  
      // Send the community profile in the response
      console.log(communityProfile);
      res.json(communityProfile);
    } catch (error) {
      console.error("An error occurred:", error.message);
      res.status(500).json({ error: "Error retrieving community profile" });
    } finally {
      await session.close();
    }
  };

  export {getProfileFromId, getProfileFromCommName};