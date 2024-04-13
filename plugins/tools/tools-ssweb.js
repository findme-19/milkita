export default {
	help: ['ssweb', 'ss'],
	command: ['ssweb', 'ss'],
	tags: ['tools'],
	desc: `Screnshoot site`,
	disabled: false,
	run: async (m, {
		conn,
		text
	}) => {

		let [u, t] = text.split(" ")
		if (!u) return m.reply(`Silahkan masukan url

contoh: #ssweb google.com f
list:
* f = full
* m = mobile
* d = desktop
* i = iPad`)

		if (!t) t = "m"

		let url;

		if (u.startsWith("https")) {
			url = u;
		} else if (u.startsWith("http")) {
			url = u;
		} else {
			url = "https://" + u;
		}
		await m.reply(`*P r o c e s s i n g. . .*`)
		switch (t) {

			// full
			case 'f':
				try {
					var get = await axios.get(API('xzn', 'api/ssweb', {
						url,
						type: 'custom',
						fullpage: 1,
						width: 2048,
						height: 2048
					}, 'apikey'), {
						responseType: 'arraybuffer'
					})
					var res = get.data
					if (get.headers['content-type'] !== 'image/png') return m.reply('gagal dalam mengambil screenshot')
					if (res) {
						conn.sendFile(m.chat, res, "", `*SCRENSHOOT WEBSITE*

Type: Full Page
Url: ${url}
`, m)
					} else {
						log(res)
						m.reply(`Terjadi kesalahan`)
					}
				} catch (e) {
					m.reply('error' + e);
				}
				break

				// mobile
			case 'm':
				try {
					var get = await axios.get(API('xzn', 'api/ssweb', {
						url,
						type: 'custom',
						fullpage: 0,
						width: 720,
						height: 1600
					}, 'apikey'), {
						responseType: 'arraybuffer'
					})
					var res = get.data
					if (get.headers['content-type'] !== 'image/png') return m.reply('gagal dalam mengambil screenshot')
					if (res) {
						conn.sendFile(m.chat, res, "", `*SCRENSHOOT WEBSITE*

Type: Mobile Page
Url: ${url}
`, m)
					} else {
						log(res)
						m.reply(`Terjadi kesalahan`)
					}
				} catch (e) {}
				break

				// desktop
			case 'd':
				try {
					var get = await axios.get(API('xzn', 'api/ssweb', {
						url,
						type: 'custom',
						fullpage: 0,
						width: 1280,
						height: 1280
					}, 'apikey'), {
						responseType: 'arraybuffer'
					})
					var res = get.data
					if (get.headers['content-type'] !== 'image/png') return m.reply('gagal dalam mengambil screenshot')
					if (res) {
						conn.sendFile(m.chat, res, "", `*SCRENSHOOT WEBSITE*

Type: Desktop Page
Url: ${url}
`, m)
					} else {
						log(res)
						m.reply(`Terjadi kesalahan`)
					}
				} catch (e) {
					m.reply('error')
				}
				break

			case 'i':
				try {
					var get = await axios.get(API('xzn', 'api/ssweb', {
						url,
						type: 'custom',
						fullpage: 0,
						width: 2048,
						height: 2732
					}, 'apikey'), {
						responseType: 'arraybuffer'
					})
					log(get.data)
					var res = get.data
					if (get.headers['content-type'] !== 'image/png') return m.reply('gagal dalam mengambil screenshot')
					if (res) {
						conn.sendFile(m.chat, res, "", `*SCRENSHOOT WEBSITE*

Type: Ipad
Url: ${url}
`, m)
					} else {
						log(res)
						m.reply(`Terjadi kesalahan`)
					}
				} catch (e) {
					m.reply('error')
				}
				break
			default:
				m.reply(`*LIST TIPE*
f = full
m = mobile
d = desktop
i = iPad

contoh: #ssweb google.com f`)
				break
		}
		// end
	}
}