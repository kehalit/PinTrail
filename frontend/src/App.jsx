
import { BrowserRouter } from "react-router-dom"
import React from "react";
import Router from "./routes/router";
import Header from "./components/Header"
import { Toaster } from 'react-hot-toast';




function App() {
  return (
    <BrowserRouter>
     <Header />
     <Toaster position="top-right" reverseOrder={false} />
      <Router />
      
    </BrowserRouter>
  
  );
}

export default App;

