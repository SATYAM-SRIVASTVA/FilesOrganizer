// let fs = require("fs");
// let path = require("path");
let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
console.log(inputArr);
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help
let command = inputArr[0];
let types={
    media : ["mp4","mkv"],
    archives :['zip','7z','rar','tar','gz','ar','iso',"xz"],
    documents :['docx','doc','pdf','xls','xlsx','odt','ods','odp','odg','odf','txt','ps','tex'],
    app : ['exe','dmg','pkg',"deb"],
}
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please🙏🙏 Enter Right Command :-)");
        break;
}
function treeFn(dirPath) {
    // let destPath;
    if (dirPath == undefined) {
        console.log("Kindly enter the path");
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath,"");
           

        } else {
            console.log("Kidly Enter the correct path")
            return;
        }

    }

}

function treeHelper(dirPath,indent){
    // is file or directory
   let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile==true){
        let fileName = path.basename(dirPath);
        console.log(indent+"|---"+ fileName);

    }else{
        let dirName=path.basename(dirPath);
        console.log(indent+"|___"+dirName);
        let children = fs.readdirSync(dirPath);
        for(let i=0;i<children.length;i++){
            let childPath=path.join(dirPath,children[i]);
            treeHelper(childPath,indent +"\t");
        }
    }
}

function organizeFn(dirPath) {
    // console.log("Organize file implemented for",dirPath);
    // 1. input -> dirPath given
    let destPath;
    if (dirPath == undefined) {
        console.log("Kindly enter the path");
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }

        } else {
            console.log("Kidly Enter the correct path")
            return;
        }

    }
    organizeHelper(dirPath, destPath);
    // 3. identify categories of all the files present in that input directory
    // 4. copy/cut files top that organized directory inside of any of category folder 

}

function organizeHelper(src, dest) {
    // 3. identify categories of all the files present in that input directory
    let childNames =fs.readdirSync(src);
    //console.log(childNames);
    for(let i=0;i<childNames.length;i++){
       let childAdrress = path.join(src,childNames[i]);
       let isFile=fs.lstatSync(childAdrress).isFile();
       if(isFile){
        //    console.log(childNames[i]);
        let category = getCategory(childNames[i]);
        console.log(childNames[i],"belongs to -->",category);
        // 4. copy/cut files top that organized directory inside of any of category folder 
        sendFiles(childAdrress,dest,category); 
    }

    }
}

function sendFiles(srcFilePath,dest,category){
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);//copy
    fs.unlinkSync(srcFilePath);//cut(remove oringinal files after copying)
    console.log(fileName,"copied to",category);
}

function getCategory(name){ 
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types){
        let currentTypeArray = types[type];
        for(let i=0;i<currentTypeArray.length;i++){
            if(ext==currentTypeArray[i]){
                return type;
            }
        }
        return "others type";
    }
}

function helpFn() {
    console.log(`
    List of all the commands :
         node main.js tree "directoryPath"
         node main.js organize "directoryPath"
         node main.js help
    `);
}
