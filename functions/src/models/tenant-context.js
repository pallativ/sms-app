
class TenantContext {
    /**
     * @param {string} tenantCode
     * @param {string} tenantName
     * @param {string} userEmail
     * @param {string} userId
     * @param {string[]} roles
     */
    constructor(tenantCode, tenantName, userEmail, userId, roles = []) {
        this.tenantCode = tenantCode;
        this.tenantName = tenantName;
        this.userEmail = userEmail;
        this.userId = userId;
        this.roles = roles;
    }

    /**
     * Creates a TenantContext instance from a Firebase Functions request object.
     * @param {import('firebase-functions').Request} req
     * @returns {TenantContext}
     */
    TenantContext.fromFirebaseRequest = function(req) {
        const tenantCode = req.headers['x-tenant-code'] || req.body.tenantCode || '';
        const tenantName = req.headers['x-tenant-name'] || req.body.tenantName || '';
        const userEmail = req.headers['x-user-email'] || req.body.userEmail || '';
        const userId = req.headers['x-user-id'] || req.body.userId || '';
        let roles = [];
        if (req.headers['x-user-roles']) {
            try {
                roles = JSON.parse(req.headers['x-user-roles']);
            } catch {
                roles = Array.isArray(req.headers['x-user-roles'])
                    ? req.headers['x-user-roles']
                    : [req.headers['x-user-roles']];
            }
        } else if (req.body.roles) {
            roles = Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];
        }
        return new TenantContext(tenantCode, tenantName, userEmail, userId, roles);
    };
}

module.exports = TenantContext;
