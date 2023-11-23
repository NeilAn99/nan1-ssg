# nan1-ssg

nan1-ssg is the static site generator converting .txt and .md files to .html files.

## Usage

**To use this tool:**

1. Run the npm install command:
```
npm i nan1-ssg
```

2. Run the npm link command:
```
npm link nan1-ssg
```

3. Start using the tool! For example:

```
nan1-ssg [-option]
```

**A list of options:**

|  Option  | Details |
| ---------------| ---------------|
| -v, --version | Will display the name and version of the tool. |
| -h, --help | Will display a help message, showing options and usage. |
| -i <filename>, --input <filename> | Gives the tool a filename to generate HTML files with. The filename can be a file or a directory. |
| -l <language>, --lang <language> | Specifies a language to generate the HTML from. |
| -c <configFile>, --config <configFile> | Add a JSON config file to specify options. Omit other options when using this option. |

The hello.txt file, markdownTest.md file, ssg-config.json file and Sherlock-Holmes-Selected-Stories directory are provided for testing purposes.

## Examples

**For a text file:**
```
nan1-ssg -i hello.txt
```

**For a markdown file:**
```
nan1-ssg -i hello.md
```

**For a file with a specific language:**
```
nan1-ssg -i hello.txt -l fr
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

**Using a configuration JSON file:**
```
nan1-ssg -c ./ssg-config.json
```

## Features

- Generating valid HTML5 files from .txt and .md files and placed in the dist directory
- An index.html file is created which contain relative links to the generated HTML files
- Each HTML file uses a default stylesheet to improve beauty and readability
- Can specify language to HTML file to use
- Horizontal rules are translated from Markdown files
- A configuration JSON file can be used to specify all options
    - Example file format:
    ```json
    {
        "input": "./ssg-config.json",
        "lang": "fr"
    }
    ```
