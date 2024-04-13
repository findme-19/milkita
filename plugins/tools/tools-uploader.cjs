var {
	sticker
} = require('../../lib/sticker.cjs');
var uploadFile = require('../../lib/uploadFile.cjs');
var uploadImage = require('../../lib/uploadImage.cjs');
var {
	webp2png
} = require('../../lib/webp2mp4.cjs');

var handler = async (m, {
	conn,
	text
}) => {
	var stiker = false
	try {
		var [packname, ...author] = text.split('|')
		author = (author || []).join('|')
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		if (/webp|image|video/g.test(mime)) {
			if (/video/g.test(mime))
				if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
			var img = await q.download?.()
			if (!img) return m.reply(`balas gambar/video/stiker dengan perintah ${usedPrefix + command}`)
			let urg = await uploadFile(img)
			return m.reply(urg)
		}
	} catch (e) {
		return m.reply("error")
	}
}
handler.help = ['tourl']
handler.tags = ['tools']
handler.command = ['tourl']

module.exports = handler