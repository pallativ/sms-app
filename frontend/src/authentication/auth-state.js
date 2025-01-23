import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useEffect, useState } from "react";

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('On Auth State Changed:', currentUser);
            setUser(currentUser);
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    return user;
};

export default useAuth;
