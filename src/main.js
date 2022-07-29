import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import "./assets/icon/iconfont.css"
// 富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.config.productionTip = false
import moment from 'moment'
// 树形表格
import ZkTable from 'vue-table-with-tree-grid'

Vue.component(ZkTable.name, ZkTable);

// 商品列表过滤时间
Vue.filter("data", function (time) {
  let dt = moment(time * 1000).format("YYYY-MM-DD  HH:mm:ss")
  return dt
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
