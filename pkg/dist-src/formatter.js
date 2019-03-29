function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A transformer transforms what is found between the symbols
 */

/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
  constructor() {
    _defineProperty(this, "transformers", []);
  }

  /**
   * Define the symbol and the transformer
   * Add a transformer to transform code when formatting text
   * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
   */
  addTransformer(params) {
    this.transformers.push(Object.assign({
      recursive: true,
      open: params.symbol,
      close: params.symbol || params.open
    }, params));
  }
  /**
   * transform and format the text
   */


  format(text) {
    let pos = 0;
    let lastSlice = 0;
    let io = []; // if the next part of the text is the string
    // todo: change to slice or something

    function accept(string, offset = 0) {
      let pt = pos + offset;
      return string.split('').every((char, i) => {
        return text[pt + i] === char;
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
      // return all transformers that start with the current char
      let matches = this.transformers.filter(transformer => {
        return transformer.open.startsWith(text[pos]);
      });

      if (matches.length > 0) {
        let matched = matches.some(match => {
          let {
            name,
            open,
            close,
            transformer,
            recursive
          } = match;

          if (accept(open)) {
            pos += open.length;
            let fromPos = pos;
            let toPos = pos;
            untilSymbol(close); // make sure the next symbol does not also match the current one
            // this stops `*italic**hi*` from working and makes sure there needs to be a different char inbetween
            // fixes bugs

            while (accept(close, 1)) {
              pos += open.length + 1;
              untilSymbol(close);
            }

            toPos = pos;

            if (accept(close)) {
              let matchedText = text.slice(fromPos, toPos);
              let parsed = transformer(matchedText);

              if (recursive) {
                parsed = this.format(parsed);
              }

              io.push(parsed);
              pos += close.length;
              lastSlice = pos;
              return true;
            }

            return false;
          }

          return false;
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