const axios = require('axios');

/**
 * Mencari video Youtube Short
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.searchShorts = async (req, res) => {
  try {
    const { query, pageToken } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Reusing the Google API Key
    const maxResults = 10;

    const params = {
      part: 'snippet',
      type: 'video',
      videoDuration: 'short',
      q: query || 'tips sehat',
      maxResults,
      key: apiKey
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });

    // Just return the raw items and nextPageToken, let client handle YoutubeExplode
    // because YoutubeExplode is heavy/scraping-based and might be better on client for now 
    // (or we could move it here but let's stick to API proxying first).
    // Actually, client uses YoutubeExplode to get the STREAM url. 
    // The search result gives Video ID.
    // So we return the search result.

    res.json(response.data);
  } catch (err) {
    console.error('YouTube Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch shorts' });
  }
};
