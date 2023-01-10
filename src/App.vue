<script setup lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { store, type Dict } from "./g/data";


// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload: any) => {
  view.value = payload.view
}

function run(){
  store.commit("log","run");
}
function share(){
  console.log("share");
  history.pushState(null, "", '?lang='+store.state.config.radio+"&code=xxx");
}
function cls(){
  store.commit("clear");
}



</script>

<template>
  <button @click="run()">run</button>with:
  <!-- {{ $store.state.config.radio }} -->

	<input type="radio" id="JavaScript" value="JavaScript" v-model="$store.state.config.radio" @click="$store.state.radioChange('JavaScript')" />
	<label for="JavaScript">JavaScript</label>

	<input type="radio" id="Python" value="Python" v-model="$store.state.config.radio" @click="$store.state.radioChange('Python')"/>
	<label for="Python">Python</label>

	<input type="radio" id="Lua" value="Lua" v-model="$store.state.config.radio" @click="$store.state.radioChange('Lua')"/>
	<label for="Lua">Lua</label>

  &nbsp;

  <button @click="share()">share</button>&nbsp;<a align="right" href="https://lockval.com" target="_blank">Lockval Engine</a>
  
  <codemirror v-model="$store.state.config.code" placeholder="Code goes here..."
    :style="{ height: '60vh' }" :autofocus="true" :indent-with-tab="true"
    :tab-size="2" :extensions="store.state.config.extensions" @ready="handleReady" />
  
  <button @click="cls()">cls</button>
  <div>
    <textarea readonly :style="{ height: '32.5vh', width: '99vw' }"  v-model="$store.state.config.log"></textarea>
  </div>
</template>

