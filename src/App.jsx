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

  // Password generation hook with dependencies
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

  // Calculate strength of the generated password
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

  // Clipboard copy functionality
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99999);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // Generate password on changes
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
        () => setTimeRemaining(timeRemaining - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      setPassword(usePasswordGenerator());
      setTimeRemaining(30);
    }
  }, [timeRemaining, usePasswordGenerator]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

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
          <nav className="hidden space-x-4 md:flex">
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
          <div className="md:hidden">
            <button
              id="menu-toggle"
              className="text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div id="mobile-menu" className="md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-2 bg-blue-600">
            <a
              href="#features"
              className="text-white transition-all hover:text-gray-200"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-white transition-all hover:text-gray-200"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white transition-all hover:text-gray-200"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-grow p-8 mx-auto max-w-7xl">
        <section className="p-10 transition-transform duration-500 ease-in-out bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
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
              className="w-full p-3 text-lg bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-4">
              <label className="block mb-2 text-lg font-medium">
                Insert Position:
              </label>
              <select
                value={customInputPosition}
                onChange={(e) => setCustomInputPosition(e.target.value)}
                className="w-full p-3 text-lg bg-gray-100 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
              >
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>
          {/* Options */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercaseAllowed"
                checked={uppercaseAllowed}
                onChange={(e) => setUppercaseAllowed(e.target.checked)}
                className="w-6 h-6 text-blue-600 transition-all border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="uppercaseAllowed" className="ml-2">
                Allow Uppercase
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="numberAllowed"
                checked={numberAllowed}
                onChange={(e) => setNumberAllowed(e.target.checked)}
                className="w-6 h-6 text-blue-600 transition-all border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="numberAllowed" className="ml-2">
                Allow Numbers
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="characterAllowed"
                checked={characterAllowed}
                onChange={(e) => setCharAllowed(e.target.checked)}
                className="w-6 h-6 text-blue-600 transition-all border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="characterAllowed" className="ml-2">
                Allow Special Characters
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="excludeSimilar"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-6 h-6 text-blue-600 transition-all border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="excludeSimilar" className="ml-2">
                Exclude Similar Characters
              </label>
            </div>
            <div className="flex items-center">
              <label htmlFor="passwordLength" className="mr-4">
                Length:
              </label>
              <input
                type="range"
                min="4"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
              />
              <span className="ml-4">{length}</span>
            </div>
          </div>
        </section>

        {/* Password History */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Password History</h2>
          <ul className="space-y-2">
            {passwordHistory.map((pass, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded-lg dark:bg-gray-700"
              >
                {pass}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white bg-gray-900">
        <p className="text-sm">© 2024 Made With By Pixinvent</p>
      </footer>
    </div>
  );
}

export default App;
