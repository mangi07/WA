/**
 * This is a command line utility to re-chunk the archives
 * that come packaged with the app.
 * 
 * Give as argument the path to the folder containing
 * the *.tsrc archives and all files that are recognized as 
 * source text will be checked for the correct JSON format.
 * 
 * If any of the source text files don't have the correct
 * format, they will simply be uncompressed and then compressed
 * without modification in between.
 * 
 * For each source text that has the correct format, it will be
 * replaced in the same directory with a file of the same name. 
 * This rewritten file will contain one verse per chunk.
 */

'use strict';
const assert = require("assert");
const fs = require("fs");
const path = require("path");
var AdmZip = require("adm-zip");
const chunkutils = require("./chunkutils.js");

// command line args validation
let argslength = process.argv.length;
assert(argslength == 3, "Incorrect number of arguments.  Expected exactly one arg containing path to archives.");


let chunker = chunkutils.Chunker();

let fileDir = path.join(__dirname, process.argv[2]); // eg argv: ../../../index/resource_containers

fs.readdir(fileDir, (err, files) => {
    files.forEach(fileName => {
        rechunkSourceText(fileDir, fileName);
    });
})

let rechunkSourceText = function(dir, fileName){
    var fileName = path.join(dir, fileName);
    var file = unzipFile(fileName); //TODO: call the python script or try with untar in compression.js
    var f = fs.readFileSync(file,{encoding: 'utf8'});
    file = chunkFile(f, chunker);
    zipFile(file);
}

/**
 * @param {String} file JSON string 
 * @param {Object} chunker must contain methods called
 * 
 * @returns re-chunked JSON (1 verse per chunk)
 */
let chunkFile = function(file, chunker){
    var data = JSON.parse(file);
    
    if(chunker.validateJSON(data)){
        data = chunker.makeOneVersePerChunkIn(data);
    }
    
    data = JSON.stringify(data);
    return data;
}
