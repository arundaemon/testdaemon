import { toast } from "react-hot-toast"
import moment from "moment";

export const claimValidation = (data) => {
  const fileExtArr = ['application/pdf','image/png','image/jpeg','image/gif']
  let {expenseType, field, params} = data 

  let {
    schoolCode,
    schoolName,
    visitNumber,
    visitPurpose,
    startDate,
    timeIn,
    timeOut,
    billFile
  } = params

  let isValidate

  if (!schoolCode?.trim()) {
    toast.error('Please Select School Code')
    return isValidate = false
  }

  if(billFile && billFile.type && fileExtArr.indexOf(billFile.type) < 0){
    toast.error('Only png, jpeg, gif or pdf files are allowed')
    return isValidate = false
  }

  if (!schoolName?.trim()) {
    toast.error('Please Select School Name By Valid School Code')
    return isValidate = false
  }

  /* if (!visitNumber?.value) {
    toast.error('Please Select Visit Number')
    return isValidate = false
  } */

  if (!visitPurpose?.trim()) {
    toast.error('Please Add Visit Purpose')
    return isValidate = false
  }

  if (!startDate) {
    toast.error('Please Add Visit Date')
    return isValidate = false
  }
  if (!timeIn) {
    toast.error('Please Select TIME IN')
    return isValidate = false
  }
  /* if (!timeOut) {
    toast.error('Please Select TIME OUT')
    return isValidate = false
  } */

  if (!(moment.utc(timeIn).local().format('X') < moment.utc(timeOut).local().format('X'))){
    toast.error("Time Out Must Be Greater")
    return false
  }

  if (expenseType, field) {
    if (expenseType === 'Boarding and Lodging') {
      if (!field?.visitTimeIn) {
        toast.error('Please Select CheckIn Time')
        return isValidate = false
      }
      if (!field?.visitTimeOut) {
        toast.error('Please Select CheckOut Time')
        return isValidate = false
      }
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }
      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Conveyance') {
      //console.log(field, "test")
      if (!field?.field?.value) {
        toast.error('Please Select Mode of Transport')
        return isValidate = false
      }
      
      if (!(field?.field?.value === "Flight" || field?.field?.value === "Metro")) {
        if (!field?.unit) {
          toast.error('Please Add Count')
          return isValidate = false
        }
      }
     
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        if (!(field?.field?.value === "Own Transport" || field?.field?.value === "Rickshaw" || field?.field?.value === "Metro")) {
          toast.error('Please Select File')
          return isValidate = false
        }
        else {
          isValidate = true
          return isValidate
        }
      }
      else {
        isValidate = true
        return isValidate
      }

    }else if (expenseType === 'Food') {

      if (!field?.unit) {
        toast.error('Please Select Count of Meal')
        return isValidate = false
      }
     
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Gifts') {

      if (!field?.field?.value) {
        toast.error('Please Select Gift To')
        return isValidate = false
      }
      

      if (!field?.unit) {
        toast.error('Please Add Count')
        return isValidate = false
      }
     
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Stamp Paper') {
      if (!field?.unit) {
        toast.error('Please Add Count')
        return isValidate = false
      }
     
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Others') {
      
      if (!field?.remark) {
        toast.error('Please Add Remark')
        return isValidate = false
      }

      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Events') {
      
      if (!field?.field?.value) {
        toast.error('Please Add Item')
        return isValidate = false
      }

      if (!field?.unit) {
        toast.error('Please Add Quantity')
        return isValidate = false
      }
   
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else if (expenseType === 'Printing') {

      if (!field?.field?.value) {
        toast.error('Please Select Printing')
        return isValidate = false
      }

      if (!field?.unit) {
        toast.error('Please Add Count')
        return isValidate = false
      }
     
      if (!field?.claimAmount) {
        toast.error('Please Add Amount')
        return isValidate = false
      }

      if (Number(field?.claimAmount) === 0) {
        toast.error('Claim Amount Must Be Greater than 0')
        return isValidate = false
      }

      if (!field?.billFile) {
        toast.error('Please Select File')
        return isValidate = false
      }

      else {
        isValidate = true
        return isValidate
      }
    }else{
      toast.error('Invalid Expense Type')
      isValidate = false
      return isValidate
    }
  }
  else {
    toast.error('Please Add Field')
    isValidate = false
    return isValidate
  }
}