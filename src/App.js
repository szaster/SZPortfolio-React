import React from "react";
import MyNavbar from "./components/navbar/mynavbar";
import MyCarousal from "./components/carousal/mycarousal";
import MyTitleMessage from "./components/title-message/title-message";
import FooterPanel from "./components/footer/footer";
import About from "./pages/about/about";
import Container from "react-bootstrap/Container";
import Fade from "react-reveal/Fade";

import "./App.css";

function App() {
  return (
    <div className="App" style={{ position: "relative" }}>
      <MyNavbar />
      <MyCarousal />
      <MyTitleMessage />
      <div>
        <Container className="container-box rounded">
          <Fade duration={500}>
            <About />
          </Fade>
        </Container>
      </div>
      <FooterPanel />
    </div>
  );
}

export default App;
