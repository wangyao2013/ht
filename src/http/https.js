import http from "./request"
export function LoginApi(data) {
  return http({
    url: '/login',
    method: 'POST',
    data
  })
}
export function Getmenus(){
    return http({
        method:"GET",
        url:"/menus",

    })
}
