import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Doctor from './components/Doctors';
import Ambulance from './components/Ambulances';

function App() {

  const [currentComponent, setCurrentComponent] = useState("doctors"); // Default component is Doctors

  const handleDoctorsClick = () => {
    setCurrentComponent("doctors");
  };

  const handleAmbulancesClick = () => {
    setCurrentComponent("ambulances");
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Find Nearby Ambulances and Doctors</h1>
      <div>
        <button onClick={handleDoctorsClick} style={styles.button}>
          Doctors
        </button>
        <button onClick={handleAmbulancesClick} style={styles.button}>
          Ambulances
        </button>
      </div>
      
      {/* Render the current component based on state */}
      <div style={{ marginTop: "20px" }}>
        {currentComponent === "doctors" && <Doctor />}
        {currentComponent === "ambulances" && <Ambulance />}
      </div>
    </div>
  );
}

const styles = {
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
