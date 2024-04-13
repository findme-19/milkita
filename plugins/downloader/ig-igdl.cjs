var handler = async (m, {
	text,
	conn
}) => {
	if (!text) throw 'Perihal Apah?'
	var url = text.replace(/\s+/g, '+')
	try {
		var response = await fetch(API('xzn', 'api/ig', {
			url
		}, 'apikey'))
		var wtf = await response.json()
		for (var i of wtf) {
			await conn.sendFile(m.chat, i.url, "", "",m)
			await delay(1500)
		}
	} catch (e) {
		console.error(e)
		throw e.toString()
	}
}
handler.help = handler.command = ['igdl']
handler.tags = ['instagram', 'downloader']

module.exports = handler