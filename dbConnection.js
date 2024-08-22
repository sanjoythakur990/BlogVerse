const mongoose= require('mongoose')
const cli= require('cli-color')

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log(cli.blueBright.bold("mongodb connected successfully"));
}).catch((err)=>{
    console.log(cli.redBright(err));
})