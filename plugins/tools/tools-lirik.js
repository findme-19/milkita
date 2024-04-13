export default {
	help: ['lirik', 'readtrack'],
	command: ['lirik', 'readtrack'],
	tags: ['tools'],
	desc: `musiklirik`,
	disabled: false,
	run: async (m, {
		conn,
		text,
		command,
		usedPrefix: _p
	}) => {
		if (!text) return m.reply('what?')
		let c
		if (command == "lirik") {
			c = await axios.post(API('xzn', 'api/musiksearch', {}, 'apikey'), {
				search: text
			})
			//if (c.data.status) return m.reply(c.data)
			if (!c.data.header) return m.reply(c.data)
			if (c.data.header.status_code !== 200) return m.reply(c.data.header.hint || 'not found')
			let teks = "*_LIRIK SEARCH_*\n\n"
			for (let yosh of c.data.body.track_list) {
				teks += "* Id: " + yosh.track_id + "\n"
				teks += "* Title: " + yosh.track_name + "\n"
				teks += "* Artist: " + yosh.artis_name + "\n"
				teks += "* Cover: " + Object.values(yosh.album_converart.shift())[0] + "\n\n"
				teks += "> Read track : " + _p + "readtrack" + " " + yosh.track_id + "\n\n\n"
			}
			teks += "\nPowered by skizo.tech"
			m.reply(teks)
		} else {
			c = await axios.post(API('xzn', 'api/read-track', {}, 'apikey'), {
				id: text
			})
			if (!c.data.header) return m.reply(c.data)
			if (c.data.header.status_code !== 200) return m.reply('not found')
			let pros = "*_READ TRACK_*\n\n"
			pros += "* Language: " + c.data.body.lyrics_language + "\n"
			pros += "* Track Name: " + c.data.matcher_track.body.track_name + "\n"
			pros += "* Copyright: " + c.data.body.lyrics_copyright + "\n"
			pros += "* Lyrics: \n\n" + c.data.body.lyrics_body + "\n\n"
			pros += "\nPowered by skizo.tech"
			m.reply(pros)
		}
	}
}