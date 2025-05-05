const { error } = require('ajv/dist/vocabularies/applicator/dependencies');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    if(err.name = 'TokenExpiredError'){
      res.status(401).json({ message: 'Expired Token' });
    } else{
      res.status(401).json({ message: 'Invalid token' });
    }
    
  }
};

module.exports = auth;