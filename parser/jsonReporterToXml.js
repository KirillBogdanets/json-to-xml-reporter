"use strict";

const path = require("path");
const fs = require('fs');

class XmlParser {
    constructor() {
        this.toXml = [];
    }

    /**
     * Create xml report from given json report
     * @param pathToJson
     * @param filename
     * @param folderName
     */
    jsonToXmlParser(pathToJson, filename='reporting', folderName='xml-report') {
        try {
            const jsonResultsObj = require(path.resolve(pathToJson));

            this.toXml.push(this._testSuiteInfo(jsonResultsObj.stats));
            this._testCasesInfo(jsonResultsObj.suites);
            this.toXml.push('\n</testsuite>');

            fs.existsSync(folderName) || fs.mkdirSync(folderName);
            fs.writeFileSync(`./${folderName}/${filename}.xml`, this.toXml.join(''));

            console.log(`${filename}.xml has been created in the ${folderName} folder.`)
        } catch (err){
            console.error(`\nGiven path: '${pathToJson}' is not valid\n`);
            throw err;
        }
    };

    /**
     * Return's String with testsuite info
     * @param stats
     * @returns {string}
     * @private
     */
    _testSuiteInfo(stats) {
        return `<testsuite name="Mocha Tests" tests="${stats.suites}" failures="${stats.failures}" errors="${stats.failures}" skipped="${stats.skipped}" timestamp="${new Date(stats.start)}" time="${stats.duration / 1000}">`;
    };

    /**
     * Parsing testCases info from given json report
     * @param suites
     * @private
     */
    _testCasesInfo(suites){
        if (suites.suites && Array.isArray(suites.suites)) {
            suites.suites.forEach(value => {
                if (value.suites && Array.isArray(value.suites)) {
                this._testsInfo(value.tests, value);
                this._testCasesInfo(value);
            }
        });
        }
    };

    /**
     * Parsing test's info from given json report
     * @param tests
     * @param suit
     * @private
     */
    _testsInfo(tests, suit) {
        tests.forEach(value => {
            if (value.err && value.err.message) {
            this.toXml.push(`\n<testcase classname="${suit.title}" name="${value.title}" time="${value.duration / 1000}"><failure>${value.err.message}\n${value.err.estack}</failure></testcase>`);
        } else {
            this.toXml.push(`\n<testcase classname="${suit.title}" name="${value.title}" time="${value.duration / 1000}"/>`);
        }
    })
    };
}

module.exports = new XmlParser();