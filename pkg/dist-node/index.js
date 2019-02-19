'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Formatter", {
  enumerable: true,
  get: function get() {
    return _formatter.default;
  }
});
exports.default = void 0;

var _formatter = _interopRequireDefault(require("./formatter.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

let futoji = new _formatter.default();
var _default = futoji; // let format = new Formatter()
// format.addFormat('bold', '**', txt => `bold(${txt})`)
// format.addFormat('italic', '*', txt => `italic[${txt}]`)
// let formatted = format.format(`
// *italic with similar syntax*
// **what why it work now**
// **uh oh**
// **italic *in* bold**
// *bold **in** italic*
// `)

/*
italic[italic with similar syntax]
bold(what why it work now)
bold(uh oh)
bold(italic italic[in] bold)
italic[bold bold(in) italic]
*/

exports.default = _default;
