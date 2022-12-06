import { createApp } from "vue";
import ViewUIPlus from "view-ui-plus";
import App from "./App.vue";
import "view-ui-plus/dist/styles/viewuiplus.css";
import VueCookies from 'vue3-cookies'
import { useCookies } from "vue3-cookies";


createApp(App).use(ViewUIPlus).use(VueCookies)
    .mount("#app");
