const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const fs = require('fs')
const slug = require('slug')
const db = require('../models/index');
const Library = db.library;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;
cloudinary.config({
    cloud_name: 'toilahuong',
    api_key: '866281779119939',
    api_secret: 'r5_MJGMPmhlxxNQDWZMVtyGPG8k'
});
exports.upload = async (req,res) => {
    try {
        const form = formidable({ multiples: true });
        
        var images = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                let math = ["image/png", "image/jpeg","image/gif"];
                if (math.indexOf(files.upload.type) === -1) reject('lỗi');
                files.upload.originalName = files.upload.name.split('.')[0];
                resolve(files);
            }); 
        });
        const image = await uploadImage(images.upload);
        const lib = await Library.create(image)
        return res.status(200).json(lib);
    } catch (error) {
        console.log(error)
    }
    
}
exports.delete = async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await Library.findOne({where: {id: id}});
        const result = await deleteImage(response.cloudinary_id);
        const isDestroy = await Library.destroy({where: {id: id}});
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getFileById = async(req,res) => {
    try {
        const id  = req.params.id ? parseInt(req.params.id) : null;
        if(id === null) throw "Lỗi";
        const response = await Library.findByPk(id);
        if(response.length <= 0) throw "Lỗi";
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.getFileByQuery = async(req,res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; 
        const page = req.query.page ? parseInt(req.query.page) : 1; 
        if(page <= 0) throw "Lỗi";
        const name = req.query.name || ''; 

        let query = {
            order: [['id', 'DESC']],
            where: {
                name: {
                    [Op.substring]: name
                }
            },
            offset: limit*(page-1),
            limit: limit
        };
        const response = await Library.findAll(query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const uploadImage = (file) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload(file.path, {
                public_id: `shop199s/${Date.now()}-${slug(file.originalName)}`
            })
            .then(result => {
                if (result) {
                    
                    fs.unlinkSync(file.path)
                    resolve({
                        name: file.originalName,
                        url: result.secure_url,
                        cloudinary_id: result.public_id,
                        thumbnail: reSizeImage(result.public_id, 150, 150),
                        medium: reSizeImage(result.public_id, 300, 300),
                        large: reSizeImage(result.public_id, 1024, 1024),
                    })
                }
            }).catch(err => reject(err));
    })
}

const reSizeImage = (id, h, w, q = 80) => {
    return cloudinary.url(id, {
        height: h,
        width: w,
        quality: q,
        crop: 'fill',
        format: 'jpg'
    })
}
const deleteImage = (id) => {
    return new Promise(async (resolve,reject) => {
        cloudinary.api.delete_resources(id, function(error, result){
            if(error) reject(error);
            resolve(result);
        })
    })
    
}