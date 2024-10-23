import { useState, useCallback, useEffect, useRef } from "react";
import { FiEye, FiEyeOff, FiCopy, FiInfo } from "react-icons/fi";
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

      if (customInput.length > 0) {
        // Insert the custom input at the desired position
        if (customInputPosition === "start") {
          pass = customInput + pass.slice(customInput.length);
        } else if (customInputPosition === "end") {
          pass = pass.slice(0, length - customInput.length) + customInput;
        } else if (customInputPosition === "random") {
          const randomIndex = Math.floor(
            Math.random() * (length - customInput.length)
          );
          pass =
            pass.slice(0, randomIndex) +
            customInput +
            pass.slice(randomIndex + customInput.length);
        }
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
  };

  const passwordGenerator = usePasswordGenerator();

  const calculateStrength = useCallback(
    (pass) => {
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
      setPassword(passwordGenerator());
      setTimeRemaining(30);
    }
  }, [timeRemaining, passwordGenerator]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-all`}
    >
      {/* Header Section */}
      <header className="py-4 text-white bg-blue-600 shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-3xl font-bold">Password Generator</h1>
          <nav className="space-x-4">
            <a href="#features" className="transition-all hover:text-gray-200">
              Features
            </a>
            <a href="#about" className="transition-all hover:text-gray-200">
              About
            </a>
            <a href="#contact" className="transition-all hover:text-gray-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="container flex-grow p-8 mx-auto">
        <section className="max-w-3xl p-10 mx-auto transition-transform duration-500 ease-in-out transform bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105">
          <h2 className="mb-6 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Generate Strong Passwords
          </h2>

          {/* Password Field */}
          <div className="relative mb-8 group">
            <label className="block mb-2 text-lg font-medium">
              Generated Password:
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                ref={passwordRef}
                className="w-full p-3 text-lg transition-all bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600"
                readOnly
              />
              <button
                onClick={copyPasswordToClipboard}
                className="absolute p-2 text-gray-600 transition-colors right-12 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title="Copy Password"
              >
                <FiCopy size={20} />
              </button>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute p-2 text-gray-600 transition-colors right-4 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-sm text-green-600 animate-pulse">
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
              className="w-full p-3 text-lg transition-all bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:bg-gray-50 dark:focus:bg-gray-600"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed(!numberAllowed)}
                className="mr-2"
              />
              Include Numbers
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={characterAllowed}
                onChange={() => setCharAllowed(!characterAllowed)}
                className="mr-2"
              />
              Include Special Characters
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={uppercaseAllowed}
                onChange={() => setUppercaseAllowed(!uppercaseAllowed)}
                className="mr-2"
              />
              Include Uppercase Letters
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={() => setExcludeSimilar(!excludeSimilar)}
                className="mr-2"
              />
              Exclude Similar Characters
            </label>
          </div>

          {/* Password Length */}
          <div className="mb-8">
            <label className="block mb-2 text-lg font-medium">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="6"
              max="24"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Password Strength Bar */}
          <div className="h-2 mb-2 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-700">
            <div
              className={`h-full transition-all ${
                calculateStrength(password) === "Strong"
                  ? "bg-green-500 w-full"
                  : calculateStrength(password) === "Moderate"
                  ? "bg-yellow-500 w-3/4"
                  : "bg-red-500 w-1/4"
              }`}
            />
          </div>
          <p className="mt-2 text-sm">{calculateStrength(password)}</p>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-8">
            <label className="text-lg">Dark Mode:</label>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-all`}
              />
            </Switch>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="py-4 mt-8 text-white bg-gray-800">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Password Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
