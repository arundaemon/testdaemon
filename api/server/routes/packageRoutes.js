const router = require("express-promise-router")();
const packagefunctions = require("../functions/packageFunctions");
const responseHandler = require("../utils/responseHandler");
const multer = require("multer");
const axios = require("axios");
const { authenticateToken } = require("../middlewares/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/uploadImageToGCP", upload.single("image"), async (req, res) => {
  let { tokenPayload } = req;
  let image = req?.file;

  return packagefunctions
    .uploadImageToGCP({ ...req.body, image, tokenPayload })
    .then((result) => responseHandler.sendSuccess(res, result, req))
    .catch((error) => responseHandler.sendError(res, error, req));
});

router.post("/listPackageBundles", async (req, res) => {
  let payload = req.query;
  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listPackageBundles`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listPackageMasterData", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listPackageMasterData`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listEntityFeatures", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listEntityFeatures`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdatePackageBundle", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdatePackageBundle`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listCampaign", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listCampaign`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateCampaign", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateCampaign`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listSource", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listSource`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateSource", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateSource`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listSubSource", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listSubSource`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateSubSource", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateSubSource`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listService", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listService`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateService", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateService`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listPricingMatrix", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listPricingMatrix`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listMatrixAttributes", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listMatrixAttributes`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdatePricingMatrix", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdatePricingMatrix`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listReceivingBank", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listReceivingBank`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listIssuingBank", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listIssuingBank`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listInvoiceOffice", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceOffice`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data && response.data.status !== undefined) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        console.log("first");
        res.status(200).send(response.data);
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

router.post(
  "/addUpdateHardwareInvoice",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateHardwareInvoice`;
    let headers = {
      Authorization: req.headers.authorization,
    };
    let response;
    try {
      response = await axios.post(url, payload, { headers });
      if (response && response.data && response.data.status !== undefined) {
        if (response.data.status == 200 || response.data.status == 1) {
          res.send(response.data);
        } else if (response.data.status == 0) {
          console.log("first");
          res.status(200).send(response.data);
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
  }
);

router.post("/listHardwareInvoice", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareInvoice`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data && response.data.status !== undefined) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        console.log("first");
        res.status(200).send(response.data);
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

router.post("/addSchoolTdsDetail", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addSchoolTdsDetail`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listSchoolTdsDetail", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listSchoolTdsDetail`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/cancelHardwareInvoice", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/cancelHardwareInvoice`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateInvoiceDsc", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateInvoiceDsc`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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
    console.log(err.response.data);
    if (err.response && err.response.data) {
      res.status(err.response.data.status).send(err.response.data);
    } else {
      res.status(400).send({ status: "Error", error: err });
    }
  }
});

router.post("/listInvoiceDsc", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceDsc`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/b2bPackageActivation", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/b2bPackageActivation`;

  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data);
      } else if (response.data.status == 0) {
        res.status(response.data.status).send(response.data);
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

router.post("/listVouchers", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listVouchers`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/packagePriceData", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/packagePriceData`;
  let refreshToken = req.headers.refreshToken;

  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/packagePriceAttributes", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/packagePriceAttributes`;
  let refreshToken = req.headers.refreshToken;

  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listFormInvoices", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listFormInvoices`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addVoucher", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addVoucher`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/voucherDetailsData", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/voucherDetailsData`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/voucherLogDetail", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/voucherLogDetail `;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/updateVoucherDetail", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/updateVoucherDetail`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/cancelVoucher", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/cancelVoucher`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/listPendingCollection", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listPendingCollection`;
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

router.post(
  "/listInvoiceCollectionSchedule",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceCollectionSchedule`;
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
  }
);

router.post("/listCollectionDetails", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listCollectionDetails`;
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

router.post(
  "/generateInvoiceFromSchedule",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/generateInvoiceFromSchedule`;
    let headers = {
      Authorization: req.headers.authorization,
    };
    let response;
    try {
      response = await axios.post(url, payload, { headers });
      if (response && response.data && response.data.status !== undefined) {
        if (
          response.data.status == 200 ||
          response.data.status == 1 ||
          response.data.status == 0
        ) {
          res.send(response.data);
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
  }
);

router.post("/updateInvoiceDetails", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/updateInvoiceDetails`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data && response.data.status !== undefined) {
      if (
        response.data.status == 200 ||
        response.data.status == 1 ||
        response.data.status == 0
      ) {
        res.send(response.data);
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

router.post("/listGeneratedInvoice", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listGeneratedInvoice`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data && response.data.status !== undefined) {
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

router.post("/listInvoiceIRNErrors", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceIRNErrors`;
  let headers = {
    Authorization: req.headers.authorization,
  };
  let response;
  try {
    response = await axios.post(url, payload, { headers });
    if (response && response.data && response.data.status !== undefined) {
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

router.post(
  "/listInvoiceScheduleDetails",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoiceScheduleDetails`;
    let headers = {
      Authorization: req.headers.authorization,
    };
    let response;
    try {
      response = await axios.post(url, payload, { headers });
      if (response && response.data && response.data.status !== undefined) {
        if (response.data.status == 200 || response.data.status == 1) {
          res.send(response.data);
        } else if (response.data.status == 0) {
          console.log("first");
          res.status(200).send(response.data);
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
  }
);

router.post("/listHardwareVoucher", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareVoucher`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/addUpdateHardwareVoucher", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateHardwareVoucher`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post("/hwInvoiceCreditDetail", async (req, res) => {
  let payload = req.query;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/hwInvoiceCreditDetail`;
  let headers = {
    Authorization: req.headers.authorization,
  };

  let response;
  try {
    response = await axios.post(url, { params: payload, headers });
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

router.post(
  "/pendingCollectionDetail",
  [authenticateToken],
  async (req, res) => {
    let payload = req.body;

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/pendingCollectionDetail`;
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
  }
);

router.post("/listSchoolLedger", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listSchoolLedger`;
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

router.post("/schoolLedgerDetails", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/schoolLedgerDetails`;
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


router.post('/creditDebitAmountLimit', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/creditDebitAmountLimit`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})

router.post('/addUpdateAddendum', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateAddendum`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})
router.post('/pendingInvoiceForRelease', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/pendingInvoiceForRelease`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})

router.post('/invoiceProcessAction', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/invoiceProcessAction`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})


router.post("/listSchoolLedgerVoucher", [authenticateToken], async (req, res) => {
  let payload = req.body;

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listSchoolLedgerVoucher`;
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
router.post('/listInvoicedForms', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listInvoicedForms`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})

router.post('/listHwInvoicedAmountDetails', [authenticateToken], async (req, res) => {
  let payload = req.body

  let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHwInvoicedAmountDetails`
  let headers = {
    Authorization: req.headers.authorization
  }
  let response
  try {
    response = await axios.post(url, payload, { headers })
    if (response && response.data.status) {
      if (response.data.status == 200 || response.data.status == 1) {
        res.send(response.data)
      } else if (response.data.status == 0) {
        res.status(400).send(response.data)
      } else {
        res.status(response.data.status).send(response.data)
      }
    } else {
      res.status(400).send(response)
    }
  } catch (err) {
    console.log('Error', err)
    if (err.response && err.response.data) {
      res.status(400).send(err.response.data)
    } else {
      res.status(400).send({ status: "Error", error: err })
    }
  }
})



module.exports = router;
