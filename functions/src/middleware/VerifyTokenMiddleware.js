
const { auth } = require('../../firebaseSetup');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "Unauthorized" });
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        if (decodedToken.tenantCode !== undefined)
            req.tenantCode = decodedToken.tenantCode[0] || null;
        req.role = decodedToken.role || [];
        req.userInfo = {
            isTenantAdmin: decodedToken.isTenantAdmin || false,
            uid: decodedToken.uid,
            email: decodedToken.email,
            tenantCode: req.tenantCode,
            roles: decodedToken.role
        }
        req.tenantContext = {
            isTenantAdmin: decodedToken.isTenantAdmin || false,
            tenantCode: req.tenantCode,
            email: decodedToken.email,
            uid: decodedToken.uid,
            roles: req.role
        };
        console.log("decodedToken:", decodedToken);
        console.log("userInfo:", req.userInfo);
        console.log("tenant-context:", req.tenantContext)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error });
    }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.roles?.includes(role)) return next();
    return res.status(403).json({ error: `Role '${role}' required` });
  };
};


exports.requireTenantAdmin = (req, res, next) => {
  if (req.user?.isTenantAdmin) return next();
  return res.status(403).json({ error: 'Admin access required' });
};


//router.get('/admin/dashboard', auth.authenticate, auth.requireTenantAdmin, (req, res) => {
//  res.json({ message: 'Welcome, Tenant Admin' });
//});

//router.get('/editor/stats', auth.authenticate, auth.requireRole('editor'), (req, res) => {
//  res.json({ message: 'Editor stats access granted' });
//});
