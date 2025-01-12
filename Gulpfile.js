"use strict";

const { series,parallel,src,dest,watch } = require("gulp");
const os = require("os");
// const gutil = require("gulp-util");
const sass = require("gulp-sass")(require("sass"));
const jshint = require("gulp-jshint");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const notify = require("gulp-notify");
const header = require("gulp-header");
const minifycss = require("gulp-clean-css");
//var jsdoc        = require("gulp-jsdoc");
//var jsdoc2md     = require("gulp-jsdoc-to-markdown");
const pkg = require("./package.json");
const dateFormat = require("dateformatter").format;
const replace = require("gulp-replace");
pkg.name         = "Editor.md";
pkg.today        = dateFormat;

const headerComment = [
    "/*",
    " * <%= pkg.name %>",
    " *",
    " * @file        <%= fileName(file) %> ",
    " * @version     v<%= pkg.version %> ",
    " * @description <%= pkg.description %>",
    " * @license     MIT License",
    " * @author      <%= pkg.author %>",
    " * {@link       <%= pkg.homepage %>}",
    " * @updateTime  <%= pkg.today('Y-m-d') %>",
    " */",
    "\r\n"].join("\r\n");

const headerMiniComment = "/*! <%= pkg.name %> v<%= pkg.version %> | <%= fileName(file) %> | <%= pkg.description %> | MIT License | By: <%= pkg.author %> | <%= pkg.homepage %> | <%=pkg.today('Y-m-d') %> */\r\n";

const replaceText1 = [
    "let cmModePath  = \"codemirror/mode/\";",
    "            let cmAddonPath = \"codemirror/addon/\";",
    "",
    "           let codeMirrorModules = [",
    "                \"jquery\", \"marked\", \"prettify\",",
    "                \"katex\", \"raphael\", \"underscore\", \"flowchart\",  \"jqueryflowchart\",  \"sequenceDiagram\",",
    "",
    "                \"codemirror/lib/codemirror\",",
    "                cmModePath + \"css/css\",",
    "                cmModePath + \"sass/sass\",",
    "                cmModePath + \"shell/shell\",",
    "                cmModePath + \"sql/sql\",",
    "                cmModePath + \"clike/clike\",",
    "                cmModePath + \"php/php\",",
    "                cmModePath + \"xml/xml\",",
    "                cmModePath + \"markdown/markdown\",",
    "                cmModePath + \"javascript/javascript\",",
    "                cmModePath + \"htmlmixed/htmlmixed\",",
    "                cmModePath + \"gfm/gfm\",",
    "                cmModePath + \"http/http\",",
    "                cmModePath + \"go/go\",",
    "                cmModePath + \"dart/dart\",",
    "                cmModePath + \"coffeescript/coffeescript\",",
    "                cmModePath + \"nginx/nginx\",",
    "                cmModePath + \"python/python\",",
    "                cmModePath + \"perl/perl\",",
    "                cmModePath + \"lua/lua\",",
    "                cmModePath + \"r/r\", ",
    "                cmModePath + \"ruby/ruby\", ",
    "                cmModePath + \"rst/rst\",",
    "                cmModePath + \"smartymixed/smartymixed\",",
    "                cmModePath + \"vb/vb\",",
    "                cmModePath + \"vbscript/vbscript\",",
    "                cmModePath + \"velocity/velocity\",",
    "                cmModePath + \"xquery/xquery\",",
    "                cmModePath + \"yaml/yaml\",",
    "                cmModePath + \"erlang/erlang\",",
    "                cmModePath + \"jade/jade\",",
    "",
    "                cmAddonPath + \"edit/trailingspace\", ",
    "                cmAddonPath + \"dialog/dialog\", ",
    "                cmAddonPath + \"search/searchcursor\", ",
    "                cmAddonPath + \"search/search\", ",
    "                cmAddonPath + \"scroll/annotatescrollbar\", ",
    "                cmAddonPath + \"search/matchesonscrollbar\", ",
    "                cmAddonPath + \"display/placeholder\", ",
    "                cmAddonPath + \"edit/closetag\", ",
    "                cmAddonPath + \"fold/foldcode\",",
    "                cmAddonPath + \"fold/foldgutter\",",
    "                cmAddonPath + \"fold/indent-fold\",",
    "                cmAddonPath + \"fold/brace-fold\",",
    "                cmAddonPath + \"fold/xml-fold\", ",
    "                cmAddonPath + \"fold/markdown-fold\",",
    "                cmAddonPath + \"fold/comment-fold\", ",
    "                cmAddonPath + \"mode/overlay\", ",
    "                cmAddonPath + \"selection/active-line\", ",
    "                cmAddonPath + \"edit/closebrackets\", ",
    "                cmAddonPath + \"display/fullscreen\",",
    "                cmAddonPath + \"search/match-highlighter\"",
    "           ];",
    "",
    "            define(codeMirrorModules, factory);"
].join("\r\n");

const replaceText2 = [
    "if (typeof define == \"function\" && define.amd) {",
    "       $          = arguments[0];",
    "       marked     = arguments[1];",
    "       prettify   = arguments[2];",
    "       katex      = arguments[3];",
    "       Raphael    = arguments[4];",
    "       _          = arguments[5];",
    "       flowchart  = arguments[6];",
    "       CodeMirror = arguments[9];",
    "   }"
].join("\r\n");

const codeMirror = {
    path: {
        src: {
            mode: "lib/codemirror/mode",
            addon: "lib/codemirror/addon"
        },
        dist: "lib/codemirror"
    },
    get:(dir,init)=>{
        let js = init || [];
        let isMode = dir === "mode";
        for (let path of codeMirror[dir+"s"] ) {
            if (isMode) {
                path = path + "/" + path;
            }
            js.push(codeMirror.path.src[dir]+"/"+path+".js");
        }
        return js;
    },
    modes: [
        "css",
        "sass",
        "shell",
        "sql",
        "clike",
        "php",
        "xml",
        "markdown",
        "javascript",
        "htmlmixed",
        "gfm",
        "http",
        "go",
        "dart",
        "coffeescript",
        "nginx",
        "python",
        "perl",
        "lua",
        "r",
        "ruby",
        "rst",
        "smartymixed",
        "vb",
        "vbscript",
        "velocity",
        "xquery",
        "yaml",
        "erlang",
        "jade",
    ],

    addons: [
        "edit/trailingspace",
        "dialog/dialog",
        "search/searchcursor",
        "search/search",
        "scroll/annotatescrollbar",
        "search/matchesonscrollbar",
        "display/placeholder",
        "edit/closetag",
        "fold/foldcode",
        "fold/foldgutter",
        "fold/indent-fold",
        "fold/brace-fold",
        "fold/xml-fold",
        "fold/markdown-fold",
        "fold/comment-fold",
        "mode/overlay",
        "selection/active-line",
        "edit/closebrackets",
        "display/fullscreen",
        "search/match-highlighter"
    ]
};

let head = (b) => {
    return {
        pkg : pkg, fileName : (file)=> file
            .path
            .split(file.base)[1]
            .replace(b ? "\\" : /[\\\/]?/ , "")
    };
};
async function scssTask(fileName, path) {
    let file = (path || "scss/")+fileName;
    let output = ()=> dest("css");
    return src(file+".scss")
    .pipe(sass({
        outFile:file+".sass",
        outputStyle:"expanded",
        sourceMap:false,
        noCache: true,
    }))
    .pipe(output())
    .pipe(header(headerComment, head(true)))
    .pipe(output())
    .pipe(rename({ suffix: ".min" }))
    .pipe(output())
    .pipe(minifycss())
    .pipe(output())
    .pipe(header(headerMiniComment, head(true)))
    .pipe(output())
    .pipe(notify({ message: fileName + ".scss task completed!" }));
}
let scssMain = async ()=> await scssTask("editormd");
let scssPreview = async ()=> await scssTask("editormd.preview");
let scssLogo = async ()=> await scssTask("editormd.logo");

let scssJob = series(
    scssMain,
    scssPreview,
    scssLogo
);
let js = async ()=> src("./src/editormd.js")
    .pipe(dest("./"))
    .pipe(header("/* jshint browser: true */ \n\r"))
    .pipe(jshint("./.jshintrc"))
    .pipe(jshint.reporter())
    .pipe(header(headerComment, head()))
    .pipe(dest("./"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())  // {outSourceMap: true, sourceRoot: "./"}
    .pipe(dest("./"))
    .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
            let name = file.path.split(file.base + ( (os.platform() === "win32") ? "\\" : "/") );
            return name[1].replace(/[\\\/]?/, "");
        }}))
    .pipe(dest("./"))
    .pipe(notify({ message: "editormd.js task complete" }));

let amd = async ()=> src("src/editormd.js")
    .pipe(rename({ suffix: ".amd" }))
    .pipe(dest("./"))
    .pipe(header(headerComment, head()))
    .pipe(dest("./"))
    .pipe(replace("/* Require.js define replace */", replaceText1))
    .pipe(dest("./"))
    .pipe(replace("/* Require.js assignment replace */", replaceText2))
    .pipe(dest("./"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify()) //{outSourceMap: true, sourceRoot: "./"}
    .pipe(dest("./"))
    .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
        let name = file.path.split(file.base + ( (os.platform() === "win32") ? "\\" : "/") );
        return name[1].replace(/[\\\/]?/, "");
    }}))
    .pipe(dest("./"))
    .pipe(notify({ message: "amd version task complete"}));


let cmMode = async ()=> src(codeMirror.get(
    "mode",
    [codeMirror.path.src.mode + "/meta.js"]
))  .pipe(concat("modes.min.js"))
    .pipe(dest(codeMirror.path.dist))
    .pipe(uglify()) // {outSourceMap: true, sourceRoot: codeMirror.path.dist}
    .pipe(dest(codeMirror.path.dist))
    .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
        let name = file.path.split(file.base + "\\");
        return (name[1]?name[1]:name[0]).replace(/\\/g, "");
    }}))
    .pipe(dest(codeMirror.path.dist))
    .pipe(notify({ message: "codemirror-mode task complete!" }));

let cmAddon = async ()=> src(codeMirror.get("addon"))
    .pipe(concat("addons.min.js"))
    .pipe(dest(codeMirror.path.dist))
    .pipe(uglify()) //{outSourceMap: true, sourceRoot: codeMirror.path.dist}
    .pipe(dest(codeMirror.path.dist))
    .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
            let name = file.path.split(file.base + "\\");
            return (name[1]?name[1]:name[0]).replace(/\\/g, "");
        }}))
    .pipe(dest(codeMirror.path.dist))
    .pipe(notify({ message: "codemirror-addon.js task complete" }));


let cm = series(cmAddon,cmMode);
exports.js = js;
exports.amd = amd;
exports.scss = scssJob;
exports.cm = cm;


exports.watch = async ()=> await parallel(
    watch("scss/editormd.scss", scssMain),
    watch("scss/editormd.preview.scss", series(scssPreview,scssLogo)),
    watch("scss/editormd.logo.scss", series(scssMain,scssLogo)),
    watch("src/editormd.js", series(js,amd))
);


exports.default = parallel(
    js,
    scssJob,
    amd,
    cm,
);
/*
gulp.task("jsdoc", function(){
    return gulp.src(["./src/editormd.js", "README.md"])
               .pipe(jsdoc.parser())
               .pipe(jsdoc.generator("./docs/html"));
});

gulp.task("jsdoc2md", function() {
    return gulp.src("src/js/editormd.js")
            .pipe(jsdoc2md())
            .on("error", function(err){
                gutil.log(gutil.colors.red("jsdoc2md failed"), err.message);
            })
            .pipe(rename(function(path) {
                path.extname = ".md";
            }))
            .pipe(dest("docs/markdown"));
});
*/