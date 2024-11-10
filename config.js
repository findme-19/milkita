import fs, {
	watchFile,
	unwatchFile
} from 'fs'
import {
	fileTypeFromBuffer,
	fileTypeStream
} from 'file-type'
import chalk from 'chalk'
import {
	fileURLToPath
} from 'url'
import {
	protoType,
	serialize
} from './lib/simple.js';
import moment from 'moment-timezone'
import md5 from 'md5';
global.md5 = md5;
global.fromBuffer = fileTypeFromBuffer
global.stream = fileTypeStream
global.moment = moment
global.ram_usage = 60000000000 // 600 MB in this example [Ram Limiter (if your server ram is 1GB put 900MB in bytes, later the server will auto restart before using 1GB ram)] // work on VPS
global.cache_used = 1000000000 // 1 GB in this example [Cached Limiter (if your server ram is 1GB put 900MB in bytes, later the server will auto clear Cache before using 1GB Cached)] // work on VPS
/*============= WAKTU =============*/
global.owner = [
	['628xxxxxxxxxx', 'YourName', true]
	// [number, dia creator/owner?, dia developer?]
] // Put your number here
global.cookie = {
	bing: '', // join channel buat dapatin cookie bing chat
	gemini: {
		'__Secure-1PSID': '' // join channel buat cara dapatin cookie gemini
	},
	cai: "" // join channel buat cara dapatin token ce ai
}
global.mods = [] // Want some help?
global.prems = [] // Premium user has unlimited limit
global.self = true // nganu
global.packname = ''
global.author = ''
global.wm = ''
global.no_wallet = ''
global.nomorown = ""
global.nomorbot = "" // nomer buat bot (login via kode)
global.xznkey = '' // chat atmin buat dapetin apikeynya skizoasia.xyz/pricing
global.profil = fs.readFileSync("./src/profil.jpg")
global.anunya = fs.readFileSync("./src/anunya.jpg")
global.log = function log() {
	var args = [].slice.call(arguments);
	console.log.apply(console, args);
}
global.APIs = { // API Prefix
	// name: 'https://website'
	xzn: 'https://skizoasia.xyz/',
}
global.APIKeys = { // APIKey Here
	// 'https://website': 'apikey'
	'https://skizoasia.xyz/': xznkey
}
global.multiplier = 69
// Function untuk menghitung keuntungan berdasarkan persentase
global.getbuffer = async function getBuffer(url, options) {
	try {
		options ? options : {}
		var res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'User-Agent': 'GoogleBot',
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
protoType();
// profit via persentase
var file = fileURLToPath(
	import.meta.url)
watchFile(file, () => {
	unwatchFile(file)
	console.log(chalk.redBright("Update 'config.js'"))
	import(`${file}?update=${Date.now()}`)
})

function ucapan() {
	var time = moment.tz('Asia/Jakarta').format('HH')
	var res
	res = tiny("Selamat pagi ")
	if (time >= 4) {
		res = tiny("Selamat pagi ")
	}
	if (time > 10) {
		res = tiny("Selamat siang ")
	}
	if (time >= 15) {
		res = tiny("Selamat sore ")
	}
	if (time >= 18) {
		res = tiny("Selamat malam ")
	}
	return res
}

// Message filter
var usedCommandRecently = new Set()

/**
 * Check is number filtered.
 * @param {String} from 
 * @returns {Boolean}
 */
global.isFiltered = (from) => {
	return !!usedCommandRecently.has(from)
}

/**
 * Add number to filter.
 * @param {String} from 
 */
global.addFilter = (from) => {
	usedCommandRecently.add(from)
	setTimeout(() => {
		return usedCommandRecently.delete(from)
	}, 3000) // 5 seconds delay, I don't recommend below that.
}

global.thumb = async function thumb(url, text, attribute) {
	return {
		mediaType: 1,
		description: '',
		title: text && text.length > 0 ? text[0] : "",
		mediaUrl: "",
		body: text && text.length > 1 ? text[1] : "",
		thumbnailUrl: "",
		thumbnail: Buffer.isBuffer(url) ? url : { url },
		sourceUrl: Buffer.isBuffer(url) ? '' : attribute.length > 2 ? url : '',
		showAdAttribution: attribute && attribute.length > 0 ? attribute[0] : false, // false
		renderLargerThumbnail: attribute && attribute.length > 1 ? attribute[1] : false // false
	}
}

global.pmenus = ["乂", "◈", "➭", "ଓ", "⟆•", "⳻", "•", "↬", "◈", "⭑", "ᯬ", "◉", "᭻", "»", "〆", "々", "⛥", "✗", "⚜", "⚚", "♪"].getRandom()
global.htjava = ["乂", "⛶", "❏", "⫹⫺", "☰", "⎔", "✦", "⭔", "⬟", "⛊", "⚝"].getRandom()
global.cmenut = htjava + "───『"
global.cmenuh = "』───" + htjava
global.cmenub = "│" + pmenus
global.cmenuf = "╰──────────⳹"
global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO LIMIT/FREE ON MENU.JS

global.sa = '╭─'
global.gx = '│✇'
global.gy = '│•'
global.gz = '│'
global.sb = '╰────࿐'
global.kki = '「'
global.kka = '」'
global.zt = '*'
global.zc = ''
