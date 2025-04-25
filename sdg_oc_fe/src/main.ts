import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";
import { router } from "./router/index";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");

app.directive("decimal", {
  mounted(el) {
    el.addEventListener("input", (e: any) => {
      let value = e.target.value;
      const newValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
      if (value !== newValue) {
        e.target.value = newValue;
        e.target.dispatchEvent(new Event("input"));
      }
    });
  },
});
