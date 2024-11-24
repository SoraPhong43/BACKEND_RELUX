// hereApiService.js
const axios = require("axios");

// Thay bằng API Key của bạn
const HERE_API_KEY = "5R8L9k18lGh1BmQEbuKtEGgXNbcF5Ze3gK42IieksVI";

// Gọi API Geocoding
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      "https://geocode.search.hereapi.com/v1/geocode",
      {
        params: {
          q: address,
          apiKey: HERE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch geocoding data: " + error.message);
  }
};

// Gọi API Reverse Geocoding
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      "https://revgeocode.search.hereapi.com/v1/revgeocode",
      {
        params: {
          at: `${lat},${lng}`,
          apiKey: HERE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch reverse geocoding data: " + error.message);
  }
};

// Gọi API Routing
const getRoute = async (origin, destination) => {
  try {
    const response = await axios.get("https://router.hereapi.com/v8/routes", {
      params: {
        origin,
        destination,
        transportMode: "car",
        apiKey: HERE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch route data: " + error.message);
  }
};

const geocodeHandler = async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
    const data = await geocodeAddress(address);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reverseGeocodeHandler = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }
  try {
    const data = await reverseGeocode(lat, lng);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const routeHandler = async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Origin and Destination are required" });
  }
  try {
    const data = await getRoute(origin, destination);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  geocodeHandler,
  reverseGeocodeHandler,
  routeHandler,
};
