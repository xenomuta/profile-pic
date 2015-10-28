var profilePic = require('./.');
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
    /* Square ratio avatar */
    {
        avatar: true,
        width: 128,
        height: 128,
        filename: '/tmp/profile.jpg'
    }
];

profilePic(__dirname + '/test/images/input.jpg', images)
    .then(function (result) {
        console.log(result);
        // Results in an array for each input image, with detected faces when avatar == true
    })
    .catch(function (err) {
        console.error(err);
        // Something bad happened ...
    });