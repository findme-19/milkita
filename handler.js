import {
	smsg
} from './lib/simple.js'
import {
	plugins
} from './lib/plugins.js'
import {
	format
} from 'util'
import {
	fileURLToPath
} from 'url'
import path, {
	join
} from 'path'
import {
	unwatchFile,
	watchFile
} from 'fs'
import chalk from 'chalk'
import Connection from './lib/connection.js'
import printMessage from './lib/print.js'
import Helper from './lib/helper.js'
import db, {
	loadDatabase
} from './lib/database.js'
import Queque from './lib/queque.js'

/** @type {import('@adiwajshing/baileys')} */
var {
	getContentType,
	proto,
	WAMessageStubType
} = (await import('@adiwajshing/baileys')).default

var isNumber = x => typeof x === 'number' && !isNaN(x)
/**
 * Handle messages upsert
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} chatUpdate
 */
export async function handler(chatUpdate) {
	this.msgqueque = this.msgqueque || new Queque()
	if (!chatUpdate)
		return
	var m = chatUpdate.messages[chatUpdate.messages.length - 1]
	if (!m)
		return
	if (db.data == null)
		await loadDatabase()
	try {
		m = smsg(this, m) || m
		if (!m)
			return
		m.exp = 0
		m.limit = false
		try {
			// TODO: use loop to insert data instead of this
			var user = db.data.users[m.sender]
			if (typeof user !== 'object')
				db.data.users[m.sender] = {}
			if (user) {
				if (!('game' in user))
					user.game = {}
				if (!('premium' in user))
					user.premium = false
				if (!('expired' in user))
					user.expired = 0
			} else
				db.data.users[m.sender] = {
					game: {},
					premium: false,
					expired: 0
				}
			var chat = db.data.chats[m.chat]
			if (typeof chat !== 'object')
				db.data.chats[m.chat] = {}
			if (chat) {
				if (!('isBanned' in chat))
					chat.isBanned = false
				if (!('sWelcome' in chat))
					chat.sWelcome = ''
				if (!('sBye' in chat))
					chat.sBye = ''
				if (!('sPromote' in chat))
					chat.sPromote = ''
				if (!('sDemote' in chat))
					chat.sDemote = ''
			} else
				db.data.chats[m.chat] = {
					isBanned: false,
					sWelcome: '',
					sBye: '',
					sPromote: '',
					sDemote: '',
				}
			var settings = db.data.settings[this.user.jid]
			if (typeof settings !== 'object') db.data.settings[this.user.jid] = {}
			if (settings) {
				if (!('self' in settings)) settings.self = false
				if (!('maintenance' in settings)) settings.maintenance = []
			} else
				db.data.settings[this.user.jid] = {
					self: false,
					maintenance: []
				}
		} catch (e) {
			console.error(e)
		}
		if (!m)
			return
		if (opts['nyimak'])
			return
		if (!m.fromMe && opts['self'])
			return
		if (opts['pc'] && m.chat.endsWith('g.us'))
			return
		if (opts['gc'] && !m.chat.endsWith('g.us'))
			return
		if (opts['sw'] && m.chat !== 'status@broadcast')
			return
		if (m.chat == 'status@broadcast')
			return
		if (typeof m.text !== 'string')
			m.text = ''

		var isROwner = [this.decodeJid(this.user.id), ...global.owner.filter(([id, isCreator, name]) => id && isCreator && name).map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
		var isOwner = [this.decodeJid(this.user.id), ...global.owner.map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || m.fromMe
		var settinge = db.data.settings[this.user.jid]
		var isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
		var isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || db.data.users[m.sender].premium

		if (m.isBaileys && !m.fromMe)
			return
		if (opts['queque'] && m.text && !m.fromMe && !(isMods || isPrems)) {
			var id = m.id
			this.msgqueque.add(id)
			await this.msgqueque.waitQueue(id)
		}

		if (m.isBaileys)
			return
		m.exp += Math.ceil(Math.random() * 10)
		if (!isOwner && settinge.self)
			return
		if (!isOwner && global.self)
			return
		if (!isOwner && opts['self'])
			return
		var usedPrefix
		var _user = db.data?.users?.[m.sender]

		var groupMetadata = (m.isGroup ? await Connection.store.fetchGroupMetadata(m.chat, this.groupMetadata) : {}) || {}
		var participants = (m.isGroup ? groupMetadata.participants : []) || []
		var user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {} // User Data
		var bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
		var isRAdmin = user?.admin == 'superadmin' || false
		var isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
		var isBotAdmin = bot?.admin || false // Are you Admin?
		var users = db.data.users[m.sender],
			chats = db.data.chats[m.chat],
			settinge = db.data.settings[this.user.jid]
		var ___dirname = path.join(path.dirname(fileURLToPath(
			import.meta.url)), './plugins')
		for (var name in plugins) {
			var plugin
			if (typeof plugins[name].run === 'function') {
				//log(name)
				//log(plugins[name])
				var ai = plugins[name]
				plugin = ai.run;
				// Spread the properties from 'ai' except 'run'
				for (var prop in ai) {
					if (prop !== 'run') {
						plugin[prop] = ai[prop];
					}
				}
				//log(plugin)
			} else {
				plugin = plugins[name]
			}
			if (!plugin)
				continue
			if (plugin.disabled)
				continue
			var __filename = join(___dirname, name)
			if (typeof plugin.all === 'function') {
				try {
					m.isCommand = false
					await plugin.all.call(this, m, {
						match,
						conn: this,
						participants,
						groupMetadata,
						user,
						bot,
						isROwner,
						isOwner,
						isRAdmin,
						isAdmin,
						isBotAdmin,
						isPrems,
						chatUpdate,
						__dirname: ___dirname,
						__filename
					})
				} catch (e) {
					// if (typeof e === 'string') continue
					console.error(e)
					for (var [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
						var data = (await this.onWhatsApp(jid))[0] || {}
						if (data.exists)
							m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
					}
				}
			}
			/*if (!opts['restrict'])
				if (plugin.tags && plugin.tags.includes('admin')) {
					// global.dfail('restrict', m, this)
					continue
				}*/
			var str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
			var _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
			var match = (_prefix instanceof RegExp ? // RegExp Mode?
				[
					[_prefix.exec(m.text), _prefix]
				] :
				Array.isArray(_prefix) ? // Array?
				_prefix.map(p => {
					var re = p instanceof RegExp ? // RegExp in Array?
						p :
						new RegExp(str2Regex(p))
					return [re.exec(m.text), re]
				}) :
				typeof _prefix === 'string' ? // String?
				[
					[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
				] : [
					[
						[], new RegExp
					]
				]
			).find(p => p[1])
			if (typeof plugin.before === 'function') {
				m.isCommand = false
				if (await plugin.before.call(this, m, {
						match,
						conn: this,
						participants,
						groupMetadata,
						user,
						bot,
						isROwner,
						isOwner,
						isRAdmin,
						isAdmin,
						isBotAdmin,
						isPrems,
						chatUpdate,
						__dirname: ___dirname,
						__filename
					}))
					continue
			}
			if (typeof plugin !== 'function')
				continue
			if ((usedPrefix = (match[0] || '')[0])) {
				var noPrefix = m.text.replace(usedPrefix, '')
				var [command, ...args] = noPrefix.trim().split` `.filter(v => v)
				args = args || []
				var _args = noPrefix.trim().split` `.slice(1)
				var text = _args.join` `
				command = (command || '').toLowerCase()
				var fail = plugin.fail || global.dfail // When failed
				var isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
					plugin.command.test(command) :
					Array.isArray(plugin.command) ? // Array?
					plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
						cmd.test(command) :
						cmd === command
					) :
					typeof plugin.command === 'string' ? // String?
					plugin.command === command :
					false

				if (!isAccept)
					continue
				users.hit += 1
				users.usebot = Date.now()
				console.log({
					hit: users.hit,
					prefix: usedPrefix.trim()
				})
				m.plugin = usedPrefix.trim() == '>' || usedPrefix.trim() == '=>' || usedPrefix.trim() == '$' ? usedPrefix.trim() : command
				if (m.chat in db.data.chats || m.sender in db.data.users) {
					var chat = db.data.chats[m.chat]
					var user = db.data.users[m.sender]
					//var settings = db.data.settings[this.user.jid]
					if (!['owner-unbanchat.js', 'group-info.cjs', 'owner-exec.cjs', 'owner-exec2.cjs', 'info-runtime.cjs', 'group-link.cjs', 'enable.cjs', 'tools-profile.js', 'owner-ping.js'].includes(name.split('/').pop()) && chat?.isBanned)
						return // Except this
				}
				if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
					fail('owner', m, this)
					continue
				}
				if (plugin.rowner && !isROwner) { // Real Owner
					fail('rowner', m, this)
					continue
				}
				if (plugin.owner && !isOwner) { // Number Owner
					fail('owner', m, this)
					continue
				}
				if (plugin.mods && !isMods) { // Moderator
					fail('mods', m, this)
					continue
				}
				if (plugin.premium && !isPrems) { // Premium
					fail('premium', m, this)
					continue
				}
				if (plugin.group && !m.isGroup) { // Group 
					fail('group', m, this)
					continue
				} else if (plugin.botAdmin && !isBotAdmin) { // You Admin
					fail('botAdmin', m, this)
					continue
				} else if (plugin.admin && !isAdmin) { // User Admin
					fail('admin', m, this)
					continue
				}
				if (plugin.private && m.isGroup) { // Private Chat 
					fail('private', m, this)
					continue
				}
				if (plugin.register == true && _user.registered == false) { // Butuh daftar?
					fail('unreg', m, this)
					continue
				}
				/* if (xp > 200)
				     m.reply('Ngecit -_-') // Hehehe
				 else*/
				var extra = {
					match,
					usedPrefix,
					noPrefix,
					_args,
					args,
					command,
					text,
					conn: this,
					participants,
					groupMetadata,
					user,
					bot,
					isROwner,
					isOwner,
					isRAdmin,
					isAdmin,
					isBotAdmin,
					isPrems,
					chatUpdate,
					__dirname: ___dirname,
					__filename
				}
				try {
					//log({test: plugin.run, real: plugin})
					await plugin.call(this, m, extra)
					if (!isPrems)
						m.limit = m.limit || plugin.limit || false
				} catch (e) {
					// Error occured
					m.error = e
					console.error(e)
					if (e) {
						var text = format(e)
						for (var key of Object.values(global.APIKeys))
							text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
						if (e.name)
							for (var [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
								var data = (await this.onWhatsApp(jid))[0] || {}
								if (data.exists)
									m.reply(`*Plugin:* ${m.plugin}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
							}
						m.reply(text)
					}
				} finally {
					// m.reply(util.format(_user))
					if (typeof plugin.after === 'function') {
						try {
							m.isCommand = false
							await plugin.after.call(this, m, extra)
						} catch (e) {
							console.error(e)
						}
					}
					if (m.limit && m.error == null)
						m.reply(+m.limit + ' Limit terpakai')
				}
				break
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
		if (opts['queque'] && m.text) {
			var id = m.id
			this.msgqueque.unqueue(id)
		}
		//console.log(db.data.users[m.sender])
		var user, stats = db.data.stats
		if (m) {
			var stat
			if (m.plugin) {
				var now = +new Date
				if (m.plugin in stats) {
					stat = stats[m.plugin]
					if (!isNumber(stat.total))
						stat.total = 1
					if (!isNumber(stat.success))
						stat.success = m.error != null ? 0 : 1
					if (!isNumber(stat.last))
						stat.last = now
					if (!isNumber(stat.lastSuccess))
						stat.lastSuccess = m.error != null ? 0 : now
				} else
					stat = stats[m.plugin] = {
						total: 1,
						success: m.error != null ? 0 : 1,
						last: now,
						lastSuccess: m.error != null ? 0 : now
					}
				stat.total += 1
				stat.last = now
				if (m.error == null) {
					stat.success += 1
					stat.lastSuccess = now
				}
			}
		}

		try {
			if (!opts['noprint']) await printMessage(m, this)
		} catch (e) {
			console.log(m, m.quoted, e)
		}
		await this.readMessages([m.key])
		if (opts['autoread'])
			await this.readMessages([m.key])

	}
}

/**
 * Handle groups participants update
 * @this {import('./lib/connection').Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */

export async function participantsUpdate({
	id,
	participants,
	action
}) {
	if (this.isInit)
		return
	if (db.data == null)
		await loadDatabase()
	var chat = db.data.chats[id] || {}
	var text = ''
	log({
		id,
		participants,
		action
	})
	switch (action) {
		case 'add':
		case 'remove':
			if (chat.welcome) {
				var groupMetadata = await Connection.store.fetchGroupMetadata(id, this.groupMetadata)
				for (var user of participants) {
					var pp = profil
					try {
						pp = await this.profilePictureUrl(user, 'image')
					} catch (e) {} finally {
						text = (action === 'add' ? (chat.sWelcome || this.welcome || Connection.conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || 'unknow') :
							(chat.sBye || this.bye || Connection.conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
						this.reply(id, text, null, {
							contextInfo: {
								mentionedJid: [user],
								externalAdReply: await thumb(pp, ['welcome baby', 'have a nice day'], [true, true])
							}
						})
					}
				}
			}
			break
		case 'promote':
			text = (chat.sPromote || this.spromote || Connection.conn.spromote || '@user ```is now Admin```')
		case 'demote':
			if (!text)
				text = (chat.sDemote || this.sdemote || Connection.conn.sdemote || '@user ```is no longer Admin```')
			text = text.replace('@user', '@' + participants[0].split('@')[0])
			if (chat.detect)
				this.sendMessage(id, {
					text,
					mentions: this.parseMention(text)
				})
			break
	}
}

global.dfail = (type, m, conn) => {
	var msg = {
		rowner: '```Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴀᴄᴄᴇꜱꜱ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!!```',
		owner: '```apakah!!!```',
		mods: '```Oɴʟʏ ᴍᴏᴅᴇʀᴀᴛᴏʀ ᴄᴀɴ ᴀᴄᴄᴇꜱꜱ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!!```',
		premium: 'gak di bolehin atmin kaka',
		group: '```Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴅᴀᴘᴀᴛ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴜᴘ!```',
		private: '```Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴅᴀᴘᴀᴛ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ Cʜᴀᴛ Pʀɪʙᴀᴅɪ!```',
		admin: 'Pᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ *Aᴅᴍɪɴ* ɢʀᴜᴘ!',
		botAdmin: 'Jᴀᴅɪᴋᴀɴ ʙᴏᴛ ꜱᴇʙᴀɢᴀɪ *Aᴅᴍɪɴ* ᴜɴᴛᴜᴋ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ!',
		unreg: 'Sɪʟᴀʜᴋᴀɴ ᴅᴀғᴛᴀʀ ᴜɴᴛᴜᴋ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ғɪᴛᴜʀ ɪɴɪ ᴅᴇɴɢᴀɴ ᴄᴀʀᴀ ᴍᴇɴɢᴇᴛɪᴋ:\n\n*#ᴅᴀғᴛᴀʀ ɴᴀᴍᴀ.ᴜᴍᴜʀ*\n\nCᴏɴᴛᴏʜ: *#ᴅᴀғᴛᴀʀ Mᴀɴᴜꜱɪᴀ.16*',
		restrict: 'Fɪᴛᴜʀ ɪɴɪ ᴅɪ *ᴅɪꜱᴀʙʟᴇ*!'
	} [type]
	if (msg) return m.reply(msg)
}

var file = Helper.__filename(
	import.meta.url, true)
watchFile(file, async () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'handler.js'"))
	if (Connection.reload) console.log(await Connection.reload(await Connection.conn))
})