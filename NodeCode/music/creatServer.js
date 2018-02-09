/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年2月5日13:32:23
 * @Last Modified by: 马少博
 * @Last Modified time:date
 * 网易云音乐封装请求方法
 */

/* jshint esversion: 6 */
const Encrypt = require('./crypto.js');
const crypto = require('crypto');
const http = require('http');
const querystring = require('querystring');
var express = require('express');
var router = express.Router();

// router.get('/', (req, res) => {

// start();
/**
 * 模拟网易云音乐登陆  获取cookie后 歌单中收藏新歌曲
 * 
 */
function start() {
  const phone = '账号'
  const cookie = ''
  const md5sum = crypto.createHash('md5')
  md5sum.update('TODO 密码')
  let data = {
    phone: phone,
    password: md5sum.digest('hex'),
    rememberLogin: 'true'
  }

  function login(data, cookie) {
    return new Promise(function(resolve, reject) {
      createWebAPIRequest(
        'music.163.com',
        '/weapi/login/cellphone',
        'POST',
        data,
        cookie,
        (music_req, cookie) => {
          console.log(cookie);
          console.log(cookie);
          resolve(cookie);
        },
        err => {
          reject(err);
        }
      )
    });
  }
  //获取到cookie后 利用cookie收藏
  login(data, cookie).then((cookie) => {
    let tracks = 531051217; //等你下课
    let data = {
      op: "add",
      pid: 980010606,
      tracks: tracks,
      trackIds: JSON.stringify([tracks]),
      csrf_token: ''
    }
    console.log("cookie is " + cookie);
    createWebAPIRequest(
      'music.163.com',
      '/weapi/playlist/manipulate/tracks',
      'POST',
      data,
      cookie,
      music_req => console.log(music_req),
      err => console.log("fail")
    )
  });

}
// })

var index_num = 0;

/**
 * 网易云音乐登陆接口
 * 
 * @param {any} host 域名
 * @param {any} path 地址
 * @param {any} method 请求方式
 * @param {any} data 数据
 * @param {any} cookie cookie
 * @param {any} callback 回调函数
 * @param {any} errorcallback 错误回调
 */
function createWebAPIRequest(
  host,
  path,
  method,
  data,
  cookie,
  callback,
  errorcallback
) {
  let music_req = ''
  const cryptoreq = Encrypt(data)
  const http_client = http.request({
      hostname: host,
      method: method,
      path: path,
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://music.163.com',
        'Host': 'music.163.com',
        'Cookie': cookie,
        'User-Agent': randomUserAgent()
      }
    },
    function(res) {
      res.on('error', function(err) {
        errorcallback(err)
      })
      res.setEncoding('utf8')
      if (res.statusCode != 200) {
        createWebAPIRequest(host, path, method, data, cookie, callback)
        return
      } else {
        res.on('data', function(chunk) {
          music_req += chunk
        })
        res.on('end', function() {
          console.log("结束");
          if (music_req == '') {
            createWebAPIRequest(host, path, method, data, cookie, callback)
            return
          }
          if (res.headers['set-cookie']) {
            callback(music_req, res.headers['set-cookie'])
          } else {
            callback(music_req)
          }
        })
      }
    }
  )


  http_client.write(
    querystring.stringify({
      params: cryptoreq.params,
      encSecKey: cryptoreq.encSecKey
    })
  )
  http_client.end()
}


/**
 * 生成随机代理
 * 
 * @returns 
 */
function randomUserAgent() {
  const userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
    'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
  ]
  const num = Math.floor(Math.random() * userAgentList.length)
  return userAgentList[num]
}


module.exports = router;