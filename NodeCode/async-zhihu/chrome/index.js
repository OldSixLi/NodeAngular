var webpage = require('webpage'),
  page = webpage.create();
page.viewportSize = { width: 1024, height: 800 };
page.clipRect = { top: 0, left: 0, width: 1024, height: 800 };
page.settings = {
  javascriptEnabled: false,
  loadImages: true,
  userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
};
page.open('https://music.163.com/#/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=35', function(status) {
  var data;
  if (status === 'fail') {
    console.log('open page fail!');
  } else {
    console.log(page.content);
    page.render('./img/test.png');
  }
  // release the memory
  page.close();
});
// phantomjs index.js