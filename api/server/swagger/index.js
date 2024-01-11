const { createSiteSurveyForm, implementationSiteSurveySchema, getSiteSurveyList, getDataFromExcel, getSurveyDetail } = require('./implementationSiteSurveySwagger');
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "CRM API with Swagger",
            version: "0.1.0",
            description: "Customer relationship management (CRM) is a technology for managing all your company's relationships and interactions with customers and potential customers. The goal is simple: Improve business relationships. A CRM system helps companies stay connected to customers, streamline processes, and improve profitability."
        },
        paths: {
            '/implementationSiteSurvey/createSiteSurvey': {
                post: createSiteSurveyForm,
            },
            '/implementationSiteSurvey/getSiteSurveyList': {
                get: getSiteSurveyList
            },
            '/implementationSiteSurvey/getDataFromExcel': {
                post: getDataFromExcel
            },
            '/implementationSiteSurvey/getSiteSurveyDetails': {
                get: getSurveyDetail
            }
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Local Server"
            },
            {
                url: "https://qa-crm-api.extramarks.com",
                description: "QA Server"
            },
        ],
        tags: ['Implementation Site Survey'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    in: 'header',
                    name: 'AccessToken',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                implementationSiteSurveySchema,
            }
        },
        apis: ["./server/routes/*.js"],
    },
    apis: ["./server/routes/*.js"]
};

module.exports = options;