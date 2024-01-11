

const leadDetailsControllers = require('../controllers/leadDetailControls');
const customExceptions = require('../responseModels/customExceptions')

const getLeadDetailsByLeadId = (params) => {
    return leadDetailsControllers.findOneByKey(params)
      .then((result) => {
        return { message: "Lead Details by lead Id", result }
      })
  }

module.exports={getLeadDetailsByLeadId}  