#! /usr/bin/env node
import { generateHTML } from './generateHTML.js';
import { program } from 'commander';
import fs, { read } from 'fs';

program
.option('-v, --version', 'displays the tool name and version')
.option('-i, --input <item>', 'gets input from a file or folder')
.option('-l, --lang <item>', 'specifies language to use')
.option('-c, --config <item>', 'Add a JSON config file to specify options');

program.parse(process.argv);

if (program.opts().version)
{
    console.log("name: nan1-ssg");
    console.log("version: 0.2");
}

if(program.opts().config)
{
    readConfigFile(program.opts().config).then(function(configFile)
    {
        generateHTML(configFile.input, configFile.lang);
    })
    .catch(function (rej)
    {
        console.log(rej);
    })
}
if (program.opts().input)
{
    if (program.opts().lang)
    {
        console.log(`${program.opts().lang}`);
        generateHTML(`${program.opts().input}`, `${program.opts().lang}`);
    }
    else
    {
        generateHTML(`${program.opts().input}`);
    }
}

//this function will read a JSON config file
function readConfigFile(config)
{
    return new Promise(function(res, rej)
    {
        if(fs.existsSync(config))
        {
            const theFile = fs.readFileSync(config, "utf-8");
            const JSONfile = JSON.parse(theFile);
            res(JSONfile);    
        }
        else
        {
            rej("Error: Config file does not exist.");
        }
    })
}
