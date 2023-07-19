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

// Edit Community
const editCommunity = async (req, res) => {
  const { commName, n_commName, n_commProfileImage, n_commBio } = req.body;

  const session = driver.session();

  try {
    const findCommunityQuery = `
      MATCH (c:Community {commName: $commName})
      RETURN c
    `;
    const result = await session.run(findCommunityQuery, { commName });
    const communityNode = result.records[0]?.get('c');

    if (communityNode) {
      const updateQuery = `
        MATCH (c:Community {commName: $commName})
        SET c.commName = $n_commName, c.profImgURL = $n_commProfileImage, c.commBio = $n_commBio
      `;
      await session.run(updateQuery, {
        commName,
        n_commName,
        n_commProfileImage,
        n_commBio,
      });

      res.status(200).json({ message: "Community edited successfully" });
    } else {
      res.status(404).json({ error: "Community not found" });
    }
  } catch (error) {
    console.error("Error editing community:", error.message);
    res.status(500).json({ error: "Error editing community" });
  } finally {
    session.close();
  }
};


export { createCommunity, editCommunity };
