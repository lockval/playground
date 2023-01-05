import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { basicSetup } from 'codemirror'
import VueCodemirror from 'vue-codemirror'
import { store } from "./g/data";

const app=createApp(App)


app.use(VueCodemirror, {
    // optional default global options
    autofocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: 'Code goes here...',
    extensions: [basicSetup]
    // ...
  });

app.use(store)

app.mount('#app')