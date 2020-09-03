import React from "react";
import MyNavbar from "./components/navbar/mynavbar";
import MyCarousal from "./components/carousal/mycarousal";
import MyTitleMessage from "./components/title-message/title-message";

import "./App.css";

function App() {
  return (
    <div className="App" style={{ position: "relative" }}>
      <MyNavbar />
      <MyCarousal />
      <MyTitleMessage />
    </div>
  );
}

export default App;
