/* Test Runner */
/*
var path = require('path'),
    fs = require('fs');

var chunkutils = require('./chunkutils.js');

var data = fs.readFileSync("./../chunk_utils/source.json");
data = JSON.parse(data);
var chunker = chunkutils.Chunker();


data = chunker.makeOneVersePerChunkIn(data);

console.log(data);
console.log("");
*/
var lodash = require('lodash');

var obj1 = {
    name:"obj1",
    arr:[1,2,3],
    innerobj:{
        "frames":["one", "two", "three"]
    }
};
var obj2 = {
    name:"obj1",
    arr:[1,2],
    innerobj:{
        "frames":["one", "two", "three"]
    }
};

var eq = lodash.isEqual(obj1, obj2);
console.log(eq);