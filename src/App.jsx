import { useState, useCallback, useEffect, useRef } from "react";
import { FiEye, FiEyeOff, FiCopy } from "react-icons/fi";
import { Switch } from "@headlessui/react";

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
  const [customInputPosition, setCustomInputPosition] = useState("start");
  const passwordRef = useRef(null);

  // Password generation hook
  const usePasswordGenerator = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyz";

    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()+={}~`";
    if (excludeSimilar) str = str.replace(/[O0Il1]/g, "");

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    // Custom input insertion
    if (customInput.length > 0) {
      const insertionIndex = {
        start: 0,
        end: pass.length,
        random: Math.floor(Math.random() * (length - customInput.length)),
      }[customInputPosition];

      pass =
        pass.slice(0, insertionIndex) +
        customInput +
        pass.slice(insertionIndex);
    }

    return pass;
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
    customInput,
    customInputPosition,
  ]);

  // Calculate password strength
  const calculateStrength = useCallback(
    (pass) => {
      if (
        pass.length >= 16 &&
        numberAllowed &&
        characterAllowed &&
        uppercaseAllowed
      ) {
        return "Strong";
      } else if (pass.length >= 12) {
        return "Moderate";
      }
      return "Weak";
    },
    [numberAllowed, characterAllowed, uppercaseAllowed]
  );

  // Clipboard copy functionality
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // Generate password on options change
  useEffect(() => {
    const newPassword = usePasswordGenerator();
    setPassword(newPassword);
    setPasswordHistory((prevHistory) => [
      newPassword,
      ...prevHistory.slice(0, 4),
    ]);
    setTimeRemaining(30);
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
    usePasswordGenerator,
  ]);

  // Countdown timer for password reset
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(
        () => setTimeRemaining((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      const newPassword = usePasswordGenerator();
      setPassword(newPassword);
      setTimeRemaining(30);
    }
  }, [timeRemaining, usePasswordGenerator]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Function to handle using a password from the history
  const handleUsePassword = (pass) => {
    setPassword(pass); // Update the current password state
    // Optionally, show a notification or highlight the input
    alert(`Password "${pass}" has been selected!`); // Feedback (optional)
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-all`}
    >
      {/* Header Section */}
      <header className="py-4 bg-blue-600 shadow-md">
        <div className="container flex items-center justify-between mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white">Password Generator</h1>
          <button
            onClick={toggleDarkMode}
            className="text-white focus:outline-none"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-grow p-8 mx-auto max-w-7xl">
        <section className="p-10 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
          {/* Password Field */}
          <div className="relative mb-8">
            <label className="block mb-2 text-lg font-medium">
              Generated Password:
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                ref={passwordRef}
                readOnly
                className="w-full p-3 text-lg bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={copyPasswordToClipboard}
                className="absolute p-2 text-gray-600 right-12 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title="Copy Password"
              >
                <FiCopy size={20} />
              </button>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute p-2 text-gray-600 right-4 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-sm text-green-600">
                Password copied to clipboard!
              </p>
            )}
          </div>

          {/* Custom Input */}
          <div className="mb-8">
            <label className="block mb-2 text-lg font-medium">
              Custom Input (optional):
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add custom text to password"
              className="w-full p-3 text-lg bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-4">
              <label className="block mb-2 text-lg font-medium">
                Insert Position:
              </label>
              <select
                value={customInputPosition}
                onChange={(e) => setCustomInputPosition(e.target.value)}
                className="p-3 text-lg bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Password Length:</label>
              <input
                type="number"
                value={length}
                onChange={(e) =>
                  setLength(Math.min(Math.max(4, e.target.value), 20))
                } // Ensure length is within bounds
                min="4"
                max="20"
                className="w-20 p-2 text-lg text-center bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <Switch
              checked={numberAllowed}
              onChange={setNumberAllowed}
              className={`flex items-center p-2 rounded-lg ${
                numberAllowed ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`mr-2 text-lg font-medium ${
                  numberAllowed ? "text-white" : "text-gray-800"
                }`}
              >
                Include Numbers
              </span>
              <span
                className={`w-8 h-8 rounded-full ${
                  numberAllowed ? "bg-white" : "bg-gray-500"
                }`}
              />
            </Switch>
            <Switch
              checked={uppercaseAllowed}
              onChange={setUppercaseAllowed}
              className={`flex items-center p-2 rounded-lg ${
                uppercaseAllowed ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`mr-2 text-lg font-medium ${
                  uppercaseAllowed ? "text-white" : "text-gray-800"
                }`}
              >
                Include Uppercase
              </span>
              <span
                className={`w-8 h-8 rounded-full ${
                  uppercaseAllowed ? "bg-white" : "bg-gray-500"
                }`}
              />
            </Switch>
            <Switch
              checked={characterAllowed}
              onChange={setCharAllowed}
              className={`flex items-center p-2 rounded-lg ${
                characterAllowed ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`mr-2 text-lg font-medium ${
                  characterAllowed ? "text-white" : "text-gray-800"
                }`}
              >
                Include Special Characters
              </span>
              <span
                className={`w-8 h-8 rounded-full ${
                  characterAllowed ? "bg-white" : "bg-gray-500"
                }`}
              />
            </Switch>
            <Switch
              checked={excludeSimilar}
              onChange={setExcludeSimilar}
              className={`flex items-center p-2 rounded-lg ${
                excludeSimilar ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`mr-2 text-lg font-medium ${
                  excludeSimilar ? "text-white" : "text-gray-800"
                }`}
              >
                Exclude Similar Characters
              </span>
              <span
                className={`w-8 h-8 rounded-full ${
                  excludeSimilar ? "bg-white" : "bg-gray-500"
                }`}
              />
            </Switch>
          </div>

          {/* Password Strength Indicator */}
          <div className="mb-4">
            <span className="block mb-1 text-lg font-medium">
              Password Strength:
            </span>
            <div
              className={`h-2 rounded-lg ${
                calculateStrength(password) === "Strong"
                  ? "bg-green-500"
                  : calculateStrength(password) === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${(password.length / 20) * 100}%` }}
            />
          </div>

          {/* Password History */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Password History:</h2>
            <ul className="mt-2 space-y-1">
              {passwordHistory.map((pass, index) => (
                <li
                  key={index}
                  className="flex justify-between p-2 bg-gray-100 rounded-lg dark:bg-gray-700"
                >
                  <span>{pass}</span>
                  <button
                    onClick={() => handleUsePassword(pass)}
                    className="text-blue-500 hover:underline"
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; 2024 Password Generator
        </p>
      </footer>
    </div>
  );
}

export default App;
