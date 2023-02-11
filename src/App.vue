<script setup lang="ts">
import { defineComponent, ref, shallowRef, onMounted } from 'vue'

import { Codemirror } from 'vue-codemirror'
import { ViewUpdate } from "@codemirror/view"
import { store, type Dict } from "./g/data";
import LZString from "lz-string"

// please run 'npm run server'
const SHAREURL = "http://127.0.0.1:37219"
const X_PPA_PSK = "thisisyourpsk"

// please start your apidemo server
const RUNURL = "http://127.0.0.1:59102"
const RUNPWD = "2222"

const radio2pathname: Dict = {
  "JavaScript": "js",
  "Python": "star",
  "Lua": "lua",
}

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload: any) => {
  view.value = payload.view
}

const editChange = (value: string, viewUpdate: ViewUpdate) => {
  history.pushState(null, "", "?");
}


async function getHash(u8a: Uint8Array) {
  const sha1 = await crypto.subtle.digest("SHA-1", u8a);
  return [...new Uint8Array(sha1)].map(b =>
    b.toString(16).padStart(2, "0")).join("");
}

function encode(message: string): Uint8Array {
  return LZString.compressToUint8Array(message);
  // return new TextEncoder().encode(message);
}

function decode(compressed: Uint8Array): string | null {
  return LZString.decompressFromUint8Array(compressed);
}

async function run() {
  // store.commit("log", "run");
  let pathname = radio2pathname[store.state.config.radio]

  let resp: Response;
  try {
    resp = await fetch(`${RUNURL}/${pathname}?pwd=${RUNPWD}`, {
      method: "POST",
      body: store.state.config.code,
    })
    if (!resp.ok) {
      throw `Response.status=${resp.status}`;
    }

  } catch (err) {
    alert(`oops! ${err}`)
    return
  }

  let log = await resp.text()
  store.commit("log", log);
  requestAnimationFrame(() => {
    let textarea = document.getElementById('textarea_id');
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  });



}


// Implement your own upload code
async function upload(key: string, value: Uint8Array) {
  const headers = new Headers();
  headers.set("X_PPA_PSK", X_PPA_PSK);
  return await fetch(`${SHAREURL}/${key}`, {
    method: "POST",
    headers,
    body: value,
  })
}

// Implement your own download code
async function download(key: string) {
  const headers = new Headers();
  headers.set("X_PPA_PSK", X_PPA_PSK);
  return await fetch(`${SHAREURL}/${key}`, {
    method: "GET",
    headers,
  })
}

async function share() {

  let u8a = encode(store.state.config.code);
  let hash = await getHash(u8a)

  let resp: Response;
  try {
    resp = await upload(hash, u8a)
    if (!resp.ok) {
      throw `Response.status=${resp.status}`;
    }
  } catch (err) {
    alert(`oops! ${err}`)
    return
  }

  console.log(await resp.text())

  history.pushState(null, "", `?lang=${store.state.config.radio}&code=${hash}`);

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(document.URL);
    alert(`The share URL has been copied to the clipboard`)
  }

}
function cls() {
  store.commit("clear");
}

onMounted(() => {

  let myURL = new URL(document.URL)
  let searchParams = new URLSearchParams(myURL.search);

  let code = searchParams.get('code');



  if (code) {
    let resp: Response;

    download(code).then(resp => {
      if (!resp.ok) {
        throw `Response.status=${resp.status}`;
      }
      return resp.arrayBuffer()
    }).then(encodeData => {

      let downloadCode = decode(new Uint8Array(encodeData))

      store.commit("setCode", downloadCode);

      let lang = searchParams.get('lang');
      store.state.setLang(lang)

    }).catch(err => {
      alert(`oops! ${err}`)
      history.pushState(null, "", "?");
    })

  }


})

</script>

<template>
  <button @click="run()">run</button>with:
  <!-- {{ $store.state.config.radio }} -->

  <input type="radio" id="JavaScript" value="JavaScript" v-model="$store.state.config.radio"
    @click="$store.state.radioChange('JavaScript')" />
  <label for="JavaScript">JavaScript</label>

  <input type="radio" id="Python" value="Python" v-model="$store.state.config.radio"
    @click="$store.state.radioChange('Python')" />
  <label for="Python">Python</label>

  <input type="radio" id="Lua" value="Lua" v-model="$store.state.config.radio"
    @click="$store.state.radioChange('Lua')" />
  <label for="Lua">Lua</label>

  &nbsp;

  <button @click="share()">share</button>&nbsp;Welcome to the playground of <a href="https://lockval.com"
    target="_blank">Lockval Engine</a>&nbsp;(&nbsp;<a href="https://github.com/lockval/playground"
    target="_blank">source</a>&nbsp;) . Lockval Engine is free backend engine

  <codemirror v-model="$store.state.config.code" placeholder="Code goes here..." :style="{ height: '60vh' }"
    :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="store.state.config.extensions"
    @ready="handleReady" @change="editChange" />

  <button @click="cls()">cls</button>
  <div>
    <textarea id="textarea_id" readonly :style="{ height: '32.5vh', width: '99vw' }"
      v-model="$store.state.config.log"></textarea>
  </div>
</template>

