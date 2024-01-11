import axios from "axios";
import { url, endPoint } from "../urls";
import requestInstance from "../../utils/authorizedRequest";

export function getSalesApprovalListAll(param) {
    let _url = `${url.backendHost + endPoint.salesApproval.getSalesApprovalListAll}?${param}`;
    return requestInstance.get(_url);
}

export function getSalesApprovalList(query) {
    let _url = `${url.backendHost + endPoint.salesApproval.getSalesApprovalList
        }?${query}`;
    return requestInstance.get(_url);
}

export function getSingleSalesApproval(searchParam) {
    let _url = `${url.backendHost + endPoint.salesApproval.getSalesApprovalList
        }?${searchParam}`;
    return requestInstance.get(_url);
}

export function acceptApprovalRequest(params) {
    let _url = url.backendHost + endPoint.salesApproval.acceptApprovalRequest;
    return requestInstance.put(_url, params);
}

export function rejectApprovalRequest(params) {
    let _url = url.backendHost + endPoint.salesApproval.rejectApprovalRequest;
    return requestInstance.put(_url, params);
}

export function assignApprovalRequest(params) {
    let _url = url.backendHost + endPoint.salesApproval.assignApprovalRequest;
    return requestInstance.post(_url, params);
}

export function updateTypeStatus(params) {
    let type = params.type;
    let _url;
    switch (type) {
        case 'Quotation Actual':
        case 'Quotation Demo':
            _url = url.backendHost + endPoint.quotation.updateQuotationApprovalStatus;
            break;
        case 'PO':
            _url = url.backendHost + endPoint.purchaseOrder.updatePurchaseOrderApprovalStatus;
            break;
        default:
            throw new Error('Invalid type');
    }
    return requestInstance.put(_url, params);
  }
  
