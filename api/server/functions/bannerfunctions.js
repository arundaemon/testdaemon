const bannerControls = require('../controllers/bannerControls');
const customExceptions = require('../responseModels/customExceptions')
const { uploadImage } = require('../middlewares/fileUploader')
const { BANNER_STATUS } = require('../constants/dbConstants');

const saveBanner = async (params) => {
    let { webBannerImage, appBannerImage, appBannerDetails, webBannerDetails, webBannerPdfFile, appBannerPdfFile, status } = params
    let webBannerUploadFolder = "crm-banners/webBanners/"
    let appBannerUploadFolder = "crm-banners/appBanners/"
    let priorityCount = await bannerControls.checkPriorityExists(params)

    try {
        if (parseInt(status) !== BANNER_STATUS.DEACTIVE) {

            let activeBannersCount = await bannerControls.getActiveBannersCountByDate(params);
            //console.log(activeBannersCount, "activebaanerscount....")
            //console.log(priorityCount,"priorityCount.....")

            if (activeBannersCount >= 4) {
                throw { errorMessage: "Max 4 banners can be active at a time, either add it in inactive state or deactivate other banner" }
            }
            if (priorityCount >= 1) {
                throw { errorMessage: "This priority is already occupied by some banner." }
            }
        }

        if (priorityCount >= 1) {
            throw { errorMessage: "This priority is already occupied by some banner." }
        }


        const webBannerImageUrl = await uploadImage(webBannerImage, webBannerUploadFolder)
        const appBannerImageUrl = await uploadImage(appBannerImage, appBannerUploadFolder)
        let webBannerPdfFileUrl = null
        let appBannerPdfFileUrl = null

        if (webBannerPdfFile)
            webBannerPdfFileUrl = await uploadImage(webBannerPdfFile, webBannerUploadFolder)

        if (appBannerPdfFile)
            appBannerPdfFileUrl = await uploadImage(appBannerPdfFile, webBannerUploadFolder)


        params.webBanner = { ...webBannerDetails, bannerUrl: webBannerImageUrl }
        params.appBanner = { ...appBannerDetails, bannerUrl: appBannerImageUrl }

        if (webBannerPdfFileUrl) {
            params.webBanner.redirectUrl = webBannerPdfFileUrl
        }

        if (appBannerPdfFileUrl) {
            params.appBanner.redirectUrl = appBannerPdfFileUrl
        }

        return bannerControls.saveBanner(params)
            .then(result => {
                return { message: 'Banner data saved successfully', result }
            })
    }
    catch (error) {
        throw error
    }
}


const uploadImageToGCP = async (params) => {
    let { image } = params
    let iconsFolderPath = "crm-icons/"

    return uploadImage(image, iconsFolderPath)
        .then(result => {
            return { message: 'Image Uploaded Successfully', result }
        })
}

const updateBanner = async (params) => {
    let { webBannerImage, appBannerImage, appBannerDetails, webBannerDetails, webBannerPdfFile, appBannerPdfFile, status } = params
    let webBannerUploadFolder = "crm-banners/webBanners/"
    let appBannerUploadFolder = "crm-banners/appBanners/"
    let priorityCount = await bannerControls.checkPriorityExists(params)


    try {

        if (parseInt(status) !== BANNER_STATUS.DEACTIVE) {
            // let countActiveBanners = await bannerControls.countByKey({ status: BANNER_STATUS.ACTIVE, isDeleted:false })
            let activeBannersCount = await bannerControls.getActiveBannersCountByDate(params);

            if (activeBannersCount >= 4) {
                throw { errorMessage: "Max 4 banners can be active at a time, either update it in inactive state or deactivate other banner" }
            }
            if (priorityCount >= 1) {
                throw { errorMessage: "This priority is already occupied by some banner." }
            }
        }
        if (priorityCount >= 1) {
            throw { errorMessage: "This priority is already occupied by some banner." }
        }


        let webBannerImageUrl = null
        let appBannerImageUrl = null
        let webBannerPdfFileUrl = null
        let appBannerPdfFileUrl = null

        if (webBannerImage)
            webBannerImageUrl = await uploadImage(webBannerImage, webBannerUploadFolder)

        if (appBannerImage)
            appBannerImageUrl = await uploadImage(appBannerImage, appBannerUploadFolder)

        if (webBannerPdfFile)
            webBannerPdfFileUrl = await uploadImage(webBannerPdfFile, webBannerUploadFolder)

        if (appBannerPdfFile)
            appBannerPdfFileUrl = await uploadImage(appBannerPdfFile, webBannerUploadFolder)


        params.webBanner = { ...webBannerDetails, bannerUrl: webBannerImageUrl }
        params.appBanner = { ...appBannerDetails, bannerUrl: appBannerImageUrl }

        if (webBannerPdfFileUrl) {
            params.webBanner.redirectUrl = webBannerPdfFileUrl
        }

        if (appBannerPdfFileUrl) {
            params.appBanner.redirectUrl = appBannerPdfFileUrl
        }

        return bannerControls.updateBanner(params)
            .then(result => {
                return { message: 'Banner data updated successfully', result }
            })
    }
    catch (error) {
        throw error
    }
}


const deleteBanner = async (params) => {
    return bannerControls.deleteBanner(params)
        .then(result => {
            return { message: `Banner Deleted Successfully!`, result }
        })
}


const getBannersList = async (params) => {
    let BannerList = bannerControls.getBannersList(params)

    return Promise.all([BannerList])
        .then(response => {
            let [result] = response
            return { message: 'Banner List', result }
        })
}


const getBannerDetails = async (params) => {
    return bannerControls.getBannerDetails(params)
        .then((result) => {
            return { message: "Banner Details !", result }
        })
}


const updateBannerStatus = async (params) => {
    let { bannerStatus } = params;

    try {
        if (parseInt(bannerStatus) !== BANNER_STATUS.DEACTIVE) {
            let activeBannersCount = await bannerControls.countByKey({ status: BANNER_STATUS.ACTIVE, isDeleted: false })

            if (activeBannersCount >= 4) {
                throw { errorMessage: "Max 4 banners can be active at a time, either update it in inactive state or deactivate other banner" }
            }
        }

        return bannerControls.updateBannerStatus(params)
            .then((result) => {
                return { message: "Status Changed", result }
            })
    }
    catch (error) {
        throw error;
    }

}

const getAllActiveBanners = async (params) => {

    return bannerControls.getAllActiveBanners(params)
        .then((result) => {
            return { message: "List of All Active Banners", result }
        })
        .catch((error) => {
            throw { errorMessage: error }

        })
}

const getActiveBannersCountByDate = async (params) => {

    return bannerControls.getActiveBannersCountByDate(params)
        .then((result) => {
            return { message: "Count of All Banners within start and end date", result }
        })
        .catch((error) => {
            throw { errorMessage: error }
        })
}

module.exports = {
    saveBanner,
    deleteBanner,
    getBannersList,
    updateBanner,
    getBannerDetails,
    updateBannerStatus,
    getAllActiveBanners,
    getActiveBannersCountByDate,
    uploadImageToGCP,
}