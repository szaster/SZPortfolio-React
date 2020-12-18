import React from "react";
import { Timeline, Events, UrlButton, ImageEvent } from "@merc/react-timeline";
import "./style.css";
import MiddleGround from "../../assets/img/projects/mdlgrnd.png";
import IdeaExpo from "../../assets/img/projects/idea-expo.png";
import EmployeeDirectory from "../../assets/img/projects/employee-directory.png";
// import Pupster from "../../assets/img/projects/pupster";
import Burger from "../../assets/img/projects/burger.png";
import Letflex from "../../assets/img/projects/landing.png";

// import NoteTaker from "../../assets/img/projects/note-taker";
// import DailyPlanner from "../../assets/img/projects/daily-planner";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const TimeLine = () => {
  return (
    <div id="projects">
      <h1 className="pt-3 text-center font-details-b pb-3">PROJECTS</h1>
      <Timeline>
        <Events>
          <ImageEvent
            date="09/29/2020"
            className="text-center"
            text="Letflex or Netflix?"
            src={Letflex}
            alt="Letflex"
          >
            <div className="d-flex justify-content-between flex-column mt-1">
              <div>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-2 text-center accordian-main"
                    >
                      PROJECT DETAILS
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0" className="text-left">
                      <Card.Body>
                        <strong>Description: </strong> Letflex is Netflix clone
                        app featuring movie search name or keywords. Users can
                        watch trailers, add movies to favorites, comment,
                        review, and discuss movies. Letflex has a blog/dashboard
                        feature with recommendations and movie reviews.
                        <hr />
                        <strong>Role: </strong> Mostly worked on back-end,
                        authorization flow, and on the connection with
                        front-end. Created data models for MongoDB Atlas
                        database, wrote Express route controllers, configured
                        Passport, and implemented user sign-in authorization
                        with Google OAuth.
                        <hr />
                        <strong>Tools/languages: </strong>JavaScript, React,
                        Redux, Express, Passport, Mongoose, Node, Heroku,
                        MongoDB Atlas.
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              <div className="d-flex justify-content-between flex-nowrap text-center">
                <UrlButton href="http://letflex.herokuapp.com/" target="_blank">
                  SEE LIVE
                </UrlButton>
                <UrlButton
                  href="https://github.com/szaster/Letflex"
                  target="_blank"
                >
                  SOURCE CODE
                </UrlButton>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            date="07/01/2020"
            className="text-center"
            text="IdeaExpo"
            src={IdeaExpo}
            alt="IdeaExpo"
          >
            <div className="d-flex justify-content-between flex-column mt-1">
              <div>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-2 text-center accordian-main"
                    >
                      PROJECT DETAILS
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0" className="text-left">
                      <Card.Body>
                        <strong>Description: </strong> Web application allows to
                        search, post, develop business/project ideas, and find
                        collaborators on the ideas of interest.
                        <hr />
                        <strong>Role: </strong>Created models for MySQL
                        database, wrote Express route controllers, configured
                        Passport, implemented user sign-in authorization with
                        Google OAuth.
                        <hr />
                        <strong>Tools/languages: </strong> HTML, JavaScript,
                        CSS, Materialize CSS, MySQL, Sequelize, Express, Node,
                        Handlebars, Heroku.
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              <div className="d-flex justify-content-between flex-nowrap text-center">
                <UrlButton
                  href="http://ideaexpo.herokuapp.com/ "
                  target="_blank"
                >
                  SEE LIVE
                </UrlButton>
                <UrlButton
                  href="https://github.com/szaster/IdeaEXPO "
                  target="_blank"
                >
                  SOURCE CODE
                </UrlButton>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            date="08/29/2020"
            className="text-center"
            text="Employee Directory"
            src={EmployeeDirectory}
            alt="EmployeeDirectory"
          >
            <div className="d-flex justify-content-between flex-column mt-1">
              <div>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-2 text-center accordian-main"
                    >
                      PROJECT DETAILS
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0" className="text-left">
                      <Card.Body>
                        <strong>Description: </strong>This app displays a list
                        of random users(employees) on every refresh and allows
                        to view and edit the entire employee directory. The user
                        can search for a specific name or sort names in
                        ascending or descending order, or by DOB.
                        <hr />
                        <strong>Tools/languages: </strong>JavaScript, React,
                        CSS.
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              <div className="d-flex justify-content-between flex-nowrap text-center">
                <UrlButton
                  href=" https://szaster.github.io/React-Employee-Directory-App/"
                  target="_blank"
                >
                  SEE LIVE
                </UrlButton>
                <UrlButton
                  href=" https://github.com/szaster/React-Employee-Directory-App"
                  target="_blank"
                >
                  SOURCE CODE
                </UrlButton>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            date="06/29/2020"
            className="text-center"
            text="Burger"
            src={Burger}
            alt="Burger"
          >
            <div className="d-flex justify-content-between flex-column mt-1">
              <div>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-2 text-center accordian-main"
                    >
                      PROJECT DETAILS
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0" className="text-left">
                      <Card.Body>
                        <strong>Description: </strong>This application allows to
                        keep records of user's most delicious burgers in the
                        very special burger list!
                        <hr />
                        <strong>Tools/languages: </strong>MySQL, Node, Express,
                        Handlebars and ORM.
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              <div className="d-flex justify-content-between flex-nowrap text-center">
                <UrlButton
                  href=" https://powerful-thicket-03747.herokuapp.com/"
                  target="_blank"
                >
                  SEE LIVE
                </UrlButton>
                <UrlButton
                  href="https://github.com/szaster/Burger-App "
                  target="_blank"
                >
                  SOURCE CODE
                </UrlButton>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            date="05/29/2020"
            className="text-center"
            text="Your Breaking News"
            src={MiddleGround}
            alt="Middle ground"
          >
            <div className="d-flex justify-content-between flex-column mt-1">
              <div>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      className="p-2 text-center accordian-main"
                    >
                      PROJECT DETAILS
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0" className="text-left">
                      <Card.Body>
                        <strong>Description: </strong> Web application that
                        aggregates articles from various news sources aiming to
                        deliver unbiased information to readers. Real-time API
                        calls to NY Times, Bing news, and Hoaxy.
                        <hr />
                        <strong>Role: </strong> Designed and implemented user
                        interface, worked on functionality, and business logic
                        of the app.
                        <hr />
                        <strong>Tools/languages: </strong>HTML, JavaScript,
                        jQuery, CSS, Materialize CSS.
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              <div className="d-flex justify-content-between flex-nowrap text-center">
                <UrlButton
                  href=" https://szaster.github.io/Your-Breaking-News/"
                  target="_blank"
                >
                  SEE LIVE
                </UrlButton>
                <UrlButton
                  href=" https://github.com/szaster/Your-Breaking-News"
                  target="_blank"
                >
                  SOURCE CODE
                </UrlButton>
              </div>
            </div>
          </ImageEvent>
        </Events>
      </Timeline>
    </div>
  );
};

export default TimeLine;
