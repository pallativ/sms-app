const request = require('supertest');
const express = require('express');
const { auth } = require('../../firebaseSetup');
const TenantRoutes = require('../../src/routes/TenantRoutes');
const app = express();
app.use(express.json());
app.use('/tenants', TenantRoutes);


async function getIdToken(uid, claims = {}) {
    // Create a custom token
    const customToken = await auth.createCustomToken(uid, claims);

    // Exchange custom token for ID token (simulate sign in)
    const response = await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: customToken,
            returnSecureToken: true,
        }),
    });

    const data = await response.json();
    return data.idToken; // ✅ Firebase Auth ID Token
}


describe('Verifying TenantRoutes', () => {
    it("create a tenant using platform admin", async () => {
        function generateRandomEmail() {
            const randomString = Math.random().toString(36).substring(2, 10);
            return `user_${randomString}@example.com`;
        }

        function generateRandomTenantCode() {
            const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
            return `TENANT_${randomString}`;
        }

        // Example usage:
        const tenantCode = generateRandomTenantCode();
        //console.log("Generated Tenant Code:", tenantCode);

        var email = generateRandomEmail();
        var new_user = await auth.createUser({
            email: email,
            password: "Dhishakti@123",
            displayName: email,
        });
        //console.log("User created:", new_user);
        const idToken = await getIdToken(new_user.uid, { "isPlatformAdmin": true });
        //console.log("Custom Token:", idToken);
        const response = await request(app).post('/tenants')
            .set('Authorization', `Bearer ${idToken}`)
            .send({ name: tenantCode, code: tenantCode, "adminEmail": 'sample@sample.com' });
        console.log("Response:", response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Tenant created successfully.");
       
    });
});
