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
      <main className="container flex-grow max-w-5xl p-6 mx-auto">
        <section className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          {/* Password Field */}
          <div className="relative mb-6">
            <label className="block mb-1 font-semibold text-md">
              Generated Password:
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                ref={passwordRef}
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={copyPasswordToClipboard}
                className="absolute p-2 text-gray-600 right-12 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title="Copy"
              >
                <FiCopy size={18} />
              </button>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute p-2 text-gray-600 right-4 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {copied && (
              <p className="mt-1 text-sm text-green-600">
                Copied to clipboard!
              </p>
            )}
          </div>

          {/* Custom Input */}
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-md">
              Custom Text (optional):
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add custom text"
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
            <label className="block mt-4 font-semibold text-md">
              Position:
            </label>
            <select
              value={customInputPosition}
              onChange={(e) => setCustomInputPosition(e.target.value)}
              className="p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Include Numbers",
                value: numberAllowed,
                setValue: setNumberAllowed,
              },
              {
                label: "Include Uppercase",
                value: uppercaseAllowed,
                setValue: setUppercaseAllowed,
              },
              {
                label: "Include Special Characters",
                value: characterAllowed,
                setValue: setCharAllowed,
              },
              {
                label: "Exclude Similar Characters",
                value: excludeSimilar,
                setValue: setExcludeSimilar,
              },
            ].map((option, idx) => (
              <div key={idx} className="flex items-center">
                <label className="mr-2 font-semibold text-md">
                  {option.label}
                </label>
                <Switch
                  checked={option.value}
                  onChange={option.setValue}
                  className={`flex items-center rounded-full ${
                    option.value ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`h-4 w-8 rounded-full transition-all ${
                      option.value ? "translate-x-6 bg-white" : "bg-gray-500"
                    }`}
                  />
                </Switch>
              </div>
            ))}
          </div>

          {/* Password Strength */}
          <div className="mb-4">
            <span className="font-semibold text-md">Strength:</span>
            <div
              className={`h-2 mt-1 rounded-lg ${
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
          <div className="mt-6">
            <h2 className="font-semibold text-md">History:</h2>
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
