/* Test Runner */

var path = require('path'),
    fs = require('fs');

var chunkutils = require('./chunkutils.js');

var data = fs.readFileSync("./../chunk_utils/source.json");
data = JSON.parse(data);
var chunker = chunkutils.Chunker();
console.log(data.chapters[0].frames[0].text);
data = chunker.makeOneVersePerChunkIn(data);
console.log(data.chapters[0].frames[0].text);



//*************************************************************************
//*************************************************************************


let valid_data = {"chapters": [
    {"frames": [
        {"format": "usx",
            "id": "01-01",
            "img": "",
            "lastvs": "2", 
            "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Verse 1 text.\n\n <verse number=\"2\" style=\"v\" />Verse 2 text.\n"
        },
        {"format": "usx",
            "id": "01-03",
            "img": "",
            "lastvs": "6", 
            "text": "<verse number=\"3\" style=\"v\" />Verse 3 text.\n " + 
                "<verse number=\"4\" style=\"v\" />Verse 4 text.\n" + 
                "<verse number=\"5\" style=\"v\" />Verse 5 text.\n" + 
                "<verse number=\"6\" style=\"v\" />Verse 6 text.\n"
        }
    ]},
    {"frames": [
        {"format": "usx",
            "id": "02-01",
            "img": "",
            "lastvs": "1", 
            "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Verse 1 text.\n"
        },
        {"format": "usx",
            "id": "02-02",
            "img": "",
            "lastvs": "3", 
            "text": "<verse number=\"2\" style=\"v\" />Verse 2 text.\n " + 
                "<verse number=\"3\" style=\"v\" />Verse 3 text.\n"
        },
        {"format": "usx",
            "id": "02-04",
            "img": "",
            "lastvs": "7", 
            "text": "<verse number=\"4\" style=\"v\" />Verse 4 text.\n " + 
                "<verse number=\"5\" style=\"v\" />Verse 5 text.\n" +
                "<verse number=\"6\" style=\"v\" />Verse 6 text.\n" +
                "<verse number=\"7\" style=\"v\" />Verse 7 text.\n"
        }
    ]}
], "date_modified": "20180427"};

// deep copy valid_data to make invalid_data
let invalid_data = JSON.stringify(valid_data);
invalid_data = JSON.parse(invalid_data);

// introduce invalid format, missing text
invalid_data.chapters[1].frames = [{
    "format": "usx",
        "id": "02-01",
        "img": "",
        "lastvs": "1",
        //"text": "this is a verse"
        // Intentionally missing verse text here in order to test validation.
}];
let response = chunker.validateJSON(invalid_data);
console.log(response);