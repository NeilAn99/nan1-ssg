import readConfigFile from './main'

describe("json config tests", () =>
{
    test("check if valid config file passes", async () => {
        const jsonData = await readConfigFile("./test/ssg-config.json");
        const testData = {"input": "./test/Sherlock-Holmes-Selected-Stories", "output": "./build", "stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"}
        expect(jsonData).toStrictEqual(testData);
    })

    test("check if config file does not exist", async () => {
        expect.assertions(1);
        await expect(readConfigFile("")).rejects.toEqual('Error: Config file does not exist.');
    })
    
    test("check if config file is not valid json", async () => {
        expect.assertions(1);
        await expect(readConfigFile("./test/invalid-config.json")).rejects.toEqual('Invalid JSON file.');
    })

    test("check if test config file passes", async () => {
        const jsonData = await readConfigFile("./test/test-config.json");
        const testData = {"input": "./test/Sherlock-Holmes-Selected-Stories/Silver Blaze.txt ./test/Sherlock-Holmes-Selected-Stories/The Adventure of the Speckled Band.txt", "output": "./croissant"}
        expect(jsonData).toStrictEqual(testData);
    })
})