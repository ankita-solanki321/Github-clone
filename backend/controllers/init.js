const fs = require("fs").promises;// used to create file
const path = require("path");

async function initRepo()  {
   const repoPath = path.resolve(process.cwd(), ".apnaGit");//.apnaGit = hidden folder name ,, process.cwd() = gives the current directory
   const commitsPath=  path.join(repoPath , "commits"); ///nesting

   try{
    await fs.mkdir(repoPath, {recursive :true});
    await fs.mkdir(commitsPath , {recursive : true});

    //LAST JO CHIZ HUI THI WO KBH HUI THI 
    await fs.writeFile(
         path.join(repoPath, "config.json"),  
        JSON.stringify({ bucket: process.env.S3_BUCKET}) 
    );
    console.log("REPOSITORY INITIALISED");

   }catch(err){
        console.error("Error initialising repository");
   }

    
}
module.exports = {initRepo};