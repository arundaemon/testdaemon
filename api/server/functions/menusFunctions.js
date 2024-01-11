
const menusControls = require('../controllers/menusControls')
const customExceptions = require('../responseModels/customExceptions')


const createMenu = async (params) => {
    return menusControls.findOneByKey({ name: params.name, projectId: params.projectId, isDeleted: false })
        .then(menuExist => {
            if (menuExist)
                throw "Project Cannot Have Duplicate Menus."

            return menusControls.createMenu(params)
        })
        .then(result => {
            return { message: `Menu created successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const saveRoleMenuMapping = async (params) => {
    return menusControls.saveRoleMenuMapping(params)
        .then(result => {
            return { message: `Menu Updated Successfully!`, result }
        })
}

const updateMenu = async (params) => {
    return menusControls.findOneByKey({ name: params.name, projectId: params.projectId, _id: { $ne: params?.menuId }, isDeleted: false })
        .then(menuExist => {
            if (menuExist)
                throw "Project Cannot Have Duplicate Menus."

            return menusControls.updateMenu(params)
        })
        .then(result => {
            return { message: `Role Updated Successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteMenu = async (params) => {
    return menusControls.deleteMenu(params)
        .then(result => {
            return { message: `Menu Deleted Successfully!`, result }
        })
}

const getMenusList = async (params) => {
    let MenusList = menusControls.getMenusList(params)
    let MenusListCount = menusControls.getMenusListCount(params)

    return Promise.all([MenusList, MenusListCount])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Menu List', result, totalCount }
        })
}

const getAllMenus = async (params) => {
    return menusControls.getAllMenus(params)
        .then(result => {
            return { message: 'Menu List', result }
        })
}

const getAllGroupedMenu = async (params) => {
    return menusControls.getAllGroupedMenu(params)
        .then(result => {
            return { message: 'Menu List', result }
        })
}


const getAllSideBarMenus = (params) => {
    return menusControls.getAllSideBarMenus(params)
}


module.exports = {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenusList,
    getAllMenus,
    saveRoleMenuMapping,
    getAllGroupedMenu,
    getAllSideBarMenus,
}