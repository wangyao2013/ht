import http from "./request"
export function LoginApi(data) {
  return http({
    url: '/login',
    method: 'POST',
    data
  })
}
export function Getmenus() {
  return http({
    method: "GET",
    url: "/menus",
  })
}
export function getUsers(params) {
  return http({
    url: "/users",
    method: "GET",
    params
  })
}
export function addUsers(data) {
  return http({
    url: "/users",
    method: "POST",
    data
  })
}
export function changeStatus(data) {
  return http({
    url: `/users/${data.id}/state/${data.mg_state}`,
    method: "PUT"
  })
}
export function emit(data) {
  return http({
    url: `/users/${data.id}`,
    method: "PUT",
    data
  })
}
export function del(id) {
  return http({
    url: `users/${id}`,
    method: "delete",

  })
}
export function setRole(data) {
  return http({
    url: `users/${data.id}/?role=${data.rid}`,
    method: "PUT",
    // data:data.rid
  })
}
export function getRid(){
  return http({
    url:"roles",
    method:"get"
  })
}
