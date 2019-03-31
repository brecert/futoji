import Benchmark from 'benchmark'
import Futoji from '../src/index'

const suite = new Benchmark.Suite

let futoji = new Futoji

futoji.addTransformer({
  name: 'custom emoji',
  symbol: ':',
  recursive: false,
  transformer: text => {
    const split = text.split('&');
    if (!split || split.length <= 1) return `:${text}:`;
    const url = split[split.length - 1].slice(4);
    return `<url=${url}>`
  }
})

futoji.addTransformer({
  name: 'bold-and-italic',
  symbol: '***',
  transformer: text => `<strong><em>${text}</em></strong>`
})

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

futoji.addTransformer({
  name: 'underline',
  symbol: '__',
  transformer: text => `<u>${text}</u>`
})

futoji.addTransformer({
  name: 'italic',
  symbol: '_',
  transformer: text => `<em>${text}</em>`
})

futoji.addTransformer({
  name: 'srike',
  symbol: '~~',
  transformer: text => `<s>${text.trim()}</s>`
})

futoji.addTransformer({
  name: 'code-block',
  symbol: '```',
  recursive: false,
  transformer: text => `<div class="codeblock"><code>${text.trim()}</code></div>`,
})

futoji.addTransformer({
  name: 'code',
  symbol: '`',
  recursive: false,
  transformer: text => `<code>${text}</code>`,
})


const text = '**bold** _italic_ _italic**bold_italic**_ :emoji_name: ***bold_and_italic*** ~~strike~~ `code` ~~not bal~ * ` ~~ ** wajds *-3 32'

suite
.add('Formatter#format', function() {
  futoji.format(text)
})
.add('Formatter#formatRegex', function() {
  futoji.formatRegex(text)
})
.on('cycle', function(event: any) {
  console.log(String(event.target));
})
.on('complete', function(this: any) {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });