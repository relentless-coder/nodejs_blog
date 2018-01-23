import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!file) {
			return;
		}
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		if (!file) {
			return;
		}
		let ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + Date.now() + ext);
	}
});

export const upload = multer({storage});

