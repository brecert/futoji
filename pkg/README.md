# futoji
**a simple open/close text transformer**

## Example Usage
```js
import Formatter from 'futoji'
let futoji = new Formatter()

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

## Example with open and close
```js
futoji.addTransformer({
  name: 'green',
  open: '>',
  close: '\n'
  transformer: text => (`<span class="green">${text}</span>`)
})

futoji.format(`
  > thing
  normal
  > greeeeen
  > stuff
  normal also
`)
// becomes
/*

  <span class="green"> thing</span>
  normal
  <span class="green"> greeeeen</span>
  <span class="green"> stuff</span>
  normal also

*/
```