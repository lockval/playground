<script setup lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'



const code = ref(`console.log('Hello, world!')`)
const extensions = [javascript()]

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload: any) => {
  view.value = payload.view
}

function run(){
  console.log("run");
  
}

// // Status is available at all times via Codemirror EditorView
// const getCodemirrorStates = () => {
//   const state = view.value.state
//   const ranges = state.selection.ranges
//   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
//   const cursor = ranges[0].anchor
//   const length = state.doc.length
//   const lines = state.doc.lines
//   // more state info ...
//   // return ...
// }



const log = console.log



</script>

<template>
  <button click="run()">run</button>
  <button>share</button>
  
  <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '60vh' }" :autofocus="true"
    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" @change="log('change', $event)"
    @focus="log('focus', $event)" @blur="log('blur', $event)" />
  
  <button>cls</button>
  <div>
    <textarea readonly :style="{ height: '34vh', width: '99vw' }"></textarea>
  </div>
</template>

