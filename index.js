'use strict';

var Q = require('q'),
    cv = require('opencv'),
    defaultConfig = {
        cover: {
            width: 800,
            height: 480
        },
        profile: {
            size: 128,
        }
    };

module.exports = function (inFile, config) {
    if (config) {
        Object.keys(defaultConfig).forEach(function (key) {
            config[key] = config[key] || defaultConfig[key];
        });
    } else {
        config = defaultConfig;
    }

    if (!config.cover.filename) {
        config.cover.filename = inFile.replace(/^(.*)(\.\w+)$/, '$1-out$2');
    }
    if (!config.profile.filename) {
        config.profile.filename = config.cover.filename.replace(/^(.*)(\.\w+)$/, '$1-profile$2');
    }

    var width = config.cover.width;
    var height = config.cover.height;

    return Q.promise(function (resolve, reject) {
        cv.readImage(inFile, function (err, im) {
            if (err) {
                return reject(err);
            }
            var w = im.size()[1],
                h = im.size()[0];

            if (w < 10 || h < 10) {
                return reject(new Error('Invalid input image'));
            }
            if (w <= h) {
                h = Math.round((h * width) / w);
                w = width;
            } else {
                w = Math.round((w * height) / h);
                h = height;
            }
            im.resize(w, h);

            if (h > height) {
                im = im.crop(0, (h / 2) - (height / 2), width, height);
            }
            if (w > width) {
                im = im.crop((w / 2) - (width / 2), 0, width, height);
            }

            im.resize(width, height);
            im.save(config.cover.filename);

            var bim = im.copy();
            bim.convertGrayscale();
            bim.detectObject(cv.FACE_CASCADE, {
                neighbors: 5
            }, function (err, faces) {
                try {
                    if (err || !faces || !faces.length) {
                        throw new Error('No faces detected');
                    }
                    config.profile.faces = faces.length;
                    var finalFace, faceSize = 0;
                    for (var i = 0; i < faces.length; i += 1) {
                        var face = faces[i];
                        if (face.width * face.height >= faceSize) {
                            faceSize = face.width * face.height;
                            finalFace = face;
                        }
                    }

                    var x = finalFace.x - (finalFace.width * 0.5),
                        y = finalFace.y - (finalFace.height * 0.5),
                        w = finalFace.width * 2,
                        h = finalFace.height * 2;

                    if (w > width) {
                        w = width;
                    } else if (w + x > width) {
                        x -= (width - w);
                        w = width;
                    }
                    if (h > height) {
                        h = height;
                    } else if (h + y > height) {
                        y -= (height - h);
                        h = height;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }

                    im = im.crop(x, y, w, h);
                    im.resize(config.profile.size, config.profile.size);
                    im.save(config.profile.filename);
                    return resolve(config);
                } catch (e) {
                    config.profile.faces = 0;
                    im.resize(config.profile.size, config.profile.size);
                    im.save(config.profile.filename);
                    return resolve(config);
                }
            });
        });
    });
};