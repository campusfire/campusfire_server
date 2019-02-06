const _=require("underscore");
const path = require("path");
const dir = './uploads';
const fs = require("fs");

module.exports={

    getOldestFileName : function(files) {
        // use underscore for min()
        return _.min(files, function (f) {
            var fullpath = path.join(dir, f);

            // ctime = creation time is used
            // replace with mtime for modification time
            return fs.statSync(fullpath).ctime;
        });
    }

};
