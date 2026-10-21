import Module from 'node:module'
// Node's default React conditions do not resolve Next's server-only marker.
// This harness blocks network and supplies database doubles in security.test.mjs.
const load = Module._load
Module._load = function (name, ...args) { return name === 'server-only' ? {} : load.call(this, name, ...args) }
