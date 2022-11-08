import fs from "fs";
import path from "path";
import readline from "readline";
import showdown from "showdown";

//this function will read a .txt file
export function readTextFile(input) {
  return new Promise(function (res, rej) {
    if (path.extname(input) == ".txt")
    {
      var lineArray = [];
      const theFile = fs.createReadStream(input);
      const line = readline.createInterface({
        input: theFile,
      });
      lineArray = readLineByLine("txt", line);
      if (lineArray) {
        res(lineArray);
      } else {
        rej("error");
      }
    }
    else
    {
      rej("not a text file");
    }
  });
}

//this function will read a .md file
export function readMdFile(input) {
  return new Promise(function (res, rej) {
    if (path.extname(input) == ".md")
    {
      var lineArray = [];
      const theFile = fs.createReadStream(input);
      const line = readline.createInterface({
        input: theFile,
      });
      lineArray = readLineByLine("md", line);
      if (lineArray) {
        res(lineArray);
      } else {
        rej("error");
      }
    }
    else
    {
      rej("not a md file");
    }
  });
}

//this function will write to a file from a text file
export function writeTxtFile(input, result, lang) {
  return new Promise(function (res, rej) {
    var content = "";
    var lineNumber = 0;
    var htmlFile = "";
    var title = "";
    //create the file name if text file or md file
    if (path.extname(input) == ".txt") {
      htmlFile = "./dist/" + input.substring(0, input.length - 4) + ".html";
      title = input.substring(0, input.length - 4);
    }

    //add the <p> tags to each line
    for (var theLine of result) {
      if (theLine != "\n") {
        //try to format the HTML file better
        if (lineNumber == 0) {
          //check if the line is an hr tag
          if (theLine == "<hr>") {
            content += theLine + "\n";
          } else {
            content += "<p>" + theLine + "</p>\n";
          }
        } else {
          if (theLine == "<hr>") {
            content += "\t" + theLine + "\n";
          } else {
            content += "\t<p>" + theLine + "</p>\n";
          }
        }
      } else {
        content += "\n";
      }
      lineNumber++;
    }

    var templateHTML = "";
    if (lang != "") {
      templateHTML = `
<!doctype html>
<html lang="${lang}">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../src/style.css">
</head>
<body>
    ${content}
</body>
</html>
            `;
    } else {
      templateHTML = `
<!doctype html>
<html lang="en-CA">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../src/style.css">
</head>
<body>
    ${content}
</body>
</html>
            `;
    }

    //write the file contents to the correct filename
    fs.writeFile(htmlFile, templateHTML, function () {});

    if (htmlFile) {
      res(htmlFile);
    } else {
      rej("error");
    }
  });
}

export function writeMdFile(input, result, lang) {
  return new Promise(function (res, rej) {
    var htmlFile = "";
    var title = "";
    //create the file name if text file or md file
    if (path.extname(input) == ".md") {
      htmlFile = "./dist/" + input.substring(0, input.length - 3) + ".html";
      title = input.substring(0, input.length - 3);
    }

    var converter = new showdown.Converter();
    converter.setFlavor("github");
    converter.setOption({
      simpleLineBreaks: "true",
      requireSpaceBeforeHeadingText: "true",
      completeHTMLDocument: "true",
    });
    var text = result.join("\n");
    var html = converter.makeHtml(text);

    var templateHTML = "";
    if (lang != "") {
      templateHTML = `
<!doctype html>
<html lang="${lang}">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../src/style.css">
</head>
<body>
    ${html}
</body>
</html>
            `;
    } else {
      templateHTML = `
<!doctype html>
<html lang="en-CA">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../src/style.css">
</head>
<body>
    ${html}
</body>
</html>
            `;
    }

    //write the file contents to the correct filename
    fs.writeFile(htmlFile, templateHTML, function () {});

    if (htmlFile) {
      res(htmlFile);
    } else {
      rej("error");
    }
  });
}

//read a file line by line
export async function readLineByLine(fileType, line) {
  var lineArray = [];
  if (fileType == "txt") {
    //go through the file line by line
    for await (const theLine of line) {
      if (theLine != "") {
        lineArray.push(theLine);
      } else {
        lineArray.push("\n");
      }
    }
  } else if (fileType == "md") {
    //go through the file line by line
    for await (const theLine of line) {
      if (theLine != "") {
        lineArray.push(theLine);
      } else {
        lineArray.push("\n");
      }
    }
  }
  return lineArray;
}
