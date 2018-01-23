import {upload} from '../config/multer.config';


function uploadHandler() {
	return (req, res, key) => {
		const uploadName = upload.file(key);

		return new Promise((resolve, reject) => {
			uploadName(req, (err) => {
				if (err)
					reject(err);
				else {
					let files = [];
					if (req.files) {
						req.files.forEach((file) => {
							files.push(file.path);
						});
						req.body.gallery = files;
					}

					resolve(req);
				}

			});
		});
	};
}

export default uploadHandler();