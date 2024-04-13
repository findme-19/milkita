process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import './config.js';
import Connection from './lib/connection.js';
import Helper from './lib/helper.js';
import db, {
	loadDatabase
} from './lib/database.js';
import clearTmp from './lib/clearTmp.js';
import {
	spawn
} from 'child_process';
import {
	protoType,
	serialize
} from './lib/simple.js';
import {
	plugins,
	loadPluginFiles,
	reload,
	pluginFolder,
	pluginFilter
} from './lib/plugins.js';
import axios from 'axios';
import fetch from 'node-fetch';
import former from 'form-data';
import fs from 'fs';
import toMs from 'ms';
import cp from 'child_process';
import {
	promisify
} from 'util';
import si from 'systeminformation';
global.former = former
//global.fetch = fetch
global.fs = fs
global.axios = axios
global.db = db
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.plugins = plugins
var PORT = process.env.PORT || process.env.SERVER_PORT || 3000
protoType()
serialize()

// Assign all the value in the Helper to global
Object.assign(global, {
	...Helper,
	timestamp: {
		start: Date.now()
	}
})


// global.opts['db'] = process.env['db']
/** @type {import('./lib/connection.js').Socket} */
global.conn = Object.defineProperty(Connection, 'conn', {
	value: await Connection.conn,
	enumerable: true,
	configurable: true,
	writable: true
}).conn
global.store = Connection.store
loadPluginFiles(pluginFolder, pluginFilter, {
		logger: conn.logger,
		recursiveRead: true
	}).then(_ => console.log(Object.keys(plugins)))
	.catch(console.error)
// load plugins
if (db.data == null) {
	await loadDatabase()
}
global.randomNomor = (min, max = null) => {
	if (max !== null) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * min) + 1
	}
}

global.toRupiah = (angka) => {
	var saldo = '';
	var angkarev = angka.toString().split('').reverse().join('');
	for (var i = 0; i < angkarev.length; i++)
		if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
	return '' + saldo.split('', saldo.length - 1).reverse().join('');
}
if (!opts['test']) {
	setInterval(async () => {
		await Promise.allSettled([
			db.data ? db.write() : Promise.reject('db.data is null'),
			(opts['autocleartmp'] || opts['cleartmp']) ? clearTmp() : Promise.resolve()
		])
		Connection.store.writeToFile(Connection.storeFile)
	}, 60 * 1000)
}
if (opts['server'])(await import('./server.js')).default(conn, PORT)

// Quick Test
async function _quickTest() {
	var test = await Promise.all([
		spawn('ffmpeg'),
		spawn('ffprobe'),
		spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
		spawn('convert'),
		spawn('magick'),
		spawn('gm'),
		spawn('find', ['--version'])
	].map(p => {
		return Promise.race([
			new Promise(resolve => {
				p.on('close', code => {
					resolve(code !== 127)
				})
			}),
			new Promise(resolve => {
				p.on('error', _ => resolve(false))
			})
		])
	}))
	var [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
	console.log(test)
	var s = global.support = {
		ffmpeg,
		ffprobe,
		ffmpegWebp,
		convert,
		magick,
		gm,
		find
	}
	// require('./lib/sticker').support = s
	Object.freeze(global.support)

	if (!s.ffmpeg)(conn?.logger || console).warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
	if (s.ffmpeg && !s.ffmpegWebp)(conn?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)')
	if (!s.convert && !s.magick && !s.gm)(conn?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}
setInterval(async () => {
	var a = await clearTmp()
	console.log(a)
}, 180000)
_quickTest()
	.then(() => (conn?.logger?.info || console.log)('Quick Test Done'))
	.catch(console.error)