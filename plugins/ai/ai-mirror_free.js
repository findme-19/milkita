import uploadFile from '../../lib/uploadFile.js';
export default {
  run: async (m, {
    text,
		conn,
		usedPrefix: _p,
		command
  }) => {
    if (!text) throw 'Input Style Contoh ' + _p + command + " anime_2d"
    var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		try {
		  await m.reply('*p r o c e s s i n g. . .*')
		  var img = /image/.test(mime) ? await q.download() : null
			if (!img) return m.reply('reply or send image with caption ' + _p + command)
			var response = (await axios.post(API('xzn', 'api/mirror', {}, 'apikey'), {
				url: await uploadFile(img),
				filter: text
			}))
			if (!response.data.generated_image_addresses) return m.reply(response.data)
			conn.sendFile(m.chat, response.data.generated_image_addresses[0], "", " powered by skizoasia.xyz", m)
			log(response.data)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.\n' + e)
		};
  },
  help: ['mirror'],
	command: ['mirror'],
	tags: ['tools', 'ai']
}