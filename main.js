#! /usr/bin/env node
import { generateHTML } from './generateHTML.js';
import { program } from 'commander';

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

