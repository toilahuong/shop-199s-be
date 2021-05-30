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
exports.uploadImages = async (req,res) => {
    try {
        const form = formidable({ multiples: true });
 
        var images = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            }); 
        });
        const response = await uploadFile(images.upload);
        const data = await generatePublicUrl(response.id);
        return res.status(200).json({url: data.webContentLink});
    } catch (error) {
        console.log(error)
    }
    
}


  async function uploadFile(image) {
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
  
      return response.data;
    } catch (error) {
      return error;
    }
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
