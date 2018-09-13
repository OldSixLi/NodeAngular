/**
 * 网易云音乐爬虫
 * @returns
 */

const nodegrass = require('nodegrass');
const DbHelper = require('./../../zhihu/mysql.js');
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




// playListSet(0)

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

getHighCommentMusicList(100000, 10000000);
/**
 * 获取高评论量歌曲
 * 
 * @param {any} from 最低值
 * @param {any} to 最高值
 */
function getHighCommentMusicList(from, to) {
  // DbHelper.getHighQualityMusicList(
  //   from,
  //   to,
  //   result => {
  //     if (result) {
  //       console.log("当前获取到的数据有" + result.length + "条");
  //       var list = [];
  //       for (var index = 0; index < result.length; index++) {
  //         var element = result[index];
  //         list.push(element.mid);
  //       }
  //       console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  //       console.log(list.join(','));
  //       console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
  //       loginC(list);
  //     }
  //   });

  // 
  DbHelper
    .resloveSql(`select  mid  from music where  comment >50000 and comment<=100000 order  by comment `)
    .then(
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
          // loginC(list.reverse());
        }

      })
}



// loginC();

function loginC(arr) {
  nodegrass.get("http://localhost:9999/login/cellphone?phone=12222222222&password=ma12222222222", function(data) {
    if (data) {
      var jsondata = JSON.parse(data);
      let cookie = jsondata.cookie;
      nodegrass.get(`http://localhost:9999/playlist/tracks?op=add&pid=2152848849&tracks=186139,276294,28248872,108251,27583305,1293951677,25727803,17753288,579954,29460377,141664,28830411,480353,29567192,21803760,437859519,31654478,32341324,185868,458238990,444269135,31654343,38358820,29713754,28949843,17194024,35528482,28665224,557581284,448184048,4132379,2313544,26625301,1934649,27808044,451169473,29818120,448144319,514235010,357126,463157222,1371159,504835560,27946894,408332757,33291435,17996972,477251491,17177324,482988834,21311956,28563317,30064263,29019227,407679465,5253801,33887645,435288399,526307800,26508240,515453363,27552544,20953761,461519272,347230,4386589,32957955,430685732,569214247,316654,407761576,28639182,185904,27876900,26830666,425828457,469699266,186125,2001320,426881506,479598964,472045959,399354289,3986017,287063,27646196,27406244,483937795,5260494,1217823,465677131,86369,443875380,402073807,22712173,415792563,478303470,167975,470759757,224000,33937527,26508242,1491585,36492599,169185,1210496,25731320,423228325,586299,63650,26830207,35403523,490602750,29431066,25906124,28188171,423849475,1696373,29814898,29572804,448393515,27901832,27955654,35847388,41500546,405597568,27890306,437387277,557584658,432506809,26060065,26620756,27867140,526464145,175072,79938,26199445,167876,518686034,489998494,25718007,562594267,506092019,27646199,185924,449577226`, function(data) {
        if (data) {
          var jsondata = JSON.parse(data);
          console.log(data)
          console.log(jsondata.count);
        }
      }, { 'Cookie': cookie });
    }
  });

  // nodegrass.get("http://localhost:9999/playlist/tracks?op=add&pid=909675332&tracks=523251474,1297486087,1296583188,504017347,526307800,574566207,1294899063,478303470,33887645,28885472,518076124,507116418,443875380,520458481,1293951677,525278524,569214247,574921549,557584658", function(data) {
  //   if (data) {
  //     var jsondata = JSON.parse(data);
  //     console.log(data)
  //     console.log(jsondata.count);
  //   }
  // });
}