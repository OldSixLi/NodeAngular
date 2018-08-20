/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 保存至当前的歌单中
 * @Last Modified by: 马少博
 * @Last Modified time:date
 */
/* jshint esversion: 6 */


/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');

/*
'##::: ##:'####::'######::'########:
 ###:: ##:. ##::'##... ##: ##.....::
 ####: ##:: ##:: ##:::..:: ##:::::::
 ## ## ##:: ##:: ##::::::: ######:::
 ##. ####:: ##:: ##::::::: ##...::::
 ##:. ###:: ##:: ##::: ##: ##:::::::
 ##::. ##:'####:. ######:: ########:
..::::..::....:::......:::........::
*/

console.logTip = str => {
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  console.log(str);
  console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
}

const PLAY_ID = 2364140116; // NOTE 歌单ID  十分重要,还不能弄错了
//调用方法
getHighCommentMusicList(100000, 10000000);

/**
 * 获取高评论量歌曲
 * 
 * @param {any} from 最低值
 * @param {any} to 最高值
 */
function getHighCommentMusicList(from, to) {
  DbHelper.getHighQualityMusicList(
    from,
    to,
    result => {
      if (result) {
        console.logTip(`数据库统计到评论量在${from}至${to}之间的歌曲共【${result.length}】条`);
        var list = [];
        for (var index = 0; index < result.length; index++) {
          var element = result[index];
          list.push(element.mid);
        }
        if (list.length > 0) {
          for (let i = 0; i < Math.ceil(list.length / 100); i++) {
            let arr = list.slice(i * 100, (i + 1) * 100);
            setTimeout(() => {
              console.log(`正在收藏${i * 100}----${ (i + 1) * 100}条`);
              loginC(arr);
            }, i * 3000);
          }
        }
      }
    });
}

/**
 * 将数据库中的数据保存至歌单中
 *
 * @param {*} arr
 */
function loginC(arr) {
  nodegrass.get("http://localhost:9999/login/cellphone?phone=12222222222&password=ma12222222222", function(data) {
    if (data) {
      var jsondata = JSON.parse(data);
      let cookie = jsondata.cookie;
      if (!cookie) {
        console.logTip(`登陆出现问题`);
      } else {
        console.logTip(`保存至歌单中...`);
      }

      console.logTip(`${arr.length }`);
      nodegrass.
      get(`http://localhost:9999/playlist/tracks?op=add&pid=${PLAY_ID}&tracks=${arr.join(',')}`,
        data => {
          if (data) {
            var jsondata = JSON.parse(data);
            console.logTip(`${data}`);
            console.logTip(`成功保存至歌单${jsondata.count}条`);
          }
        }, {
          'Cookie': cookie
        });
    }
  });

}