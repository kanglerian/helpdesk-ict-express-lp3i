require('dotenv').config();

const { API_KEY } = process.env;

module.exports = async (req, res, next) => {
  const key = req.headers['api-key'];
  if (!key || key !== API_KEY) {
    return res.status(403).json({
      message: 'Invalid API Key'
    });
  }
  next();
}