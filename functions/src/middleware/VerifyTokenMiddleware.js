
const { auth } = require('../../firebaseSetup');
const AuthorizationRespository = require('../repositories/authorization-repository');
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "Unauthorized" });
        //console.log("Verifying token:", token);
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        if (decodedToken.tenantCode !== undefined)
            req.tenantCode = decodedToken.tenantCode[0] || null;
        req.role = decodedToken.role || [];
        req.user = {
            isPlatformAdmin: decodedToken.isPlatformAdmin || false,
            isTenantAdmin: decodedToken.isTenantAdmin || false,
            uid: decodedToken.uid,
            email: decodedToken.email,
        }

        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            return res.status(403).json({ message: "Tenant ID is required" });
        }
        req.user.tenantId = ""; // his will be set later if tenantId is valid

        var authorizationRepository = new AuthorizationRespository();
        var user_authorization = await authorizationRepository.getUserByEmail(req.user.email);
        //console.log("user_authorization:", user_authorization); 
        if (user_authorization) {
            req.user.roles = user_authorization.roles || [];
            req.user.permissions = user_authorization.permissions || [];
            //req.user.tenants = user_authorization.tenants || []; // This is not needed as we are using tenantId from headers
        } else {
            return res.status(403).json({ message: "user is not found." });
        }
        if (user_authorization.tenants?.includes(tenantId)) {
            req.user.tenantId = tenantId;
        } else {
            return res.status(403).json({ message: "Unauthorized tenant" });
        }

        //console.log("decodedToken:", decodedToken);
        //console.log("userInfo:", req.userInfo);
        next();
    } catch (error) {
        //console.log('Error in validating token:', error);
        res.status(401).json({ error: error });
    }
};

exports.requirePlatformAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });
    //console.log("Verifying token:", token);
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    if (decodedToken.tenantCode !== undefined)
        req.tenantCode = decodedToken.tenantCode[0] || null;
    req.role = decodedToken.role || [];
    req.user = {
        isPlatformAdmin: decodedToken.isPlatformAdmin || false,
        isTenantAdmin: decodedToken.isTenantAdmin || false,
        uid: decodedToken.uid,
        email: decodedToken.email,
    }

    if (!req.user.isPlatformAdmin) {
        return res.status(403).json({ message: "Unauthorized. Required PlatformAdmin Role." })
    }
    next();
}

exports.requireRole = (role) => {
    return (req, res, next) => {
        //console.log("requireRole middleware called with role:", role, req.user);
        if (req.user?.isPlatformAdmin) return next();
        if (req.user?.roles?.includes(role)) return next();
        res.status(403).json({ error: `Role '${role}' required` });
    };
};

exports.requirePersmission = (permission) => {
    return async (req, res, next) => {
        if (req.user?.isPlatformAdmin) return next();
        if (req.user?.permissions?.includes(permission)) return next();
        res.status(403).json({ error: `permission '${permission}' required` });
    };
};


//router.get('/admin/dashboard', auth.authenticate, auth.requireTenantAdmin, (req, res) => {
//  res.json({ message: 'Welcome, Tenant Admin' });
//});

//router.get('/editor/stats', auth.authenticate, auth.requireRole('editor'), (req, res) => {
//  res.json({ message: 'Editor stats access granted' });
//});
