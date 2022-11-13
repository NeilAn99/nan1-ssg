import { readTextFile, readMdFile, readLineByLine } from './file-handling'
import fs from 'fs'
import path from 'path'
import readline from "readline";
import showdown from "showdown";

//this function will write to a file from a text file
function writeTxtFile(input, result, lang) {
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
      if (htmlFile) {
        res(templateHTML);
      } else {
        rej("error");
      }
    });
  }

function writeMdFile(input, result, lang) {
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
  
      if (htmlFile) {
        res(templateHTML);
      } else {
        rej("error");
      }
    });
  }

describe("file handling tests", () =>
{
    test("check if valid text file is read properly", async () => {
        const arrayData = await readTextFile("./test/hello.txt");
        const testData = ["hello", "hi", "goodbye"];
        expect(arrayData).toEqual(expect.arrayContaining(testData));
    })

    test("check if invalid text file is handled properly", async () => {
        await expect(readTextFile("./test/markdownTest.md")).rejects.toEqual('not a text file');
    })

    test("check if valid md file is read properly", async () => {
        const arrayData = await readMdFile("./test/markdownTest.md");
        const testData = ["this line has no bolded text", "this line has **bolded** text.", "this **line** has **alternating** bolded **text**.", "---", "**this entire line should be bolded**. "];
        expect(arrayData).toEqual(expect.arrayContaining(testData));
    })

    test("check if invalid md file is handled properly", async () => {
        await expect(readMdFile("./test/hello.txt")).rejects.toEqual('not a md file');
    })

    test("check if valid text file is written properly", async () => {
        const fileName = path.basename("./test/hello.txt");
        const htmlFile = await writeTxtFile(fileName, ["hello", "hi", "goodbye"], "FR");
        const testData = 
`
  <!doctype html>
  <html lang="FR">
  <head>
      <meta charset="utf-8">
      <title>hello</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="../src/style.css">
  </head>
  <body>
      <p>hello</p>
	<p>hi</p>
	<p>goodbye</p>

  </body>
  </html>
              `;
        expect(htmlFile).toStrictEqual(testData);
    })

    test("check if valid md file is written properly", async () => {
        const fileName = path.basename("./test/markdownTest.md");
        const htmlFile = await writeMdFile(fileName, ["this line has no bolded text", "this line has **bolded** text.", "this **line** has **alternating** bolded **text**.", "---", "**this entire line should be bolded**. "], "FR");
        const testData = 
`
  <!doctype html>
  <html lang="FR">
  <head>
      <meta charset="utf-8">
      <title>markdownTest</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="../src/style.css">
  </head>
  <body>
      <p>this line has no bolded text<br />
this line has <strong>bolded</strong> text.</p>
<h2 id="this-line-has-alternating-bolded-text">this <strong>line</strong> has <strong>alternating</strong> bolded <strong>text</strong>.</h2>
<p><strong>this entire line should be bolded</strong>. </p>
  </body>
  </html>
              `;
        expect(htmlFile).toStrictEqual(testData);
    })

    test("check if valid text file line is read properly", async () => {
        const theFile = fs.createReadStream("./test/hello.txt");
        const line = readline.createInterface({
          input: theFile,
        });
        const lineData = await readLineByLine("txt", line);
        const testData = ["hello", "\n", "hi", "\n", "goodbye"];
        expect(lineData).toStrictEqual(testData);
    })

    test("check if valid md file line is read properly", async () => {
        const theFile = fs.createReadStream("./test/markdownTest.md");
        const line = readline.createInterface({
          input: theFile,
        });
        const lineData = await readLineByLine("txt", line);
        const testData = ["this line has no bolded text", "this line has **bolded** text.", "\n", "this **line** has **alternating** bolded **text**.", "\n", "---", "\n", "**this entire line should be bolded**. ", "\n"];
        expect(lineData).toStrictEqual(testData);
    })

    test("check if invalid file type returns empty array", async () => {
        const theFile = fs.createReadStream("./test/hello.txt");
        const line = readline.createInterface({
          input: theFile,
        });
        const lineData = await readLineByLine("doc", line);
        const testData = [];
        expect(lineData).toStrictEqual(testData);
    })
})
