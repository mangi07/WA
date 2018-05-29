'use strict';
const assert = require("assert");
var _ = require("lodash");

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
            for (var ch = 0; ch < data.chapters.length; ++ch) {
                var all_chunks = [];
                for (var fr = 0; fr < data.chapters[ch].frames.length; ++fr) {
                    var text = data.chapters[ch].frames[fr].text;
                    var verses = this._splitVerses(text, "<verse");
                    var some_chunks = this._createChunks(ch, verses);
                    all_chunks = all_chunks.concat(some_chunks);
                }
                data.chapters[ch].frames = all_chunks;
            }

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
            assert(typeof(chunkstr) === "string", "In Chunker._splitVerses: chunkstr must be of type string");
            assert(typeof(tag) === "string", "In Chunker._splitVerses: tag must be of type string");

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
         * Given a verse chunk of a chapter, creates an array of objects, 
         * each representing a verse.
         * 
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

            var chunks = [];
            var re = /verse number="(\d+)"/;
            var vtext, vnum, id, lastvs, text, chunk;
            chapter = _.padStart(""+chapter, 2, "0");

            while (verses.length > 0) {
                vtext = verses.pop();
                vnum = vtext.match(re)[1]; // catch any errors here ??
                lastvs = vnum;
                vnum = _.padStart(vnum, 2, "0");
                id = chapter + "-" + vnum;

                chunk = {"format": "usx",
                    "id": id,
                    "img": "",
                    "lastvs": lastvs, 
                    "text": vtext
                };
                chunks.push(chunk);
            }

            return chunks;
        }
    }

}

module.exports.Chunker = Chunker;
