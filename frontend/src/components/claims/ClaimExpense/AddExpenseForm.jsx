import { Box, Grid, TextField, Typography } from "@mui/material"
import ReactSelect from "react-select"
import {useStyles} from '../../../css/ClaimForm-css'
import { useCallback, useEffect, useState } from "react"
import { BoardingForm } from "./BoardingForm"
import { ConveyanceDetail } from "./ConveyanceForm"
import { FoodDetailForm } from "./FoodDetailForm"
import { GiftDetailForm } from "./GiftDetailForm"
import { StampDetailForm } from "./StampDetailForm"
import { OtherDetailForm } from "./OtherDetailForm"
import { CommonDetailForm } from "./CommonForm"
import { EventDetailForm } from "./EventDetailForm"
import { PrintingDetailForm } from "./PrintingDetail"
import FormSelect from "../../../theme/form/theme2/FormSelect"
import {ReactComponent as IconExpenseRemove} from './../../../assets/icons/icon-expense-remove.svg';

export const AddExpenseForm = ({list,expenseIndex,expenseData,updateExpenseData,removeExpense}) => {

  const classes = useStyles()
  const [expense, setExpense] = useState(null)

  const updateData = useCallback((data) => {
    updateExpenseData(data,expenseIndex)
  })

  const expenseOptions = [
    {label: 'Boarding and Lodging', value: 'Boarding and Lodging'}, 
    {label: 'Conveyance', value: 'Conveyance'},
    {label: 'Food', value: 'Food'},
    {label: 'Gifts', value: 'Gifts'},
    {label: 'Stamp Paper', value: 'Stamp Paper'},
    {label: 'Others (Specify)', value: 'Others'},
    {label: 'Events', value: 'Events'},
    {label: 'Printing', value: 'Printing'}
  ]

  const renderView = () => {
    if (expense?.value === 'Boarding and Lodging') {
      return <BoardingForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Conveyance') {
      return <ConveyanceDetail list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Food') {
      return <FoodDetailForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Gifts') {
      return <GiftDetailForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Stamp Paper') {
      return <StampDetailForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Others') {
      return <OtherDetailForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Events') {
      return <EventDetailForm list={list} data={expenseData} updateData={updateData}/>
    }
    else if (expense?.value === 'Printing') {
      return <PrintingDetailForm data={expenseData} updateData={updateData}/>
    }
  }

  useEffect(() => {
    if(expense?.value) {
      expenseData.expenseType = expense?.value
      updateExpenseData({...expenseData},expenseIndex)
    }
  }, [expense])

  return (
    <>
      <Box className='crm-sd-claims-expenses-heading'>
        <Box>
          {
            (expenseIndex === 0)  ? <Typography component="h2" className='crm-sd-claims-expenses-label'>Expenses</Typography> : null
          }
        </Box>
        {
          (expenseIndex > 0) && <Box className="crm-sd-claims-expenses-heading-action" onClick={() => removeExpense(expenseIndex)}><IconExpenseRemove /></Box>
        }        
      </Box>
      <Box className="crm-sd-claims-expenses-form-container">
        <Grid container spacing={2} className={`crm-sd-claims-expenses-form ` + ((expenseIndex === 0) ? `expenses-item-first` : ``)}>
          <Grid item className='crm-sd-claims-expenses-form-item' xs={12} md={4}>
            <Typography component="h4" className='crm-sd-claims-expenses-form-label'>Type of Expense</Typography>
              <FormSelect
                theme="dark"
                fontTheme="lg"
                placeholder='Select Expense'
                value={expense}
                optionLabels={{label: 'label', value: 'value'}}
                options={expenseOptions}
                returnType="object"
                handleSelectedValue={(e) => {
                  setExpense({
                    label: e.label,
                    value: e.value
                  })
                }}
            />
          </Grid>
          {
            renderView()
          }

        </Grid>
      </Box>
    </>
  )
}