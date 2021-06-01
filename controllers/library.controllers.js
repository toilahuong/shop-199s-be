const { google } = require('googleapis');
const formidable = require('formidable');
const fs = require('fs');
const CLIENT_ID  = '488748839605-1j3n0q1iqejta56n1j0ua5osgumt3q17.apps.googleusercontent.com';
const CLIENT_SECRET  = 'Ob0t_xJmKRzWhbTxwa9j0pqf';
const REDIRECT_URI  = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN  = '1//04uxpQlwUsSqmCgYIARAAGAQSNwF-L9Ir2iRXZoF9ZU6icjwLoW6IU1dPCTZgJkQAbj2COHZsqGbBAVVirx790tPcDRB0WrmiVhU';
const FOLDER_ID = '1wu62GSsfmZfXwNpEOvh-R2GDFMh97z--';
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});


const db = require('../models/index');
const slug = require('slug');
const sharp = require('sharp');
const { default: axios } = require('axios');
const Library = db.library;

exports.uploadImages = async (req,res) => {
    try {
        const form = formidable({ multiples: true });
 
        var images = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                let math = ["image/png", "image/jpeg"];
                if (math.indexOf(files.upload.type) === -1) reject('lỗi');
                files.upload.originalName = files.upload.name.split('.')[0];
                resolve(files);
            }); 
        });
        const response = await uploadFile(images.upload);
        if(!response) throw 'Lỗi';
        const data = await generatePublicUrl(response.id);
        const lib = await Library.create({
            name: `${Date.now()}-${slug(images.upload.originalName)}.jpg`,
            drive_id: response.id,
            url: data.webContentLink
        })

        return res.status(200).json(lib);
    } catch (error) {
        console.log(error)
    }
    
}
exports.getFile = async (req,res) => {
    try {
        const lib = await Library.findAll({order: [['id', 'DESC']],limit: 20});
        return res.status(200).json(lib);
    } catch (error) {
        return res.status(400).json(error);
    }
}
exports.resize = async (req,res) => {
  try {
    const width = req.params.width ? parseInt(req.params.width) : 'full';
    const height = req.params.height ? parseInt(req.params.height) : 'full';
    const id = req.params.id;
    const data = await generatePublicUrl(id); 
    console.log(data);
    const response = await resizeImage(width,height,data.webContentLink);
    res.set('Content-Type', 'image/jpeg');
    return res.send(response);
  } catch (err) {
    console.log(err)
    return res.json(err);
  }
}
function resizeImage (width,height,url) {
  return new Promise(async (resolve,reject) => {
    const imageResponse = await axios({url: url, responseType: 'arraybuffer'})
    const buffer = Buffer.from(imageResponse.data, 'binary')
    if (width === 'full' || height === 'full') {
      sharp(buffer)
        .jpeg({ mozjpeg: true })
        .toBuffer()
        .then( data => { resolve(data) })
        .catch( err => { reject(err) });
    } else {
      sharp(buffer)
        .resize(width,height)
        .jpeg({ mozjpeg: true })
        .toBuffer()
        .then( data => { resolve(data) })
        .catch( err => { reject(err) });
    }     
  });
}
function uploadFile(image) {
    return new Promise(async (resolve,reject) => {
        try {
            const response = await drive.files.create({
                requestBody: {
                  name: image.name, //This can be name of your choice
                  mimeType: image.type,
                  parents: [FOLDER_ID]
                },
                media: {
                  mimeType: image.type,
                  body: fs.createReadStream(image.path),
                },
            });
      
          resolve(response.data)
        } catch (error) {
          reject(error);
        }
    })
    
  }

  async function deleteFile(fileId) {
    try {
      const response = await drive.files.delete({
        fileId: fileId,
      });
      return {
        data: response.data,
        status: response.status
      }
    } catch (error) {
      return (error);
    }
  }

  async function generatePublicUrl(fileId) {
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      return result.data;
    } catch (error) {
      return error;
    }
  }


  // thumbail: reSizeImage(result.public_id, 150, 150),
  // medium: reSizeImage(result.public_id, 300, 300),
  // large: reSizeImage(result.public_id, 1024, 1024),
  // full: reSizeImage(result.public_id)