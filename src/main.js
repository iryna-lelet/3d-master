import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import ElementUI from 'element-ui'
import App from '../components/App.vue'
import locale from 'element-ui/lib/locale/lang/en'
import axios from 'axios';
import i18n from '../plugins/i18n';

import 'element-ui/lib/theme-chalk/index.css'
import '../assets/css/font-awesome.css'

import Editor from '../components/Editor.vue'
import Help from '../components/Help.vue'

Vue.use(Vuelidate)
Vue.use(ElementUI, { locale })
Vue.use(VueRouter)

const lang = localStorage.getItem('lang') || 'en';
axios.defaults.headers['Accept-Language'] = lang;

const routes = [
  { path: '/', component: Editor, name: 'editor' },
  { path: '/help', component: Help, name: 'help' }
]

const router = new VueRouter({
  routes // сокращённая запись для `routes: routes`
})

const vue = new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
