import {
	JSDOM
} from 'jsdom'
import cheerio from 'cheerio';
async function webp2mp4(source) {
	var form = new former()
	var isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	form.append('new-image-url', isUrl ? source : '')
	form.append('new-image', isUrl ? '' : source, 'image.webp')
	var res = await axios.request("https://ezgif.com/webp-to-gif", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders()
		}
	})
	var {
		document
	} = new JSDOM(res.data).window
	var obj = {}
	var form2 = new former()
	for (var input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await axios.request('https://ezgif.com/webp-to-gif/' + obj.file, {
		method: "POST",
		data: form2.getBuffer(),
		headers: {
			...form2.getHeaders()
		}
	})
	var akhir = cheerio.load(res2.data)
	return "https:" + akhir("p.outfile > video > source").attr("src")
}
async function webp2gif(source) {
	var form = new former()
	var isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	form.append('new-image-url', isUrl ? source : '')
	form.append('new-image', isUrl ? '' : source, 'image.webp')
	var res = await axios.request("https://ezgif.com/webp-to-gif", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders()
		}
	})
	var {
		document
	} = new JSDOM(res.data).window
	var obj = {}
	var form2 = new former()
	for (var input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await axios.request('https://ezgif.com/webp-to-gif/' + obj.file, {
		method: "POST",
		data: form2.getBuffer(),
		headers: {
			...form2.getHeaders()
		}
	})
	var akhir = cheerio.load(res2.data)
	return "https:" + akhir("p.outfile > img").attr("src")
}
async function webp2png(source) {
	var form = new former()
	var isUrl = typeof source === 'string' && /https?:\/\//.test(source)
	form.append('new-image-url', isUrl ? source : '')
	form.append('new-image', isUrl ? '' : source, 'image.webp')
	var res = await axios.request("https://ezgif.com/webp-to-png", {
		method: "POST",
		data: form.getBuffer(),
		headers: {
			...form.getHeaders()
		}
	})
	var {
		document
	} = new JSDOM(res.data).window
	var obj = {}
	var form2 = new former()
	for (var input of document.querySelectorAll('form input[name]')) {
		obj[input.name] = input.value
		form2.append(input.name, input.value)
	}
	var res2 = await axios.request('https://ezgif.com/webp-to-png/' + obj.file, {
		method: "POST",
		data: form2.getBuffer(),
		headers: {
			...form2.getHeaders()
		}
	})
	var akhir = cheerio.load(res2.data)
	return "https:" + akhir("p.outfile > img").attr("src")
}
export {
	webp2mp4,
	webp2png,
	webp2gif
}