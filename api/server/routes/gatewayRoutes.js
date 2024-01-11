const router = require("express-promise-router")();
const request = require("request");
const axios = require("axios");
const responseHandler = require("../utils/responseHandler");
const { authenticateToken } = require("../middlewares/auth");

router.get("/getBoardList", async (req, res) => {
  let payload = req.query;
  //console.log(req.headers,payload)
  let url = `${envConfig.API_GATEWAY_URL}/syllabus-v2/boardList`;
  let refreshToken = req.headers.refreshToken;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.get(url, { params: payload, headers });
    //console.log(response)
    if (response && response.data.status) {
      if (response.data.status == 200) {
        res.send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    //console.log(err.response.data)
    if (err.response && err.response.data) {
      res.status(err.response.data.status).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
  //console.log(data.response.data)
});

router.post("/getMasterList", [authenticateToken], async (req, res) => {
  let payload = req.body;
  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listPackageMasterData`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        res.status(400).send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    console.log("Error", err.response.data);
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

router.post(
  "/addInvoiceCollectionSchedule",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addInvoiceCollectionSchedule`;
    let headers = {
      Authorization: req.headers.authorization,
    };
    let response;
    try {
      response = await axios.post(url, payload, { headers });
      if (response && response.data.status) {
        //console.log(response)
        if (response.data.status == 200 || response.data.status == 1) {
          res.send(response.data);
        } else if (response.data.status == 0) {
          res.status(400).send(response.data);
        } else {
          res.status(response.data.status).send(response.data);
        }
      } else if (response.data) {
        res.status(400).send(response.data);
      } else {
        res
          .status(400)
          .send({ status: "Error", error: JSON.stringify(response) });
      }
    } catch (err) {
      console.log("Error", err);
      if (err.response && err.response.data) {
        res.status(400).send(err.response.data);
      } else {
        res.status(400).send({ status: "Error", error: err });
      }
    }
  }
);

router.post("/getScheduleList", [authenticateToken], async (req, res) => {
  const url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceCollectionSchedule`;
  let payload = req.body;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        res.status(400).send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    console.log("Error", err);
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

router.post("/getReasonMasterList", [authenticateToken], async (req, res) => {
  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listReasonMaster`;
  let payload = req.body;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        res.status(400).send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    console.log("Error", err);
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

router.get("/getChildList", async (req, res) => {
  let payload = req.query;
  //console.log(req.headers,payload)
  let url = `${envConfig.API_GATEWAY_URL}/syllabus-v2/childList`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.get(url, { params: payload, headers });
    //console.log(response)
    if (response && response.data.status) {
      if (response.data.status == 200) {
        res.send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    //console.log(err.response.data)
    if (err.response && err.response.data) {
      res.status(err.response.data.status).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

router.post("/sendEmail", async (req, res) => {
  let payload = req.query;
  let url = `${envConfig.API_GATEWAY_URL}/communication-service/communication/sendMail`;

  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
    //console.log(response)
    if (response && response.data.status) {
      if (response.data.status == 200) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        res.status(400).send(response.data);
      } else {
        res.status(response.data.status).send(response.data);
      }
    } else {
      res.status(400).send(response);
    }
  } catch (err) {
    // console.log(err?.response?.data, 'getrrReeeee')
    if (
      err?.response &&
      err?.response?.data &&
      !(err?.response?.data?.status === 0)
    ) {
      res.status(err?.response?.data?.status).send(err?.response?.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

module.exports = router;
