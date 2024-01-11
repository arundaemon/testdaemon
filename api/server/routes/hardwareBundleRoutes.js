const router = require('express-promise-router')();
const axios = require('axios');




router.post('/listHardwareParts', async (req, res) => {
    let payload = req.query
    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareParts`
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


router.post('/addUpdateHardwarePart', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateHardwarePart`
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

router.post('/listHardwareBundle', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/listHardwareBundle`
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


router.post('/addUpdateHardwareBundle', async (req, res) => {
    let payload = req.query

    let url = `${envConfig.API_GATEWAY_URL}/cognito-login-service/auth/packages/addUpdateHardwareBundle`
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
