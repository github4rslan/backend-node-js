const express = require("express");
const axios = require("axios");
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "twitter241.p.rapidapi.com";
const API_BASE_URL = `https://${RAPIDAPI_HOST}`;

const HEADERS = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST,
};

// ✅ 1. Get user info by username
router.post("/get-user", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      params: { username },
      headers: HEADERS,
    });

    if (!response.data) return res.status(404).json({ error: "User not found" });

    res.json({ type: "user", data: response.data });
  } catch (err) {
    console.error("Error fetching user data:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// ✅ 2. Get tweets (by username OR userId)
router.post("/get-user-tweets", async (req, res) => {
  const { username, userId, count = 20 } = req.body;

  try {
    let resolvedUserId = userId;

    // If only username is given → resolve userId first
    if (!resolvedUserId && username) {
      const userRes = await axios.get(`${API_BASE_URL}/user`, {
        params: { username },
        headers: HEADERS,
      });
      resolvedUserId = userRes.data?.result?.user?.rest_id;
    }

    if (!resolvedUserId) {
      return res.status(400).json({ error: "Either username or userId is required" });
    }

    // ✅ Always request 20 from RapidAPI
    const tweetsRes = await axios.get(`${API_BASE_URL}/user-tweets`, {
      params: { user: resolvedUserId, count: "20" },
      headers: HEADERS,
    });

    console.log(`Fetching tweets for userId=${resolvedUserId}, requestedCount=${count}`);

    // 🔎 Collect entries from instructions
    const instructions = tweetsRes.data?.result?.timeline?.instructions || [];
    let entries = [];

    for (const inst of instructions) {
      if (inst.entries) entries = entries.concat(inst.entries);
      if (inst.addEntries?.entries) entries = entries.concat(inst.addEntries.entries);
    }

    // ✅ Normalize tweets
    let tweets = entries
      .map((entry) => {
        const content = entry?.content?.itemContent?.tweet_results?.result?.legacy;
        if (!content) return null;
        return {
          id: entry.entryId,
          text: content.full_text,
          createdAt: content.created_at,
        };
      })
      .filter(Boolean);

    // ✅ Apply manual count limit (max 20)
    tweets = tweets.slice(0, Math.min(Number(count) || 20, 20));

    if (!tweets.length) {
      console.log("Raw tweets response:", JSON.stringify(tweetsRes.data, null, 2));
      return res.status(404).json({ error: "No tweets found" });
    }

    res.json({ type: "tweets", data: tweets });
  } catch (err) {
    console.error("Error fetching tweets:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
});

module.exports = router;
