/**
 * Upload image to uguu.se
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * @param {Buffer} buffer Image Buffer
 */
var uploadImage = async buffer => {
	var tipe = await import('file-type');
	var { ext, mime } = (await tipe.fileTypeFromBuffer(buffer)) || {};

	var form = new former();
	form.append("file", buffer, 'tmp.' + ext);

	try {
		var response = await fetch("https://tmpfiles.org/api/v1/upload", {
			method: "POST",
			body: form
		});

		var data = await response.json();
		console.log(data);

		var ew = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url);
		return 'https://tmpfiles.org/dl/' + ew[1];
	} catch (e) {
		throw e;
	}
};

export default uploadImage;
