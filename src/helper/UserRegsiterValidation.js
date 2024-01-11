export const UserRegisterValidate = (params) => {
  let {name, selectedInterest, phone ,userType, email, board, boardClass, employeeCode, city, getState} = params;
  let message;

  if (name.trim() === "") {
    return message = "Please Enter The Name"
  }

  else if (selectedInterest?.value === null) {
    return message = "Please Select Interest"
  } 

  
  else if (board?.value === null) {
    return message = "Please Select Board"
  }

  else if (boardClass?.value === null) {
    return message = "Please Select Class"
  }

  else if (phone.trim() === "" || !(phone?.length == 10)) {
    if ((phone?.length > 0 && phone?.length < 10) || phone?.length > 10) {
      return "Phone Number Must be 10 digit"
    }
    else {
      return message = "Please Enter The Number"
    }
  }

  else if (getState?.value === null) {
    return  message = "Please Select State"
  }

  else if (city?.value === null) {
    return  message = "Please Select City"
  }
  
  else if (employeeCode.trim() === "") {
    return  message = "Please Provide Referred Details"
  }
  else {
    return message = false
  }
}