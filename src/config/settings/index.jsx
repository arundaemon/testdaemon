import merge from 'lodash/merge';
import local from './local';
import test from './test';
import prod from './prod';
import dev from './dev';

const settings = {
  LOCAL_ENCRYPTION_SECRET: 'Bdeh3#44%dw',
  ADMIN_ROLES:['Superadmin_CRM1', 'Superadmin_CRM2', 'Superadmin_CRM3', 'CBO','Test_Admin_6','Test_Admin_5','Test_Admin_4','Test_Admin_3','Retail Admin_Noida HO_8','Retail Admin_Noida HO_7','Retail Admin_Noida HO_6','Retail Admin_Noida HO_5','Retail Admin_Noida HO_4','Retail Admin_Noida HO_3','Retail Admin_Noida HO_2','Retail Admin_Noida HO_1','Test_Admin_2','Test_Admin_1']
}

export default (() => {
  switch (process.env.REACT_APP_ENV) {
    case 'dev':
      return merge(dev, settings)
    case 'test':
      return merge(test, settings)
    case 'prod':
      return merge(prod, settings)
    default:
      return merge(local, settings)
  }
})()

// export default (() => {
//   return merge(local, settings)
// })()