/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const cheerio = require('cheerio');
const fs = require("fs");
const mysql = require('mysql');
const Q = require('q');
const path = require('path');
const io = require('socket.io')();
const DbHelper = require('./../zhihu/mysql.js');
const async = require('async');

let SPIDER_INDEX = 1; //抓取到的数量
let PAYLIST_INDEX = 0; //可用的歌单
let PAYLIST_ARR = [];　　　　　

/*
:'######::'########::::'###::::'########::'########:
'##... ##:... ##..::::'## ##::: ##.... ##:... ##..::
 ##:::..::::: ##:::::'##:. ##:: ##:::: ##:::: ##::::
. ######::::: ##::::'##:::. ##: ########::::: ##::::
:..... ##:::: ##:::: #########: ##.. ##:::::: ##::::
'##::: ##:::: ##:::: ##.... ##: ##::. ##::::: ##::::
. ######::::: ##:::: ##:::: ##: ##:::. ##:::: ##::::
:......::::::..:::::..:::::..::..:::::..:::::..:::::
*/
　　　　　　
// playList(0);

// function playList(str) { console.log(str); }




playListSet(0)

function playListSet(index_page_num) {
  console.log(index_page_num);
  nodegrass.post(
    `http://localhost:9999/top/playlist/highquality?limit=30&offset=${index_page_num * 35}&cat=%E8%AF%B4%E5%94%B1`,
    (data, err) => {
      let resultArr = [];
      //获取数据
      try {　　
        resultArr = JSON.parse(data) && JSON.parse(data).playlists;
      } catch (error) {　　
        console.log(error);　　
      }

      if (resultArr.length > 0 && index_page_num < 20) {
        console.log(`第【${index_page_num}】页,有 #${resultArr.length}# 条结果`);

        //遍历数组
        resultArr.forEach(element => {
          // 声明歌单对象
          let playListObj = {
            playId: element.id,
            name: element.name || "", //歌单名称
            collectCount: element.playCount || 0, //收藏量(w)
            imgSrc: element.coverImgUrl || "", //歌单封面图片
            href: `/playlist?id=${element.id}` //地址
          };

          console.log(`歌单【${element.name}】---- 播放量:${element.playCount}万`);

          DbHelper.listAdd(playListObj); //数据库添加 

          PAYLIST_ARR.push(`http://localhost:9999/playlist/detail?id=${element.id}`); //插入相关的列表数组
        });
        //抓取
        setTimeout(function() {
          index_page_num++;
          playListSet(index_page_num);
        }, 3000);

      } else {
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(`当前待抓取歌单数量为: ${PAYLIST_ARR.length}`);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        //开始处理歌单
        // startResolvePlayListArr(5);
      }
    });
}


/**
 * 开始处理歌单列表(每次处理num条)
 * 
 * @param {any} asyncNum  每次下载多少
 */
function startResolvePlayListArr(asyncNum) {
  async.mapLimit(
    PAYLIST_ARR,
    asyncNum,
    (href, callback) => {
      setTimeout(() => {
        //开始获取歌单详情
        getPlayListDetail(href + "&timestamp=" + new Date().getTime(), callback);
      }, 10000);
    },
    err => {
      if (err) {
        console.log(err);
      } else {
        console.log("全部已下载完毕！");
      }
    });
}

/**
 * 获取歌单详情
 * 
 * @param {any} playListHref 歌单地址
 * @param {any} callback 回调函数
 */
function getPlayListDetail(playListHref, callback) {
  var playID = playListHref.split("?id=")[1];
  setTimeout(
    () => {
      nodegrass.get(
        playListHref,
        data => {
          if (data) {
            var payListJson = {};
            try {　　
              payListJson = JSON.parse(data);
            } catch (error) {　　
              console.log(error);　　
            }

            //存储歌曲信息进music表
            for (var songIndex = 0; songIndex < payListJson.privileges.length; songIndex++) {
              var musicObj = payListJson.privileges[songIndex];
              var model = {
                id: musicObj.id,
                collectid: playID,
                name: "",
                comment: ""
              };
              //数据库添加 
              DbHelper.musicAdd(model);
              SPIDER_INDEX++;
              console.log(payListJson.playlist.name + "第" + SPIDER_INDEX + "首:" + musicObj.id);
            }
            callback(null, "successful!");
          } else {
            console.log("请求失败...");
          }
        });
    }, 1000);
}
/*
'########::'##::::::::::'###::::'##:::'##:'##:::::::'####::'######::'########:
 ##.... ##: ##:::::::::'## ##:::. ##:'##:: ##:::::::. ##::'##... ##:... ##..::
 ##:::: ##: ##::::::::'##:. ##:::. ####::: ##:::::::: ##:: ##:::..::::: ##::::
 ########:: ##:::::::'##:::. ##:::. ##:::: ##:::::::: ##::. ######::::: ##::::
 ##.....::: ##::::::: #########:::: ##:::: ##:::::::: ##:::..... ##:::: ##::::
 ##:::::::: ##::::::: ##.... ##:::: ##:::: ##:::::::: ##::'##::: ##:::: ##::::
 ##:::::::: ########: ##:::: ##:::: ##:::: ########:'####:. ######::::: ##::::
..:::::::::........::..:::::..:::::..:::::........::....:::......::::::..:::::
*/
// getHipHop()

async function getHipHop() {
  let playIdList = await DbHelper.getHipHop();
  console.log(playIdList.length + "个歌单");
  //循环遍历歌单
  for (let i = 0; i < playIdList.length; i++) {

    await playList(playIdList[i].playid).then(
      data => {
        console.log(`第${i}条处理结果是:■■■■【 ${data} 】■■■■`);
        console.log();
      }
    );
  }
}


async function playList(playId) {
  // let playId = 2119440255;
  // console.log(playId);
  let playUrl = `http://localhost:9999/playlist/detail?id=${playId}`
  return new Promise(function(resolve, reject) {
    nodegrass.get(playUrl, data => {
      // console.log(data);
      let playObj = {};
      try {　　
        playObj = data && JSON.parse(data);
      } catch (error) {　　
        console.log(error);　　
      }
      let musicArr = playObj.privileges || [];
      if (musicArr.length > 0) {
        // let sql = "INSERT INTO music (name, address) VALUES ?";
        let musicObjArr = [];
        musicArr.forEach(musicObj => musicObjArr.push([musicObj.id, "", "", playId, getNowFormatDate()]));

        DbHelper.multiAddMusic(musicObjArr)
          .then(
            data => {

              console.log(`歌单【${playObj.playlist.name}】--- # ${data.affectedRows} #条数据已插入数据库中`);
              resolve("处理完成")


            },
            err => {
              console.log(`歌单【${playObj.playlist.name}】出现错误:${err}`);
              resolve(`歌单【${playObj.playlist.name}】插入数据库出现错误:${err}`)
            }
          )
      } else {
        resolve(`${playId}--Empty Value`)
      }
    })
  });
}
/*
:'######:::'#######::'##::::'##:'##::::'##:'########:'##::: ##:'########:
'##... ##:'##.... ##: ###::'###: ###::'###: ##.....:: ###:: ##:... ##..::
 ##:::..:: ##:::: ##: ####'####: ####'####: ##::::::: ####: ##:::: ##::::
 ##::::::: ##:::: ##: ## ### ##: ## ### ##: ######::: ## ## ##:::: ##::::
 ##::::::: ##:::: ##: ##. #: ##: ##. #: ##: ##...:::: ##. ####:::: ##::::
 ##::: ##: ##:::: ##: ##:.:: ##: ##:.:: ##: ##::::::: ##:. ###:::: ##::::
. ######::. #######:: ##:::: ##: ##:::: ##: ########: ##::. ##:::: ##::::
:......::::.......:::..:::::..::..:::::..::........::..::::..:::::..:::::
*/

//获取歌曲评论
// getMusicList(1, 1000);
var MUSICLIST = [];

/**
 * 获取空评论列表并抓取数据填充进数据库中
 * 
 * @param {any} pageIndex 页码
 * @param {any} pageNum 分页偏移量
 */
function getMusicList(pageIndex, pageNum) {
  DbHelper.getEmptyCommentMusicList(
    pageIndex,
    pageNum,
    result => {
      if (result && result.length) {
        //如果返回结果
        for (var m = 0; m < result.length; m++) {
          var element = result[m];
          MUSICLIST.push(element);
        }
        //延时执行
        setTimeout(
          () => {
            pageIndex++;
            getMusicList(pageIndex, 1000);
          }, 500);
      } else {
        //进行请求操作
        getMusic(5);
      }
    });
}

/**
 * 批量进行评论量请求
 * 
 * @param {any} asyncNum 每次请求的数量
 */
function getMusic(asyncNum) {
  console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log("开始进行请求");
  console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
  async.mapLimit(MUSICLIST, asyncNum, function(item, callback) {
    setTimeout(function() {
      getSingleMusicComment(item, callback);
    }, 1000);
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("全部已下载完毕！");
    }
  });
}

/**
 * 获取单个歌曲的评论量
 * 
 * @param {any} item 
 * @param {any} callback 
 */
function getSingleMusicComment(item, callback) {
  var musicId = item.mid; //歌曲ID
  var id = item.id; //主键
  // var name = item.name;
  setTimeout(function() {
    nodegrass.get(
      "http://localhost:9999/comment/music?id=" + musicId + '&limit=1&offset=2',
      data => {
        item.total = JSON.parse(data).total || 0;
        DbHelper.updateMusic(item)
        callback(null, 'success');
      }).on('error', function(e) {
      console.log("Got error: " + e.message);
      callback(null, 'success');
    });
  }, 1000);
}　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
/*
'##::: ##::::'###::::'##::::'##:'########:
 ###:: ##:::'## ##::: ###::'###: ##.....::
 ####: ##::'##:. ##:: ####'####: ##:::::::
 ## ## ##:'##:::. ##: ## ### ##: ######:::
 ##. ####: #########: ##. #: ##: ##...::::
 ##:. ###: ##.... ##: ##:.:: ##: ##:::::::
 ##::. ##: ##:::: ##: ##:::: ##: ########:
..::::..::..:::::..::..:::::..::........::
*/

//获取歌曲名称
// getEmptyNameMusicList(1, 1000);
var EMPTY_NAME_MUSIC_LIST = [];
/**
 * 获取空名称音乐列表
 * 
 * @param {any} pageIndex 
 * @param {any} pageNum 
 */
function getEmptyNameMusicList(pageIndex, pageNum) {
  DbHelper.getEmptyMusicList(pageIndex, pageNum,
    result => {
      if (result && result.length && pageIndex <= 10) {
        //如果返回结果
        for (var m = 0; m < result.length; m++) {
          var element = result[m];
          EMPTY_NAME_MUSIC_LIST.push(element);
        }
        console.log(pageIndex + "页面");
        setTimeout(function() {
          pageIndex++;
          getEmptyNameMusicList(pageIndex, 1000);
        }, 500);
      } else {
        //进行请求操作
        getEmptyNameMusic(5);
      }
    })
}

/**
 * 开始批量抓取歌单详细信息
 * 
 * @param {any} asyncNum 每次操作的数量
 */
function getEmptyNameMusic(asyncNum) {
  console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log("开始进行歌曲名称详情请求");
  console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
  // async.parallelLimit
  async.mapLimit(EMPTY_NAME_MUSIC_LIST, asyncNum,
    (item, callback) => {
      setTimeout(() => {
        getSingleMusicName(item, callback);
      }, 1000);
    },
    (err, result) => {
      err && console.log(err);
      !err && console.log("全部已下载完毕！");
    });
}

/**
 * 根据music相关信息进行某个歌曲的详情请求
 * 
 * @param {any} item 歌曲信息
 * @param {any} callback 回调
 */
function getSingleMusicName(item, callback) {
  var musicId = item.mid; //歌曲ID
  var id = item.id; //主键 
  setTimeout(
    () => {
      nodegrass.get(
        "http://localhost:9999/song/detail?ids=" + musicId,
        data => {
          try {　　
            let json_data = JSON.parse(data);
            item.name = (json_data.songs && json_data.songs.length > 0) ? json_data.songs[0].name : ""; //名称
            item.author = (json_data.songs && json_data.songs.length > 0 && json_data.songs[0].ar && json_data.songs[0].ar.length > 0) ? json_data.songs[0].ar[0].name : ""; //作者
            if (item.name || item.author) {
              //添加信息到数据库中
              DbHelper.updateMusicName(item)
            } else {
              //查询不到的信息删除
              DbHelper.deleteMusicById(item.id);
            }
            callback(null, 'success');
          } catch (error) {　　
            console.log(error);　　
          }
        }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(null, 'success');
      })
    }, 1000);

}

/**
 * 生成随机数（不包含起止点）
 * 
 * @param {any} start 起点
 * @param {any} end 终点
 */
function radomNum(start, end) {
  end = start > end ? [start, start = end][0] : end; //保证End最大  
  return parseInt(Math.random() * (end - start) + start + 1);
}

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

// getHighCommentMusicList(50000, 100000);
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
        console.log("当前获取到的数据有" + result.length + "条");
        var list = [];
        for (var index = 0; index < result.length; index++) {
          var element = result[index];
          list.push(element.mid);
        }
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(list.join(','));
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");

      }
    });
}

/**
 * 获取当天日期
 * @param {规定只返回日期还是返回日期时间} dates
 * @returns {}
 */
function getNowFormatDate(dates) {
  var date = new Date(),
    seperator1 = "-",
    seperator2 = ":",
    month = date.getMonth() + 1,
    strDate = date.getDate();
  if (month >= 1 && month <= 9)
    month = "0" + month;
  if (strDate >= 0 && strDate <= 9)
    strDate = "0" + strDate;
  //返回当前的日期（时间）
  var currentdate = dates !== 'date' ? date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds() : date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// nodegrass.get("http://localhost:9999/login/cellphone?phone=18222223333&password=ma18222223333", function(data) {
//   if (data) {
//     var jsondata = JSON.parse(data);
//     console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
//     console.log(jsondata.profile.signature);
//     console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
//   }
// });

// nodegrass.get("http://localhost:9999/playlist/tracks?op=add&pid=909675332&tracks=208889", function(data) {
//   if (data) {
//     var jsondata = JSON.parse(data);
//     console.log(data)
//     console.log(jsondata.count);
//   }