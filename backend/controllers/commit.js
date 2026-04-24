const  fs =  require("fs").promises;
const  path = require("path");
const {v4: uuidv4} = require("uuid");

async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    try{
     const commitId = uuidv4();
     const commitDir = path.join(commitPath, commitId); //same id used to make name of the folder jo folder banega uska namm similar hoga uuid  se
     await fs.mkdir(commitDir ,{recursive: true});//folder creation
    //  now staging me jo bhi files hai unhe copy karna hai iss folder me jo humne banaya hai
    const files = await fs.readdir(stagedPath); // read all the files which is in stagedpath
    //run the loop for each file and copy them
    for(const file of files){
         await fs.copyFile(
            path.join(stagedPath, file), //initial path
            path.join(commitDir, file)  //final path jaha copy hogii
         );
    }
     // now we make json file which tracks that which file made at where and at what time
     await fs.writeFile(path.join(commitDir , "commit.json") ,
    JSON.stringify({message ,date: new Date().toISOString() }) //JSON.stringify is used to coonvert js object into json formate into string type
);
console.log(`Commit ${commitId} created with message: ${message}`);
    }
    catch(err){
        console.error("Error commiting Files: " , err);

    }

}
module.exports = { commitRepo };