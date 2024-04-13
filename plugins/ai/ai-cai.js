export default {
	run: async (m, {
		text,
		conn
	}) => {
		if (!text) return m.reply('naon kang?');
		var game = db.data.users[m.sender].game
		if (!game.cai) game.cai = {
			sessionId: false
		}
		try {
			await m.reply('*w r i t i n g. . .*')
			var response = (await axios.post(API('xzn', 'api/cai/chat', {}, 'apikey'), {
				text,
				token: cookie.cai,
				characterId: "KpPL_mmsF1Xoavr03sTC9fdblOpcRDNp5JIH86w0qW0", // karakter ce ai (HUTAWO)
				...(game.cai.sessionId ? {
					sessionId: game.cai.sessionId
				} : {})
			})).data
			if (response.success !== true) return m.reply(response)
			game.cai.sessionId = response.result.sessionId
			var {
				id
			} = await conn.reply(m.chat, response.result.text, m)
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.' + e)
		};
	},
	help: ['cai'],
	command: ['cai'],
	tags: ['tools', 'ai']
}