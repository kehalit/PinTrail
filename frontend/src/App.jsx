
import { BrowserRouter } from "react-router-dom"
import React from "react";
import Router from "./routes/router";
import Header from "./components/Header"



function App() {
  return (
    <BrowserRouter>
     <Header />
      <Router />
    </BrowserRouter>
  
  );
}

export default App;

