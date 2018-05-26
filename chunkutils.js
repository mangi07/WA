'use strict';
const assert = require("assert");

function Chunker() {

    return {

        /* 
        Expects a JSON object with specific structure.
        Returns a JSON object with the same structure as the one passed in,
        where each chunk is only one verse. */
        splitVerses: function (data) {
            var versestring = data.chapters[0].frames[0].text; // TODO: extract into helper funct
            data = this._splitVerses(versestring, "<verse");
            return data;
        },

        /**
         * @param {String} chunkstr One or more verses.
         * @param {String} tag Syntax marking the start of a verse.
         * 
         * @return {Array} Each element a single verse from the original chunkstr.
         */
        _splitVerses: function (/** @type {String} */ chunkstr, 
                /** @type {String} */ tag) {
                    console.log(chunkstr);
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
        }
    }

}

module.exports.Chunker = Chunker;
