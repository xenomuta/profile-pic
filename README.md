
# Profile Picture

[![Build Status](https://travis-ci.org/xenomuta/profile-pic.png?branch=master)](https://travis-ci.org/xenomuta/profile-pic)

Create cover and profile pictures with face centered and uniform expected sizes.

It gets an input image and outputs two images: a cover image centered with specified size, and a profile picture with square ratio centered in bigest detected human face.

## Install

```bash
npm install profile-pic
```

## Usage

```javascript
var profilePic = require('profile-pic');
var images = [
    /* Landscape Ratio */
    {
        width: 800,
        height: 480,
        filename: '/tmp/landscape.jpg'
    },
    /* Portrait Ratio */
    {
        width: 480,
        height: 800,
        filename: '/tmp/standing.jpg'
    },
    /* Square ratio avatar */
    {
        avatar: true,
        width: 128,
        height: 128,
        filename: '/tmp/profile.jpg'
    }
];

profilePic('./test-image.jpeg', images)
    .then(function (result) {
        // Results in an array for each input image, with detected faces when avatar == true
    })
    .catch(function (error) {
        // Something bad happened ...
    });
```

This example will result in 3 images out of this input:

**INPUT**:

<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/input.jpg" alt="input">

**OUTPUT**:
- Two centered and resized to expected size:

(800x480)
<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/landscape.jpg" alt="800x480">

(400x240)
<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/standing.jpg" alt="800x480">

- And one avatar image with biggest detected face:

(128x128)
<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/profile.jpg" alt="800x480">




