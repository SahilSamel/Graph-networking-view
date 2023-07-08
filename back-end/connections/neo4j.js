import neo4j from "neo4j-driver";

//<-- NEO4J CONNECTION ESTABLISHMENT -->
let driver;
try {
  driver = neo4j.driver(
    process.env.NeoURI,                                               //passing neo4j URI
    neo4j.auth.basic(process.env.NeoUSER, process.env.NeoPASS)        //passing username and password
  );

  console.log("Neo4j credentials verified: Connection established");
} catch (error) {
  console.log(error);
}
//<-- End of NEO4J CONNECTION ESTABLISHMENT -->

export default driver;