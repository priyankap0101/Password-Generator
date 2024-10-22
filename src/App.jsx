import { useState, useCallback, useEffect, useRef } from "react";
import Header from "./component/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharAllowed] = useState(false);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customInput, setCustomInput] = useState(""); // Custom input state
  const [useCustomInput, setUseCustomInput] = useState(false); // Toggle for using custom input
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const passwordRef = useRef(null);

  // Custom hook for password generation logic
  const usePasswordGenerator = () => {
    return useCallback(() => {
      let pass = "";
      let str = "abcdefghijklmnopqrstuvwxyz"; // Lowercase letters

      if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (numberAllowed) str += "0123456789";
      if (characterAllowed) str += "!@#$%^&*()+={}~`";

      if (excludeSimilar) str = str.replace(/[O0Il1]/g, ""); // Exclude similar characters

      // Generate the main part of the password
      for (let i = 1; i <= length; i++) {
        let char = Math.floor(Math.random() * str.length);
        pass += str.charAt(char);
      }

      // Add custom input if it's enabled and not empty
      if (useCustomInput && customInput) {
        // Insert custom input at a random position
        const insertAt = Math.floor(Math.random() * pass.length);
        pass = pass.slice(0, insertAt) + customInput + pass.slice(insertAt);
      }

      return pass;
    }, [length, numberAllowed, characterAllowed, uppercaseAllowed, excludeSimilar, customInput, useCustomInput]);
  };

  const passwordGenerator = usePasswordGenerator();

  const calculateStrength = useCallback(
    (pass) => {
      let strength = "Weak";
      if (pass.length >= 12) strength = "Moderate";
      if (pass.length >= 16 && numberAllowed && characterAllowed && uppercaseAllowed) {
        strength = "Strong";
      }
      return strength;
    },
    [numberAllowed, characterAllowed, uppercaseAllowed]
  );

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
    <div className={`min-h-screen ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
      <Header />
      <div className="w-full max-w-md px-6 py-4 mx-auto my-8 bg-white rounded-lg shadow-lg dark:bg-gray-900">
        <h1 className="mb-4 text-2xl font-bold text-center">Password Generator</h1>

        <div className="flex items-center mb-4 space-x-2 rounded-lg shadow">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            ref={passwordRef}
            className="w-full px-3 py-2 text-lg text-gray-800 rounded-l-lg outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            readOnly
          />
          <button
            onClick={copyPasswordToClipboard}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-r-lg hover:bg-blue-500"
          >
            Copy
          </button>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-500"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {copied && (
          <div className="mb-4 text-center text-green-500">
            Password copied!
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <label className="mr-4">Length: {length}</label>
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full bg-gray-300 rounded-lg cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="mr-4">Strength: {calculateStrength(password)}</label>
          <div className="relative w-full h-2 bg-gray-300 rounded-full">
            <div
              className={`absolute h-full rounded-full transition-all duration-500 ${
                calculateStrength(password) === "Strong"
                  ? "bg-green-500 w-full"
                  : calculateStrength(password) === "Moderate"
                  ? "bg-yellow-500 w-2/3"
                  : "bg-red-500 w-1/3"
              }`}
            ></div>
          </div>
        </div>

        <div className="mb-4 text-center text-gray-500 dark:text-gray-400">
          Password expires in: {timeRemaining}s
          {timeRemaining < 10 && (
            <span className="ml-2 text-red-500">Hurry!</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(!numberAllowed)}
              className="mr-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-400"
            />
            Include Numbers
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={characterAllowed}
              onChange={() => setCharAllowed(!characterAllowed)}
              className="mr-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-400"
            />
            Include Characters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={uppercaseAllowed}
              onChange={() => setUppercaseAllowed(!uppercaseAllowed)}
              className="mr-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-400"
            />
            Include Uppercase
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={() => setExcludeSimilar(!excludeSimilar)}
              className="mr-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-400"
            />
            Exclude Similar Characters
          </label>
        </div>

        {/* Custom Input Section */}
        <div className="my-4">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={() => setUseCustomInput(!useCustomInput)}
              className="mr-2 cursor-pointer"
            />
            Include Custom Input (e.g., Name)
          </label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={!useCustomInput}
            placeholder="Enter custom text"
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-lg outline-none dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 mt-4 text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

export default App;
