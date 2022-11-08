# Contributing to nan1-ssg

Contributions are welcome!

## How to contribute

1. First, look for an issue to contribute to. You may add your own issue if it does not exist.

2. Fork the nan1-ssg repository.

3. Clone the project to your computer.

4. Go into the project directory where you cloned the repo.

5. Run the npm install command:
```
npm install
```

6. Run the npm link command:
```
npm link
```

7. Create a new branch:
```
git checkout -b BranchName
```

8. Make your changes to the code.

9. Run ESLint by running the script in your terminal:
```
npm run lint
```

10. Run the prettier script to format your code:
```
npm run prettier
```

11. Check that the files have been formatted correctly:
```
npm run prettier-check
```

12. Commit and push your changes to the branch.

13. Create a pull request.

## Adding Prettier and ESLint extenstions to VSCode

1. Upon opening the project for the first time, VSCode will recommend you to install `Prettier - Code Formater`, and `ESLint`. Install these extensions.

## Testing

This project uses [jest](https://jestjs.io/) for testing.

Using the `npm test` command to run all of the test files found in `src`.

To add a test, look for the correct test file to add to and add a description to the test.