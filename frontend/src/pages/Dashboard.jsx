import React, {  useState,  } from "react";

import TripsMap from "../components/TripsMap";
import Header from "../components/Header";



const Dashboard = () => {
  const [popupOpen, setPopupOpen] = useState(false);


    return (
        <div>
            <Header popupOpen={popupOpen} />
            <TripsMap setPopupOpen={setPopupOpen} />
        </div>
    );
};



export default Dashboard;
