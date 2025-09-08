const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const options = {
      method: "GET",
      url: "https://tiktok-video-no-watermark2.p.rapidapi.com/",
      params: { url, hd: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // keep it safe in .env
        "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (err) {
    console.error("TikTok API error:", err.message);
    res.status(500).json({ error: "Failed to fetch TikTok video" });
  }
});

module.exports = router;
