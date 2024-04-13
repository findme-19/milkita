let handler = async (m, {
	conn,
	text,
	args,
	usedPrefix: prefix,
	command
}) => {
	let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	if (!args[0]) return m.reply('linknya mana gan?')
	conn.room = conn.room ? conn.room : {}
	if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(args[0])) {
		let id = 'dl_' + m.sender
		if (id in conn.room) return m.reply('Kamu Masih Mendownload!')
		conn.room[id] = true
		m.reply('*_please wait..._*')
		if (/^.*tiktok/i.test(args[0])) {
			try {
				let {
					data,
					code,
					msg
				} = await tiktokDl(args[0])
				if (code !== 0) throw msg
				if (data?.images?.length) {
					for (let x = 0; x < data.images.length; x++) {
						let capt = x == 0 ? data.title : ''
						await conn.sendMessage(m.chat, {
							image: {
								url: data.images[x]
							},
							caption: capt
						}, {
							quoted: m
						})
					}
				} else {
					let vid = data.play
					let desc = `${formatK(data.digg_count)} Likes, ${formatK(data.comment_count)} Comments. TikTok video from ${data.author.nickname} (@${data.author.unique_id}): "${data.title}". ${data.music_info.title}.`
					await conn.sendFile(m.chat, vid, '', desc, m)
				}
			} catch (e) {
				m.reply("mana gada hoax hoax")
			} finally {
				delete conn.room[id]
			}
		} else if (/^.*instagram.com\/(p|reel|tv)/i.test(args[0])) {
			try {
				let response = await fetch(API('xzn', 'api/ig', {
					url: args[0]
				}, 'apikey'))
				let wtf = await response.json()
				for (var i of wtf) {
					await conn.sendFile(m.chat, i.url, "", "",m)
					await delay(1500)
				}
			} catch (e) {
				console.error(e)
				throw e.toString()
			} finally {
				delete conn.room[id]
			}
		} else if (rx.test(args[0])) {
			try {
				let response = await fetch(API('xzn', 'api/y2mate', {
					url: args[0]
				}, 'apikey'))
				let wtf = await response.json()
				if (args[1] == "audio") {
					var a = await getbuffer(Object.values(wtf.audio).getRandom().url)
					conn.sendFile(m.chat, a)
				} else {
					let url = wtf.video["360p"] ? wtf.video["360p"] : wtf.video["240p"] ? wtf.video["240p"] : wtf.video["144p"] ? wtf.video["144p"] : null
					if (!url) return m.reply("can't download video now, try again later")
					var a = await getbuffer(url.url)
					conn.sendFile(m.chat, a, "", `quality: ${url.quality}\nsize: ${url.fileSieH}`, m)
				}
			} catch (e) {
				throw e.toString()
			} finally {
				delete conn.room[id]
			}
		} else if (/^.*(fb.watch|facebook.com|fb.gg)/i.test(args[0])) {
			try {
				var api_facebook = await (await fetch(API('xzn', 'api/facebook', {
					url: args[0]
				}, 'apikey'))).json();
				for (var i of api_facebook) {
					await conn.sendFile(m.chat, i.url, "", "",m)
					await delay(1500)
				}
			} catch (error) {
				console.error(error);
				throw error.toString()
			} finally {
				delete conn.room[id]
			}
		} else {
			m.reply('*your link not supported yet.*\n\nnow only supported for this link\n\n1. Tiktok\n2. Instagram\n3. Youtube\n4. Facebook')
			delete conn.room[id]
		}
	} else {
		m.reply('apa cuba')
	}
}

handler.help = handler.command = ['download', 'dl']
handler.tags = "downloader"
module.exports = handler

async function tiktokDl(url) {
	let xzn = await fetch(API('xzn', 'api/tiktok', {
		url
	}, 'apikey'))
	let wtf = xzn.json();
	return wtf
}

function formatK(num) {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(num)
}