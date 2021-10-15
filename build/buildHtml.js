const path = require('path');
const fs = require('fs');
const php2html = require('php2html');
const shell = require("shelljs");
const minify = require("html-minifier").minify;
const process = require("process");

const viewsPath = path.resolve(path.dirname(__dirname), "src/views");
const outputPath = path.resolve(path.dirname(__dirname));

convertFiles(viewsPath, outputPath);

function convertFiles(source, target)
{
    var files = fs.readdirSync(source);

    files.forEach((file, index) => {
        if(file.indexOf("_") != 0){
            if(fs.statSync(path.resolve(source, file)).isDirectory()){
                var sourceD = path.resolve(source, file);
                var targetD = path.resolve(target, file);
                
                if(!fs.existsSync(targetD)){
                    shell.mkdir(targetD);
                }

                convertFiles(sourceD, targetD);

                return;
            }

            if(path.extname(file).toLowerCase() == ".php"){
                var targetFile = path.resolve(target, path.basename(file, path.extname(file)) + ".html");
                php2html(path.resolve(source, file), (error, data) => {
                    if(error){
                        console.error("php2html ran into a problem", error);
                        process.exit(1);
                    }

                    if(fs.existsSync(targetFile)){
                        shell.rm("-rf", targetFile);
                    }
                    
                    shell.touch(targetFile);
                    fs.writeFileSync(targetFile, minify(data, {
                        removeAttributeQuotes: false,
                        collapseWhitespace: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }));
                });
            }
        }
    });
}