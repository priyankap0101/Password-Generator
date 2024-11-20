import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ password, darkMode }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowQRCode(!showQRCode)}
        className={`px-4 py-2 text-sm font-medium transition rounded-lg ${
          darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-blue-500 text-white hover:bg-blue-400"
        }`}
      >
        {showQRCode ? "Hide QR Code" : "Show QR Code"}
      </button>
      {showQRCode && (
        <div className="flex justify-center mt-4">
          <QRCodeCanvas
            value={password}
            size={200}
            bgColor={darkMode ? "#1f2937" : "#ffffff"}
            fgColor={darkMode ? "#ffffff" : "#000000"}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
