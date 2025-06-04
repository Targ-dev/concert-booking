// Custom validation middleware for email
const validateEmail = (req, res, next) => {
    const email = req.body.email;
    const errors = [];
 
    if (!isValidEmail(email)) {
      errors.push({ msg: 'Invalid email address' });
    }
 
    req.validationErrors = req.validationErrors || [];
    req.validationErrors.push(...errors);
 
    next();
  };
 
  const validatePassword = (req, res, next) => {
    const password = req.body.password;
    const errors = [];
 
    if (!isValidPassword(password)) {
      errors.push({ msg: 'Password must meet certain criteria' });
    }
 
    req.validationErrors = req.validationErrors || [];
    req.validationErrors.push(...errors);
 
    next();
  };
 

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not admin
}

const isUser = (req, res, next) => {
  if (req.session && req.session.role === 'user') {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not user
}

module.exports = { validateEmail, validatePassword, isAdmin, isUser };