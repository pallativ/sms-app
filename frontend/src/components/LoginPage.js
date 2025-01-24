import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is already logged in, redirect to the home page
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            console.log("Logged in");
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
    },
    header: {
        textAlign: "center",
        marginBottom: "20px"
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    inputGroup: {
        marginBottom: "15px"
    },
    label: {
        marginBottom: "5px",
        fontWeight: "bold"
    },
    input: {
        width: "95%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },
    error: {
        color: "red",
        marginBottom: "15px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default LoginPage;
