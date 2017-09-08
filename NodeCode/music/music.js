/**
 * 网易云音乐爬虫
 * @returns
 */

var nodegrass = require('nodegrass');
var cheerio = require('cheerio');
var https = require("https");
var fs = require("fs");
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var io = require('socket.io')();
var xssEscape = require('xss-escape');
var DbHelper = require('F:/PersonCodes/NodeAngular项目/NodeCode/zhihu/mysql.js');
var async = require('async');

for (var i = 0; i < 38; i++) {
  (function(i) {
    setTimeout(function() {
      getlist(i)
    }, i * 2000);
  })(i)
}
var SPIDERINDEX = 1; //抓取到的数量
var PAYLISTINDEX = 0; //可用的歌单

function getlist(num) {
  nodegrass.get('http://music.163.com/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=' + num * 35, function(data, status, headers) {
    var $ = cheerio.load(data);
    var resultArr = $("#m-disc-pl-c #m-pl-container").find("li");

    $("#m-disc-pl-c #m-pl-container").find("li").each(function(i, item) {

      var playListObj = {
        name: "",
        collectCount: "",
        imgSrc: "",
        href: ""
      }
      var collectCount = $(this).find('.nb').text();
      var tenThousandNum = 0;
      if (collectCount.indexOf('万') > 0) {
        tenThousandNum = collectCount.split('万')[0] > 50 ? collectCount.split('万')[0] : 0;
      }
      if (tenThousandNum > 0) {

        console.log(tenThousandNum + "万");
        var paylistUrl = $(this).find(".u-cover .msk").attr("href");
        playListObj.name = $(this).find(".u-cover .msk").attr("title").trim().replace(/[&\|\\\*^%$#@\-]/g, "");
        playListObj.collectCount = tenThousandNum;
        playListObj.imgSrc = $(this).find("img.j-flag").attr("src");
        playListObj.href = paylistUrl;
        // DbHelper.listAdd(playListObj); //数据库添加 
        var paylistDetailUrl = "http://localhost:9999/playlist" + paylistUrl.replace('playlist', 'detail');
        //获取歌单中的歌曲列表
        (function(paylistDetailUrl) {
          setTimeout(function() {
            nodegrass.get(paylistDetailUrl, function(data) {
              if (data) {
                var payListJson = JSON.parse(data);

                PAYLISTINDEX += 1;
                //遍历歌单中的歌曲
                for (var songIndex = 0; songIndex < payListJson.privileges.length; songIndex++) {
                  var element = payListJson.privileges[songIndex];
                  console.log("第" + SPIDERINDEX + "首" + element.id);
                  LISTARR.push(element.id);
                  SPIDERINDEX++;
                  // (function(id) {
                  //   setTimeout(function() {
                  //     nodegrass.get("http://localhost:9999/comment/music?id=" + id, function(data) {
                  //       if (data) {
                  //         var musicCommentDetailJson = JSON.parse(data);
                  //         console.log("第" + SPIDERINDEX + "首:" + "歌曲ID:" + id + "....." + "评论量:" + musicCommentDetailJson.total);
                  //         SPIDERINDEX++;
                  //       }
                  //     });
                  //   }, SPIDERINDEX * 1000);
                  // })(element.id)
                }
              }
            })
          }, PAYLISTINDEX * 0);
        })(paylistDetailUrl)


      }
    })
  });
}

var LISTARR = [];

function listarr() {
  for (var index = 0; index < LISTARR.length; index++) {
    var element = LISTARR[index];
    nodegrass.get("http://localhost:9999/playlist" + element, function(data) {

    })
  }
}