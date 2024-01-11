const sourceControls = require('../controllers/sourceControls');
const customExceptions = require('../responseModels/customExceptions')
const leadControls= require('../controllers/leadControls');

const createSource = async (params) => {
    return sourceControls.createSource(params)
    .then(data => {
        return { message: 'Source created successfully', data }
    })
    .catch(error => {
        throw { errorMessage: error }
    })
}

const addSubSource = async (params) => {
    return sourceControls.addSubSource(params)
    .then(data => {
        return { message: 'Sub Source added successfully', data }
    })
    .catch(error => {
        throw { errorMessage: error }
    })

}

const updateSource = async (params) => {
    return sourceControls.updateSource(params)
    .then(data => {
        return { message: `Source updated successfully`, data }
    })
    .catch(error => {
        throw { errorMessage: error }
    })
}

const removeSubSource = async (params) => {
    return sourceControls.removeSubSource(params)
    .then(data => {
        return { message: 'Sub Source removed successfully', data }
    })
    .catch(error => {
        throw { errorMessage: error }
    })

}

const getSourceList = async (params) => {
    let SourceList = sourceControls.getSourceList(params);
    return Promise.all([SourceList])
        .then(response => {
            let [result, totalCount] = response
            return { message: 'Source List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAllSources = async (params) => {
    return sourceControls.getAllSources(params)
        .then(result => {
            return { message: 'Source List', result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const deleteSource = async (params) => {
    return sourceControls.deleteSource(params)
        .then(result => {
            return { message: `Source deleted successfully!`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const changeStatus = async ( _id, status ) => {
    return sourceControls.changeStatus( _id, status )
        .then(result => {
            return { message: `Status changed`, result }          
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const getAllSubSource = async (id) => {
    return sourceControls.getAllSubSource(id)
        .then(result => {
            return { message: `Sub Source List`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const changeSubSourceStatus = async ( params ) => {
    return sourceControls.changeSubSourceStatus( params )
        .then(result => {
            return { message: `Status changed`, result }          
        })
        .catch(error => {
            throw { errorMessage: error }
        })

}




const getSourceDetails = async (id, subSourceName) => {
    return sourceControls.getSourceDetails(id, subSourceName)
        .then(result => {
            return { message: `Source details`, result }
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const isDuplicateSource = async (leadSourceName) => {
    return sourceControls.isDuplicateSource(leadSourceName)
        .then(result => {
            if(result){
                throw customExceptions.sourceExists() //to do
            }
            return { message: 'Success', result }
            
        })
        .catch(error => {
            throw { errorMessage: error }
        })
}

const allSourcesWithLeadCount= async () => {
    
    const allSourceArray = await sourceControls.allSources();
    // console.log(allSourceArray,"Sources Array....")
    const finalArray= allSourceArray.map(async(item,index) => {
        let query= {sourceId:item._id}
        const findNumber= await leadControls.getAllLeads(query);
        item.numberOfLeads=findNumber;
        // console.log(findNumber,`&`,id,`number of leads attched to the Source ${query.sourceId}`);
        // return findNumber;
        return item;
        // return Promise.resolve(findNumber)
        //      .then((result) => {
        //         return {result}
        //      })
        //      .catch((error) => {
        //         throw {errorMessage:error}
        //      })
    })

    return Promise.all(finalArray).then((result) =>{
       
        // console.log("result of Number of Leads",result)
        return { message:"Number of leads", result}

    }).catch((error) =>{
        throw {errorMessage: error}
    })

    
}

module.exports = {
    createSource,
    updateSource,
    getAllSources,
    getSourceList,
    deleteSource,
    changeStatus,
    getSourceDetails,
    isDuplicateSource,
    addSubSource,
    removeSubSource,
    changeSubSourceStatus,
    getAllSubSource,
    allSourcesWithLeadCount
}

// return await Leads.countDocuments(query)
// .then((result) =>{
//    return {  message:"Number of leads", result}
// })
// .catch((error) => {
//    throw { errorMessage: error}
// })