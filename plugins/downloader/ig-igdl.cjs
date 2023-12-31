var handler = async (m, {
	text,
	conn
}) => {
	if (!text) throw 'Mohon berikan URL Instagram reel yang valid'
	var url = text.replace(/\s+/g, '+')
	try {
		var response = await fetch(API('xzn', 'api/igdl', {
			url: url
		}, 'apikey'))
		var wtf = await response.json()
		for (var i = 0; i < wtf.media.length; i++) {
			var caption = i == 0 ? wtf.caption : ''
			//var type = wtf.media[i].includes('.jpg') ? 'image' : 'video'
			/*await conn.sendMessage(m.chat, {
				[type]: {
					url: wtf.media[i]
				},
				caption
			}, {
				quoted: m
			})*/
			var bf = await (await fetch(wtf.media[i])).buffer()
			conn.sendFile(m.chat, bf, '', caption, m)
			await delay(1500)
		}
	} catch (e) {
		console.error(e)
		throw e.toString()
	}
}
handler.help = handler.command = ['igdl']
handler.tags = ['downloader']

module.exports = handler