import { useLocation } from "react-router-dom";
import QuotationDetailPage from "./QuotationDetailPage";

const ApprovalQuotation = () => {

  let location = useLocation();

  let {
    softwareList,
    hardwareList,
    schoolInfo,
    isQuoteType,
    serviceList,
    interestData,
    quotationMasterConfigId,
    quotationMaster,
    quoteInterest,
  } = location?.state ? location?.state : {};

  console.log(location, 'testlocation')

  return (
    <>
      {/* <QuotationDetailPage
        softwareList={softwareList?.flat()}
        hardwareList={hardwareList}
        serviceList={serviceList}
        schoolInfo={schoolInfo}
        interestData={interestData}
        quotationMasterConfigId={quotationMasterConfigId}
        quotationMaster={quotationMaster}
        isQuoteType={isQuoteType}
        quoteInterest={quoteInterest}
      /> */}
    </>
  );
};

export default ApprovalQuotation;
