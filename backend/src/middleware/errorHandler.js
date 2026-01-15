const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details || err.message,
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced record does not exist',
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
