import React from 'react';
import ProfileComponent from './ProfileComponent';
import RoleComponent from './RoleComponent';

function ConditionalRendering(props) {

    if (props.value == 'ROLE') {
        return (
            <div>
                <RoleComponent matrixType={props}/>
            </div>
        )
    } 
    else if (props.value == 'PROFILE') {
        return (
            <div>
                <ProfileComponent matrixType={props}/>
            </div>
        )
    } else {
        return null
    }
   
  
}
export default ConditionalRendering


