var assert = require('assert');
var _ = require('lodash');

describe('ChunkUtils', function() {

    let data = {"chapters": [
        {"frames": [
            {"format": "usx",
              "id": "01-01",
              "img": "",
              "lastvs": "2", 
              "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  <verse number=\"2\" style=\"v\" />La terre \u00e9tait informe et vide: il y avait des t\u00e9n\u00e8bres \u00e0 la surface de l\' ab\u00eeme, et l\' esprit de Dieu se mouvait au- dessusdes eaux.\n"
            }
        ]}
    ], "date_modified": "20180427"};

    let chunkutils = require('./../chunkutils.js');
    let chunker = chunkutils.Chunker();


    describe('@_splitVerses()', function() {
        it('should return two strings: verse 1 and verse 2', function() {
            let expected_verse1 = "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  ";
            let expected_verse2 = "<verse number=\"2\" style=\"v\" />La terre \u00e9tait informe et vide: il y avait des t\u00e9n\u00e8bres \u00e0 la surface de l\' ab\u00eeme, et l\' esprit de Dieu se mouvait au- dessusdes eaux.\n";

            let versetext = "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  <verse number=\"2\" style=\"v\" />La terre \u00e9tait informe et vide: il y avait des t\u00e9n\u00e8bres \u00e0 la surface de l\' ab\u00eeme, et l\' esprit de Dieu se mouvait au- dessusdes eaux.\n";
            
            verses = chunker._splitVerses(versetext, "<verse");

            if (verses.length != 2) assert(false);
            //console.log(verses[0]);
            //console.log(verses[1]);
            assert(verses[1] == expected_verse1);
            assert(verses[0] == expected_verse2);

        });
    });

    describe('@_createChunks()', function() {
        it('should return Object with expected structure of one verse per frame (chunk)', function() {

            let expected_chunk1 = {"format": "usx",
                "id": "01-01",
                "img": "",
                "lastvs": "1", 
                "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  "
            };
            let expected_chunk2 = {"format": "usx",
                "id": "01-02",
                "img": "",
                "lastvs": "2", 
                "text": "<verse number=\"2\" style=\"v\" />La terre \u00e9tait informe et vide: il y avait des t\u00e9n\u00e8bres \u00e0 la surface de l\' ab\u00eeme, et l\' esprit de Dieu se mouvait au- dessusdes eaux.\n"
            };

            let chunk = data.chapters[0].frames[0].text;
            let verses = chunker._splitVerses(chunk, "<verse");
            let actual_array = chunker._createChunks(1, verses);

            let expected_array = [expected_chunk1, expected_chunk2];

            arr1 = JSON.stringify(actual_array);
            arr2 = JSON.stringify(expected_array);
            assert.equal(arr1, arr2);

        });
    });

    describe('@makeOneVersePerChunkIn()', function() {
        it('should return correct JSON with one verse per chunk', function() {

            let input_data = {"chapters": [
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

            let expected_output = {"chapters": [
                {"frames": [
                    {"format": "usx",
                        "id": "01-01",
                        "img": "",
                        "lastvs": "1", 
                        "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Verse 1 text.\n\n "
                    },
                    {"format": "usx",
                        "id": "01-02",
                        "img": "",
                        "lastvs": "2", 
                        "text": "<verse number=\"2\" style=\"v\" />Verse 2 text.\n"
                    },
                    {"format": "usx",
                        "id": "01-03",
                        "img": "",
                        "lastvs": "3", 
                        "text": "<verse number=\"3\" style=\"v\" />Verse 3 text.\n "
                    },
                    {"format": "usx",
                        "id": "01-04",
                        "img": "",
                        "lastvs": "4", 
                        "text": "<verse number=\"4\" style=\"v\" />Verse 4 text.\n"
                    }, 
                    {"format": "usx",
                        "id": "01-05",
                        "img": "",
                        "lastvs": "5", 
                        "text": "<verse number=\"5\" style=\"v\" />Verse 5 text.\n"
                    }, 
                    {"format": "usx",
                        "id": "01-06",
                        "img": "",
                        "lastvs": "6", 
                        "text": "<verse number=\"6\" style=\"v\" />Verse 6 text.\n"
                    }
                ]},
                {"frames": [
                    {"format": "usx",
                        "id": "02-01",
                        "img": "",
                        "lastvs": "1", 
                        "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Verse 1 text.\n\n "
                    },
                    {"format": "usx",
                        "id": "02-02",
                        "img": "",
                        "lastvs": "2", 
                        "text": "<verse number=\"2\" style=\"v\" />Verse 2 text.\n"
                    },
                    {"format": "usx",
                        "id": "02-03",
                        "img": "",
                        "lastvs": "3", 
                        "text": "<verse number=\"3\" style=\"v\" />Verse 3 text.\n "
                    },
                    {"format": "usx",
                        "id": "02-04",
                        "img": "",
                        "lastvs": "4", 
                        "text": "<verse number=\"4\" style=\"v\" />Verse 4 text.\n"
                    }, 
                    {"format": "usx",
                        "id": "02-05",
                        "img": "",
                        "lastvs": "5", 
                        "text": "<verse number=\"5\" style=\"v\" />Verse 5 text.\n"
                    }, 
                    {"format": "usx",
                        "id": "02-06",
                        "img": "",
                        "lastvs": "6", 
                        "text": "<verse number=\"6\" style=\"v\" />Verse 6 text.\n"
                    },
                    {"format": "usx",
                        "id": "02-07",
                        "img": "",
                        "lastvs": "7", 
                        "text": "<verse number=\"7\" style=\"v\" />Verse 7 text.\n"
                    }
                ]}
            ], "date_modified": "20180427"};

            let actual_output = chunker.makeOneVersePerChunkIn(data);
            // TODO: Write expected_output and actual_output to files and compare them.

            assert.equal(_.isEqual(expected_data, actual_data));

        });
    });

});