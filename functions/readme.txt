add the following lines to your .env file:
USE_FIRESTORE_EMULATOR=true
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099


We can receive the .env.test for jest tests case environment settings.


(Optional) Set Emulator Auth via REST

curl -X POST http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "returnSecureToken": true
  }'
