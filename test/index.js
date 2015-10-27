'use strict';

var should = require('should');
var pp = require('../'),
    cv = require('opencv'),
    Q = require('q'),
    fs = require('fs'),
    result,
    config = {
        cover: {
            width: 800,
            height: 480,
            filename: '/tmp/cover-' + Date.now().toString() + '.jpg'
        },
        profile: {
            size: 128,
            filename: '/tmp/profile-' + Date.now().toString() + '.jpg'
        }
    };

describe('Profile Picture', function () {
    after(function (done) {
        fs.unlinkSync(config.cover.filename);
        fs.unlinkSync(config.profile.filename);
        done();
    });

    it('should create two images', function (done) {
        pp(__dirname + '/people.jpg', config).then(function (r) {
            result = r;
            var fs = require('fs');
            should(fs.existsSync(config.cover.filename)).equal(true);
            should(fs.existsSync(config.profile.filename)).equal(true);
            done();
        }).catch(done);
    });
    it('should have detected 5 faces for sample image', function (done) {
        should.exist(result.profile.faces);
        result.profile.faces.should.equal(5);
        done();
    });
    it('images should be of spected size', function (done) {
        Q.all([config.cover.filename, config.profile.filename].map(function (filename) {
            return Q.promise(function (resolve, reject) {
                cv.readImage(filename, function (err, im) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(im.size());
                });
            });
        })).then(function (result) {
            var cover = result[0];
            var profile = result[1];
            should.exist(cover);
            should.exist(profile);
            cover.length.should.equal(2);
            profile.length.should.equal(2);
            should(cover[1]).equal(config.cover.width);
            should(cover[0]).equal(config.cover.height);
            should(profile[1]).equal(config.profile.size);
            should(profile[0]).equal(config.profile.size);
            done();
        }).catch(done);
    });
});