import { useState,useEffect } from "react";
import { TableContainer,Table,TableHead,TableBody,TableRow,TableCell,Button,classes,className } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { EncryptData } from "../../utils/encryptDecrypt";
const MyTeamList=({list})=>{
    const navigate = useNavigate();
    //  console.log(list,'.............list')
    const panLogin=async (data)=>{


        let userData = JSON.parse(localStorage.getItem('userData'));
        
        userData.crm_profile=data.profileName;
        userData.crm_role=data.roleName;
        localStorage.setItem('userData',JSON.stringify(userData));
        let allChildRoles=await fetchAllChildRoles(userData);
        
        navigate('/');
        console.log(userData);


    }


    const fetchAllChildRoles =  (userData) => {
        let role_name = !(userData?.crm_role?.includes(',')) ? userData?.crm_role?.trim() : userData?.crm_role?.split(',')?.[0]?.trim()
        return  getAllChildRoles({ role_name }).then(
          res => {
            let { all_child_roles } = res?.data?.response?.data ?? { childs: [] }
            localStorage.setItem('childRoles', EncryptData(all_child_roles ?? []))
            return userData
          }
        )
      }

    return(

        <>

        <TableContainer className='table-container'>

            {list && list.length > 0  && (
            <Table aria-label="customized table" className="custom-table datasets-table">
            <TableHead >
                <TableRow className='cm_table_head'>
                    <TableCell >S.No</TableCell>
                    <TableCell ><div className='tableHeadCell'>E-Code</div></TableCell>
                    <TableCell ><div className='tableHeadCell'>Name</div></TableCell>
                   
                    <TableCell ><div className='tableHeadCell'>Designation</div></TableCell>
                    <TableCell ><div className='tableHeadCell'>Profile</div> </TableCell>
                    <TableCell >Role</TableCell>
                    <TableCell >Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>

                {list.map((data,i)=>(
                    <TableRow key={i}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{data.userName}</TableCell>
                    <TableCell>{data.displayName}</TableCell>
                    <TableCell>{data.displayName}</TableCell>
                    <TableCell>{data.profileName}</TableCell>
                    <TableCell>{data.roleName}</TableCell>
                    
                    <TableCell className="edit-cell action-cell">
                        
                    <Button
                    
                    onClick={() => 
                      panLogin(data)
                      
                    }
                  >
                    Login
                  </Button>
                    </TableCell>
                </TableRow>


                ))}

            </TableBody>
            </Table>
           ) }
        </TableContainer>
        </>
    )



}

export default MyTeamList;