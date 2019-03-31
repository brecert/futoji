function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * a transformer transforms and formats using symbols/patters to find the start and end of a piece of text easily and formats it
 */

/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
  constructor() {
    _defineProperty(this, "transformers", []);
  }

  /**
   * define the symbol and the transformer
   * Add a transformer to transform code when formatting text
   * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
   */
  addTransformer(params) {
    this.transformers.push(Object.assign({
      recursive: true,
      open: params.symbol,
      close: params.symbol || params.open,
      padding: true,
      validate: text => true
    }, params));
  }
  /**
   * slower than format but supports regex
   * much simpler
   */


  formatRegex(text) {
    let pos = 0;
    let lastPos = 0;
    let io = [];

    function normalizePattern(pattern) {
      return pattern instanceof RegExp ? pattern.source : pattern.replace(/(.)/, "\\$1");
    }

    while (pos < text.length) {
      let anyMatched = this.transformers.some(transformer => {
        let matcher = new RegExp(`^${normalizePattern(transformer.open)}(.+?)${normalizePattern(transformer.close)}`);
        let [raw, matchedText] = matcher.exec(text.slice(pos)) || [null, null];

        if (raw && matchedText && transformer.validate(matchedText)) {
          io.push(text.slice(lastPos, pos));
          lastPos = pos;
          let transformed = transformer.transformer(matchedText); // temporary
          // if(transformer.recursive) {
          //   transformed = this.formatRegex(transformed)
          // }

          pos += raw.length;

          if (transformer.padding) {
            let close = new RegExp(normalizePattern(transformer.close));

            if (close.test(text[pos])) {
              pos += 1;
              return false;
            }
          }

          io.push(transformed);
          lastPos = pos;
          return true;
        } else {
          return false;
        }
      });

      if (!anyMatched) {
        pos += 1;
      }
    }

    io.push(text.slice(lastPos, pos));
    lastPos = pos;
    return io.join('');
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
      return text.startsWith(string, pos + offset);
    } // next char until a symbol is matched


    function untilSymbol(symbol) {
      // while(!accept(symbol) && pos < text.length) {
      //   pos += 1
      // }
      let i = text.indexOf(symbol, pos);

      if (i < 0) {
        pos = text.length;
      } else {
        pos = i;
      }
    }

    function slice_to_io() {
      io.push(text.slice(lastSlice, pos));
      lastSlice = pos;
    }

    while (pos < text.length) {
      // return all transformers that start with the current char
      let matches = this.transformers.filter(transformer => {
        if (typeof transformer.open === "string") {
          return text.indexOf(transformer.open, pos) === pos;
        } else {
          return true;
        }
      });

      if (matches.length > 0) {
        const matched = matches.some(match => {
          const {
            name,
            open,
            close,
            transformer,
            padding,
            validate,
            recursive
          } = match; // todo: remove

          if (open instanceof RegExp || close instanceof RegExp) {
            let matcher = new RegExp(`^${open instanceof RegExp ? open.source : open}(.+?)${close instanceof RegExp ? close.source : close}`);
            let rmatch = matcher.exec(text); // console.log(matcher, rmatch)

            if (rmatch && rmatch[1] && validate(rmatch[1])) {
              pos += rmatch[0].length;
              io.push(transformer(rmatch[1]));
              lastSlice = pos;
            }

            return false;
          }

          if (accept(open)) {
            pos += open.length;
            let fromPos = pos;
            let toPos = pos;
            untilSymbol(close); // make sure the next symbol does not also match the current one
            // this stops `*italic**hi*` from working and makes sure there needs to be a different char inbetween
            // fixes bugs

            if (padding) {
              while (accept(close, 1)) {
                pos += open.length + 1;
                untilSymbol(close);
              }
            }

            toPos = pos;
            let matchedText = text.slice(fromPos, toPos);

            if (validate(matchedText)) {
              if (accept(close)) {
                let parsed = transformer(matchedText);

                if (recursive) {
                  parsed = this.format(parsed);
                }

                io.push(parsed);
                pos += close.length;
                lastSlice = pos;
                return true;
              } else {
                return false;
              }
            } else {
              pos = fromPos;
              return false;
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