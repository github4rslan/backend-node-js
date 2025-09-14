const axios = require('axios');

// Define the OpenRouter API URL
const url = "https://openrouter.ai/api/v1/chat/completions";

// Your OpenRouter API Key (replace this with your actual API key)
const OPENROUTER_API_KEY = "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"; // Replace with your API key

// Define the model and the message you want to send to OpenRouter
const model = "deepseek/deepseek-chat-v3.1:free"; // Use the model you want
const userMessage = "What is the meaning of life?"; // Input message you want to test

// Function to make the API call
const fetchChatbotResponse = async () => {
  try {
    // Make the POST request using Axios
    const response = await axios.post(
      url,
      {
        model: model,  // Specify the model
        messages: [
          {
            role: "user",  // The role of the sender, can be "user" or "assistant"
            content: userMessage,  // The actual message to send
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,  // Authorization header with your API key
          "Content-Type": "application/json",  // Content type for the API request
          "HTTP-Referer": "<YOUR_SITE_URL>",  // Optional: Your site URL for rankings (replace <YOUR_SITE_URL>)
          "X-Title": "<YOUR_SITE_NAME>",  // Optional: Your site title (replace <YOUR_SITE_NAME>)
        },
      }
    );

    // Extract and log the chatbot's response
    const chatbotMessage = response.data.choices[0].message.content;
    console.log("Chatbot response:", chatbotMessage);

  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      // This is the response from the server
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // This is when no response was received
      console.error("No response received:", error.request);
    } else {
      // Other errors
      console.error("Error message:", error.message);
    }
  }
};

// Call the function to test the API
fetchChatbotResponse();
