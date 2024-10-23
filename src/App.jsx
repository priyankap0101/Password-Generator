import { useState, useCallback, useEffect, useRef } from "react";
import Header from "./component/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharAllowed] = useState(false);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInputPosition, setCustomInputPosition] = useState("start"); // New state for input position
  const passwordRef = useRef(null);

  const usePasswordGenerator = () => {
    return useCallback(() => {
      let pass = "";
      let str = "abcdefghijklmnopqrstuvwxyz"; // Lowercase letters

      if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (numberAllowed) str += "0123456789";
      if (characterAllowed) str += "!@#$%^&*()+={}~`";

      if (excludeSimilar) str = str.replace(/[O0Il1]/g, ""); // Exclude similar characters

      // Generate base password without custom input
      for (let i = 0; i < length; i++) {
        let char = Math.floor(Math.random() * str.length);
        pass += str.charAt(char);
      }

      if (useCustomInput && customInput.length > 0) {
        // Decide where to place the custom input
        if (customInputPosition === "start") {
          pass = customInput + pass.slice(customInput.length);
        } else if (customInputPosition === "end") {
          pass = pass.slice(0, length - customInput.length) + customInput;
        } else if (customInputPosition === "random") {
          // Randomly insert the custom input
          const randomIndex = Math.floor(Math.random() * (length - customInput.length));
          pass = pass.slice(0, randomIndex) + customInput + pass.slice(randomIndex + customInput.length);
        }
      }

      return pass;
    }, [length, numberAllowed, characterAllowed, uppercaseAllowed, excludeSimilar, customInput, useCustomInput, customInputPosition]);
  };

  const passwordGenerator = usePasswordGenerator();

  const calculateStrength = useCallback((pass) => {
    let strength = "Weak";
    if (pass.length >= 12) strength = "Moderate";
    if (pass.length >= 16 && numberAllowed && characterAllowed && uppercaseAllowed) {
      strength = "Strong";
    }
    return strength;
  }, [numberAllowed, characterAllowed, uppercaseAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99999);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  useEffect(() => {
    const newPassword = passwordGenerator();
    setPassword(newPassword);
    setPasswordHistory((prevHistory) => [newPassword, ...prevHistory.slice(0, 4)]);
    setTimeRemaining(30);
  }, [length, numberAllowed, characterAllowed, uppercaseAllowed, excludeSimilar, passwordGenerator]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setPassword(passwordGenerator()); // Regenerate on expiration
      setTimeRemaining(30);
    }
  }, [timeRemaining, passwordGenerator]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <Header />
      <div className="w-full max-w-md px-6 py-4 mx-auto my-8 rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center">Password Generator</h1>

        {/* Password display and control buttons */}
        <div className="flex items-center mb-4 rounded-lg shadow">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            ref={passwordRef}
            className="w-full px-3 py-2 text-lg text-gray-800 outline-none bg-gray-50"
            readOnly
          />
          <button
            onClick={copyPasswordToClipboard}
            className="px-4 py-2 text-white transition-colors bg-blue-600 hover:bg-blue-500"
          >
            Copy
          </button>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 py-2 text-white transition-colors bg-gray-600 hover:bg-gray-500"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {copied && (
          <div className="mb-4 text-center text-green-500">
            Password copied!
          </div>
        )}

        {/* Custom input field */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={() => setUseCustomInput(!useCustomInput)}
              className="mr-2 cursor-pointer"
            />
            Include Custom Input in Password
          </label>
          {useCustomInput && (
            <div>
              <input
                type="text"
                placeholder="Enter custom input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full px-3 py-2 mt-2 bg-white border rounded-md outline-none"
              />
              {/* Dropdown to select custom input position */}
              <div className="mt-4">
                <label className="block mb-2">Custom Input Position</label>
                <select
                  value={customInputPosition}
                  onChange={(e) => setCustomInputPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-md outline-none"
                >
                  <option value="start">Start of Password</option>
                  <option value="end">End of Password</option>
                  <option value="random">Random Position</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Password length */}
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4">Length: {length}</label>
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Password strength */}
        <div className="mb-4">
          <label className="mr-4">Strength: {calculateStrength(password)}</label>
          <div className="relative w-full h-2 bg-gray-300 rounded-full">
            <div
              className={`absolute h-full rounded-full transition-all duration-300 ${
                calculateStrength(password) === "Strong"
                  ? "bg-green-500 w-full"
                  : calculateStrength(password) === "Moderate"
                  ? "bg-yellow-500 w-2/3"
                  : "bg-red-500 w-1/3"
              }`}
            ></div>
          </div>
        </div>

        <div className="mb-4 text-center text-gray-500">
          Password expires in: {timeRemaining}s
          {timeRemaining < 10 && (
            <span className="ml-2 text-red-500">Hurry!</span>
          )}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(!numberAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Numbers
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={characterAllowed}
              onChange={() => setCharAllowed(!characterAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Special Characters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={uppercaseAllowed}
              onChange={() => setUppercaseAllowed(!uppercaseAllowed)}
              className="mr-2 cursor-pointer"
            />
            Include Uppercase Letters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={() => setExcludeSimilar(!excludeSimilar)}
              className="mr-2 cursor-pointer"
            />
            Exclude Similar Characters (O, 0, I, l, 1)
          </label>
        </div>

        {/* Dark mode toggle */}
        <div className="flex justify-end mt-6">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 text-white transition-colors bg-gray-800 hover:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
