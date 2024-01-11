import axios from "axios";
import { url, endPoint } from "../urls";
import settings from '../settings'
import requestInstance from "../../utils/authorizedRequest";

export function listActivatedSchool(params) {
    let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.activatedPackage.listActivatedSchool}`
    // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

    return requestInstance.post(_url, params);
}

export function listActivatedPackageDetails(params) {
    let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.activatedPackage.listActivatedPackageDetails}`
    // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

    return requestInstance.post(_url, params);
}

export function activatedPackageDetails(params) {
    let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.activatedPackage.activatedPackageDetails}`
    // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

    return requestInstance.post(_url, params);
}

export function updateActivatedPackageDetails(params) {
    let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.activatedPackage.updateActivatedPackageDetails}`
    // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

    return requestInstance.post(_url, params);
}

export function updatePackageActivationStatus(params) {
    let _url = `${settings.WEBSITE_URL}cognito-login-service/auth${endPoint.activatedPackage.updatePackageActivationStatus}`
    // let _url = ` https://dev-apigateway.extramarks.com/cognito-login-service/auth/packages/listBatchDetails`

    return requestInstance.post(_url, params);
}