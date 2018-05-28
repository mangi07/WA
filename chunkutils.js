'use strict';
const assert = require("assert");

function Chunker() {

    return {

        /**
         * Parses input data to split chunks with more than one verse
         * so each chunk ("format") represents or contains exactly one verse.
         * 
         * @param {String} data JSON object following this example structure:
         * 
         * {"chapters": [
         *  {"frames": [
         *      {"format": "usx", 
         *      "id": "01-01", 
         *      "img": "", 
         *      "lastvs": "2", 
         *      "text": "<para style=\"p\">\n\n  
         *          <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  
         *          <verse number=\"2\" style=\"v\" />La terre \u00e9tait informe et vide: il y avait des t\u00e9n\u00e8bres \u00e0 la surface de l' ab\u00eeme, et l' esprit de Dieu se mouvait au- dessusdes eaux.\n"
         *      },
         *      ...]
         *  },
         *  ...
         *  ]
         * ], "date_modified": "20180427"}
         * 
         * @return {Array} JSON object with same structure.
         */
        makeOneVersePerChunkIn: function (data) {
            // TODO: for each chapter, build new frames array

            // looking frame by frame at the original frames array
            // and then replace the original frames array with the new one.
            var versestring = data.chapters[0].frames[0].text; // TODO: extract into helper funct
            data = this._splitVerses(versestring, "<verse");
            return data;
        },

        /**
         * @param {String} chunkstr One or more verses.
         * @param {String} tag Syntax marking the start of a verse.
         * 
         * @return {Array} Each element a single verse from the original chunkstr,
         *  in reverse order (eg: verse 3, verse 2, verse 1).
         */
        _splitVerses: function (/** @type {String} */ chunkstr, 
                /** @type {String} */ tag) {
            assert(typeof(chunkstr) === "string", "chunkstr must be of type string");
            assert(typeof(tag) === "string", "tag must be of type string");

            var verses = [];
            var i, v;
            while( (i = chunkstr.lastIndexOf(tag)) !== -1) {
                v = chunkstr.substring(i);
                verses.push(v);
                chunkstr = chunkstr.substring(0, i);
            }
            if (chunkstr.length > 0 && verses.length > 0) {
                verses[verses.length-1] = chunkstr + verses[verses.length-1];
            }
            return verses;
        },

        /**
         * Given a chapter, creates an array of objects, each representing a verse.
         * For example, with chapter 1, the first verse format would be:
         *  {"format": "usx",
                "id": "01-01",
                "img": "",
                "lastvs": "1", 
                "text": "<para style=\"p\">\n\n  <verse number=\"1\" style=\"v\" />Au commencement, Dieu cr\u00e9ales cieuxet la terre.\n\n  "
            }
         * 
         * @param {number} chapter
         * @param {String[]} verses 
         */
        _createChunks: function(chapter, verses){
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

            return [expected_chunk1, expected_chunk2];
        }
    }

}

module.exports.Chunker = Chunker;
