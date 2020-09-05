import React from "react";
import { Timeline, Events, UrlButton, ImageEvent } from "@merc/react-timeline";

import MiddleGround from "../../assets/img/projects/mdlgrnd.png";
import IdeaExpo from "../../assets/img/projects/idea-expo.png";
import EmployeeDirectory from "../../assets/img/projects/employee-directory.png";
// import Pupster from "../../assets/img/projects/pupster";
import Burger from "../../assets/img/projects/burger.png";
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
            // date="05/29/2020"
            className="text-center"
            text="Your Breaking News"
            src={MiddleGround}
            alt="Middleground"
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
                        <strong>Description:</strong>This project aims to bring
                        you news in an objective fashion from the whole
                        political spectrum.
                        <hr />
                        <strong>Features:</strong>
                        <ul className="list-styles pt-1">
                          <li>Search 3 news sources</li>
                          <li>
                            Real-time API calls to NY Times, Bing news, and
                            Hoaxy
                          </li>
                        </ul>
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            // date="05/29/2020"
            className="text-center"
            text="Idea Expo"
            src={IdeaExpo}
            alt="Ideaexpo"
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
                        <strong>Description:</strong>Storage for project ideas
                        to be shared, discussed, exchanged, developed.
                        <hr />
                        <strong>Features:</strong>
                        <ul className="list-styles pt-1">
                          <li>Search, post, edit, and read business ideas</li>
                          <li>
                            Collaborate on the applications of your interest
                          </li>
                        </ul>
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </div>
          </ImageEvent>

          <ImageEvent
            // date="05/29/2020"
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
                        <strong>Description:</strong>This project allows view
                        the entire employee directory.
                        <hr />
                        <strong>Features:</strong>
                        <ul className="list-styles pt-1">
                          <li>
                            View, search, sort the employee directory by name
                            and DOB.
                          </li>
                        </ul>
                        <hr />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </div>
          </ImageEvent>
        </Events>
      </Timeline>
    </div>
  );
};

export default TimeLine;
