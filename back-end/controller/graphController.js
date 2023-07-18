import driver from "../connections/neo4j.js";

// <-- GRAPH FUNCTIONALITIES -->

// <-- FETCH USER RELATED INFORMATION -->

// Fetching the user specific graph
const fetchGraph = (req, res) => {
  const session = driver.session();
  const query = `
  MATCH (n)-[r]-(m)
  WHERE id(n) < id(m)
  RETURN 
  n {.*, labels: labels(n)} AS source, 
  r AS edge, 
  m {.*, labels: labels(m)} AS target
  `;

  session
    .run(query)
    .then((result) => {
      const nodesSet = new Set(); // To store unique node IDs
      const nodes = [];
      const edges = [];

      result.records.forEach((record) => {
        const source = record.get("source");
        const edge = record.get("edge");
        const target = record.get("target");

        let sourceId, sourceLabel, sourceImage;
        let targetId, targetLabel, targetImage;

        if (source.labels.includes("User")) {
          sourceId = "User_" + source.userId;
          sourceLabel = source.userName;
          sourceImage = source.profImgURL;
        } else if (source.labels.includes("Community")) {
          sourceId = "Community_" + source.commName;
          sourceLabel = source.commName;
          sourceImage = source.profImgURL;
        }

        if (target.labels.includes("User")) {
          targetId = "User_" + target.userId;
          targetLabel = target.userName;
          targetImage = target.profImgURL;
        } else if (target.labels.includes("Community")) {
          targetId = "Community_" + target.commName;
          targetLabel = target.commName;
          targetImage = target.profImgURL;
        }

        const sourceNode = {
          id: sourceId,
          label: sourceLabel,
          image: sourceImage,
          shape: "circularImage",
          title: sourceLabel,
        };

        const targetNode = {
          id: targetId,
          label: targetLabel,
          image: targetImage,
          shape: "circularImage",
          title: targetLabel,
        };

        if (!nodesSet.has(sourceId)) {
          nodes.push(sourceNode);
          nodesSet.add(sourceId);
        }

        if (!nodesSet.has(targetId)) {
          nodes.push(targetNode);
          nodesSet.add(targetId);
        }

        edges.push({
          from: sourceId,
          to: targetId,
          label: edge.type,
        });
      });

      const graphData = { nodes, edges };
      res.json(graphData);
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).json({ error: "An error occurred" });
    })
    .finally(() => {
      session.close();
    });
};

// Fetch user connections informations
const getConnections = async (req, res) => {
  const userId = req.userId.id;
  const session = driver.session();

  try {
    const connectedQuery = `
      MATCH (u:User {userId: $userId})-[:CONNECTED]->(n:User)
      RETURN COUNT(*) as connectedCount`;
    const connectedResult = await session.run(connectedQuery, { userId });
    const connectedCount = connectedResult.records[0]
      .get("connectedCount")
      .toNumber();

    const memberOfQuery = `
      MATCH (u:User {userId: $userId})-[:Member_Of]->(n:Community)
      RETURN COUNT(*) as memberOfCount
    `;
    const memberOfResult = await session.run(memberOfQuery, { userId });
    const memberOfCount = memberOfResult.records[0]
      .get("memberOfCount")
      .toNumber();

    res.status(200).json({ connectedCount, memberOfCount });
  } catch (error) {
    console.error("Error fetching connections:", error.message);
    res.status(500).json({ error: "Error fetching connections" });
  } finally {
    session.close();
  }
};

// <-- End of FETCH USER RELATED INFORMATION -->

// Make connection
const makeConnection = async (req, res) => {
  const userId = req.userId.id;
  const { n_userId, n_commName } = req.body;

  const session = driver.session();

  try {
    if (n_userId) {
      const checkQuery = `
      MATCH (u:User {userId: $userId})-[:CONNECTED]-(n:User {userId: $n_userId})
      RETURN COUNT(*) as count
      `;
      const result = await session.run(checkQuery, { userId, n_userId });
      const count = result.records[0].get("count").toNumber();

      if (count === 0) {
        const createQuery = `
          MATCH (u:User {userId: $userId})
          MATCH (n:User {userId: $n_userId})
          CREATE (u)-[:CONNECTED]->(n)
        `;
        await session.run(createQuery, { userId, n_userId });
      }
    }

    if (n_commName) {
      const checkQuery = `
        MATCH (u:User {userId: $userId})-[:Member_Of]-(n:Community {commName: $n_commName})
        RETURN COUNT(*) as count
      `;
      const result = await session.run(checkQuery, { userId, n_commName });
      const count = result.records[0].get("count").toNumber();

      if (count === 0) {
        const createQuery = `
          MATCH (u:User {userId: $userId})
          MATCH (n:Community {commName: $n_commName})
          CREATE (u)-[:Member_Of]->(n)
        `;
        await session.run(createQuery, { userId, n_commName });
      }
    }

    res.status(200).json({ message: "Connections made successfully" });
  } catch (error) {
    console.error("Error creating connections:", error.message);
    res.status(500).json({ error: "Error creating connections" });
  } finally {
    session.close();
  }
};

//Delete Connection
const deleteConnection = async (req, res) => {
  const userId = req.userId.id;
  const { n_userId, n_commName } = req.body;

  const session = driver.session();

  try {
    if (n_userId) {
      const checkQuery = `
        MATCH (u:User {userId: $userId})-[r:CONNECTED]->(n:User {userId: $n_userId})
        RETURN COUNT(*) as count
      `;
      const result = await session.run(checkQuery, { userId, n_userId });
      const count = result.records[0].get("count").toNumber();

      if (count > 0) {
        const deleteQuery = `
          MATCH (u:User {userId: $userId})-[r:CONNECTED]->(n:User {userId: $n_userId})
          DELETE r
        `;
        await session.run(deleteQuery, { userId, n_userId });
      }
    }

    if (n_commName) {
      const checkQuery = `
        MATCH (u:User {userId: $userId})-[r:Member_Of]->(n:Community {commName: $n_commName})
        RETURN COUNT(*) as count
      `;
      const result = await session.run(checkQuery, { userId, n_commName });
      const count = result.records[0].get("count").toNumber();

      if (count > 0) {
        const deleteQuery = `
          MATCH (u:User {userId: $userId})-[r:Member_Of]->(n:Community {commName: $n_commName})
          DELETE r
        `;
        await session.run(deleteQuery, { userId, n_commName });
      }
    }

    res.status(200).json({ message: "Connections deleted successfully" });
  } catch (error) {
    console.error("Error deleting connections:", error.message);
    res.status(500).json({ error: "Error deleting connections" });
  } finally {
    session.close();
  }
};

// Search user
const searchUser = async (req, res) => {
  const searchQuery = req.query.query;
  const session = driver.session();
  const query = `
  MATCH (user:User)
  WHERE user.userName CONTAINS $searchQuery
  RETURN user
  `;
  const values = {searchQuery};
  await session
    .run(query, values)
    .then((result) => {
   
      const users = result.records.map((record) => record.get('user').properties);
      res.json(users);
    })
    .catch((error) => {
      console.error('Error executing Neo4j query', error);
      res.status(500).json({ error: 'An error occurred while searching for users' });
    })
    .finally(() => {
      session.close();
    });
};

// <-- End of GRAPH FUNCTIONALITIES -->
export { fetchGraph, getConnections, makeConnection, deleteConnection,searchUser };
