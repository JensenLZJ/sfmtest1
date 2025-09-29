// Simple test API for debugging
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};
