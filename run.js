#!/usr/bin/env node

const url = require("url");
const { run } = require("./index.js");
const {
  reactSnap,
  homepage,
  devDependencies,
  dependencies,
  staticBasePath
} = require(`${process.cwd()}/package.json`);

const publicUrl = process.env.PUBLIC_URL || homepage;

console.log(`env Public URL: ${process.env.PUBLIC_URL}`)
console.log(`package homepage: ${homepage}`)

console.log(`env staticBasePath: ${process.env.STATIC_BASE_PATH}`)
console.log(`package staticBasePath: ${staticBasePath}`)
console.log(`env REACT_APP_STATIC_BASE_URL: ${process.env.REACT_APP_STATIC_BASE_URL}`)

const reactScriptsVersion = parseInt(
  (devDependencies && devDependencies["react-scripts"]) ||
  (dependencies && dependencies["react-scripts"])
);
let fixWebpackChunksIssue;
switch (reactScriptsVersion) {
  case 1:
    fixWebpackChunksIssue = "CRA1";
    break;
  case 2:
    fixWebpackChunksIssue = "CRA2";
    break;
}

const parcel = Boolean(
  (devDependencies && devDependencies["parcel-bundler"]) ||
  (dependencies && dependencies["parcel-bundler"])
);

if (parcel) {
  if (fixWebpackChunksIssue) {
    console.log("Detected both Parcel and CRA. Fixing chunk names for CRA!");
  } else {
    fixWebpackChunksIssue = "Parcel";
  }
}

run({
  publicPath: publicUrl ? url.parse(publicUrl).pathname : "/",
  staticBasePath: process.env.STATIC_BASE_PATH || staticBasePath,
  fixWebpackChunksIssue,
  ...reactSnap
}).catch(error => {
  console.error(error);
  process.exit(1);
});
