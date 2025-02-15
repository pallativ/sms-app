
const { auth } = require('../../firebaseSetup');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "Unauthorized" });
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        if (decodedToken.tenantCode !== undefined)
            req.tenantCode = decodedToken.tenantCode[0] || "";
        req.role = decodedToken.role || "";
        req.userInfo = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            tenantCode: req.tenantCode,
            roles: decodedToken.role
        }
        console.log("decodedToken:", decodedToken);
        console.log("userInfo:", req.userInfo)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error });
    }
};


