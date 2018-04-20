const wallpaper = require('wallpaper');

wallpaper.set('C:/Users/Administrator/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper.jpg').then(() => {
  console.log('done');
});

wallpaper.get().then(imagePath => {
  console.log(imagePath);
  //=> '/Users/sindresorhus/unicorn.jpg'
});