var handler = async m => m.reply(`
╭─「 Donasi 」
│ • DANA [082331033919]
│ • SHOPEEPAY [082331033919]
│ • OVO [tidak terdaftar]
╰────
╭─「 Hubungi 」
│ > Ingin donasi? Wa.me/6282331033919
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['']
handler.command = /^dona(te|si)$/i

module.exports = handler