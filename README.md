# futoji
**a simple open/close text transformer**

## Example Usage
```js
import futoji from 'futoji'
// or
// import { Formatter } from 'futoji'
// const futoji = new Formatter()

futoji.addTransformer({
  name: 'bold', 
  symbol: '**',
  transformer: text => `<strong>${text}</strong>`
})

futoji.addTransformer({
  name: 'italic', 
  symbol: '*',
  transformer: text => `<em>${text}</em>`
})

let formatted = futoji.format(`
  normal text
  *italic text*
  **bold text**
  **bold *italic* bold**
  *italic **bold** italic*
`)
// becomes
/*

  normal text
  <em>italic text</em>
  <strong>bold<em>italic</em>bold</strong>
  <em>italic <strong>bold</strong> italic</em>

*/
```