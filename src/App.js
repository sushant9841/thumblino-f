import React, { useState } from "react";
import axios from "axios";
import "./App.css";
// Define valid page types as a static array
const validPageTypes = [
  "About",
  "Contact Us",
  "Blog",
  "Sign Up",
  "Login",
  "Pricing",
  "404",
  "Landing Page",
];

function App() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [quality, setQuality] = useState("80");
  const [scale, setScale] = useState("1");
  const [pageType, setPageType] = useState("Landing Page");
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [error, setError] = useState("");

  const handleCapture = async () => {
    try {
      // Validate page type on the frontend
      if (!validPageTypes.includes(pageType)) {
        throw new Error("Invalid pageType");
      }

      // Determine if full page screenshot is needed
      const isFullPage = parseInt(height) === 0;

      const response = await axios.get(
        `http://localhost:5000/get/width/${width}/height/${
          isFullPage ? "0" : height
        }/quality/${quality}/scale/${scale}/page/${encodeURIComponent(
          pageType.replace(/ /g, "-")
        )}/url/${encodeURIComponent(url)}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result;
        setScreenshot(base64String);
        setError("");
      };

      reader.onerror = () => {
        setError("Error reading the screenshot data.");
        setScreenshot("");
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      setError(
        "Error capturing screenshot. Please check the URL and try again."
      );
      setScreenshot("");
    }
  };

  return (
    <div className="App">
      <h1>Thumblino</h1>{" "}
      <div className="main">
        <div className="maininput">
          <div className="input">
            <label>Width:</label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          <div className="input">
            <label>Height (0 for full page):</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="input">
            <label>Quality:</label>
            <input
              type="text"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
          </div>

          <div className="input">
            <label>Scale:</label>
            <input
              type="text"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
            />
          </div>
        </div>

        <div className="maininput">
          <div className="input">
            <label>Page Type:</label>
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
            >
              {validPageTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label>URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleCapture}>Capture Screenshot</button>
      </div>
      {error && <p>{error}</p>}
      {screenshot && (
        <div className="main1">
          <h2>Result:</h2>
          <img src={screenshot} alt="Screenshot" />
        </div>
      )}
    </div>
  );
}

export default App;
