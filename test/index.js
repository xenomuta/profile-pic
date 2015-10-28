'use strict';

var should = require('should');
var pp = require('../'),
    cv = require('opencv'),
    Q = require('q'),
    fs = require('fs'),
    result,
    outputs = [{
        width: 800,
        height: 480,
        filename: '/tmp/cover-' + Date.now().toString() + '.jpg'
    }, {
        width: 480,
        height: 800,
        filename: '/tmp/stand-' + Date.now().toString() + '.jpg'
    }, {
        avatar: true,
        width: 128,
        height: 128,
        filename: '/tmp/profile-' + Date.now().toString() + '.jpg'
    }];

describe('Profile Picture', function () {
    after(function (done) {
        outputs.forEach(function (output) {
            fs.unlinkSync(output.filename);
        });
        done();
    });

    it('should create output images', function (done) {
        pp(__dirname + '/images/input.jpg', outputs).then(function (r) {
            result = r;
            should.exist(result);
            result.length.should.equal(outputs.length);
            result.forEach(function (output) {
                should(fs.existsSync(output.filename)).equal(true);
            });
            done();
        }).catch(done);
    });
    it('should have detected 5 faces for testing avatar image', function (done) {
        should.exist(result[2].faces);
        result[2].faces.should.equal(5);
        done();
    });
    it('images should be of spected sizes', function (done) {
        Q.all(result.map(function (r) {
            return Q.promise(function (resolve, reject) {
                cv.readImage(r.filename, function (err, im) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(im.size());
                });
            });
        })).then(function (sizes) {
            should.exist(sizes);
            sizes.length.should.equal(outputs.length);
            outputs.forEach(function (output, i) {
                should(sizes[i][1]).equal(output.width);
                should(sizes[i][0]).equal(output.height);
            });
            done();
        }).catch(done);
    });
});