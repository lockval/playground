#!/usr/bin/env node

import fs from "fs"

let SHAREURL = process.env.SHAREURL;
let X_PPA_PSK = process.env.X_PPA_PSK;
let RUNURL = process.env.RUNURL;
let RUNPWD = process.env.RUNPWD;

let data = fs.readFileSync("./src/App.vue", "utf8");

if (SHAREURL) {
  data = data.replace("http://127.0.0.1:37219", SHAREURL)
}
if (X_PPA_PSK) {
  data = data.replace("thisisyourpsk", X_PPA_PSK)
}
if (RUNURL) {
  data = data.replace("http://127.0.0.1:59102", RUNURL)
}
if (RUNPWD) {
  data = data.replace("2222", RUNPWD)
}

fs.writeFileSync("./src/App.vue", data, "utf8");
