/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dialogueSystem.ts"
/*!*******************************!*\
  !*** ./src/dialogueSystem.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getLines = getLines;\nconst os = __webpack_require__(/*! os */ \"os\");\nfunction username() {\n    try {\n        return os.userInfo().username;\n    }\n    catch {\n        return 'friend';\n    }\n}\nfunction getLines() {\n    const name = username();\n    return [\n        // ── Classic Rocky lines ─────────────────────────────────────────────\n        { text: \"How do you know when the hug is done?\" },\n        { text: \"Thumbs up, baby\", particleEffect: 'sparkles' },\n        { text: \"Rocky hate Mark.\" },\n        { text: \"Fist my bump.\" },\n        { text: `${name} question is dumb` },\n        { text: \"Only us\" },\n        { text: \"My portable Earth thinking machine\" },\n        { text: `Rocky, ${name}, big science`, animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"I go home six years slow\", animation: 'sleep' },\n        { text: \"Oh, humor. Confusing.\" },\n        { text: \"Dirty, dirty, dirty…. This room for garbage?\", animation: 'panic' },\n        { text: \"It's not enough\" },\n        { text: \"Need word: to risk self to help another\", animation: 'inspect' },\n        { text: \"Amaze. Amaze. Amaze.\", animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: `${name} Rocky Save Stars`, animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"Words of encouragement.\" },\n        { text: \"Words of GREAT encouragement\", animation: 'celebrate' },\n        { text: \"Rocky new to ball\" },\n        { text: \"It's full good\", particleEffect: 'sparkles' },\n        { text: \"Dirty. Dirty. Dirty.\", animation: 'panic' },\n        { text: \"Where my bedroooom\", animation: 'sleep', particleEffect: 'zzz' },\n        // ── New Rocky lines ─────────────────────────────────────────────────\n        { text: `${name} will die question?`, animation: 'inspect' },\n        { text: `Rocky watch whole crew die. Rocky not fix. ${name} say ${name} will die. Rocky fix.`, animation: 'inspect' },\n        { text: \"You sleep. I watch.\" },\n        { text: `Friend ${name}.`, particleEffect: 'sparkles' },\n        { text: \"Question?\", animation: 'inspect' },\n        { text: \"Good. Good. Good.\", particleEffect: 'sparkles' },\n        { text: \"You are scary space monster. But okay.\" },\n        { text: `${name}. Clever. Amaze.`, animation: 'celebrate', particleEffect: 'sparkles' },\n        // ── Code-related Rocky-inspired lines ───────────────────────────────\n        { text: \"Code working. Question?\", animation: 'inspect' },\n        { text: \"Bug. Bug. Bug. Rocky see.\", animation: 'panic' },\n        { text: \"Tests pass. Big science.\", animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: `Function clever. Like ${name}.` },\n        { text: \"Compile success. Amaze.\", animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"Merge conflict. Dirty. Dirty.\", animation: 'panic' },\n        { text: \"Push to main? Question?\", animation: 'inspect' },\n        { text: `${name} code amaze.`, animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"Refactor. Cleaner. Good.\" },\n        { text: \"Loop infinite. Rocky scared.\", animation: 'panic' },\n        { text: \"Null pointer. Null pointer. Why.\", animation: 'panic' },\n        { text: \"Stack overflow. Question?\", animation: 'inspect' },\n        { text: \"TypeScript. Confusing. But okay.\" },\n        { text: \"Async. Await. Patience.\" },\n        { text: \"Memory leak. Plug hole. Plug hole.\", animation: 'panic' },\n        { text: \"Git push good. Fist my bump.\", animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"Console log? Show Rocky.\", animation: 'inspect' },\n        { text: \"Syntax error. Fix. Fix.\", animation: 'panic' },\n        { text: \"Pull request. Words of encouragement.\" },\n        { text: \"Deploy success. Big science.\", animation: 'celebrate', particleEffect: 'sparkles' },\n        { text: \"Code clean. Rocky proud.\", particleEffect: 'sparkles' },\n        { text: \"Variable name dumb. Rocky rename.\" },\n        { text: \"Code review. Only us.\" },\n        { text: `Rocky watch code die. Could not fix. ${name} say ${name} will fix. ${name} fix.`, animation: 'celebrate' },\n    ];\n}\n\n\n//# sourceURL=webpack://rocky-pet/./src/dialogueSystem.ts?\n}");

/***/ },

/***/ "./src/extension.ts"
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.activate = activate;\nexports.deactivate = deactivate;\nconst vscode = __webpack_require__(/*! vscode */ \"vscode\");\nconst rockyView_1 = __webpack_require__(/*! ./rockyView */ \"./src/rockyView.ts\");\nfunction activate(ctx) {\n    const view = new rockyView_1.RockyView(ctx);\n    ctx.subscriptions.push(vscode.window.registerWebviewViewProvider('rocky.view', view), vscode.commands.registerCommand('rocky.show', () => vscode.commands.executeCommand('rocky.view.focus')), vscode.commands.registerCommand('rocky.hide', () => view.dispose()));\n    // Auto-show Rocky in the bottom panel on every startup\n    vscode.commands.executeCommand('rocky.view.focus');\n}\nfunction deactivate() { }\n\n\n//# sourceURL=webpack://rocky-pet/./src/extension.ts?\n}");

/***/ },

/***/ "./src/rockyView.ts"
/*!**************************!*\
  !*** ./src/rockyView.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RockyView = void 0;\nconst vscode = __webpack_require__(/*! vscode */ \"vscode\");\nconst spritesheet_1 = __webpack_require__(/*! ./spritesheet */ \"./src/spritesheet.ts\");\nconst dialogueSystem_1 = __webpack_require__(/*! ./dialogueSystem */ \"./src/dialogueSystem.ts\");\nclass RockyView {\n    constructor(ctx) {\n        this.ctx = ctx;\n    }\n    resolveWebviewView(webviewView) {\n        this.view = webviewView;\n        webviewView.webview.options = {\n            enableScripts: true,\n            localResourceRoots: [vscode.Uri.joinPath(this.ctx.extensionUri, 'media')]\n        };\n        webviewView.webview.html = this.getHtml(webviewView.webview);\n    }\n    uri(webview, file) {\n        return webview.asWebviewUri(vscode.Uri.joinPath(this.ctx.extensionUri, 'media', file));\n    }\n    getHtml(webview) {\n        const css = this.uri(webview, 'rocky.css');\n        const js = this.uri(webview, 'rocky.js');\n        const img = this.uri(webview, 'spritesheet.png');\n        const csp = webview.cspSource;\n        const lines = (0, dialogueSystem_1.getLines)();\n        return `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta http-equiv=\"Content-Security-Policy\"\n    content=\"default-src 'none';\n             img-src ${csp};\n             style-src 'unsafe-inline' ${csp};\n             script-src 'unsafe-inline' ${csp};\">\n  <link rel=\"stylesheet\" href=\"${css}\">\n</head>\n<body>\n  <div id=\"stage\">\n    <canvas id=\"rocky-canvas\"></canvas>\n    <div id=\"dialogue\" style=\"display:none\">\n      <div id=\"d-text\"></div>\n    </div>\n  </div>\n  <script>\n    window.ROCKY_SHEET = \"${img}\";\n    window.SHEET_COLS  = ${spritesheet_1.SHEET_COLS};\n    window.FRAME_W     = ${spritesheet_1.FRAME_W};\n    window.FRAME_H     = ${spritesheet_1.FRAME_H};\n    window.ANIM_ROWS   = ${JSON.stringify(spritesheet_1.ANIM_ROWS)};\n    window.ROCKY_LINES = ${JSON.stringify(lines)};\n  </script>\n  <script src=\"${js}\"></script>\n</body>\n</html>`;\n    }\n    dispose() {\n        this.view = undefined;\n    }\n}\nexports.RockyView = RockyView;\n\n\n//# sourceURL=webpack://rocky-pet/./src/rockyView.ts?\n}");

/***/ },

/***/ "./src/spritesheet.ts"
/*!****************************!*\
  !*** ./src/spritesheet.ts ***!
  \****************************/
(__unused_webpack_module, exports) {

eval("{\n// 8 rows × 8 columns spritesheet (1536×1536, 192×192 per frame).\n// Only animation rows actually used are listed.\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ANIM_ROWS = exports.FRAME_H = exports.FRAME_W = exports.SHEET_COLS = void 0;\nexports.SHEET_COLS = 8;\nexports.FRAME_W = 192;\nexports.FRAME_H = 192;\nexports.ANIM_ROWS = {\n    idle: 0,\n    run: 2,\n    sleep: 3,\n    react: 4,\n};\n\n\n//# sourceURL=webpack://rocky-pet/./src/spritesheet.ts?\n}");

/***/ },

/***/ "vscode"
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
(module) {

module.exports = require("vscode");

/***/ },

/***/ "os"
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
(module) {

module.exports = require("os");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;