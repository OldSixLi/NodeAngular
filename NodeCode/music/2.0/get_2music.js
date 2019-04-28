/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');
const async = require('async');

let SPIDER_INDEX = 1; //抓取到的数量
let PAYLIST_ARR = ['2163404529', '2230318386', '2325284160'];


// startResolvePlayListArr(3)
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
getHipHop()

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
  return new Promise(function (resolve, reject) {
    nodegrass.get(playUrl, data => {
      //获取到数据
      let playObj = {};
      try {
        playObj = data && JSON.parse(data);
      } catch (error) {
        console.error(error);
      }

      //获取到列表
      let musicArr = playObj.playlist && playObj.playlist.tracks || [];

      //遍历循环数据插入数据库中
      if (musicArr.length > 0) {
        let musicObjArr = [];
        musicArr.forEach((musicObj) => {
          musicObjArr.push(
            [musicObj.id,
            musicObj && musicObj.name || "",
            musicObj && musicObj.ar && musicObj.ar[0] && musicObj.ar[0].name || "",
            musicObj && musicObj.ar && musicObj.ar[0] && musicObj.ar[0].id || 0,
              0,
              playId,
            getNowFormatDate()
            ])
        });

        DbHelper.multiAddMusic(musicObjArr)
          .then(
            data => {
              console.log(`歌单【${playObj.playlist.name}】--- # ${data.affectedRows} #条数据已插入数据库中`);

              setTimeout(() => {
                resolve("处理完成");
              }, 300);

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

// -- 
// -- select mid, name ,author from music where  mid in(select mid from music where createtime >'2018-06-08 19:24:17' and createtime <'2018-08-13 18:28:02'  ) 

// -- 

// -- select * from
// -- (select * from music
// --  where mid  in(select mid from(select mid from  music where createtime >'2018-08-13 12:28:02'   group by mid  having count(mid )>1) a)
// --  and id  in (select id from(select max(id) as id from  music  group by mid  having count(mid )>1) b)) c
// -- 

//   update music set music.name=((select * from music
//  where mid  in(select mid from(select mid from  music where createtime >'2018-08-13 12:28:02'   group by mid  having count(mid )>1) a)
//  and id  in (select id from(select max(id) as id from  music  group by mid  having count(mid )>1) b)) c).name where music.id=c.mid;

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