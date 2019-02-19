/**
 * A transformer transforms what is found between the symbols
 */
interface ITransformer {
  /**
   * note: currently unused 
   */
  name: string

  /**
   * The symbol to match when opening and closing transformation
   */
  symbol: string

  /**
   * If the transformed text is to be transformed again
   */
  recursive: boolean

  /**
   * The transform the text into something else
   */
  transformer: (text: string) => string
}

/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
  transformers: ITransformer[] = []

  /**
   * Define the symbol and the transformer
   * Add a transformer to transform code when formatting text
   * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
   */
  addTransformer(params: ITransformer) {
    this.transformers.push({...{
      recursive: true
    },...params})
  }

  /**
   * transform and format the text
   */
  format(text: string) {
    let pos = 0
    let lastSlice = 0
    let io: string[] = []

    // if the next part of the text is the string
    // todo: change to slice or something
    function accept(string: string, offset = 0) {
      let pt = pos + offset
      return string.split('').every((c, i) => {
        return text[pt + i] === c
      })
    }

    // next char until a symbol is matched
    function untilSymbol(symbol: string) {
      while(!accept(symbol) && pos < text.length) {
        pos += 1
      }
    }

    function slice_to_io() {
      io.push(text.slice(lastSlice, pos))
      lastSlice = pos
    }

    while(pos < text.length) {
      let matches = this.transformers.filter(transformer => {
        return transformer.symbol.startsWith(text[pos])
      })

      if(matches.length > 0) {
        let matched = matches.some(match => {
          let { name, symbol, transformer, recursive } = match
          if(accept(symbol)) {
            pos += symbol.length

            let fromPos = pos
            let toPos = pos

            untilSymbol(symbol)

            // make sure the next symbol does not also match the current one
            // this stops `*italic**hi*` from working and makes sure there needs to be a different char inbetween
            // fixes bugs
            while(accept(symbol, 1)) {
              pos += symbol.length + 1
              untilSymbol(symbol)
            }

            toPos = pos

            if(accept(symbol)) {
              let matchedText = text.slice(fromPos, toPos)
              let parsed = transformer(matchedText)

              if(recursive) {
                parsed = this.format(parsed)
              }

              io.push(parsed)

              pos += symbol.length
              lastSlice = pos
              return true
            }

            return false
          }
          
          return false
        })
        if(!matched) {
          pos += 1
          slice_to_io()
        }
      } else {
        pos += 1
        slice_to_io()
      }
    }
    return io.join('')
  }
}