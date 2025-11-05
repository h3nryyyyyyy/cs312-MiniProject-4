import React, { useState } from "react";

function Auth({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const USER_LIST_KEY = "registered_users";

  //get users
  const getUsers = () => {
    return JSON.parse(localStorage.getItem(USER_LIST_KEY)) || {};
  };
  //set users
  const saveUsers = (users) => {
    localStorage.setItem(USER_LIST_KEY, JSON.stringify(users));
  };
  //match user info to make acc
  const handleAuthenticate = (e, isSigningUp) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter a username and password.");
      return;
    }

    const trimmedUsername = username.trim();
    const users = getUsers();

    //signup
    if (isSigningUp) {
      if (users[trimmedUsername]) {
        setMessage(`Username '${trimmedUsername}' already exists. Please sign in instead.`);
        return;
      }

      users[trimmedUsername] = { password };
      console.log("Saved users:", users);
      saveUsers(users);
      localStorage.setItem("user", trimmedUsername);
      onSignIn(trimmedUsername);
      setMessage(`Welcome, ${trimmedUsername}! Account created successfully.`);
      return;
    }

    // signin
    if (!users[trimmedUsername]) {
      setMessage(`Username '${trimmedUsername}' not found. Please sign up first.`);
      return;
    }

    if (users[trimmedUsername].password !== password) {
      setMessage("Invalid username or password.");
      return;
    }

    localStorage.setItem("user", trimmedUsername);
    onSignIn(trimmedUsername);
    setMessage(`Welcome back, ${trimmedUsername}!`);
  };

  return (
    <div className="auth-form">
      <h2>User Authentication</h2>

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => {
        setUsername(e.target.value);
        setMessage("");
        }}
        required
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => {
        setPassword(e.target.value);
        setMessage("");
        }}
        required
      />

      <div className="auth-actions">
        <button type="submit" onClick={(e) => handleAuthenticate(e, false)}>
        Sign In
        </button>
        <button type="submit" onClick={(e) => handleAuthenticate(e, true)}>
        Sign Up
        </button>
      </div>

      {message && (
        <p className={`auth-message ${message.includes("Welcome") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Auth;
