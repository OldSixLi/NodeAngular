 /**
  * 知乎抓取数据存储进入数据
  * @李老六(1030809514@qq.com )
  * @date    2016年8月2日13:06:18
  * @version v 0.1.1
  */

 var mysql = require('mysql');
 var TEST_DATABASE = 'nodesql';
 var TEST_TABLE = 'user';

 //创建连接
 var client = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: '123456',
   port: '3306'
 });
 client.connect();
 //和哪个数据库建立连接
 client.query("use " + TEST_DATABASE);

 /**
  * 通用的数据存储方法
  * 后期移出 (统一以Promise方式回调)
  * @returns 
  */
 function resloveSql(sql, param, callback) {
   let addSql = sql;
   return new Promise((resolve, reject) => {
     client.query(sql, param, (err, result) => {
       //如果存在回调函数,则执行回调
       callback && callback(err, result);
       //promise 返回结果集
       if (err) {
         reject(err);
       } else {
         resolve(result);
       }
     });
   });
 }

 //数据存储
 function start(questrionModel) {
   //语句
   var userAddSql = 'INSERT INTO Answers(QuestrionId,Question,AnswerUserName,AnswerUserLink,AnswerId,DianzanCount,Detail,CreateTime) VALUES(?,?,?,?,?,?,?,NOW())';
   //参数
   var userAddSqlParams = [
     questrionModel.QuestrionId,
     questrionModel.Question,
     questrionModel.AnswerUserName,
     questrionModel.AnswerUserLink,
     questrionModel.AnswerId,
     questrionModel.DianzanCount,
     questrionModel.Detail
   ];
   //增 add
   client.query(userAddSql, userAddSqlParams, function(err, result) {
     if (err) {
       console.log('[INSERT ERROR] - ', err.message);
       return;
     }
     console.log('~~~~~~~~~~~~~~~~~~~数据插入成功~~~~~~~~~~~~~~~~~~~~~~~');
     console.log('作者：【' + questrionModel.AnswerUserName + '】,用户链接' + questrionModel.AnswerUserLink);
     console.log('INSERT ID:', result.insertId + ',Anserid:' + questrionModel.AnswerId + ' ,点赞数：【' + questrionModel.DianzanCount + '】 ');
     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');
   });
 }

 /**
  * 数据库中插入用户
  * 
  * @param {any} userModel 用户信息对象
  */
 function AddUser(userModel) {
   let userAddSql = 'INSERT INTO music_users(\
    userid,\
    nickname,\
    weibourl,\
    selfword,\
    imgurl,\
    date,\
    level) \
    VALUES(?,?,?,?,?,NOW(),?)';
   let params = [
     userModel.userid,
     userModel.nickname,
     userModel.weibourl,
     userModel.selfword,
     userModel.imgurl,
     userModel.level
   ]
   return new Promise((resolve, reject) => {
     client.query(
       userAddSql,
       params,
       (err, result) => {
         if (err) {
           reject(err);
         } else {
           resolve('插入成功');
         }
       });
   });
 }
 /**
  * 批量添加关注者信息
  * 
  * @param {array} arr  关注人的信息(多条)
  * @returns 
  */
 function addFollow(arr) {
   let sql = 'INSERT INTO user_follow(\
    userid,\
    followid,followusername) \
    VALUES';
   let str = "";
   let strArr = arr.map(x => {
     return '(' + x.userID + ',' + x.followID + ',"' + x.followUserName + '")';
   });
   params = strArr.join(',');
   return new Promise((resolve, reject) => {
     client.query(
       sql + params, null,
       (err, result) => {
         if (err) {
           reject(err);
         } else {
           resolve('插入成功');
         }
       });
   });
 }
 /**
  * 从数据库获取关注者信息
  * 
  * @returns 
  */
 function getFollow() {
   //将int类型转化为字符串类型
   let sql = "select \
  CAST(userid AS CHAR) as source,\
  CAST(followid AS CHAR) as target,\
  followusername from user_follow \
  limit 0,30000";
   return new Promise(function(resolve, reject) {
     client.query(sql,
       (err, result) => {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
   });
 }

 /**
  * 获取数据库中用户列表
  * 
  * @returns 
  */
 function getUser() {
   let sql = "select id,userid,nickname as name ,level from music_users order by level limit 0,200";
   //返回一个promise对象才可以调用then等函数
   return new Promise(function(resolve, reject) {
     client.query(sql,
       (err, result) => {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
   });
 }
 var NUMBERS = 0;
 /**
  * 歌单插入数据库
  * 
  * @param {any} model 
  */
 function musicPayListAdd(model) {
   let findSql = "select * from paylist where playid=" + model.playId;
   let sql = "insert  into paylist(playId,name,href,src,collectnum,createtime) values(?,?,?,?,?,NOW())";
   let param = [
     model.playId,
     model.name,
     model.href,
     model.imgSrc,
     model.collectCount
   ];
   //查

   client.query(findSql, function(err, result) {
     if (err) {
       console.log(err);
       return;
     }
     if (!err && result.length == 0) {
       //增 add
       client.query(sql, param, function(err, result) {
         if (err) {
           console.log('[INSERT ERROR] - ', err.message);
           return;
         }
         console.log(`数据库插入歌单数据成功,歌单ID:${model.playId},歌单名称:${model.name}`);
       });
     } else {
       console.log(`${model.name}已经存在于歌单数据库表中`);
     }
   });
 }


 /**
  * 歌单插入数据库
  * 
  * @param {any} modelList 
  */
 function multiPlayListAdd(modelList) {

   //返回一个promise对象才可以调用then等函数
   return new Promise(function(resolve, reject) {
     let sql = "insert  into paylist(playId,name,href,src,collectnum,createtime) values ?";
     let param = modelList;

     //批量增 add
     client.query(sql, [param], function(err, result) {
       if (err) {
         reject(err);
       } else {
         resolve(result);
       }
     });
   });


 }


 function deleteRepeatPlayList() {
   return new Promise(function(resolve, reject) {
     let sql = `delete from paylist
     where playid  in(select playid from(select playid from  paylist  group by playid  having count(playid )>1) a)
     and id not in (select id from(select min(id) as id from  paylist  group by playid  having count(playid )>1) b)`;

     //批量增 add
     client.query(sql, function(err, result) {
       if (err) {
         reject(err);
       } else {
         resolve(result);
       }
     });
   });
 }

 /**
  * 数据库中日期大于2018-06-07的都是hiphop歌单
  * 截止至2018年8月13日10:13:07 是这样
  *
  */
 function getHipHopPlayList() {
   return new Promise(function(resolve, reject) {
     let sql = "select  playid from paylist where id>2471 and createtime<'2018-08-14'";
     client.query(sql, function(err, result) {
       if (!err) {
         resolve(result);
       } else {
         resolve([]);
       }
     })
   });

 }



 function multiAddMusic(musicArr) {
   //  console.log(musicArr);
   //返回一个promise对象才可以调用then等函数
   return new Promise(function(resolve, reject) {
     let sql = "INSERT INTO music (mid,name,author,comment,collectid,createtime) VALUES ?";
     let param = musicArr;
     // NOTE注意此处的param一定要被[]包裹起来
     client.query(sql, [param], (err, result) => {
       if (!err) {
         resolve(result);
       } else {
         reject(err);
       }
     })
   });

 }

 /**
  * 获取歌单ID列表
  * @returns
  */
 function playList(next) {
   var sql = 'select DISTINCT playid from paylist';
   client.query(sql, function(err, result) {
     if (!err) {
       next(result);
     } else {
       next([]);
     }
   })
 }

 /**
  * 查询当前的问题是否已经遍历过
  * @param {any} questionId 
  * @param {any} next 
  */
 function finds(questionId, next) {
   if (questionId) {
     var userAddSql = 'select * from  Answers where QuestrionId="' + questionId + '"';
     client.query(userAddSql, function(err, result) {
       if (!err) {
         next(result.length);
       } else {
         next(0);
       }
     });
   };
 }


 /**
  * 分页获取数据库中网易云歌曲评论量为0的数据
  * 
  * @param {any} pageInedx 
  * @param {any} pageNum 
  * @param {any} next 
  */
 function getEmptyCommentMusicList(pageInedx, pageNum, next) {
   var start = (pageInedx - 1) * pageNum;
   var end = pageNum;
   //  之前查询的评论为0的歌曲列表
   //  var sql = "select id,mid,name from music where comment=0  LIMIT " + start + "," + pageNum;

   //2018年8月10日17:24:31 嘻哈
   var sql = "select id,mid,name from music where   comment=0  LIMIT " + start + "," + pageNum;
   //更新歌曲评论
   //  var sql = "select id,mid,name from music order by comment desc LIMIT " + start + "," + pageNum;
   //  'SELECT id, mid FROM music ORDER BY comment DESC LIMIT 0 ,100'
   client.query(sql, function(err, result) {
     if (!err) {
       next(result);
     } else {
       next(0);
     }
   });
 }


 /**
  * 获取数据库中歌曲名为空的数据
  * 
  * @param {any} pageInedx 
  * @param {any} pageNum 
  * @param {any} next 
  */
 function getEmptyMusicList(pageInedx, pageNum, next) {
   var start = (pageInedx - 1) * pageNum;
   var end = pageNum;
   //  var sql = "select id,mid from music where name=''  LIMIT " + start + "," + pageNum;


   var sql = "select id,mid from music where createtime >'2018-06-18' and name=''  LIMIT " + start + "," + pageNum;
   client.query(sql, function(err, result) {
     if (!err) {
       next(result);
     } else {
       next(0);
     }
   });
 }

 /**
  * 更新歌曲名称
  * 
  * @param {any} name 
  * @param {any} id 
  */
 function updateMusicName(item) {
   // \"" + item.name + "\"
   // \"" + item.author + "\"
   let sql = "update  music set name=? , author=?  where id=" + item.id;
   client.query(sql, [item.name, item.author], function(err, result) {
     if (err) {
       console.log('[INSERT ERROR] - ', err.message);
       console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
       console.log(sql);
       console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
       return;
     }
     console.log('名称：' + getfullStr(item.id) + ",▇▇▇▇▇▇歌曲名:" + item.name + '--' + item.author);
   });
 }
 /**
  * 获取高评论量歌曲
  * 
  * @param {any} next 
  */
 function getHighQualityMusicList(fromNum, toNum, next) {
   // var sql = "select mid from music where COMMENT>100000";
   var sql = "select * from music where comment>=" + fromNum + " and comment<=" + toNum + " and createtime>'2018-06-08 16:24:17' order by id ";
   // and COMMENT<=50000 order by id limit 1400,200
   client.query(sql, function(err, result) {
     if (!err) {
       next(result);
     } else {
       next(0);
     }
   })
 }
 /**
  * 更新评论数量以及歌曲名称
  * 
  * @param {any} model 
  */
 function updateMusic(model) {
   var sql = "update music set comment=" + model.total + "  where id=" + model.id;
   client.query(sql, function(err, result) {
     if (err) {
       console.log('[INSERT ERROR] - ', err.message);
       return;
     } else {
       console.log('歌曲:《' + model.name + '》歌曲ID： ' + getfullStr(model.mid) + "评论量:" + model.total + ' 成功加入歌单');
       console.log("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ");
       //  console.log(result);
     }
   });
 }





 /**
  * 批量更新评论数量以及歌曲名称
  * 
  * @param {any} model 
  */
 function multiUpdateMusic(arr) {
   return new Promise(function(resolve, reject) {

     //  var sql = "update music set comment=" + model.total + "  where id=" + model.id;
     if (!arr.length) {
       reject(0);
     }
     let str = arr.reduce((p, n) => { return p += `WHEN ${n.mid} THEN ${n.total} `; }, '');
     let idstr = arr.reduce((p, n) => { return p += `${n.mid},`; }, '');
     let sql = `
     UPDATE music SET comment = CASE mid 
     ${str}
     END
     WHERE mid IN (${idstr.slice(0,-1)})
     `;
     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
     console.log(sql);
     console.log(arr);
     console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
     client.query(sql, function(err, result) {
       if (err) {
         reject(err)
       } else {
         resolve(result);
       }
     });
   });

 }
 /**
  * 
  * 
  * @param {any} str 
  * @returns 
  */
 function getfullStr(str) {
   var a = (10 - str.length);
   var nullstr = "";
   for (var index = 0; index < a; index++) {
     nullstr += ' ';
   }
   return str + nullstr;
 }

 /**
  * 添加信息到网易云音乐
  * 
  * @param {any} model 
  */
 function musicAdd(model) {
   // var findsql = 'select * from music where mid=' + model.mid;
   var sql = "insert  into music(mid,name,comment,collectid,createtime) values(?,?,?,?,NOW())";
   var param = [model.id, model.name, model.comment, model.collectid];
   // client.query(findsql, function(err, result) {
   // if (!err && result != undefined && result.length == 0) {
   //增 add
   client.query(sql, param, function(err, result) {
     if (err) {
       console.log('[INSERT ERROR] - ', err.message);
       return;
     }
     console.log('歌曲ID:▇▇▇▇▇▇▇▇' + model.id);
   });

   //   } else {
   //     console.log(model.id + '已存在此歌曲');
   //   }
   // })
   /*  delete from music
   where mid  in(select mid from(select mid from  music  group by mid  having count(mid )>1) a)
   and id not in (select id from(select min(id) as id from  music  group by mid  having count(mid )>1) b)
   */

 }

 function deleteMusicById(id) {
   let sql = "delete from music where id=" + id;
   client.query(sql, function(err, result) {
     if (err) {
       console.log('[删除失败] - ', err.message);
       return;
     }
     console.log('删除歌曲ID:▇▇▇▇▇▇▇▇' + id);
   });
 }


 module.exports = {
   start: start,
   finds: finds,
   listAdd: musicPayListAdd,
   musicAdd: musicAdd,
   getEmptyCommentMusicList: getEmptyCommentMusicList,
   updateMusic: updateMusic,
   getHighQualityMusicList: getHighQualityMusicList,
   playList: playList,
   addUser: AddUser,
   addFollow: addFollow,
   getUser: getUser,
   getFollow: getFollow,
   resloveSql: resloveSql,
   getEmptyMusicList: getEmptyMusicList,
   updateMusicName: updateMusicName,
   deleteMusicById: deleteMusicById,
   getHipHop: getHipHopPlayList,
   multiAddMusic: multiAddMusic,
   multiPlayListAdd: multiPlayListAdd,
   deleteRepeatPlayList,
   multiUpdateMusic
 }