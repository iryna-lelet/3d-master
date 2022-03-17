import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '../lang/en.json';
import ru from '../lang/ru.json';
import ua from '../lang/ua.json';

Vue.use(VueI18n);

export default new VueI18n({
   locale: localStorage.getItem('lang') || 'en',
   messages: {
       en,
       ru,
       ua
   }
});