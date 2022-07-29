import axios from "axios"
import {
  Message
} from "element-ui"
import router from "@/router/index"
import url from "./url"
const http = axios.create({
  baseURL: url.prod.baseURL,
  //   baseURL: "http://www.ysqorz.top:8888/api/private/v1"
  //   timeOut: 5000
})
http.interceptors.request.use(
  (config) => {
    // console.log(config);
    if (config.url !== "/login") {
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
    // console.log(config.data.meta.msg);
    console.log(config);
    const arr = [200, 201, 204]
    if (arr.includes(config.data.meta.status)) {
      Message({
        message: config.data.meta.msg,
        type: 'success'
      })
    } else {
      Message.error(config.data.meta.msg)
    }
    // sessionStorage.setItem('token', config.data.data.token)
    if (config.config.url === "/login") {
      sessionStorage.setItem('token', config.data.data.token)
    }
    if (config.data.meta.msg === "无效token") {
      router.replace({
        path: "/login"
      })
      sessionStorage.removeItem("token")
    }
    return config
  },
  (err) => {
    alert(err)
  }
)
export default http
