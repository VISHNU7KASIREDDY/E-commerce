const DEMO_EMAILS = [
  'demo_user@example.com',
  'demo_admin@example.com',
];

const demoProtect = (req, res, next) => {
  if (req.user && DEMO_EMAILS.includes(req.user.email) && req.method === 'DELETE') {
    return res.status(403).json({ message: 'Demo accounts cannot delete data' });
  }
  next();
};

module.exports = demoProtect;
