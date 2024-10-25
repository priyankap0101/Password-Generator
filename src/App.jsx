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
          </div>

          {/* Options Section */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              {
                label: "Include Numbers",
                checked: numberAllowed,
                onChange: () => setNumberAllowed(!numberAllowed),
              },
              {
                label: "Include Special Characters",
                checked: characterAllowed,
                onChange: () => setCharAllowed(!characterAllowed),
              },
              {
                label: "Include Uppercase Letters",
                checked: uppercaseAllowed,
                onChange: () => setUppercaseAllowed(!uppercaseAllowed),
              },
              {
                label: "Exclude Similar Characters",
                checked: excludeSimilar,
                onChange: () => setExcludeSimilar(!excludeSimilar),
              },
            ].map((opt) => (
              <label className="flex items-center" key={opt.label}>
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={opt.onChange}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
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

          {/* Strength Indicator */}
          <div className="mb-8">
            <label className="block text-lg font-medium">Strength:</label>
            <p className="text-xl font-semibold">
              {calculateStrength(password)}
            </p>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-end">
            <Switch.Group>
              <Switch.Label className="mr-4 font-medium text-gray-900 dark:text-gray-100">
                Dark Mode
              </Switch.Label>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                className={`${
                  darkMode ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                />
              </Switch>
            </Switch.Group>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-sm text-center text-white bg-blue-600">
        © 2024 Made With ❤️ By Your Company
      </footer>
    </div>
  );
}

export default App;
