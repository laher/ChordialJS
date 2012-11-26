#!/usr/bin/env node

var name='Chordial';
var version='0.0.1';

// TODO: look up UglifyJS



var setup = {
        input: {
	    copy: name+".copy.js",
            core: name+".core.js",
            common: name+".common.js",
        },
        output: {
 //           name+"-min-"+version+".js": function () {
   //             return this.copy + "\n" + minify(this.core + this.common);
     //       },
            name+"-"+version+".js": function () {
                return this.copy + "\n" + this.core + "\n\n" + this.common;
            },
        }
    };
/*
    ujs = require("../UglifyJS/uglify-js.js"),
    jsp = ujs.parser,
    pro = ujs.uglify,
    fs = require("fs"),
    rxdr = /\/\*\\[\s\S]+?\\\*\//g;

function minify(code) {
    return pro.gen_code(pro.ast_squeeze(pro.ast_mangle(jsp.parse(code))));
}
*/
var files = {};
for (var file in setup.input) {
    files[file] = String(fs.readFileSync(setup.input[file], "utf8")).replace(rxdr, "");
}
for (file in setup.output) {
    (function (file) {
        fs.writeFile(file, setup.output[file].call(files), function () {
            console.log("Saved to \033[32m" + file + "\033[0m\n");
        });
    })(file);
}
