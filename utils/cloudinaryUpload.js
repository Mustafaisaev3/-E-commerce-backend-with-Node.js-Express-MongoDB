const cloudinary = require('cloudinary')

class CloudinaryUpload {
    async uploadFile (file, folder) {
        // const fileObj = cloudinary.v2.uploader.upload_stream({resource_type: 'auto', folder: folder}, (error, result) => {
        //     console.log(result, error)
        //     if(error || !result){
        //         return error
        //     }

        //     if(result){
        //         console.log(result)
        //         return result
        //     }
        // }).end(file.buffer)

        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({resource_type: 'auto', folder: folder}, (error, result) => {
                // console.log(result, error)
                if(error || !result){
                    return reject(error)
                }
    
                if(result){
                    console.log(result)
                    return resolve(result)
                }
            }).end(file.buffer)
        });

    }

    async uploadFiles (files, folder) {
        let imagesObj = []
        for (const file of files) {            

            const cloudImgObj = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({resource_type: 'auto', folder: folder}, (error, result) => {
                    // console.log(result, error)
                    if(error || !result){
                        return reject(error)
                    }
        
                    if(result){
                        console.log(result)
                        return resolve(result)
                    }
                }).end(file.buffer)
            });

            imagesObj.push(cloudImgObj.url);
        }

        return imagesObj
        // let imagesObj = []
        // for (const file of files) {            
        //     const cloudImgObj = await cloudinary.v2.uploader.upload_stream({resource_type: 'auto', folder}, (error, result) => {
        //         console.log(result, error)
        //         if(error || !result){
        //             return error
        //         }

        //         if(result){
        //             return result
        //         }
        //     }).end(file.buffer)

        //     imagesObj.push(cloudImgObj);
        // }
        // return imagesObj
    }

}

module.exports = new CloudinaryUpload()