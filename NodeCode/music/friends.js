/**
 * 获取关注的人层级关系 
 * start()开始抓取
 */
var nodegrass = require('nodegrass');
var fs = require("fs");
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var io = require('socket.io')();
var DbHelper = require('./../zhihu/mysql.js');
var async = require('async');


let startUserID = 93498013; //以哪个用户ID开始(囧六六囧)
let startUrl = 'http://localhost:9999/user/follows'; //请求的地址
let filePath = path.resolve(__dirname + '/记录.txt');

//开始请求
start(startUserID, 1);
/**
 * 获取关注者
 * 
 * @param {any} startID 
 * @param {any} level 
 */
function start(startID, level) {
  nodegrass.get(
    //地址
    startUrl + '?uid=' + startID + '&limit=1000',
    //回调
    (data, status, headers) => {
      level++;
      let userList = JSON.parse(data).follow;
      let followArr = [];
      if (userList.length > 0) {
        for (let i = 0; i < userList.length; i++) {
          const userObj = userList[i];
          ((i) => {
            setTimeout(() => {
              getUserDetail(userObj.userId, level);
              (level <= 3) && start(userObj.userId, level);
            }, i * 1000);
          })(i);

          followArr.push({
            userID: startID,
            followID: userObj.userId,
            followUserName: userObj.nickname
          });
        }
        //批量插入关系表
        DbHelper.addFollow(followArr)
          .then(
            result => console.log(result),
            err => console.log(err));
      }
    });
}


function getUserDetail(id, level) {
  nodegrass.get("http://localhost:9999/user/detail?uid=" + id,
    (data, status, headers) => {
      let obj = JSON.parse(data)
      let userObj = obj.profile;
      if (userObj) {
        let model = {
          userid: userObj.userId,
          nickname: userObj.nickname,
          weibourl: (obj.bindings && obj.bindings.length > 1) ? obj.bindings[1].url : "",
          selfword: userObj.signature,
          imgurl: userObj.avatarUrl,
          level: level
        };
        DbHelper.addUser(model)
          .then(
            result => console.log(id + '---' + result),
            err => console.log('有重复键')
          );
      }
    });
}

/**
 * 写入文件 
 * @returns 
 */
function writeFile(fileName, data) {
  fs.appendFile(fileName, data, 'utf-8');
}