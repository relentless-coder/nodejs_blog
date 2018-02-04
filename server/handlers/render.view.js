import ejs from 'ejs';

export const renderView = (path, data)=>{
    const viewDirectory = './client/';
    return new Promise((resolve, reject) => {
        ejs.renderFile(`${viewDirectory}${path}`, data, (err, str)=>{
            if(err) {
                reject(err);
            } else
                resolve(str);
        });
    });
};
