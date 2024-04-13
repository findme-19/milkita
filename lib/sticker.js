import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import {
	ffmpeg
} from './converter.js'
import {
	spawn
} from 'child_process'
import {
	fileURLToPath
} from 'url';
import {
	fileTypeFromBuffer
} from 'file-type';
import webp from 'node-webpmux' // Optional Feature
var __dirname = path.dirname(fileURLToPath(import.meta.url))
var tmp = path.join(__dirname, '../tmp')
import addExif from './addexif.cjs'
/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
var stiker = async (img, url) => {
	if (url) {
		img = await getbuffer(url)
	}
	var {
		ext
	} = await fileTypeFromBuffer(img)
	if (ext == 'mp4') {
		return await ffmpeg(img, [
			`-vcodec`, `libwebp`,
			`-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
		], 'mp4', 'webp')
	} else {
		return await ffmpeg(img, [
			'-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
		], 'jpeg', 'webp')
	}
}
var sticker = async (img, ...args) => {
	var s
	if (Buffer.isBuffer(img)) s = await stiker(img)
	else s = await stiker(null, img)
	return await addExif(s, ...args)
}
/**
 * Image to Sticker
 */

export {
	sticker,
	addExif
}