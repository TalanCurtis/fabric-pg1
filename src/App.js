import React from 'react';
import CanvasGrid from './components/CanvasGrid/CanvasGrid';
import "./styles/main.css";

function App() {
  return (
    <div className="App">
      <div style={{ width:"100vw", height:"100vh" , backgroundColor:"red"}}>
        <CanvasGrid />
      </div>
    </div>
  );
}

export default App;
