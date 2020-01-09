const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-type': 'application/json' }
})
import { API_BASE_URL } from '../config'
import * as axios from 'axios'
import {trackError} from '../utils/common';

export const post = async (route, data) => {
    const response = await instance.post(route, data)
    .catch (err =>{
      if (err.code==="ECONNABORTED"){
        console.log("http post error TIMEOUT")
        trackError(new Error(err.code +" | route: "+route));
        return null;
      }
    })

    return response;
}

export const get = async (route, data) => {
  try {
    const response = await instance.get(route+"?="+data)
    return respose;
  } catch (error) {
    trackError(error)
  }

}
