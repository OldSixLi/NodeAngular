
var fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname, '../public/Doc/test.html');
fs.watch(filePath, function(event, filename) {
  console.log('event is: ' + event);
  if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});