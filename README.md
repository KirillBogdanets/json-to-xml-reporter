### Description
Simple JSON to XML report parser for creating report in XML after running tests.

### Installation
npm install jsonToXml

### Usage
If you want to create xml report from json report it looks like this:
```const parser = require('jsonToXml')```
```parser.jsonToXmlParser(pathToTheJsonFile, xmlReporterName, pathToTheXmlReporter)```