const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`

const uploadImage = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_product")

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    const result = await dataResponse.json()
    
    if (result.error) {
        throw new Error(result.error.message || 'Upload failed')
    }
    
    return result.secure_url || result.url

}

export default uploadImage
