"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Formatter {
  constructor() {
    _defineProperty(this, "formatters", []);
  }

  addFormat(name, symbol, cb) {
    this.formatters.push({
      name: name,
      symbol: symbol,
      cb: cb
    });
  }

  format(text) {
    let pos = 0;
    let lastSlice = 0;
    let io = []; // if the next part of the text is the string
    // todo: change to slice or something

    function accept(string, offset = 0) {
      let pt = pos + offset;
      return string.split('').every((c, i) => {
        return text[pt + i] === c;
      });
    } // next char until a symbol is matched


    function untilSymbol(symbol) {
      while (!accept(symbol) && pos < text.length) {
        pos += 1;
      }
    }

    function slice_to_io() {
      io.push(text.slice(lastSlice, pos));
      lastSlice = pos;
    }

    while (pos < text.length) {
      let matches = this.formatters.filter(f => {
        return f.symbol.startsWith(text[pos]);
      });

      if (matches.length > 0) {
        let matched = matches.some(m => {
          if (accept(m.symbol)) {
            pos += m.symbol.length;
            let fromPos = pos;
            let toPos = pos;
            untilSymbol(m.symbol); // make sure the next symbol does not also match the current one
            // this stops `*italic**hi*` from working and makes sure there needs to be a different char inbetween
            // fixes bugs

            while (accept(m.symbol, 1)) {
              pos += m.symbol.length + 1;
              untilSymbol(m.symbol);
            }

            toPos = pos;

            if (accept(m.symbol)) {
              let matchedText = text.slice(fromPos, toPos);
              let parsed = m.cb(matchedText);
              io.push(this.format(parsed));
              pos += m.symbol.length;
              lastSlice = pos;
              return true;
            }

            return false;
          }
        });

        if (!matched) {
          pos += 1;
          slice_to_io();
        }
      } else {
        pos += 1;
        slice_to_io();
      }
    }

    return io.join('');
  }

}

exports.default = Formatter;