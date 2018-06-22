let fs = require('fs');
let path = require('path');

/**
 * 复制src目录中的所有文件
 *
 * @param {*} src 被复制的路径
 * @param {*} dst 新路径
 * @param {*} isIncludeChildDir 是否包含子目录(默认不包含)
 */
let copy = (src, dst, isIncludeChildDir = false) => {
  let paths = fs.readdirSync(src); // 同步读取目录中的所有文件/目录
  //遍历文件
  paths.forEach(path => {
    let _src = src + '/' + path;
    let _dst = isIncludeChildDir ? (dst + '/' + path) : dst;
    fs.stat(_src, (err, st) => {
      if (err) { throw err; }
      // 判断是否为文件
      if (st.isFile()) {
        //如果完整映射 需去除此变量
        let newPath = isIncludeChildDir ? _dst : (_dst + '/' + _src.substr(_src.lastIndexOf('/') + 1));
        console.log("复制到 ■■■■■■■ " + newPath);
        //进行资源处理
        fs.writeFileSync(newPath, fs.readFileSync(_src));
      } else if (st.isDirectory()) {
        // 如果是目录则递归调用自身
        startCopy(_src, _dst, isIncludeChildDir);
      }
    });
  });
};

/**
 * 注意此处如果想让目录一一对应,则需调整isFullCopy的值
 *
 * @param {*} src 被复制的路径
 * @param {*} dst 复制的路径
 * @param {*} isFullCopy 是否完整复制子路径
 */
let startCopy = (src, dst, isFullCopy = false) => {
  fs.exists(dst, function(exists) {
    // 已存在
    if (exists) {
      copy(src, dst, isFullCopy);
    }
    // 不存在则创建此目录
    else {
      fs.mkdir(dst, function() {
        copy(src, dst, isFullCopy);
      });
    }
  });
};

//运行代码
startCopy(path.resolve(__dirname, './tubatu/img2'), path.resolve(__dirname, './tubatu/ALL/'), false);