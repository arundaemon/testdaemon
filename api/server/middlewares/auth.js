const jwt = require('jsonwebtoken');
const config = require('../config').cfg
const customExceptions = require('../responseModels/customExceptions')

let _verifyTok = async (acsTokn) => {    
    return jwt.verify(acsTokn, config.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            //throw new Error(err)
            return false
        }
        let { exp } = decoded
        let expInMillis = exp * 1000
        let currentDateTimeMillis = new Date().getTime()

        if (currentDateTimeMillis > expInMillis) {
            //throw customExceptions.tokenExpired()
            return false
        }

        if(decoded.role){
            decoded.role = decoded.role.toUpperCase()
        }

        return decoded
    });
};

const authenticateToken = (req, res, next) => {
    let acsToken = req.get('AccessToken');
    let authToken = req.get('Authorization');

    if (!acsToken && !authToken) {
        //throw customExceptions.noTokenSupplied()
        return res.status(401).send({status:0,err:'Authentication failed'})
    }
    if (authToken && !acsToken) {
        acsToken = authToken.replace('Bearer ','');
    }

    _verifyTok(acsToken)
        .then(data => {
            if(data){
                req.tokenPayload = data
                return next()
            }else{
                //console.log(data)
                return res.status(401).send({status:0,err:'Authentication failed'})
            }            
        })
        .catch(err => {
            console.log(err)
            return res.status(401).send({status:0,err:err})
            //next(err)
        })
}

const approvalRequest = (req,res,next) => {
    let params = req.body

    if(!params.approvalType){
        return res.status(400).send({status:0,err:'Please provide approval Type (ApprovalType)'})
    }

    if(!params.groupCode){
        return res.status(400).send({status:0,err:'Please provide Group Code (groupCode)'})
    }

    if(!params.referenceCode){
        return res.status(400).send({status:0,err:'Please provide Module Unique ID (referenceCode)'})
    }

    if(!params.createdByRoleName){
        return res.status(400).send({status:0,err:'Please provide Requester Role Name (createdByRoleName)'})
    }

    return next()
}


module.exports = {
    authenticateToken,
    approvalRequest
}