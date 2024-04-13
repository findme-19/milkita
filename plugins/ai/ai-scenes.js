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
			var response = (await axios.post(API('xzn', 'api/control-net', {}, 'apikey'), {
				url: await uploadFile(img),
				filterid: "scene102"
			}, {
				responseType: 'arraybuffer'
			}))
			if (!/image/.test(response.headers['content-type'])) return m.reply(JSON.parse(response.data.toString()))
			conn.sendFile(m.chat, response.data, "", " powered by skizo.tech", m)
			log(response.data)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.\n' + e)
		};
	},
	help: ['aiscene'],
	command: ['aiscene'],
	tags: ['tools', 'ai']
}