import fs, { read } from 'fs';
import path from 'path';
import readline from 'readline';

//this function will generate all the HTML files
export function generateHTML(input, lang="")
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
                            readTextFile(input + "/" + fileName).then(function(result)
                            {
                                writeFile(fileName, result, lang);
                            })
                        } else if (path.extname(fileName) == ".md")
                        {
                            readMdFile(input + "/" + fileName).then(function(result)
                            {
                                writeFile(fileName, result, lang);
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
                    readTextFile(input).then(function(result)
                    {
                        writeFile(strippedInput, result, lang);
                        generateIndexHTML(strippedInput, false);
                    })
                }
                else if (path.extname(strippedInput) == ".md")
                {
                    readMdFile(input).then(function(result)
                    {
                        writeFile(strippedInput, result, lang);
                        generateIndexHTML(strippedInput, false);
                    })
                }
            }
        }
    })
}

//this function will read a .txt file
function readTextFile(input)
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

//this function will read a .md file
function readMdFile(input)
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
                // regex to find opening and closing '**' in the line
                //  based off of stackoverflow answer found here: https://stackoverflow.com/a/2295943 

                // the pattern below matches multiple sets of characters that are surrounded by '**'
                let pattern = /\*\*(?:\\.|[^\*\*])*\*\*/gm;
                let matchIndexes = [];
                let match;

                // the while loop below will test the regex pattern against the line, and then push the beginning and ending index of the match into the match indexes array to find the positions where to place the <strong>...</strong> tags
                while( match = pattern.exec(theLine) ){
                    matchIndexes.push(match.index);
                    matchIndexes.push(pattern.lastIndex);
                }

                // // make a modifiable copy of theLine
                let modifiedLine = theLine;

                // replace '**' with '<strong>' and '</strong>' tags, note lines may have multiple bolded words
                for (let i = 0; i < matchIndexes.length; i += 2) {
                    modifiedLine = modifiedLine.slice(0, matchIndexes[i]) + '<strong>' + modifiedLine.slice(matchIndexes[i] + 2, matchIndexes[i + 1] - 2) + '</strong>' + modifiedLine.slice(matchIndexes[i + 1]);

                    // compensate for the added characters in the array (adding <strong> and </strong> tags and removing '**' --> 8 + 9 - 4 = 13)
                    for (let j = i + 2; j < matchIndexes.length; j++) {
                        matchIndexes[j] += 13;
                    }
                }
                
                //check if the line is a horizontal rule
                if (modifiedLine == "---")
                {
                    modifiedLine = '<hr>';
                }

                lineArray.push(modifiedLine);
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
function writeFile(input, result, lang)
{
    return new Promise(function(res, rej)
    {
        var content = "";
        var lineNumber = 0;
        var htmlFile = "";
        var title = "";
        //create the file name if text file or md file
        if (path.extname(input) == ".txt")
        {
            htmlFile = './dist/' + input.substring(0, input.length-4) + '.html';
            title = input.substring(0, input.length-4);
        }
        else if (path.extname(input) == ".md")
        {
            htmlFile = './dist/' + input.substring(0, input.length-3) + '.html';
            title = input.substring(0, input.length-3);
        }

        //add the <p> tags to each line
        for (var theLine of result)
        {
            if (theLine != "\n")
            {
                //try to format the HTML file better
                if (lineNumber == 0)
                {
                    //check if the line is an hr tag
                    if (theLine == "<hr>")
                    {
                        content += theLine + "\n";
                    }
                    else
                    {
                        content += "<p>" + theLine + "</p>\n";
                    }
                }
                else
                {
                    if (theLine == "<hr>")
                    {
                        content += "\t" + theLine + "\n";
                    }
                    else
                    {
                        content += "\t<p>" + theLine + "</p>\n";
                    }
                }
            }
            else
            {
                content += "\n";
            }
            lineNumber++;
        }

        var templateHTML = "";
        if (lang != "")
        {
            templateHTML =
            `
<!doctype html>
<html lang="${lang}">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    ${content}
</body>
</html>
            `
        }
        else
        {
            templateHTML =
            `
<!doctype html>
<html lang="en-CA">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    ${content}
</body>
</html>
            `
        }


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
    <title>index</title>
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