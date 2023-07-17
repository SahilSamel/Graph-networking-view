import driver from "../connections/neo4j.js";

// <-- GRAPH FUNCTIONALITIES -->

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

// Make connection


// <-- End of GRAPH FUNCTIONALITIES -->
export { fetchGraph };
