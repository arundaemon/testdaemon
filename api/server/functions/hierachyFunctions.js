const axios = require('axios');
const md5 = require('md5');
const getHierachyDetails = async (params) => {
    try {

        const checkSumForHierachyFetch = md5(`role_hierarchy:${envConfig.HRMS_API_KEY}:${params?.roleName}:${envConfig.HRMS_SALT_KEY}`);
       
        let data_for_hierachy = {
          "action": "role_hierarchy",
          "checksum": `${checkSumForHierachyFetch}`,
          "role_name": `${params?.roleName}`
        } 
        const { data } = await axios.post(envConfig.HRMS_URL+'/user/rolehierarchy',data_for_hierachy);
        let hierarchyInfo = data?.response?.data;
        let result = data?.response?.data?.parents;
    
        return { message: 'Hierachy Details fetched Successfully', result, hierarchyInfo }
        
    } catch (error) {
        console.log(error)
        throw { errorMessage: "Something went"}
    }

}

const getChildRoles = async (params) => {
    try {
       
        const data_for_hierachy = {
            "action": "all_child_roles",
            "role_name": `${params?.role_name}`,
            "checksum": md5("all_child_roles:" + envConfig.HRMS_API_KEY + ":" + `${params?.role_name}` + ":" + envConfig.HRMS_SALT_KEY)
        }
        const {data} = await axios.post(envConfig.HRMS_URL + '/user/all-child-roles',data_for_hierachy);
        //console.log('ROle',data_for_hierachy)
        const roleList = data?.response?.data.all_child_roles;
      
        return { message: 'Child Roles fetched Successfully', roleList }
        
    } catch (error) {
        console.log(error)
        throw { errorMessage: "Something went wrong in hierarchy details"}
    }

}

const getChildRolesAPI = async (params) => {
    try {
       
        const data_for_hierachy = {
            "action": "all_child_roles",
            "role_name": `${params?.role_name}`,
            "checksum": md5("all_child_roles:" + envConfig.HRMS_API_KEY + ":" + `${params?.role_name}` + ":" + envConfig.HRMS_SALT_KEY)
        }
        const {data} = await axios.post(envConfig.HRMS_URL + '/user/all-child-roles',data_for_hierachy);
        //console.log('ROle',data_for_hierachy)
        //const roleList = data;
      
        return { message: 'Child Roles fetched Successfully', data }
        
    } catch (error) {
        console.log(error)
        throw { errorMessage: "Something went wrong in hierarchy details"}
    }

}

module.exports = {
    getHierachyDetails,
    getChildRoles,
    getChildRolesAPI
}