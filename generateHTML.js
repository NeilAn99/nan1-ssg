import fs, { read } from 'fs';
import path from 'path';
import readline from 'readline';
 
export function generateHTML(input)
{
    const dist = './dist';

    //remove the dist directory and its contents
    if (fs.existsSync(dist))
    {
        fs.rmSync(dist, { recursive: true, force: true });
    }

    //create the dist directory if not exists
    if (!fs.existsSync(dist))
    {
        fs.mkdirSync(dist);
    }
    
    fs.lstat(input, function(err, stats)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(stats);
            if (stats.isDirectory())
            {
                console.log("Dir: " + input);
                fs.readdir(input, function(err, files)
                {
                    console.log(files);
                    files.forEach(function(fileName)
                    {
                        if (path.extname(fileName) == ".txt")
                        {
                            console.log("filename" + fileName);
                            readFile(input + "/" + fileName).then(function(result)
                            {
                                writeFile(fileName, result);
                            })
                            .then(function(err)
                            {
                                console.log("testest");
                            })
                        }
                    })
                    generateIndexHTML(files, true);
                })
            }
            else
            {
                if (path.extname(input) == ".txt")
                {
                    readFile(input).then(function(result)
                    {
                        writeFile(input, result);
                        generateIndexHTML(input, false);
                    })
                    .then(function(err)
                    {
                        console.log("testest");
                    })
                }
            }
        }
    })
}

function readFile(input)
{
    return new Promise(async function(res, rej)
    {
        var lineArray = [];
        const theFile = fs.createReadStream(input);
        //console.log(theFile)
        const line = readline.createInterface(
            {
                input: theFile
            }
        );
    
        //go through the file line by line
        for await (const theLine of line)
        {
            //console.log("theline" + theLine);
            if (theLine != "")
            {
                lineArray.push(theLine);
                //console.log("concat" + lineArray);
            }
            else
            {
                lineArray.push("\n");
            }
        }
        //console.log("first" + lineArray);
        res(lineArray);    
    })
}

function writeFile(input, result)
{
    return new Promise(function(res, rej)
    {
        var content = "";
        var lineNumber = 0;
        //create the file name
        var htmlFile = './dist/' + input.substring(0, input.length-4) + '.html';

        //create the content to write
        for (var theLine of result)
        {
            if (theLine != "\n")
            {
                if (lineNumber == 0)
                {
                    content += "<p>" + theLine + "</p>\n";
                }
                else
                {
                    content += "\t<p>" + theLine + "</p>\n";
                }
            }
            else
            {
                content += "\n";
            }
            lineNumber++;
        }

        const templateHTML =
        `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Filename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    ${content}
</body>
</html>
        `

        //have to write the file contents now
        fs.writeFile(htmlFile, templateHTML, function(err)
        {
            console.log(err);
        });

        console.log("second");
        res(htmlFile);
    })
}

function generateIndexHTML(input, isDir)
{
    var content = "";
    if (isDir)
    {
        for (var file of input)
        {
            var htmlFile = input.substring(0, input.length-4) + '.html';
            var htmlFileReadable = input.substring(0, input.length-4) + '.html';
            content += `<a href="${htmlFile}"> ${htmlFileReadable} </a><br>`;
            console.log(file);
        }
    }
    else
    {
        var htmlFile = input.substring(0, input.length-4) + '.html';
        var htmlFileReadable = input.substring(0, input.length-4) + '.html';
        content += `<a href="${htmlFile}"> ${htmlFileReadable} </a><br>`;
    }

    const templateHTML =
        `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Filename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    The files are:
    <br>
    ${content}
</body>
</html>
        `
        fs.writeFile('./dist/index.html', templateHTML, function(err)
        {
            console.log(err);
        });
}