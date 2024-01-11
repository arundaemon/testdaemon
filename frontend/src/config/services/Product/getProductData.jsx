import { getUserData } from "../../../helper/randomFunction/localStorage";

var  userRole = getUserData("userData")?.crm_role;

export const getProductInterest = async (params) => {
  let leadInterestId
  let leadInterest
  let {interestOption, userDetail} = params

  let optionArray = interestOption?.map((obj) => obj);


  let interest = userDetail?.interest
    ?.filter((obj) => !(obj?.assignedTo_role_name === userRole))
    ?.map((obj) => obj?.learningProfile);


  let interestedId = userDetail?.interest?.map((obj) => {
    return {
      profileName: obj?.learningProfile,
      leadId: obj?.leadId,
      leadStage: obj?.stageName,
      leadStatus: obj?.statusName,
      schoolId: obj?.schoolId,
      schoolLeadId: userDetail?.leadId,
      productCode: obj?.learningProfileCode,
      learningProfileGroupCode: obj?.learningProfileGroupCode,
      learningProfileRefId: obj?.learningProfileRefId,
    };
  });


  interest = optionArray
    ?.map((obj) => {
      if (!interest?.includes(obj?.label)) {
        return {
          profileName: obj?.label,
          leadId: "",
          leadStage: "",
          leadStatus: "",
          schoolId: "",
          schoolLeadId: "",
          productCode: obj?.productCode,
          learningProfileGroupCode: obj?.groupkey,
          learningProfileRefId: obj?.productID,
        };
      }
    })
    .filter((obj) => obj);

    try {
      leadInterestId = await Promise.all(interestedId)
      leadInterest = await Promise.all(interest)
    }catch(err) {
      console.error('An error occurred during Promise.all:', err);
    }

    return  {
      interestedId: leadInterestId,
      interest: leadInterest
    }
};

export const getLeadInterestId = async (data) => {
  const uniqueValues = new Set();
  const filteredArray = data?.filter((item) => {
    if (!uniqueValues.has(item.profileName)) {
      uniqueValues.add(item.profileName);
      return true;
    }
    return false;
  });

  return {
    filteredArray: filteredArray
  }
};
