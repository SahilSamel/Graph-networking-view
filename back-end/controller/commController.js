import driver from "../connections/neo4j.js";

// Create Community
const createCommunity = async (req, res) => {
  const userId = req.userId.id;
  const { commName, commProfileImage, commBio } = req.body;

  const session = driver.session();

  try {
    await session.run(
      "CREATE (:Community { commName: $commName, profImgURL: $profImgURL, commBio: $commBio}) ",
      { commName, profImgURL: commProfileImage, commBio }
    );

    await session.run(
      "MATCH (u:User {userId: $userId}), (c:Community {commName: $commName}) " +
      "CREATE (u)-[:Member_Of]->(c)",
      { userId, commName }
    );

    res.status(200).json({ message: "Community created successfully" });
  } catch (error) {
    console.error("Community could not be created:", error.message);
    res.status(500).json({ error: "Error creating the community" });
  } finally {
    session.close();
  }
};

export { createCommunity };
