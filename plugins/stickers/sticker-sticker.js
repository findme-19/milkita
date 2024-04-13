/*import {
	default as anu
} from '../../lib/sticker.cjs';
import {
	webp2png
} from '../../lib/webp2mp4.cjs';
import {
	default as uploadFile
} from '../../lib/uploadFile.cjs';
import {
	default as uploadImage
} from '../../lib/uploadImage.cjs';
var handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	var isUrl = (text) => {
		return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
	}
	var stiker = false
	try {
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		if (/webp|image|video/g.test(mime)) {
			if (/video/g.test(mime))
				if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
			var img = await q.download?.()
			if (!img) return m.reply(`balas gambar/video/stiker dengan perintah ${usedPrefix + command}`)
			var out
			try {
				if (/webp/g.test(mime)) out = await webp2png(img)
				else if (/video/g.test(mime)) out = await uploadFile(img)
				if (!out || typeof out !== 'string') out = await uploadImage(img)
				stiker = await anu.sticker(out, global.packname, `© ${await conn.getName(m.sender)}`)
			} catch (e) {
				console.error(e)
			} finally {
				if (!stiker) stiker = await anu.sticker(img, global.packname, global.author)
			}
		} else if (args[0]) {
			if (isUrl(args[0])) stiker = await anu.sticker(args[0], global.packname, global.author)
			else return m.reply('URL tidak valid!')
		}
	} catch (e) {
		console.error(e)
		if (!stiker) stiker = e
	} finally {
		if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
		else throw 'Conversion failed'
	}
}
handler.help = ['stiker (caption|reply media)', 'stiker *url*', 'stikergif (caption|reply media)', 'stikergif *url*']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i

export default handler*/