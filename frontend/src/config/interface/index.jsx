import merge from 'lodash/merge';
import test from './test';
import prod from './prod';
import local from './local';
import dev from './dev';

const CubeDataset = {

}

export default (() => {
  switch (process.env.REACT_APP_ENV) {
    case 'dev':
      return merge(dev, CubeDataset)
    case 'test':
      return merge(test, CubeDataset)
    case 'prod':
      return merge(prod, CubeDataset)
    default:
      return merge(test, CubeDataset)
  }
})()