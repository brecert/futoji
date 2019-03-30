import { RequireAtLeastOne, Merge } from 'type-fest';

/**
 * A transformer transforms what is found between the symbols
 */
interface Transformer {

  /**
   * note: currently unused 
   */
  name: string

  /**
   * The symbols to match to start matching a transformation
   */
  open: string

  /**
   * The symbols to match to stop matching a transformation 
   */
  close: string

  /**
   * If the transformed text is to be transformed again
   */
  recursive: boolean

  /**
   * The function to validate if the text should be transformed
   * if the validation is false the result will be ignored
   */
  validate: (text: string) => boolean

  /**
   * The function to transform the text into something else
   */
  transformer: (text: string) => string
}

type TransformerOptions = Merge<Transformer, {
  /**
   * @depricated
   * please use open instead, symbol is depricated
   */
  symbol?: string

  /**
   * The symbols to match to start matching a transformation
   */
  open?: string

  /**
   * The symbols to match to stop matching a transformation 
   */
  close?: string

   /**
   * The function to validate if the text should be transformed
   * if the validation is false the result will be ignored
   */
  validate?: (text: string) => boolean

  /**
   * If the transformed text is to be transformed again
   */
  recursive?: boolean
}>

/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
  transformers: Transformer[] = []

  /**
   * Define the symbol and the transformer
   * Add a transformer to transform code when formatting text
   * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
   */
  addTransformer(params: TransformerOptions) {
    this.transformers.push(Object.assign({
      recursive: true,
      open: <string>(params.symbol),
      close: <string>(params.symbol || params.open),
      validate: (text: string) => true
    }, params))
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
      return string.split('').every((char, i) => {
        return text[pt + i] === char
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

      // return all transformers that start with the current char
      let matches = this.transformers.filter(transformer => {
        return transformer.open.startsWith(text[pos])
      })

      if(matches.length > 0) {
        let matched = matches.some(match => {
          let { name, open, close, transformer, validate, recursive } = match
          if(accept(open)) {
            pos += open.length

            let fromPos = pos
            let toPos = pos

            untilSymbol(close)

            // make sure the next symbol does not also match the current one
            // this stops `*italic**hi*` from working and makes sure there needs to be a different char inbetween
            // fixes bugs
            while(accept(close, 1)) {
              pos += open.length + 1
              untilSymbol(close)
            }

            toPos = pos
            let matchedText = text.slice(fromPos, toPos)

            if(accept(close) && validate(matchedText)) {
              let parsed = transformer(matchedText)

              if(recursive) {
                parsed = this.format(parsed)
              }

              io.push(parsed)

              pos += close.length
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