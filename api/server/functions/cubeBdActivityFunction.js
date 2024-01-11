const cubeBdActivitiesController = require('../controllers/cubeBdActivityControls')

const createCubeBdActivity = async (params) => {
  return cubeBdActivitiesController.createCubeBDActivity(params)
  .then(result => {
    return { message: `BD Activity Created successfully!`, result }
    })
    .catch(err => {
        throw err
   })

} 

const getCubeBdActivity = async (params) => {
  return cubeBdActivitiesController.findByKey({key: params.key}) 
}

module.exports={
  createCubeBdActivity,
  getCubeBdActivity
}