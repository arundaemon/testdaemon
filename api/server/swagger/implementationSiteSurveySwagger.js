const implementationSiteSurveySchema = {
    type: 'object',
    required: ['implementationCode', 'quotationCode', 'purchaseOrderCode', 'schoolCode', 'internetAvailability',],
    properties: {
        implementationCode: {
            type: 'string',
        },
        quotationCode: {
            type: 'string',
        },
        purchaseOrderCode: {
            type: 'string',
            trim: true
        },
        schoolId: {
            type: 'string',
            trim: true,
        },
        schoolCode: {
            type: 'string',
            trim: true,
        },
        schoolName: {
            type: 'string',
            trim: true,
        },
        schoolPinCode: {
            type: 'string',
            trim: true,
        },
        schoolAddress: {
            type: 'string',
            trim: true,
        },
        schoolEmailId: {
            type: 'string',
            trim: true,
        },
        schoolCountryCode: {
            type: 'string',
            trim: true,
        },
        schoolCountryName: {
            type: 'string',
            trim: true,
        },
        schoolType: {
            type: 'string',
            trim: true,
        },
        schoolStateCode: {
            type: 'string',
            trim: true,
        },
        schoolStateName: {
            type: 'string',
            trim: true,
        },
        schoolCityCode: {
            type: 'string',
            trim: true,
        },
        schoolCityName: {
            type: 'string',
            trim: true,
        },
        internetAvailability: {
            type: 'boolean'
        },
        downloadSpeed: {
            type: 'string',
            trim: true
        },
        uploadSpeed: {
            type: 'string',
            trim: true
        },
        networkType: {
            type: 'string',
            trim: true
        },
        serviceProviderDetails: {
            type: 'string',
            trim: true
        },
        serverConfiguration: {
            type: 'object'
        },
        numOfSwitchEightport: {
            type: 'integer',
            trim: true
        },
        numOfSwitchSixteenPort: {
            type: 'integer',
            trim: true
        },
        numOfSwitchTwentyFourPort: {
            type: 'integer',
            trim: true
        },
        classRoomDetails: {
            type: 'array',
            items: {
                type: 'object'
            }
        },
        standaloneOnlineConfiguration: {
            type: 'array',
            items: {
                type: 'object'
            }
        },
        IFPOnlineConfiguration: {
            type: 'array',
            items: {
                type: 'object'
            }
        },
        createdByName: {
            type: 'string',
            trim: true,
        },
        createdByRoleName: {
            type: 'string',
            trim: true,
        },
        createdByProfileName: {
            type: 'string',
            trim: true,
        },
        createdByEmpCode: {
            type: 'string',
            trim: true,
        },
        createdByUuid: {
            type: 'string',
            trim: true,
        },
        modifiedByName: {
            type: 'string',
            trim: true,
        },
        modifiedByRoleName: {
            type: 'string',
            trim: true,
        },
        modifiedByProfileName: {
            type: 'string',
            trim: true,
        },
        modifiedByEmpCode: {
            type: 'string',
            trim: true,
        },
        modifiedByUuid: {
            type: 'string',
            trim: true,
        },
        status: {
            type: 'string',
            trim: true
        },
        consentFile: {
            type: 'string',
            trim: true
        },
        isDeleted: {
            type: 'boolean',
            default: false
        }
    }
}

const createSiteSurveyForm = {
    tags: ['Implementation Site Survey'],
    operationId: 'createSiteSurvey',
    description: 'Api to create site survey of implementation',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        content: {
            'multipart/form-data': {
                // schema: {
                //     // $ref: '#/components/schemas/implementationSiteSurveySchema',
                // }
                schema: {
                    type: 'object',
                    properties: {
                        consentFile: {
                            type: 'string',
                            format: 'binary'
                        },
                        implementationCode: {
                            type: 'string',
                        },
                        quotationCode: {
                            type: 'string',
                        },
                        purchaseOrderCode: {
                            type: 'string',
                            trim: true
                        },
                        schoolId: {
                            type: 'string',
                            trim: true,
                        },
                        schoolCode: {
                            type: 'string',
                            trim: true,
                        },
                        schoolName: {
                            type: 'string',
                            trim: true,
                        },
                        schoolPinCode: {
                            type: 'string',
                            trim: true,
                        },
                        schoolAddress: {
                            type: 'string',
                            trim: true,
                        },
                        schoolEmailId: {
                            type: 'string',
                            trim: true,
                        },
                        schoolCountryCode: {
                            type: 'string',
                            trim: true,
                        },
                        schoolCountryName: {
                            type: 'string',
                            trim: true,
                        },
                        schoolType: {
                            type: 'string',
                            trim: true,
                        },
                        schoolStateCode: {
                            type: 'string',
                            trim: true,
                        },
                        schoolStateName: {
                            type: 'string',
                            trim: true,
                        },
                        schoolCityCode: {
                            type: 'string',
                            trim: true,
                        },
                        schoolCityName: {
                            type: 'string',
                            trim: true,
                        },
                        internetAvailability: {
                            type: 'boolean'
                        },
                        downloadSpeed: {
                            type: 'string',
                            trim: true
                        },
                        uploadSpeed: {
                            type: 'string',
                            trim: true
                        },
                        networkType: {
                            type: 'string',
                            trim: true
                        },
                        serviceProviderDetails: {
                            type: 'string',
                            trim: true
                        },
                        serverConfiguration: {
                            type: 'object'
                        },
                        numOfSwitchEightport: {
                            type: 'integer',
                            trim: true
                        },
                        numOfSwitchSixteenPort: {
                            type: 'integer',
                            trim: true
                        },
                        numOfSwitchTwentyFourPort: {
                            type: 'integer',
                            trim: true
                        },
                        classRoomDetails: {
                            type: 'array',
                            items: {
                                type: 'object'
                            }
                        },
                        standaloneOnlineConfiguration: {
                            type: 'array',
                            items: {
                                type: 'object'
                            }
                        },
                        IFPOnlineConfiguration: {
                            type: 'array',
                            items: {
                                type: 'object'
                            }
                        },
                        createdByName: {
                            type: 'string',
                            trim: true,
                        },
                        createdByRoleName: {
                            type: 'string',
                            trim: true,
                        },
                        createdByProfileName: {
                            type: 'string',
                            trim: true,
                        },
                        createdByEmpCode: {
                            type: 'string',
                            trim: true,
                        },
                        createdByUuid: {
                            type: 'string',
                            trim: true,
                        },
                        modifiedByName: {
                            type: 'string',
                            trim: true,
                        },
                        modifiedByRoleName: {
                            type: 'string',
                            trim: true,
                        },
                        modifiedByProfileName: {
                            type: 'string',
                            trim: true,
                        },
                        modifiedByEmpCode: {
                            type: 'string',
                            trim: true,
                        },
                        modifiedByUuid: {
                            type: 'string',
                            trim: true,
                        },
                    }
                }
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'Site Survey Submitted Successfully',
            content: {
                'application/json': {
                   
                    schema: {
                        // $ref: '#/components/schemas/implementationSiteSurveySchema',
                    }
                }
            }
        }
    }

}

const getSiteSurveyList = {
    tags: ['Implementation Site Survey'],
    // operationId: 'SiteSurvey',
    description: 'Api to fetch listing of site survey',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            name: 'pageNo',
            in: 'query',
            required: false,
            type: 'integer',
        },
        {
            name: 'count',
            in: 'query',
            required: false,
            type: 'integer',
        },
        {
            name: 'sortKey',
            in: 'query',
            required: false,
            type: 'integer',
        },
        {
            name: 'sortOrder',
            in: 'query',
            required: false,
            type: 'integer',
        }
    ],
    responses: {
        '200': {
            description: 'Site Survey List Fetched Successfully',
            content: {
                'application/json': {
                    // schema: {
                    //     $ref: '#/components/definition/implementationSiteSurveySchema',
                    // }
                }
            }
        }
    }
}

const getSurveyDetail = {
    tags: ['Implementation Site Survey'],
    description: 'Api to fetch details of site survey',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            name: 'siteSurveyCode',
            in: 'query',
            required: true,
            type: 'integer',
        },
    ],
    responses: {
        '200': {
            description: 'Site Survey Details Fetched Successfully',
            content: {
                'application/json': {
                    // schema: {
                    //     $ref: '#/components/definition/implementationSiteSurveySchema',
                    // }
                }
            }
        }
    }
}

const getDataFromExcel = {
    tags: ['Implementation Site Survey'],
    description: 'Api to fetch data from Excel',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary',
                        }
                    },
                    required: ['file']
                }
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'Data Fetched Successfully',
            content: {
                'application/json': {
                    // schema: {
                    //     $ref: '#/components/definition/implementationSiteSurveySchema',
                    // }
                }
            }
        }
    }

}

module.exports = {
    implementationSiteSurveySchema,
    createSiteSurveyForm,
    getSiteSurveyList,
    getDataFromExcel,
    getSurveyDetail
}

