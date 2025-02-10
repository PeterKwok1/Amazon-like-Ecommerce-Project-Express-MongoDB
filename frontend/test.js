const a = ['a', 'b']
const b = `${a.map(x => `${x}`).join('\n')}`
console.log(b)