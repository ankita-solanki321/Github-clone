const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");

const yargs = require('yargs');
const {hideBin} = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const {pushRepo} = require("./controllers/push");
const {pullRepo} = require("./controllers/pull");
const {revertRepo} = require("./controllers/revert");

dotenv.config(); //this enables the values written in .env file 

yargs(hideBin(process.argv))
   .command("start" ,"start a server" ,{},startServer)
   .command("init" , "Intialise a new repository" ,{}, initRepo)


   .command("add <file>" , "Add a file to the repository" ,
    (yargs)=>{
        yargs.positional("file" ,{
            describe:"file to add to staging area",
            type:"string",
        });
    },
    (argv) => {
        addRepo(argv.file);
    }
)

    .command("commit <message>" , "commit the staged files" ,
    (yargs)=>{
        yargs.positional("message" ,{
            describe:"commit message",
            type:"string",
        });
    },
(argv) =>{
    commitRepo(argv.message);
}
)

    .command("push", "push commit to S3", {} , pushRepo)
    .command("pull", "pull commit to S3", {} , pullRepo)

    .command("revert <commitId>" , "Revert to a specific commit" ,
        (yargs)=>{
            yargs.positional("commmitId" ,{
                describe:"commit Id to revert to",
                type: "string",
            });
        },
        (argv) =>{
    revertRepo(argv.commitId);
}
    )

   .demandCommand(1 , "you need at least one command")
   .help().argv;

   function startServer(){
    const app = express();
    const port =  process.env.PORT || 30000; //These platforms automatically assign a port and store it in process.env.PORT. If you hardcode 3000 your app will crash on their server! ❌

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;
    mongoose.connect(mongoURI).then(() => console.log("MongoDb Connected!")).catch((err) => console.error("unable to connect:" ,err));
   }