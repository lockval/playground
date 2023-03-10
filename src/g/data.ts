import { createStore } from "vuex";

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

const javascriptExtensions = [javascript()]
const pythonExtensions = [python()]
const luaExtensions = [python()]

const allExtensions: Dict = {
  "JavaScript": javascriptExtensions,
  "Python": pythonExtensions,
  "Lua": luaExtensions,
}



export type Dict = {
  [key: string | number | symbol]: any;
};

class mystatus {

  config: Dict = {
    radio: "JavaScript",
    log: "",
    code: ``,

    extensions: javascriptExtensions,
  };

  setLang(lang: string | null) {
    if (!lang) {
      return false;
    }
    if (this.radioChange(lang, true)) {
      this.config.radio = lang;
      return true;
    }
    return false;
  }

  radioChange = (lang: string, noPush: boolean) => {
    // this.config.radio=lang
    if (!noPush) {
      history.pushState(null, "", "?");
    }
    let ext = allExtensions[lang];
    if (ext) {
      this.config.extensions = ext;
      return true;
    }
    return false;

  }

}

export const store = createStore({
  state() {
    return new mystatus();
  },
  mutations: {
    log(state: mystatus, o: string) {
      state.config.log += o + "\n";
    },
    clear(state: mystatus) {
      state.config.log = "";
    },
    setCode(state: mystatus, o: string) {
      state.config.code = o;
    },


  },
  actions: {},
  modules: {},
});