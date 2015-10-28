
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
        width: 400,
        height: 240,
        filename: '/tmp/landscape.jpg'
    },
    /* Portrait Ratio */
    {
        width: 240,
        height: 400,
        filename: '/tmp/standing.jpg'
    },
    /* detected face avatar with square ratio */
    {
        avatar: true,
        width: 128,
        height: 128,
        filename: '/tmp/profile.jpg'
    }
];

profilePic('./test-image.jpeg', images)
    .then(function (result) {
		/*
		[ { width: 400, height: 240, filename: '/tmp/landscape.jpg' },
		  { width: 240, height: 400, filename: '/tmp/standing.jpg' },
		  { avatar: true,
		    width: 128,
		    height: 128,
		    filename: '/tmp/profile.jpg',
		    faces: 5 } ]
		*/
    })
    .catch(function (err) {
        // Something bad happened ...
    });
```

This example will result in 3 images out of this input:

**INPUT**:

<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/input.jpg" alt="input">

**OUTPUT**:
- Two centered and resized to expected size:

<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/landscape.jpg" alt="400x240">

landscape.jpg (400x240)

<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/standing.jpg" alt="200x120">

standing.jpg (400x240)

- And one avatar image with biggest detected face:

<img src="https://raw.githubusercontent.com/xenomuta/profile-pic/master/test/images/profile.jpg" alt="128x128">

profile.jpg (128x128)



