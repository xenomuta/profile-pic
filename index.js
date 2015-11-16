'use strict';

var Q = require('q'),
    cv = require('opencv'),
    fs = require('fs'),
    Debug = require('debug'),
    debug = new Debug('profile-pic');

module.exports = function ProfilePic(inFile, outputs) {
    if (!outputs || !Object.keys(outputs)) {
        throw new Error('No configuration specified');
    }

    return Q.promise(function (finalResolve, finalReject) {
        if (!fs.existsSync(inFile)) {
            return finalReject('Input image file not found');
        }
        cv.readImage(inFile, function (err, image) {
            if (err) {
                return finalReject(err);
            }
            debug('* Loaded image: %j', image.size());
            var promises = outputs.map(function (output, idx) {
                return Q.promise(function (resolve, reject) {
                    debug('* Generating image: %j', [output.height, output.width]);
                    if (!output.filename) {
                        output.filename = inFile.replace(/^(.*)(\.\w+)$/, '$1-out-' + (idx + 1).toString() + '$2');
                    }
                    var im = image.copy();

                    var width = output.width;
                    var height = output.height;

                    if (output.avatar) {
                        debug('* Detecting faces');
                        var bim = im.copy();
                        bim.convertGrayscale();
                        return bim.detectObject(cv.FACE_CASCADE, {
                            neighbors: 5
                        }, function (err, faces) {
                            debug(err);
                            try {
                                if (err || !faces || !faces.length) {
                                    throw new Error('No faces detected');
                                }
                                debug('* Faces detected: %d', faces.length);
                                output.faces = faces.length;
                                var finalFace, faceSize = 0;
                                for (var i = 0; i < faces.length; i += 1) {
                                    var face = faces[i];
                                    if (face.width * face.height >= faceSize) {
                                        faceSize = face.width * face.height;
                                        finalFace = face;
                                    }
                                }

                                var width = bim.size()[1],
                                    height = bim.size()[0],
                                    padding = 2;

                                var x = finalFace.x - (finalFace.width / padding),
                                    y = finalFace.y - (finalFace.height / padding),
                                    w = finalFace.width * padding,
                                    h = finalFace.height * padding;

                                if (x < 0) {
                                    x = 0;
                                }
                                if (y < 0) {
                                    y = 0;
                                }
                                if (x + w > width) {
                                    w -= (x + w) - width;
                                }
                                if (y + h > height) {
                                    h -= (y + h) - height;
                                }
                                if (x < 0 || y < 0 || x + w > width || y + h > height) {
                                    throw new Error('Face ROI out of image bounds');
                                }
                                im = im.crop(x, y, w, h);
                            } catch (e) {
                                console.error(e);
                                output.faces = 0;
                            }
                            output.im = im;
                            return resolve(output);
                        });
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
                    output.im = im;
                    resolve(output);
                });
            });

            Q.all(promises).then(function (outputs) {
                try {
                    outputs = outputs.map(function (output) {
                        output.im.resize(output.width, output.height);
                        output.im.save(output.filename);
                        delete output.im;
                        return output;
                    });
                    finalResolve(outputs);
                } catch (e) {
                    finalReject(e);
                }
            });
        });
    });
};