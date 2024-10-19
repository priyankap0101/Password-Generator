/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharAllowed] = useState(false);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false); // New state for uppercase
  const [password, setPassword] = useState("");

  // useRef Hook for clipboard
  const passwordRef = useRef(null);

  // Password strength calculator (simple example)
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

    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Add uppercase if allowed
    if (numberAllowed) str += "0123456789"; // Add numbers if allowed
    if (characterAllowed) str += "!@#$%^&*()+={}~`"; // Add special characters if allowed

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllowed, characterAllowed, uppercaseAllowed, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99999); // Select the entire password
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator(); // Generate password whenever conditions change
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    passwordGenerator,
  ]);

  return (
    <>
      <div className="w-full max-w-md px-6 py-4 mx-auto my-8 text-orange-500 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="my-3 text-2xl text-center text-white">
          Password Generator
        </h1>

        <div className="flex mb-4 overflow-hidden rounded-lg shadow">
          <input
            type="text"
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
        </div>

        {/* Password length */}
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

        {/* Strength Indicator */}
        <div className="mb-4 text-center">
          <span
            className={`inline-block px-3 py-1 rounded-md text-xs ${
              calculateStrength(password) === "Strong"
                ? "bg-green-500"
                : calculateStrength(password) === "Moderate"
                ? "bg-yellow-500"
                : "bg-red-500"
            } text-white`}
          >
            {calculateStrength(password)}
          </span>
        </div>

        {/* Password options */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={uppercaseAllowed}
              onChange={() => setUppercaseAllowed((prev) => !prev)}
              className="mr-2 cursor-pointer"
            />
            Include Uppercase
          </label>

          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
              className="mr-2 cursor-pointer"
            />
            Include Numbers
          </label>

          <label className="flex items-center text-white">
            <input
              type="checkbox"
              checked={characterAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
              className="mr-2 cursor-pointer"
            />
            Include Special Characters
          </label>
        </div>
      </div>
    </>
  );
}

export default App;
