import {upload} from '../config/multer.config';


export const uploadHandler = (req, res, key) => {
    const uploadName = upload.single(key);

    return new Promise((resolve, reject) => {
        uploadName(req, res, (err) => {
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