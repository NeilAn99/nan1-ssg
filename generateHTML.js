import fs, { read } from 'fs';
import path from 'path';
import readline from 'readline';

//this function will generate all the HTML files
export function generateHTML(input)
{
    const dist = './dist';

    //to get the filename without the full pathname
    var strippedInput = path.basename(input);

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
            if (stats.isDirectory())
            {
                fs.readdir(input, function(err, files)
                {
                    files.forEach(function(fileName)
                    {
                        if (path.extname(fileName) == ".txt")
                        {
                            readFile(input + "/" + fileName).then(function(result)
                            {
                                writeFile(fileName, result);
                            })
                        }
                    })
                    generateIndexHTML(files, true);
                })
            }
            else
            {
                if (path.extname(strippedInput) == ".txt")
                {
                    readFile(input).then(function(result)
                    {
                        writeFile(strippedInput, result);
                        generateIndexHTML(strippedInput, false);
                    })
                }
            }
        }
    })
}

//this function will read a file
function readFile(input)
{
    return new Promise(async function(res, rej)
    {
        var lineArray = [];
        const theFile = fs.createReadStream(input);
        const line = readline.createInterface(
            {
                input: theFile
            }
        );
    
        //go through the file line by line
        for await (const theLine of line)
        {
            if (theLine != "")
            {
                lineArray.push(theLine);
            }
            else
            {
                lineArray.push("\n");
            }
        }
        res(lineArray);    
    })
}

//this function will write to a file
function writeFile(input, result)
{
    return new Promise(function(res, rej)
    {
        var content = "";
        var lineNumber = 0;
        //create the file name
        var htmlFile = './dist/' + input.substring(0, input.length-4) + '.html';

        //add the <p> tags to each line
        for (var theLine of result)
        {
            if (theLine != "\n")
            {
                //try to format the HTML file better
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
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    ${content}
</body>
</html>
        `

        //write the file contents to the correct filename
        fs.writeFile(htmlFile, templateHTML, function()
        {

        });

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
            var htmlFile = file.substring(0, file.length-4) + '.html';
            content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
        }
    }
    else
    {
        var htmlFile = input.substring(0, input.length-4) + '.html';
        content += `<a href="${htmlFile}"> ${htmlFile} </a>\n<br>`;
    }

    const templateHTML =
        `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Filename</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    The files are:
    <br>
    ${content}
</body>
</html>
        `
        fs.writeFile('./dist/index.html', templateHTML, function()
        {

        });
}