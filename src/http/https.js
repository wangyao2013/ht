
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
    url: `/users/${id}`,
    method: "delete",
  })
}
export function setRole(data) {
  return http({
    url: `/users/${data.id}/role`,
    method: "PUT",
    data
  })
}
export function getRid() {
  return http({
    url: "/roles",
    method: "get"
  })
}
export function rolesDel(id) {
  return http({
    url: `/roles/${id}`,
    method: "delete"
  })
}
export function addRoles(data) {
  return http({
    url: `/roles`,
    method: "post",
    data
  })
}
export function getRights() {
  return http({
    url: "/rights/tree",
    method: "get"
  })
}
export function changeRoles(data) {
  return http({
    url: `/roles/${data.roleId}/rights`,
    method: "post",
    data
  })
}
export function emitRoles(data) {
  return http({
    url: `/roles/${data.id}`,
    method: "put",
    data
  })
}
export function getRightList() {
  return http({
    url: "/rights/list",
    method: "get"
  })
}
export function getGoods(params) {
  return http({
    url: "/goods",
    method: "get",
    params
  })
}
// 获取商品分类
export function Getcategories1(params) {
  // console.log(params);
  return http({
    url: "/categories",
    method: "GET",
    // params
  })
}
export function Getcategories(params) {
  // console.log(params);
  return http({
    url: "/categories",
    method: "GET",
    params
  })
}
export function delRoledRight(data) {
  return http({
    url: `/roles/${data.roleId}/rights/${data.rightId}`,
    method: "delete"
  })
}
export function addGoods(data) {
  return http({
    url: "/goods",
    method: "post",
    data
  })
}
export function delGoods(id) {
  return http({
    url: `/goods/${id}`,
    method: "delete"
  })
}
// 获取参数列表
export function attributes(params) {
  return http({
    url: `/categories/${params.id}/attributes`,
    method: "get",
    params
  })
}
// 添加动态参数或者静态属性
export function addcategories(data) {
  return http({
    url: `/categories/${data.id}/attributes`,
    method: "post",
    data
  })
}
// 删除动态参数或者静态属性
export function delCategories(data) {
  return http({
    url: `/categories/${data.id}/attributes/${data.attrid}`,
    method: "delete"
  })
}
// 图表数据
export function Echarts() {
  return http({
    url: "/reports/type/1",
    method: "get"
  })
}
// 获取订单列表
export function getOrders(params) {
  return http({
    url: "/orders",
    method: "get",
    params
  })
}
// 查看物流信息
export function kuaidi(id) {
  return http({
    url: `/kuaidi/${id}`,
    method: "get"
  })
}
// 添加分类
export function AddCategory(data){
  return http({
    url:"/categories",
    method:"post",
    data
  })
}
// 删除分类
export function delcategories(id){
  return http({
    url:`categories/${id}`,
    method:"delete",

  })
}
// 编辑提交分类
export function emitCate(data){
  return http({
    url:`categories/${data.cat_id}`,
    method:"put",
    data
  })
}
// 编辑提交参数
export function emitParameter(data){
  return http({
    url:`categories/${data.id}/attributes/${data.attrId}`,
    method:"put",
    data
  })
}

