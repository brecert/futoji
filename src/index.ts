import Formatter from './formatter'

let futoji = new Formatter()

export default futoji
export { Formatter }

// let format = new Formatter()

// format.addFormat('bold', '**', txt => `bold(${txt})`)
// format.addFormat('italic', '*', txt => `italic[${txt}]`)

// let formatted = format.format(`
// *italic with similar syntax*
// **what why it work now**
// **uh oh**
// **italic *in* bold**
// *bold **in** italic*
// `)
/*
italic[italic with similar syntax]
bold(what why it work now)
bold(uh oh)
bold(italic italic[in] bold)
italic[bold bold(in) italic]
*/