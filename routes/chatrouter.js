const express = require("express");
const axios = require("axios");
const router = express.Router();

// OpenRouter API key (for testing purposes, it can remain as it is here)
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

// POST route to handle chat API request
router.post("/chat", async (req, res) => {
  try {
    // Extract the messages from the request body
    const { messages } = req.body;

    // Basic validation: Ensure there are messages provided
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    // Log the incoming messages for debugging purposes
    console.log("Received messages:", messages);

    // Call the OpenRouter API to get the chatbot's response
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3.1:free",  // Using the specified model for OpenRouter
        messages: messages,  // Send the messages from the frontend
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,  // Authorization header with API key
          "Content-Type": "application/json",  // Ensures data is sent as JSON
        },
      }
    );

    // Log the OpenRouter API response for debugging purposes
    console.log("OpenRouter API response:", response.data);

    // Extract the chatbot's response from the API's data
    const chatbotMessage = response.data.choices[0].message.content;

    // Send the chatbot's response back to the frontend (client)
    res.json({ message: chatbotMessage });

  } catch (error) {
    // Log the error and return a 500 status with error details
    console.error("Error during API call:", error.response ? error.response.data : error.message);

    // Send an internal server error response with details
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;
