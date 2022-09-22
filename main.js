#! /usr/bin/env node
import { generateHTML } from './generateHTML.js';
import { program } from 'commander';

program
.option('-v, --version', 'displays the tool name and version')
.option('-i, --input <item>', 'gets input from a file or folder');

program.parse(process.argv);

if (program.opts().version)
{
    console.log("name: nan1-ssg");
    console.log("version: 0.2");
}

if (program.opts().input)
{
    generateHTML(`${program.opts().input}`);
}

