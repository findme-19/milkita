import uploadFile from '../../lib/uploadFile.js';
export default {
	run: async (m, {
		text,
		conn,
		usedPrefix: _p,
		command
	}) => {
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		try {
			await m.reply('*p r o c e s s i n g. . .*')
			var img = /image/.test(mime) ? await q.download() : null
			if (!img) return m.reply('reply or send image with caption ' + _p + command)
			var response = (await axios.post(API('xzn', 'api/imagetoprompt', {}, 'apikey'), {
				url: await uploadFile(img)
			})).data
			if (response.status !== 200) return m.reply(response)
			conn.reply(m.chat, response.prompt + "\n\npowered by skizoasia.xyz", m)
			log(response)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.\n' + e)
		};
	},
	help: ['prompt'],
	command: ['prompt'],
	tags: ['tools', 'ai']
}