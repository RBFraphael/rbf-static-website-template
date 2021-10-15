const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { log, error: logError } = console;
const pjson = require("../package.json");
const chalk = require("chalk");
const process = require("process");

const workingPath = path.resolve(path.dirname(__dirname), "__build");
const srcPath = path.resolve(path.dirname(__dirname));
const fileName = `${pjson.name}-${pjson.version}.zip`;
const filePath = path.resolve(srcPath, fileName);

log(`${chalk.yellowBright("Building your project...")}`);

if(fs.existsSync(workingPath)){
    shell.rm("-rf", workingPath);
}

if(fs.existsSync(filePath)){
    shell.rm("-rf", filePath);
}

shell.mkdir(workingPath);
shell.cp("-r", path.resolve(srcPath, "*"), workingPath);

var exclude = ['build', '__build', 'cache', 'node_modules', 'src', '*.js', '*.json', '*.md', '*.zip'];
exclude.forEach((e, i) => { shell.rm("-rf", path.resolve(workingPath, e)); });

fs.readdirSync(workingPath, (err, files) => {
    if(err){
        console.error("Couldn't list the directory", err);
        process.exit(1);
    }

    var dict = {
        '<common-footer></common-footer>': path.join(workingPath, "common-footer.html"),
        '<common-footer/>': path.join(workingPath, "common-footer.html"),
        '<common-header></common-header>': path.join(workingPath, "common-header.html"),
        '<common-header/>': path.join(workingPath, "common-header.html"),
        '<site-footer></site-footer>': path.join(workingPath, "footer.html"),
        '<site-footer/>': path.join(workingPath, "footer.html"),
        '<site-head></site-head>': path.join(workingPath, "head.html"),
        '<site-head/>': path.join(workingPath, "head.html"),
    };

    files.forEach((file, index) => {
        if(file.split(".").pop() == "html"){
            var filePath = path.join(workingPath, file);
        }
    });
});

const output = fs.createWriteStream(filePath);
const archive = archiver("zip", {
    zlib: {
        level: 9
    }
});

output.on("close", () => {
    shell.rm("-rf", workingPath);
    var fileSize = ((archive.pointer()/1000)/1000).toFixed(1);
    log(`${chalk.blueBright("Final zip file created with " + fileSize + "MB")}`);
    log(`${chalk.blueBright("You can find your final ZIP file here: " + filePath)}`);
    log(`${chalk.greenBright("Done! :-)")}`);
});
output.on('end', function() {
    console.log('Data has been drained');
});
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        logError(err);
    } else {
        throw err;
    }
});
archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);
archive.directory(workingPath, pjson.name);
archive.finalize();