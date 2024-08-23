const blogDataValidator=({title, textBody})=>{
    return new Promise((resolve,reject)=>{
        if(!title || !textBody) reject("Missing blog data")
        if(typeof title !== 'string') reject("Title is not a text")
        if(typeof textBody !== 'string') reject("Text Body is not a text")

        resolve()
    })
}

module.exports= blogDataValidator