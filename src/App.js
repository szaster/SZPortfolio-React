import React from "react";
import MyNavbar from "./components/navbar/mynavbar";
import MyCarousal from "./components/carousal/mycarousal";
import MyTitleMessage from "./components/title-message/title-message";
import FooterPanel from "./components/footer/footer";
import About from "./pages/about/about";
import Container from "react-bootstrap/Container";
import Fade from "react-reveal/Fade";
import Skills from "./pages/skills/skills";
import Slide from "react-reveal/Slide";
import TimeLine from "./components/projects/projects";

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
      <Container className="container-box rounded">
        <Slide bottom duration={500}>
          <hr />
          <Skills />
          <Slide bottom duration={500}>
            <hr />
            <TimeLine />
          </Slide>
        </Slide>
      </Container>
      <FooterPanel />
    </div>
  );
}

export default App;
