import cubejs from '@cubejs-client/core';
import { useCubeQuery } from '@cubejs-client/react';
import { fetchCubeToken } from './getCubeToken';
import Env_Config from '../config/settings'
const getCubeInstance = async () => {
  let cubeToken = localStorage.getItem('cubeToken')
  if(!cubeToken){
    cubeToken = await fetchCubeToken()
  }
  return cubejs(cubeToken, {
    apiUrl: `${Env_Config.CUBE_API_URL}/cubejs-api/v1`,
  })
}


export default async function CubeSocket(props) {
  let cubejsApi = await getCubeInstance()
  const query = props?.query ?? {}
  const { resultSet, error, isLoading } = useCubeQuery(query, { subscribe: false, cubejsApi });
  return { resultSet, error, isLoading }
}
export async function CubeSocketSubs(props) {
  let cubejsApi = await getCubeInstance()
  const query = props?.query ?? {}
  const { resultSet, error, isLoading } = useCubeQuery(query, { subscribe: true, cubejsApi });
  return { resultSet, error, isLoading }
}

export const CubeQuery = async (props) => {
  let cubejsApi = await getCubeInstance()
  //console.log(cubejsApi)
  const query = props?.query ?? {}
  return cubejsApi.load(query).then((response) => {
    return response
  })
  .catch(err => {
    console.log(err, 'cube error')
  })
}







