 const checkValidPhone = (value) => {
    //let regex = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$');
    //let regex = new RegExp('(0|91)?[6-9][0-9]{9}')
    let regex = new RegExp('^[6-9][0-9]{9}$')
    
    if (value) {
        if (!regex.test(value)) {
            return false;
        } else {
            return true
        }
    }

}

const checkValidEmail = (value) => {
    let regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$');

    if (value) {
        if (!regex.test(value)) {
            return false;
        } else {
            return true
        }
    }

}

const checkValidName = (value) => {
    let regex = new RegExp('^[a-zA-Z ]*$')

    if(value) {
        if(!regex.test(value)) {
            return false;
        } else {
            return true;
        }
    }
}

module.exports = {
    checkValidEmail,
    checkValidPhone,
    checkValidName
}