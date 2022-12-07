import { createApp } from "vue";
import ViewUIPlus from "view-ui-plus";
import App from "./App.vue";
import "view-ui-plus/dist/styles/viewuiplus.css";
import VueCookies from 'vue3-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App);
app.use(ViewUIPlus);
app.use(VueCookies);
app.use(VueAxios, axios)
app.mount("#app");
