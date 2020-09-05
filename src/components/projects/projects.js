import React from "react";
import { Timeline, Events, UrlButton, ImageEvent } from "@merc/react-timeline";

import MiddleGround from "../../assets/img/projects/mdlgrnd.png";
// import IdeaExpo from "../../assets/img/projects/idea-expo";
// import EmployeeDirectory from "../../assets/img/projects/employee-directory";
// import Pupster from "../../assets/img/projects/pupster";
// import Burger from "../../assets/img/projects/burger";
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
        </Events>
      </Timeline>
    </div>
  );
};

export default TimeLine;
