// testCovidApi.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.COVID_API_KEY;

async function testCovidApi() {
  try {
    const countries = await axios.get("https://covid-193.p.rapidapi.com/countries", {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
    });
    console.log("✅ Countries:", countries.data.response.slice(0, 10));

    const stats = await axios.get("https://covid-193.p.rapidapi.com/statistics", {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
      params: { country: "Pakistan" },
    });
    console.log("✅ Stats for Pakistan:", stats.data.response[0]);
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

testCovidApi();
