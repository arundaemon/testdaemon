const router = require('express-promise-router')();
const axios = require('axios');




router.post('/packageMasterList', async (req, res) => {
    let payload = req.query
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/packageMasterList`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})


router.post('/listHardwarePartVariants', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwarePartVariants`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})

router.post('/listHardwareBundleVariants', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareBundleVariants`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})


router.post('/addUpdatePartVariants', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdatePartVariants`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})

router.post('/addUpdateBundleVariants', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateBundleVariants`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})

router.post('/listUnitOfMeasurement', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listUnitOfMeasurement`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})


router.post('/listHardwareRecommendation', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareRecommendation`
    let headers = {
        Authorization: req.headers.authorization
    }
    let response
    try {
        response = await axios.post(url, { params: payload, headers })
        if (response && response.data.status) {
            if (response.data.status == 200) {
                res.send(response.data)
            } else {
                res.status(response.data.status).send(response.data)
            }
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        //console.log(err.response.data)
        if (err.response && err.response.data) {
            res.status(err.response.data.status).send(err.response.data)
        } else {
            res.status(400).send({ status: "Error", error: err })
        }
    }
})











module.exports = router;
