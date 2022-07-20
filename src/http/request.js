import axios from "axios"
import {
  Message
} from "element-ui"
import url from "./url"
const http = axios.create({
  baseURL: url.prod.baseURL,
  //   baseURL: "http://www.ysqorz.top:8888/api/private/v1"
  //   timeOut: 5000
})
http.interceptors.request.use(
  (config) => {
  console.log(config.url);
  if(config.url!="/login"){
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
   
    return config
  },
  (err) => {
    alert(err)
  }
)
http.interceptors.response.use(
  (config) => {
    let res = config.data
    let arr = [200, 201, 204]
    if (arr.includes(config.data.meta.status)) {
      Message({
        message: res.meta.msg,
        type: 'success'
      })
     
    } else {
      Message.error(res.meta.msg)
    }
    if(config.url=="/login"){
        sessionStorage.setItem('token', config.data.data.token)
    }else{
        return config
    }
    
  },
  (err) => {
    alert(err)
  }
)
export default http
