export default {
	run: async (m, {
		text,
		conn
	}) => {
		if (!text) return m.reply('naon kang?');
		try {
			await m.reply('*w r i t i n g. . .*')
			var response = (await axios.post(API('xzn', 'api/simi', {}, 'apikey'), {
				text
			})).data
			if (!response.result) return m.reply(response)
			var {
				id
			} = await conn.reply(m.chat, response.result, m)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.' + e)
		};
	},
	help: ['simi', 'simsimi'],
	command: ['simi', 'simsimi'],
	tags: ['tools', 'ai']
}