const EnvData = {
  api: {
    url: 'https://qa-crm-api.extramarks.com',
    socketUrl: 'http://crm-msa-qa-backend-service:3001',
    hrm_api_url: 'https://myhr.extramarks.com/apis',
    logbookApi: 'https://logbook-qa-api.extramarks.com',
    logBookLogin: 'admin@extra',
    logBookPass: 'bhwe531EDcs#$ded',
    mode: 'cors'
  },
  env: 'dev',
  WEBISTE_LOGIN_PAYLOAD: {
    "action": "cognito_login", "apikey": "D21B2DBA59F52167BEBFF2484DAFB", "checksum": "950fa7d3b6a6380761f8ee07ee401120", "login_details": { "username": "guestuser", "password": "extra@123", "app_name": "Student_App", "acess_id": "", "app_version": "", "gcm_key": "", "email_address": "", "latitude": "", "longitude": "", "operating_system_version": "", "source": "website" }, "refresh_token": ""
  },
  LOCAL_STORAGE_ENCRYPTION: false,
  version: '2.0.0',
  WEBSITE_URL: "https://qa-apigateway.extramarks.com/",
  AUTH_SECRET: 'f24ae3ef1dd937560b7ab6885b303d5e36c77412d4e8c5e13d65ba6e48f699fe5fec3657f25518be882ba4ba8f93ccb3094a7fc96fcc6aea05de5b3b2dd056c1',
  REPORT_ENGINE_API_ENDPOINT: 'https://testgcp-report-api.extramarks.com',
  CUBE_API_URL: 'https://testgcp-report-datalake.extramarks.com',
  KNOWLARITY_STREAM_URL: 'https://konnect.knowlarity.com:8100',
  HRM_API_ENDPOINT: 'https://test-gcp-myhr.extramarks.com/apis',
  HRM_API_KEY: "m9wH72NLomYMT3eltAKY2IBO1g3kRl7YdZnIwQJv1R0Zx5xMRPuUXGvjmoU7c7qV",
  HRM_API_SALT_KEY: 'hrmsCrm@Integ@2022',
  OMS_API_URL: 'https://omsdev-gcp.extramarks.com',
  WEBSITE_API_KEY: 'D21B2DBA59F52167BEBFF2484DAFB',
  WEBSITE_SALT_KEY: 'CoLo&Mi!2021',
  TRIAL_ACTIVATION_ACTION: 'crmTrialActivation',
  COLLECT_PAYMENT_API_KEY: '1808366726612233476330D95',
  COLLECT_PAYMENT_SALT_KEY: 'OmS!Exm@^#2019',
  API_GATEWAY_API_KEY: '2832FSTDT7237DHDDH338HH',
  API_GATEWAY_SALT_KEY: '$crMNewST@2022',
  REDIRECT_LEAD_NAME_URL: "https://test-report.extramarks.com",
  REPORT_ENGINE_URL: "https://test-report.extramarks.com",
  CLAIM_DASHBOARD_KEY: "64a693f9603bca00127e1847",
  DEFAULT_LEAD_STAGE: 'Prospect',
  DEFAULT_LEAD_STATUS: 'New',
  FINANCE_PROFILES: ['Finance Executive','Finance Manager'],
  API_GATEWAY_KEY: '2ANKSAJ6UBM448FF5MG137E',
  API_GATEWAY_SALT: 'AnSA&BM!2023',
  API_GATEWAY_URL:"https://qa-apigateway.extramarks.com",
}


export default EnvData