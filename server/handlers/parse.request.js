export const getReqBody = (req) => {
    let body = [];
    return new Promise((resolve, reject) => {
        if (req.body) {
            resolve(req.body);
        } else {
            req.on('error', (err) => {
                reject(err);
            }).on('data', (data) => {
                body.push(data);
            }).on('end', () => {
                resolve(JSON.parse(Buffer.concat(body).toString()));
            });
        }
    });
};