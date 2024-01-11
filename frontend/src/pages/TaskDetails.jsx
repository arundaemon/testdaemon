import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import Page from "../components/Page";

const TaskDetails = () => {
  return (
    <>
      <div className="Create-Journey">
        <Page
          title="Extramarks | Task Details"
          className="main-container datasets_container"
        >
          {/* <Box>
                        <Breadcrumbs className='create-journey-heading' separator="›" aria-label="breadcrumb">
                            <Link underline="hover" key="1" color="inherit" >
                                Dummy
                            </Link>

                            <Typography key="2" color="text.primary">{'Lorem Ipsum'}</Typography>
                        </Breadcrumbs>
                    </Box> */}

          <Card
            style={{
              minHeight: "600px",
              marginLeft: "15px",
              marginRight: "30px",
            }}
          >
            <Container style={{ marginLeft: "5px" }}>
              <h3>
                <br></br>Task Details
              </h3>
              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliqua</p> */}
              <Divider style={{ marginTop: "20px" }} />

              <h4>
                <br></br>Virtual demo Task
              </h4>
              <p style={{ marginTop: "15px" }}>
                Name: <a href="/">Shivendra Pratap Singh</a>
              </p>
              <p style={{ marginTop: "15px" }}>
                Duration: <b>01:30 Hours</b>
              </p>
              <p style={{ marginTop: "15px" }}>
                Start Date: <b>03-05-2022, 3:50PM</b>
              </p>
              <p style={{ marginTop: "15px" }}>
                End Date: <b>27-08-2022, 3:50PM</b>
              </p>
              <p style={{ marginTop: "15px" }}>Task Status: Completed</p>
              <Divider style={{ marginTop: "20px" }} />

              <p style={{ marginTop: "15px" }}>
                Ownership: <a href="/">Himanshu Pratap Singh</a>
              </p>
            </Container>
          </Card>
        </Page>
      </div>
    </>
  );
};

export default TaskDetails;
