export default {
	run: async (m, {
		text,
		conn
	}) => {
		if (!text) return m.reply('hutawo?');
		try {
			await m.reply('*s e a r c h i n g. . .*')
			var response = (await axios.post(API('xzn', 'api/cai/search', {}, 'apikey'), {
				name: text,
				token: cookie.cai
			})).data
			if (response.success !== true) return m.reply(response)
			let teks = "*_CAI SEARCH_*\n\n"
			for (let yosh of response.result) {
				teks += "* Title: " + yosh.title + "\n"
				teks += "* Character: " + yosh.participant__name + "\n"
				teks += "* Character Id: " + yosh.external_id + "\n"
				teks += "* Greeting: \n\n" + yosh.greeting + "\n\n"
			}
			teks += "\nPowered by skizoasia.xyz"
			var {
				id
			} = await conn.reply(m.chat, teks, m)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.' + e)
		};
	},
	help: ['caisearch'],
	command: ['caisearch'],
	tags: ['tools', 'ai']
}