var handler = async (m, {
	text,
	conn
}) => {
	var delay = time => new Promise(res => setTimeout(res, time))
	if (!text) throw 'apakah sudah betul';
	var body = text.replace(/\s+/g, '+')
	try {
		var {
			data,
			code,
			msg
		} = await tiktokDl(body)
		if (code !== 0) throw msg
		if (data?.images?.length) {
			for (var x = 0; x < data.images.length; x++) {
				var capt = x == 0 ? data.title : ''
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
			var vid = data.play
			var desc = `${formatK(data.digg_count)} Likes, ${formatK(data.comment_count)} Comments. TikTok video from ${data.author.nickname} (@${data.author.unique_id}): "${data.title}". ${data.music_info.title}.`
			await conn.sendFile(m.chat, vid, '', desc, m)
		}
	} catch (e) {
		m.reply("mana gada hoax hoax")
	};
};
handler.help = ['tiktok']
handler.tags = ['downloader'];
handler.command = ['tiktok', 'ttdl', 'tt'];

module.exports = handler;
async function tiktokDl(url) {
	var xzn = await fetch(API('xzn', 'api/tiktok', {
		url
	}, 'apikey'))
	var wtf = xzn.json();
	return wtf
}

function formatK(num) {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(num)
}