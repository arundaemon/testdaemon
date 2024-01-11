const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1,
};

const HTTP_STATUS_CODES = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

const MESSAGES = {
    EMPTY: {},
    KEY_CANT_EMPTY: "{{key}} cannot be empty",
    EMAIL_EXIST: "Email already exist!",
    INTERNAL_SERVER_ERROR: 'Something went wrong.',
    UNAUTHORIZED_ACCESS_EXCEPTION: 'Unauthorised Access',
    NO_TOKEN_SUPPLIED: 'No Token Supplied',
    DATA_SET_EXIST: 'DataSet already exist with this name.',
    DASHBOARD_EXIST: 'Dashboard already exist with this name.',
    DATASET_NOT_EXIST: 'DataSetId does not exist.',
    JOIN_NOT_EXIST: 'Join with this joinId does not exist',
    TABLE_ALIAS_EXIST: 'TableAlias already exist with this name',
    USER_TYPE_EXIST: 'UserType already exist with this name',
    ROLE_EXIST: 'Role already exist with this name',
    FOLDER_EXIST: 'Folder already exist with this name',
    MAX_FOLDER_REACHED: 'You can create max 9 folders.',
    USER_UUID_EXIST: 'User with this uuid already exist',
    UUID_DONT_EXIST: "Invalid UUID.",
    WRONG_CREDENTIALS: 'Wrong Credentials.',
    USER_DEACTIVATED: 'User Is Deactivated. Please Contact Admin.',
    TOKEN_EXPIRED: 'Token Expired! Login Again',
    CYCLE_EXISTS: 'Cycle name already exists',
    CAMPAIGN_EXISTS: 'Campaign name already exists',
    TERRITORY_EXISTS: 'Territory already exists',
    STATUS_EXISTS: 'Status name already exists',
    STAGE_EXISTS: 'Stage name already exists',
    SOURCE_EXISTS: 'Source name already exists',
    LEAD_NOT_EXISTS: 'leadId not exists',
    WRONG_TEMPLATE: 'Wrong excel template is uploaded.Please download sample file and then upload',
    USER_EXISTS: 'User already exists',
    DUPLICATE_COMBINATION: 'Duplicate combination of stage, status, customer response, priority and hardware',
    DND_STATUS_ACTIVATED: 'Dnd status is already activated',
    DND_STATUS_DEACTIVATED: 'Dnd status is already de-activated',
    DUPLICATE_REQUEST: 'Duplicate Request',
    DUPLICATE_CLAIM_MASTER: 'Duplicate entry',
    DUPLICATE_CRM_FIELD_MASTER: 'Field name already exists',
    DUPLICATE_SCHOOL: 'School already exist',
    DUPLICATE_QUOTATION_CONFIG: 'Duplicate combination of product name, quotation for',
    DUPLICATE_APPROVAL_MATRIX: 'Duplicate combination of approval type, product',
    DUPLICATE_PURCHASE_ORDER:'Purchase order already exists for this quotation',
    CONSENT_FILE_REQUIRED: 'Please upload consent file',
}

module.exports = Object.freeze({
    STATUS_CODE,
    MESSAGES,
    HTTP_STATUS_CODES
})