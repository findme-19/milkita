import uploadFile from '../../lib/uploadFile.js';
export default {
	run: async (m, {
		text,
		conn
	}) => {
		var mesek = text && m.quoted ? (m.quoted.text ? text + '\n\n' + m.quoted.text : text) : text ? text : (m.quoted ? (m.quoted.text ? m.quoted.text : false) : false);
		if (!mesek) throw 'Hallo, can I help you?';
		var body = text.replace(/\s+/g, '+')
		conn.bard = conn.bard ? conn.bard : {
			last_answer: 0
		}
		var game = db.data.users[m.sender].game
		if (!game.bard) game.bard = {
			is_first: true,
			ids: {}
		}
		var q = m.quoted ? m.quoted : m
		var mime = (q.msg || q).mimetype || q.mediaType || ''
		var delayTime = 5 * 1000; // Delay in milliseconds
		var timeElapsed = Date.now() - conn.bard.last_answer;
		var remainingTime = Math.max(delayTime - timeElapsed, 0);
		await delay(remainingTime)
		try {
			await m.reply('*w r i t i n g. . .*')
			var img = /image/.test(mime) ? await q.download() : null
			var response = (await axios.post(API('xzn', 'api/gemini', {}, 'apikey'), {
				cookie: global.cookie.gemini,
				text: mesek,
				...game.bard.ids,
				...(/image/.test(mime) ? {
					url_img: await uploadFile(img)
				} : {})
			})).data
			if (!response.content) return m.reply(response)
			log(response)
			game.bard.ids = response.ids
			if (!game.bard.is_first) clearTimeout(game.bard.expired)

			game.bard.is_first = false
			game.bard.expired = setTimeout(v => {
				clearTimeout(game.bard.expired)
				delete game.bard
			}, 5 * 60 * 1000)
			conn.bard.last_answer = Date.now()
			var {
				id
			} = await conn.reply(m.chat, response.content, m)
			if (response.images?.length) {
				for (let me of response.images) {
					await delay(5000)
					let tesk = `${me.tag}\n\n${me.info.source}`
					await conn.sendFile(m.chat, me.url, "", tesk, m)
				}
			}
			game.bard.id = id
		} catch (e) {
			log(e);
			m.reply('oops, an error occured.' + e)
		};
	},
	help: ['bard', 'ba', 'gemini'],
	command: ['bard', 'ba', 'gemini'],
	tags: ['tools', 'ai']
}