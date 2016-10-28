var m = require('mithril');

var HbFormsApp;
if(typeof window != 'undefiend'){
    HbFormsApp = window.HbFormsApp || (window.HbFormsApp = require('../src/app.js'))
}

HbFormsApp.prototype.InputOutput = (args)=>{
    return require('../src/input-template.jsx')(args, this);
}
