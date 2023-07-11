import driver from "../connections/neo4j.js";

const fetchGraph = (req, res) => {
  const session = driver.session();
  const query = `
    MATCH (n)-[r]->(m)
    RETURN n.userId AS source, m.userId AS target, n.userName AS sourceUsername, m.userName AS targetUsername, n.profImgURL AS sourceProfileImage, m.profImgURL AS targetProfileImage
  `;

  session
    .run(query)
    .then((result) => {
      const nodes = [];
      const edges = [];

      result.records.forEach((record) => {
        const sourceId = record.get("source");
        const targetId = record.get("target");
        const sourceUsername = record.get("sourceUsername");
        const targetUsername = record.get("targetUsername");
        const sourceProfileImage = record.get("sourceProfileImage");
        const targetProfileImage = record.get("targetProfileImage");

        nodes.push({
          id: sourceId,
          label: sourceUsername,
          image: sourceProfileImage,
          shape: "circularImage",
          title: sourceUsername,
        });

        nodes.push({
          id: targetId,
          label: targetUsername,
          image: targetProfileImage,
          shape: "circularImage",
          title: targetUsername,
        });

        edges.push({
          from: sourceId,
          to: targetId,
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

export {fetchGraph}
