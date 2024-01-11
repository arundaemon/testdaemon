const { PO_ADVANCE_DETAILS_MODE } = require('../constants/dbConstants');
const customExceptions = require('../responseModels/customExceptions');
const Utils = require('../utils/utils');

let { PAYMENT_MODE, PAYMENT_DATE, PAYMENT_PROOF_URL, RECIEVER_BANK_NAME, RECIEVER_BANK_ACCOUNT_NUMBER, ISSUE_BANK_NAME, ISUUE_BANK_ACCOUNT_NUMBER, ADVANCE_DETAILS_REF_NO, BANK_AMOUNT } = PO_ADVANCE_DETAILS_MODE

const createPurchaseOrderValidator = async (req, res, next) => {
    let errors = [];
    let { schoolCode, poAmount, schoolName, agreementStartDate, agreementEndDate, agreementTenure, agreementPayableMonth, overallContractValue, paymentTerm, isAdvance, totalAdvanceAmount, advanceDetailsMode, adminName, adminContactNumber, adminEmailId, totalAdvanceSoftwareAmount, totalAdvanceHardwareAmount } = req.body;
    let customErrorMessage = ""

    if (!schoolCode) {
        let errorMessage = customErrorMessage = 'School Code is required';
        errors.push({ errorMessage });
    }

    if (!schoolName) {
        let errorMessage = customErrorMessage = 'School Name is required';
        errors.push({ errorMessage });
    }

    if (!poAmount) {
        let errorMessage = customErrorMessage = 'Purchase Order Amount is required';
        errors.push({ errorMessage });
    }

    if (poAmount < 0) {
        let errorMessage = customErrorMessage = 'Purchase Order Amount is not valid';
        errors.push({ errorMessage });
    }

    if (!agreementStartDate) {
        let errorMessage = customErrorMessage = 'Agreement Start Date is required';
        errors.push({ errorMessage });
    }

    if (!agreementEndDate) {
        let errorMessage = customErrorMessage = 'Agreement End Date is required';
        errors.push({ errorMessage });
    }

    if (!agreementTenure) {
        let errorMessage = customErrorMessage = 'Agreement Tenure is required';
        errors.push({ errorMessage });
    }

    if (!agreementPayableMonth) {
        let errorMessage = customErrorMessage = 'Agreement Payable Month is required';
        errors.push({ errorMessage });
    }

    if (agreementPayableMonth < 0) {
        let errorMessage = customErrorMessage = 'Agreement Payable Month is not valid';
        errors.push({ errorMessage });
    }

    if (!overallContractValue) {
        let errorMessage = customErrorMessage = 'Total Contract Value is required';
        errors.push({ errorMessage });
    }

    if (!paymentTerm) {
        let errorMessage = customErrorMessage = 'Payment Terms is required';
        errors.push({ errorMessage });
    }

    if (isAdvance === true) {
        if (!totalAdvanceAmount) {
            let errorMessage = customErrorMessage = 'Total Advance Amount is required';
            errors.push({ errorMessage });
        }

        if (totalAdvanceAmount < 0) {
            let errorMessage = customErrorMessage = 'Total Advance Amount is not valid';
            errors.push({ errorMessage });
        }

        if (totalAdvanceAmount != (parseFloat(totalAdvanceHardwareAmount) + parseFloat(totalAdvanceSoftwareAmount))) {
            let errorMessage = customErrorMessage = 'Sum of Advance Amount Software & Hardware must be equal to Total Advance Amount is required';
            errors.push({ errorMessage });
        }

        if (!advanceDetailsMode || advanceDetailsMode?.length == 0) {
            let errorMessage = customErrorMessage = 'Advance Details Mode is required';
            errors.push({ errorMessage });
        }

        let totalBankAmount = 0
        for (let i = 0; i < advanceDetailsMode?.length; i++) {
            let detailModeItem = advanceDetailsMode?.[i]
            let paymentMode = detailModeItem[PAYMENT_MODE]

            if (!detailModeItem[ADVANCE_DETAILS_REF_NO]) {
                let errorMessage = customErrorMessage = `Advance Details Ref No. is required for ${paymentMode}`;
                errors.push({ errorMessage });
            }

            if (!detailModeItem[PAYMENT_DATE]) {
                let errorMessage = customErrorMessage = `Payment Date is required for ${paymentMode}`;
                errors.push({ errorMessage });
            }

            if (!detailModeItem[PAYMENT_PROOF_URL]) {
                let errorMessage = customErrorMessage = `Payment is required for ${paymentMode}`;
                errors.push({ errorMessage });
            }

            if (!detailModeItem[RECIEVER_BANK_NAME] || !detailModeItem[RECIEVER_BANK_ACCOUNT_NUMBER]) {
                let errorMessage = customErrorMessage = `Receiver Bank Details is required for ${paymentMode}`;
                errors.push({ errorMessage });
            }

            if (!detailModeItem[BANK_AMOUNT]) {
                let errorMessage = customErrorMessage = `Amount is required for ${paymentMode}`;
                errors.push({ errorMessage });
            }

            if (detailModeItem[BANK_AMOUNT] < 0) {
                let errorMessage = customErrorMessage = `Amount is not valid ${paymentMode}`;
                errors.push({ errorMessage });
            }
            totalBankAmount += parseFloat(detailModeItem[BANK_AMOUNT])
        }

        if (totalAdvanceAmount != totalBankAmount) {
            let errorMessage = customErrorMessage = `Sum of all Amounts must be equal to Total Advance Amount`;
            errors.push({ errorMessage });
        }
    }

    if (!adminName) {
        let errorMessage = customErrorMessage = 'Name is required';
        errors.push({ errorMessage });
    }

    if (!adminContactNumber) {
        let errorMessage = customErrorMessage = 'Contact Number is required';
        errors.push({ errorMessage });
    }

    if (!adminEmailId) {
        let errorMessage = customErrorMessage = 'Email Id is required';
        errors.push({ errorMessage });
    }

    if (errors && errors.length) {
        throw next(customExceptions.completeCustomException(0, (customErrorMessage ?? 'Validation Error'), errors))
    }

    next();
}


module.exports = {
    createPurchaseOrderValidator,
}