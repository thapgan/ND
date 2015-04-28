var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    http = require('http'),
    busboy = require('busboy'),
    xls = require("excel");




var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.route('/upload')
.post(function (req, res) {
        var a = path.join(__dirname, 'public', 'upload');
        var uploadServer = new busboy({ headers: req.headers });

        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        var savedFileName = day + month + year + hour + min + sec;
        var pathFile = '';
    
        var colMasv = -1;
        var colCC = -1;
        var colKT = -1;
        var colThi = -1;

        uploadServer.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var tmpfileName = savedFileName + '_' + filename;
            //savedFileName = tmpfileName;
            var saveTo = path.join(__dirname, 'public', 'upload', path.basename(tmpfileName));
            savedFileName = saveTo;
            file.pipe(fs.createWriteStream(saveTo));
        });
    
        uploadServer.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname == 'colMasv') { colMasv = val-1; }
            else if(fieldname == 'colCC') { colCC = val - 1;}
            else if (fieldname == 'colKT') { colKT = val - 1; }
            else if(fieldname == 'colThi') { colThi = val - 1; }
        });

        uploadServer.on('finish', function () {
        //parse xlsx file
        var options = { headers: false, trim: true }
        var ds = [];
        xls(savedFileName, function (err, data) {
            for (var i = 1; i < data.length; i++) {
                var row = [];
                if (colMasv > -1) {
                    row.push(data[i][colMasv]);//Masv
                }
                if (colCC > -1) {
                    row.push(data[i][colCC]);//CC
                }

                if (colKT > -1) {
                    row.push(data[i][colKT]);//KT
                }
                if (colThi > -1) {
                    row.push(data[i][colThi]);//Thi
                }
                
                ds.push(row);
            }
            //console.log(ds);
            res.json(ds);
        });
        fs.unlink(savedFileName, function (err) {});
        });

        return req.pipe(uploadServer);
    });

app.listen(app.get('port'), function () {
    console.log('Nhap diem server listening on port ' + app.get('port'));
});
