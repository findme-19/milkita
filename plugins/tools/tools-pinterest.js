export default {
	help: ['pin', 'pinterest'],
	command: ['pin', 'pinterest'],
	tags: ['tools'],
	desc: `pinterest search`,
	disabled: false,
	run: async (m, {
		conn,
		text
	}) => {
		if (!text) return m.reply('search?')
		var c = await axios.get(API('xzn', 'api/pinterest', {
			search: text
		}, 'apikey'))
		if (c.data.status !== 200) return m.reply(c.data)
		let find = c.data.data.getRandom()
		conn.sendFile(m.chat, find.media.url, "", find.title, m)
	}
}