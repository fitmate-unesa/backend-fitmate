const axios = require('axios');

exports.getNearbyGyms = async (req, res) => {
  try {
    const { lat, lng, radius } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const r = radius || 3000;
    
    // Overpass API Query
    const query = `
      [out:json];(
      node(around:${r},${lat},${lng})["leisure"="fitness_centre"];
      node(around:${r},${lat},${lng})["sport"~"fitness|gym"];
      node(around:${r},${lat},${lng})["amenity"="gym"];
      node(around:${r},${lat},${lng})["leisure"="sports_centre"]["sport"~"fitness|gym"];
      );out body;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const data = response.data;
    const elements = data.elements || [];

    const gyms = elements.map(e => ({
      id: e.id,
      lat: e.lat,
      lon: e.lon,
      name: e.tags?.name || 'Unnamed Gym',
      tags: e.tags
    })).filter(e => e.lat && e.lon);

    res.json({ gyms });
  } catch (err) {
    console.error('Gyms Error:', err);
    res.status(500).json({ error: 'Failed to fetch nearby gyms' });
  }
};
