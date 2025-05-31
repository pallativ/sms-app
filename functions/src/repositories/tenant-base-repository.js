
const { db } = require('../../firebaseSetup');
class TenantBaseRepository {
   
    constructor(tenantContext) {
        if (!tenantContext) {
            throw new Error('tenantContext is required');
        }
        this.tenantContext = tenantContext;
    }

    getTenantContext() {
        return this.tenantContext;
    }
    getTenantCode() {
        return this.tenantContext.tenantCode;
    }
    getTenant() {
        if (!this.tenantContext.tenantCode) {
            throw new Error('tenantName is required');
        }
        return db.collection("tenants").doc(this.tenantContext.tenantCode);
    }
}

module.exports = TenantBaseRepository;
