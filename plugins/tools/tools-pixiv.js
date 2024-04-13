export default {
	help: ['pixiv'],
	command: ['pixiv'],
	tags: 'tools',
	desc: `pixiv`,
	disabled: false,
	run: async (m, {
		conn,
		text
	}) => {
		if (!text) return m.reply('what?')
		const regex = /^https:\/\/www\.pixiv\.net\/([a-z]+\/)?artworks\/(\d+)$/;
		let stara = text.match(regex)
		let c
		if (stara) {
			c = await axios.get(API('xzn', 'api/pixiv/download', {
				url: text
			}, 'apikey'))
			if (c.data.status) return m.reply(c.data)
			if (c.data.length < 1) return m.reply('not found')
			for (let me of c.data) {
				let yo = await axios.get(me, {
					headers: {
						referer: "https://pixiv.net"
					},
					responseType: 'arraybuffer'
				})
				conn.sendFile(m.chat, yo.data, "", "", null)
			}
		} else {
			c = await axios.get(API('xzn', 'api/pixiv/search', {
				search: text
			}, 'apikey'))
			if (c.data.status) return m.reply(c.data)
			if (c.data.length < 1) return m.reply('not found')
			let yos = c.data.getRandom()
			let up = await axios.get(yos.url, {
				headers: {
					referer: "https://pixiv.net"
				},
				responseType: 'arraybuffer'
			})
			conn.sendFile(m.chat, up.data, "", yos.title, m)
		}
	}
}