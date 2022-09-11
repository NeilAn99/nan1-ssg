# nan1-ssg

nan1-ssg is a static site generator converting .txt files to .html files.

## Requirements

[Node.js](https://nodejs.org/en/download/) is required to run this tool.

## Usage

**To use this tool:**

1. Clone or download and extract the repo to a location on your computer.

2. Open a terminal/command window and navigate to the location where the tool is.

3. Start using the tool! For example:

```
node main [-option]
```

**A list of options:**

|  Option  | Details |
| ---------------| ---------------|
| -v, --version | Will display the name and version of the tool. |
| -h, --help | Will display a help message, showing options and usage. |
| -i <filename>, --input <filename> | Gives the tool a filename to generate HTML files with. The filename can be a file or a directory. |

The hello.txt file and Sherlock-Holmes-Selected-Stories directory is provided for testing purposes.

## Examples

**For a text file:**
```
node main -i hello.txt
```

**For a directory:**
```
node main -i Sherlock-Holmes-Selected-Stories
```

**Files containing spaces:**
```
node main -i "file with spaces.txt"
```

## Features

- Generating valid HTML5 files from .txt files and placed in the dist directory
- An index.html file is created which contain relative links to the generated HTML files
- Each HTML file uses a default stylesheet to improve beauty and readability
