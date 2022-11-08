import { readTextFile, readMdFile, writeTxtFile, writeMdFile, readLineByLine } from './file-handling'
import fs from 'fs'
import path from 'path'
import readline from "readline";

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
        const data = fs.readFileSync(htmlFile, 'utf8');
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
        expect(data).toStrictEqual(testData);
    })

    test("check if valid md file is written properly", async () => {
        const fileName = path.basename("./test/markdownTest.md");
        const htmlFile = await writeMdFile(fileName, ["this line has no bolded text", "this line has **bolded** text.", "this **line** has **alternating** bolded **text**.", "---", "**this entire line should be bolded**. "], "FR");
        const data = fs.readFileSync(htmlFile, 'utf8');
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
        expect(data).toStrictEqual(testData);
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
