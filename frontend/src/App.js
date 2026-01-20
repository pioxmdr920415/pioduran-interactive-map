import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InteractiveMap from "./components/InteractiveMap";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InteractiveMap />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            borderRadius: '1rem',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
