// import { log } from 'util';

/**
 * 获取关注的人层级关系 
 * @returns 
 */
var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
var fs = require("fs");
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var io = require('socket.io')();
var DbHelper = require('./../zhihu/mysql.js');
var async = require('async');


// nodegrass
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
  nodegrass.get(startUrl + '?uid=' + startID + '&limit=1000',
    (data, status, headers) => {
      level++;
      let userList = JSON.parse(data).follow;
      if (userList.length > 0) {
        let followArr = [];
        for (let i = 0; i < userList.length; i++) {
          const userObj = userList[i];

          ((i) => {
            setTimeout(() => {
              if (level <= 3) {
                start(userObj.userId, level);
              }
              getUserDetail(userObj.userId, level)
              console.log(userObj.userId);
            }, i * 1000);
          })(i);

          followArr.push({
            userID: startID,
            followID: userObj.userId,
            followUserName: userObj.nickname
          });
        }
        //批量插入关系表
        DbHelper.addFollow(followArr).then(
          result => {
            console.log(result);
          },
          err => {
            console.log(err);
          });
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
        DbHelper
          .addUser(model)
          .then(
            (result) => console.log(id + '---' + result),
            (err) => {
              // if (err.indexOf("Duplicate") > -1) {
              //   console.log('有重复键');
              // }
              console.log('有重复键');

            }
          );
      }
    });

}

/**
 * 写入文件 
 * @returns 
 */

//写入文件utf-8格式 
function writeFile(fileName, data) {
  console.log(data);
  fs.appendFile(fileName, data, 'utf-8');
}