/* Test Runner */

var path = require('path'),
    fs = require('fs');

var chunkutils = require('./chunkutils.js');

var data = fs.readFileSync("./../chunk_utils/source.json");
data = JSON.parse(data);
var chunker = chunkutils.Chunker();


data = chunker.splitVerses(data);

console.log(data);
console.log("");