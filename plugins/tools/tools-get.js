import * as ag from 'https-proxy-agent';
var handler = async (m, {
	text
}) => {
	if (!text) throw "linknya mana?"
	try {
		var res = await axios.request(text, {
			method: 'GET',
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
			}
		})
		if (!/text|json/.test(res.headers['content-type'])) {
			if (res.headers['content-length'] > 300 * 1024 * 1024) return m.reply('gede cik filenya, donlot sendiri')
			return conn.sendFile(m.chat, text, '', text, m)
		}
		var txt = res.data
		m.reply(txt)
	} catch (e) {
		log(e)
		m.reply("error occurred")
	}
}
handler.help = ['fetch', 'get'].map(v => v + ' <url>')
handler.tags = ['tools']
handler.command = /^(fetch|get)$/i

export default handler