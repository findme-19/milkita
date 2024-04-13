var regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
var handler = async (m, {
	args,
	usedPrefix,
	command
}) => {

	if (!args[0]) throw 'link githubnya mana? contoh: https://github.com/Ghost19-ui/family100/'

	if (!regex.test(args[0])) throw 'link salah!'

	var [, user, repo] = args[0].match(regex) || []
	repo = repo.replace(/.git$/, '')
	var url = `https://api.github.com/repos/${user}/${repo}/zipball`
	var filename = (await fetch(url, {
		method: 'HEAD'
	})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
	// 'attachment; filename=Nurutomo-wabot-aq-v2.5.1-251-g836cccd.zip'
	m.reply(`*Mohon tunggu, sedang mengirim repository..*`)
	conn.sendFile(m.chat, url, filename, null, m)

}
handler.help = ['gitclone <url>']
handler.tags = ['downloader']
handler.command = /gitclone/i

handler.limit = 2

module.exports = handler