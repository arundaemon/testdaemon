var { STATUS_CODE, MESSAGES } = require('../constants/responseConstants');

class APIResponse {
    constructor(statusCode, result, request) {
        //console.log(result.errorMessage)
        this.statusCode = statusCode;
        if (statusCode == STATUS_CODE.SUCCESS) {
            result ? this.responseData = result : MESSAGES.EMPTY;
        } else {
            result ? (this.error = result ): MESSAGES.EMPTY;
        }
        this.time = new Date();
    }
}

// ========================== Export Module Start ==========================
module.exports = APIResponse;
// ========================== Export Module End ============================