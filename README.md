# nan1-ssg

nan1-ssg is a static site generator converting .txt and .md files to .html files.

## Requirements

[Node.js](https://nodejs.org/en/download/) is required to run this tool.

## Usage

**To use this tool:**

1. Clone or download and extract the repo to a location on your computer.

2. Open a terminal/command window and navigate to the location where the tool is.

3. Run the npm install command:
```
npm install
```

4. Run the npm link command:
```
npm link
```

5. Start using the tool! For example:

```
nan1-ssg [-option]
```

**A list of options:**

|  Option  | Details |
| ---------------| ---------------|
| -v, --version | Will display the name and version of the tool. |
| -h, --help | Will display a help message, showing options and usage. |
| -i <filename>, --input <filename> | Gives the tool a filename to generate HTML files with. The filename can be a file or a directory. |

The hello.txt file, markdownTest.md file,  and Sherlock-Holmes-Selected-Stories directory are provided for testing purposes.

## Examples

**For a text file:**
```
nan1-ssg -i hello.txt
```

**For a markdown file:**
```
nan1-ssg -i hello.md
```

**For a directory:**
```
nan1-ssg -i Sherlock-Holmes-Selected-Stories
```

**Files that are nested:**
```
nan1-ssg -i "./Sherlock-Holmes-Selected-Stories/Silver Blaze.txt"
```

**Files containing spaces:**
```
nan1-ssg -i "file with spaces.txt"
```

## Features

- Generating valid HTML5 files from .txt and .md files and placed in the dist directory
- An index.html file is created which contain relative links to the generated HTML files
- Each HTML file uses a default stylesheet to improve beauty and readability
