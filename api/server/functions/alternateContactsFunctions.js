const alternateContactsControls = require('../controllers/alternateContactsControl');

const getAlternateContactList = async (params) => {
    let ContactList = alternateContactsControls.getAlternateContactList(params);
    //let TotalContactCount = alternateContactsControls.getListCount(params);
    return Promise.all([ContactList])
        .then(response => {
            let [result] = response
            return { message: 'Alternate Contact List', result }
        })
}

module.exports = {
    getAlternateContactList
}