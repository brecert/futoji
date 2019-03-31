import Formatter from '../src/formatter'

import { expect } from 'chai' 

describe('Formatter', function() {
  let markdown = new Formatter()
  let openClose = new Formatter()
  let validator = new Formatter()

  it('should be created', function() {
    expect(markdown).to.exist
    expect(openClose).to.exist
  })

  describe('#addFormat()', function() {
    it('should add the transformer to the formatter', function() {
      markdown.addTransformer({
        name: 'italic',
        symbol: '*',
        transformer: text => `<i>${text}</i>`
      })
      expect(markdown.transformers).to.have.lengthOf(1)
    })

    it('should add a non recursive ', function() {
      markdown.addTransformer({
        name: 'block',
        symbol: '`',
        recursive: false,
        transformer: text => `<code>${text}</code>`
      })
      expect(markdown.transformers.filter(t => t.name === 'block')[0].recursive).to.equal(false)
    })

    it('should add a transformer that opens', function() {
      openClose.addTransformer({
        name: "tilda",
        open: "~",
        transformer: text => `[tilda:${text}]`
      })
    })

    it('should add a transformer that opens and closes', function() {
      openClose.addTransformer({
        name: "emoji",
        open: '<',
        close: '>',
        transformer: text => `[emoji:${text}]`
      })
    })

    it('should add a transformer that closes with a space', function() {
      openClose.addTransformer({
        name: "header",
        open: '#',
        close: ' ',
        transformer: text => `[header:${text}]`
      })
    })

    it('should add a colliding transformer that closes with a space', function() {
      openClose.addTransformer({
        name: "green",
        open: '> ',
        close: ' ',
        transformer: text => `[green:${text}]`
      })
    })

    it('should add a transformer that has a validator', function() {
      validator.addTransformer({
        name: "emoji_name",
        symbol: ':',
        validate: text => /^[A-Z,a-z]+$/.test(text),
        transformer: text => `<@${text}>`
      })
    })

    it('should add a transformer that uses regex', function() {
      markdown.addTransformer({
        name: 'header',
        open: /#{1,6} /,
        close: /\n/,
        transformer: text => `<h1>${text.trim()}</h1>`
      })
    })
  })

  describe('#format()', function() {
    it('should format', function() {
      expect(markdown.format('*italic text*')).to.equal('<i>italic text</i>')
    })

    it('should format with normal text', function() {
      expect(markdown.format('normal text *italic text*')).to.equal('normal text <i>italic text</i>')
    })

    it('should format with different transformers', function() {
      expect(markdown.format('`block text`')).to.equal('<code>block text</code>')
    })

    it('should not format recursively if recursive is not enabled', function() {
      expect(markdown.format('`block text *not italic text*`')).to.equal('<code>block text *not italic text*</code>')
    })

    it('should format using open', function() {
      expect(openClose.format('~stuff~')).to.equal('[tilda:stuff]')
    })

    it('should format using open and close', function() {
      expect(openClose.format('<smile>')).to.equal('[emoji:smile]')
    })

    it('should format using open and close recursively', function() {
      expect(openClose.format('<smile~stuff~>')).to.equal('[emoji:smile[tilda:stuff]]')
      expect(openClose.format('~stuff<smile>~')).to.equal('[tilda:stuff[emoji:smile]]')
      expect(openClose.format('<~smile stuff~>')).to.equal('[emoji:[tilda:smile stuff]]')
    })

    it('should format using close with a space', function() {
      expect(openClose.format('#title')).to.equal('#title')
      expect(openClose.format('#title ')).to.equal('[header:title]')
    })

    it('should format with a colliding transformer that closes with a space', function() {
      expect(openClose.format('> message ')).to.equal('[green:message]')
      expect(openClose.format('<smile> > message ')).to.equal('[emoji:smile] [green:message]')    
    })

    it('should not format with a colliding transformer that closes with a space', function() {
      expect(openClose.format('>message')).to.equal('>message')
      expect(openClose.format('> message')).to.equal('> message')
      expect(openClose.format('>message ')).to.equal('>message ')

      expect(openClose.format('<smile>> message ')).to.equal('<smile>> message ')    
    })

    it('should format with a validator', function() {
      expect(validator.format(':cake:')).to.equal('<@cake>')
      expect(validator.format(': :cake: :')).to.equal(': <@cake> :')
    })

    it('should not format with a validator', function() {
      expect(validator.format(':large_cake:')).to.equal(':large_cake:')
    })

    it('should format using regex', function() {
      expect(markdown.format('### hi\n')).to.equal('<h1>hi</h1>')
    })
  })

  describe('#formatRegex()', function() {
    it('should formatRegex', function() {
      expect(markdown.formatRegex('*italic text*')).to.equal('<i>italic text</i>')
    })

    it('should formatRegex with normal text', function() {
      expect(markdown.formatRegex('normal text *italic text*')).to.equal('normal text <i>italic text</i>')
    })

    it('should formatRegex with different transformers', function() {
      expect(markdown.formatRegex('`block text`')).to.equal('<code>block text</code>')
    })

    it('should not formatRegex recursively if recursive is not enabled', function() {
      expect(markdown.formatRegex('`block text *not italic text*`')).to.equal('<code>block text *not italic text*</code>')
    })

    it('should formatRegex using open', function() {
      expect(openClose.formatRegex('~stuff~')).to.equal('[tilda:stuff]')
    })

    it('should formatRegex using open and close', function() {
      expect(openClose.formatRegex('<smile>')).to.equal('[emoji:smile]')
    })

    it('should formatRegex using open and close recursively', function() {
      expect(openClose.formatRegex('<smile~stuff~>')).to.equal('[emoji:smile[tilda:stuff]]')
      expect(openClose.formatRegex('~stuff<smile>~')).to.equal('[tilda:stuff[emoji:smile]]')
      expect(openClose.formatRegex('<~smile stuff~>')).to.equal('[emoji:[tilda:smile stuff]]')
    })

    it('should formatRegex using close with a space', function() {
      expect(openClose.formatRegex('#title')).to.equal('#title')
      expect(openClose.formatRegex('#title ')).to.equal('[header:title]')
    })

    it('should formatRegex with a colliding transformer that closes with a space', function() {
      expect(openClose.formatRegex('> message ')).to.equal('[green:message]')
      expect(openClose.formatRegex('<smile> > message ')).to.equal('[emoji:smile] [green:message]')    
    })

    it('should not formatRegex with a colliding transformer that closes with a space', function() {
      expect(openClose.formatRegex('>message')).to.equal('>message')
      expect(openClose.formatRegex('> message')).to.equal('> message')
      expect(openClose.formatRegex('>message ')).to.equal('>message ')

      expect(openClose.formatRegex('<smile>> message ')).to.equal('<smile>> message ')    
    })

    it('should formatRegex with a validator', function() {
      expect(validator.formatRegex(':cake:')).to.equal('<@cake>')
      expect(validator.formatRegex(': :cake: :')).to.equal(': <@cake> :')
    })

    it('should not formatRegex with a validator', function() {
      expect(validator.formatRegex(':large_cake:')).to.equal(':large_cake:')
    })

    it('should formatRegex using regex', function() {
      expect(markdown.formatRegex('### hi\n')).to.equal('<h1>hi</h1>')
    })
  })
})