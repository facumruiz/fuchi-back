const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
  
    res.status(500).json({ message: 'Internal server error', error: err.message });
  };
  
  export default errorMiddleware;
  