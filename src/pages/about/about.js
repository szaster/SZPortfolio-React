import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./style.css";
import Profile from "../../assets/img/profile.jpeg";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const About = () => {
  return (
    <div id="about">
      <div className="about">
        <h1 className="pt-3 text-center font-details pb-3">ABOUT ME</h1>
        <Container>
          <Row className="pt-3 pb-5 align-items-center">
            <Col xs={12} md={6}>
              <Row className="justify-content-center mb-2 mr-2 ">
                <Image
                  className="profile justify-content-end"
                  alt="profile"
                  src={Profile}
                  thumbnail
                  fluid
                />
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Row className=" align-items-start p-2 my-details rounded">
                <h4>About me</h4>

                <p>
                  My professional career as a teacher started after obtaining
                  MS. in Physics and Education from a National Technical
                  University "KPI" in Kyiv, Ukraine. My journey continued in
                  Houston, where I entered graduate school at University oh
                  Houston, taught general Chemistry and conducted a research.
                  While being in grad school I performed scientific programming
                  for my field of study.{" "}
                </p>
                <p>
                  Several year ago, inspired by the capabilities of Python and
                  armed with my scientific background, I started to learn Python
                  for my own project. At some point I needed more in-depth
                  knowledge, and joined the Full Stack Web Development Bootcamp
                  with UT Texas to expand my skill set to be able to build more
                  meaningful applications that would help people.{" "}
                </p>
                <p>
                  {" "}
                  I constantly learn and build upon knowledge and the foundation
                  I acquired during my career. Please take a glance at some of
                  my projects and feel free to contact me.
                </p>
                <Col className="d-flex justify-content-center flex-wrap">
                  <div>
                    <a href="#contact">
                      <Button className="m-2" variant="outline-primary">
                        Let's talk
                      </Button>
                    </a>
                  </div>
                  <div>
                    <a target="_blank" href="../../assets/img/resume.pdf">
                      <Button className="m-2" variant="outline-success">
                        My Resume
                      </Button>
                    </a>
                  </div>
                  <div>
                    <Button className="m-2" variant="outline-primary">
                      <a
                        href="https://www.linkedin.com/in/svitlana-zaster-77a9a06b/"
                        target="_blank"
                      >
                        <i class="fab fa-linkedin">Linkedin</i>
                      </a>
                    </Button>
                  </div>
                  <div>
                    <Button className="m-2" variant="outline-dark">
                      <a href="https://github.com/szaster/" target="_blank">
                        <i class="fab fa-github">Github</i>
                      </a>
                    </Button>
                  </div>
                  <div>
                    <Button className="m-2" variant="outline-info">
                      <a
                        class="social"
                        href="https://twitter.com/szaster"
                        target="_blank"
                      >
                        <i class="fab fa-twitter">Twitter</i>
                      </a>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;
