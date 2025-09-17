
import { BrowserRouter } from "react-router-dom"
import React from "react";
import Router from "./routes/router";
import Header from "./components/Header"
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from "./components/ErrorBoundary";
import ChatBot from "./components/ChatBot";




function App() {
  return (
    <BrowserRouter>
     <ErrorBoundary>
     <Header />
     <Toaster position="top-right" reverseOrder={false} />
     <ChatBot /> 
      <Router />
     </ErrorBoundary>
    </BrowserRouter>
  
  );
}

export default App;

