
# Profile Picture

[![Build Status](https://travis-ci.org/xenomuta/profile-pic.png?branch=master)](https://travis-ci.org/xenomuta/profile-pic)

Create cover and profile pictures with face centered and uniform expected sizes.

It gets an input image and outputs two images: a cover image centered with specified size, and a profile picture with square ratio centered in bigest detected human face.

## Install

```bash
npm install profile-pic
```

## Usage

```javscript
var pp = require('profile-pic');

pp('./input-image.jpg', {
	cover: {
		width: 800,
		height: 240,
		filename: '/tmp/cover.jpg'
	},
	profile: {
		size: 128,
		filename: '/tmp/profile.jpg'
	}
}).then(function () {
	// ... all good ...
}).catch(function (err) {
	// ... an error has ocurred ...
	console.error(err);
});

```



