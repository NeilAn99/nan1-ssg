import fs from "fs";
import path from "path";
import * as fileHandling from "./file-handling.js";

//this function will generate all the HTML files
export function generateHTML(input, lang = "") {
  const dist = "./dist";

  //to get the filename without the full pathname
  var strippedInput = path.basename(input);

  //remove the dist directory and its contents
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
  }

  //create the dist directory if not exists
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  fs.lstat(input, function (err, stats) {
    if (err) {
      console.log(err);
    } else {
      if (stats.isDirectory()) {
        fs.readdir(input, function (err, files) {
          files.forEach(function (fileName) {
            if (path.extname(fileName) == ".txt") {
              fileHandling
                .readTextFile(input + "/" + fileName)
                .then(function (result) {
                  fileHandling.writeTxtFile(fileName, result, lang);
                });
            } else if (path.extname(fileName) == ".md") {
              fileHandling
                .readMdFile(input + "/" + fileName)
                .then(function (result) {
                  fileHandling.writeMdFile(fileName, result, lang);
                });
            }
          });
          generateIndexHTML(files, true);
        });
      } else {
        if (path.extname(strippedInput) == ".txt") {
          fileHandling.readTextFile(input).then(function (result) {
            fileHandling.writeTxtFile(strippedInput, result, lang);
            generateIndexHTML(strippedInput, false);
          });
        } else if (path.extname(strippedInput) == ".md") {
          fileHandling.readMdFile(input).then(function (result) {
            fileHandling.writeMdFile(strippedInput, result, lang);
            generateIndexHTML(strippedInput, false);
          });
        }
      }
    }
  });
}

export function generateIndexHTML(input, isDir) {
  var content = "";
  var htmlFile;
  if (isDir) {
    for (var file of input) {
      htmlFile = file.substring(0, file.length - 4) + ".html";
      content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
    }
  } else {
    htmlFile = input.substring(0, input.length - 4) + ".html";
    content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
  }

  const templateHTML = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>index</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../src/style.css">
</head>
<body>
    The files are:
    <br>
    ${content}
</body>
</html>
        `;
  fs.writeFile("./dist/index.html", templateHTML, function () {});
}
