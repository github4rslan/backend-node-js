const express = require("express");
const axios = require("axios");
const router = express.Router();

const RAPIDAPI_HOST = "whatsapp-osint.p.rapidapi.com";
const API_BASE_URL = `https://${RAPIDAPI_HOST}`;
const HEADERS = {
  "x-rapidapi-key": process.env.WHATSAPP_API_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST,
};

// ✅ Privacy Settings
router.post("/privacy", async (req, res) => {
  try {
    const { phone } = req.body;
    const response = await axios.get(`${API_BASE_URL}/privacy`, {
      params: { phone },
      headers: HEADERS,
    });
    res.json({ type: "privacy", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Privacy Info" });
  }
});

// ✅ Devices
router.post("/devices", async (req, res) => {
  try {
    const { phone } = req.body;
    const response = await axios.get(`${API_BASE_URL}/devices`, {
      params: { phone },
      headers: HEADERS,
    });
    res.json({ type: "devices", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Device Info" });
  }
});

// ✅ OSINT (registration + public profile image)
router.post("/osint", async (req, res) => {
  try {
    const { phone } = req.body;
    const response = await axios.get(`${API_BASE_URL}/wspic/dck`, {
      params: { phone },
      headers: HEADERS,
    });
    const raw = response.data;

    res.json({
      type: "osint",
      data: {
        registered: raw.Registered === "Yes",
        publicImage: raw.PublicImage === "Yes",
        imageUrl: raw.URL || null,
      },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch OSINT Info" });
  }
});

// ✅ Status (About)
router.post("/status", async (req, res) => {
  try {
    const { phone } = req.body;
    const response = await axios.get(`${API_BASE_URL}/about`, {
      params: { phone },
      headers: HEADERS,
    });

    res.json({
      type: "status",
      data: {
        about: response.data?.about || "No status set",
      },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Status Info" });
  }
});

module.exports = router;
