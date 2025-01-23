import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { signIn, signUp, logOut } from "./authentication/auth-actions";
import useAuth from './authentication/auth-state';

function App() {
    useEffect(() => {
        callApi();
    }, []);


    const user = useAuth();
    console.log('****************user:', user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => signUp(email, password);
    const handleSignIn = () => signIn(email, password);
    const handleLogOut = () => logOut();

    const callApi = async () => {
        try {
            console.log('****************Calling Function API ---- fetching data***************');
            const response = await fetch('/api/contacts');
            console.log('****************response:***************', response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Veerakondalu Version-1.0.0
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>

            <div>
                <h1>Firebase Authentication</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignUp}>Sign Up</button>
                <button onClick={handleSignIn}>Sign In</button>
                <button onClick={handleLogOut}>Log Out</button>
            </div>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
}

export default App;
