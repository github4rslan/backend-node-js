const express = require("express");
const axios = require("axios");

const router = express.Router();

// ✅ GET /api/covid/countries
router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get("https://covid-193.p.rapidapi.com/countries", {
      headers: {
        "x-rapidapi-key": process.env.COVID_API_KEY,
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching countries:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// ✅ GET /api/covid/stats/:country
router.get("/stats/:country", async (req, res) => {
  try {
    const { country } = req.params;

    const response = await axios.get("https://covid-193.p.rapidapi.com/statistics", {
      headers: {
        "x-rapidapi-key": process.env.COVID_API_KEY,
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
      params: { country },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching stats:", error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ✅ GET /api/covid/history/:country
router.get("/history/:country", async (req, res) => {
  try {
    const { country } = req.params;

    const response = await axios.get("https://covid-193.p.rapidapi.com/history", {
      headers: {
        "x-rapidapi-key": process.env.COVID_API_KEY,
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
      params: { country },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching history:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
