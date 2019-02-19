import Formatter from '../src/formatter'

import { expect } from 'chai' 

describe('Formatter', function() {
  let formatter = new Formatter()
  it('should be created', function() {
    expect(formatter).to.exist
  })

  describe('#addFormat()', function() {
    it('should add the format to formatter', function() {
      formatter.addFormat('italic', '*', text => `<i>${text}</i>`)
      expect(formatter.formatters).to.have.lengthOf(1)
    })
  })

  describe('#format()', function() {
    it('should format italic', function() {
      expect(formatter.format('*italic text*')).to.equal('<i>italic text</i>')
    })

    it('should format italic and normal text', function() {
      expect(formatter.format('normal text *italic text*')).to.equal('normal text <i>italic text</i>')
    })
  })
})