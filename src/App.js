import React from "react";
import Checkin from "./Components/Checkin"; // Ensure Checkin.js is inside src/components
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Checkin ratePerHour={10} />
    </div>
  );
}

export default App;
