import pkg from "pg";
import dbConfig from "../connections/postgresConnection.js";

const { Client } = pkg;

const insertMessage = async (senderUID, receiverUID, message) => {
    const client = new Client(dbConfig);
    try {
      await client.connect();
  
      const conversation_id = [senderUID, receiverUID].sort().join('');
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
      SELECT insert_message($1, $2, $3, $4);
      `;
      const values = [conversation_id, message, timestamp, senderUID];
  
      const result = await client.query(query, values);
  
      console.log('Message inserted successfully!');
  
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      client.end();
    }
};

export {insertMessage};  