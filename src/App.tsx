import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ParkingSlots from "./components/ParkingSlots";
import ParkingCharges from "./components/ParkingCharges";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parking-slots/:numSlots?" element={<ParkingSlots />} />
        <Route path="/parking-charges/:slotNumber" element={<ParkingCharges />} />
      </Routes>
    </Router>
  );
}

export default App;
