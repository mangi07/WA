/* Test Runner */

var path = require('path'),
    fs = require('fs');

var chunkutils = require('./chunkutils.js');

var data = fs.readFileSync("./../chunk_utils/source.json");
data = JSON.parse(data);
var chunker = chunkutils.Chunker();

let chunk = data.chapters[0].frames[0].text;
let verses = chunker._splitVerses(chunk, "<verse");
let chunks = chunker._createChunks(1, verses);

console.log(chunks);
/*
data = chunker.makeOneVersePerChunkIn(data);

console.log(data);
console.log("");
*/