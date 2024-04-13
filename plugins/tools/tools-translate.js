var handler = async(m, {
	text,
	conn,
	command
}) => {
	if (!text && !m.quoted) throw '*[ format translate ]*\n*#' + command + ' language code (default id)|text*\nexample: *#' + command + ' en|halo dunia*'
	var teks = m.quoted && m.quoted.text ? m.quoted.text : text ? text.split('|')[1] : text
	var language = m.quoted && m.quoted.text && text ? text : text ? text.split('|')[0] ? text.split('|')[0] : "id" : "id"
	try {
		var a = await axios.get(API('xzn', 'api/translate', {
			text: teks,
			lang: language
		}, 'apikey'))
		if (!a.data.result) throw a.data
		m.reply(a.data.result)
	} catch (e) {
		log(e)
		return m.reply('*can\'t translate it*')
	}
}
handler.help = handler.command = ['tr', 'translate']
handler.tags = ['tools']
export default handler