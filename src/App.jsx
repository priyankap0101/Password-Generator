/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useState, useCallback, useEffect, useRef } from "react";
import Header from "./component/Header";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharAllowed] = useState(false);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false); // New feature
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Show/Hide feature
  const [passwordHistory, setPasswordHistory] = useState([]); // Password history
  const [timeRemaining, setTimeRemaining] = useState(30); // Timer for expiration

  const passwordRef = useRef(null);

  // Password strength calculator
  const calculateStrength = (pass) => {
    let strength = "Weak";
    if (pass.length >= 12) strength = "Moderate";
    if (
      pass.length >= 16 &&
      numberAllowed &&
      characterAllowed &&
      uppercaseAllowed
    ) {
      strength = "Strong";
    }
    return strength;
  };

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyz"; // Lowercase letters

    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()+={}~`";

    if (excludeSimilar) str = str.replace(/[O0Il1]/g, ""); // Exclude similar characters

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
  ]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99999);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
    setPasswordHistory((prevHistory) => [password, ...prevHistory.slice(0, 4)]);
    setTimeRemaining(30); // Reset timer on new password generation
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
    passwordGenerator,
  ]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(
        () => setTimeRemaining(timeRemaining - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      passwordGenerator(); // Regenerate on expiration
      setTimeRemaining(30); // Reset timer
    }
  }, [timeRemaining, passwordGenerator]);

  return (
    <div className="min-h-screen text-white bg-gray-800">
      <Header />
      <div className="w-full max-w-md px-6 py-4 mx-auto my-8 text-orange-500 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="my-3 text-2xl text-center text-white">
          Password Generator
        </h1>

        <div className="flex mb-4 overflow-hidden rounded-lg shadow">
          <input
            type={showPassword ? "text" : "password"} // Show/Hide functionality
            value={password}
            className="w-full px-3 py-2 text-lg text-white bg-gray-800 outline-none"
            placeholder="Generated password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="px-4 py-2 text-white transition-colors bg-blue-700 hover:bg-blue-600 shrink-0"
          >
            Copy
          </button>
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="px-4 py-2 text-white transition-colors bg-gray-700 hover:bg-gray-600 shrink-0"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center mb-4">
          <label className="mr-4 text-white">Length: {length}</label>
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            className="w-full cursor-pointer"
            onChange={(e) => setLength(e.target.value)}
          />
        </div>

        {/* Strength Indicator with progress bar */}
        <div className="w-full h-2 mb-4 bg-gray-300 rounded-full">
          <div
            className={`h-full rounded-full ${
              calculateStrength(password) === "Strong"
                ? "bg-green-500"
                : calculateStrength(password) === "Moderate"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width:
                calculateStrength(password) === "Strong"
                  ? "100%"
                  : calculateStrength(password) === "Moderate"
                  ? "66%"
                  : "33%",
            }}
          ></div>
        </div>

        {/* Password expiration timer */}
        <div className="mb-4 text-center">
          <span className="text-sm text-white">
            Password expires in: {timeRemaining}s
          </span>
        </div>

        {/* Password settings */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(!numberAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Numbers
          </label>
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={characterAllowed}
              onChange={() => setCharAllowed(!characterAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Characters
          </label>
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={uppercaseAllowed}
              onChange={() => setUppercaseAllowed(!uppercaseAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Uppercase
          </label>
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={() => setExcludeSimilar(!excludeSimilar)}
              className="mr-2 cursor-pointer"
            />
            Exclude Similar Characters (O, 0, I, 1)
          </label>
        </div>

        {/* Password History */}
        <div className="my-4">
          <h2 className="mb-2 text-white">Password History</h2>
          <ul className="space-y-2">
            {passwordHistory.map((pass, index) => (
              <li key={index} className="text-sm text-gray-300">
                {pass}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
