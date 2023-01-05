import { createStore } from "vuex";

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

const javascriptExtensions=[javascript()]
const pythonExtensions=[python()]
const luaExtensions=[javascript()]

const allExtensions: Dict={
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
    code: `console.log('Hello, world!')`,

    extensions: javascriptExtensions,
  };

  radioChange=(lang: string)=>{
    // console.log(lang)
    // this.config.radio=lang
    this.config.extensions=allExtensions[lang]
  }

}

export const store = createStore({
  state() {
    return new mystatus();
  },
  mutations: {
    log(state: mystatus, o: string) {
      state.config.log+=o+"\n";
    },
    clear(state: mystatus) {
      state.config.log="";
    },
  },
  actions: {},
  modules: {},
});