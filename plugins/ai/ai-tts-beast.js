export default {
	run: async (m, {
		text,
		conn
	}) => {
		if (!text) return m.reply('naon kang?');
		try {
			await m.reply('*r e c o r d i n g. . .*')
			var response = (await axios.post(API('xzn', 'api/tts', {}, 'apikey'), {
				text,
				voice: 'Mr. Beast'
			})).data
			if (response.status !== 200) return m.reply(response)
			conn.sendFile(m.chat, response.url, "", "", m, true)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.\n' + e)
		};
	},
	help: ['beast', 'mrbeast'],
	command: ['beast', 'mrbeast'],
	tags: ['tools', 'ai']
}