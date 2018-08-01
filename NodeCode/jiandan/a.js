/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @note: async 版获取
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月4日11:26:56
 */
var nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
var cheerio = require('cheerio');

let START_INDEX = 0; //从第几页开始请求
let PAGE_COUNT = 0; //每次爬虫处理多少页,设置为0就自动根据答案页数计算
let IS_GIF = false; //是否为GIF格式下载
let MIN_DIANZAN = 0; //最小点赞数
let USER_INPUT = "274143680"; //用户输入内容

//开始调用方法
// getPage(
//   `http://jandan.net/ooxx/page-45#comments`
// ).
// then(data => console.log(data), err => { console.log(err); });
var b = typeof exports != "undefined" ? exports : typeof self != "undefined" ? self : $.global;
var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function a(d) {
  this.message = d
}
var btoa = function(g) {
  var j = String(g);
  for (var i, e, d = 0, h = c, f = ""; j.charAt(d | 0) || (h = "=",
      d % 1); f += h.charAt(63 & i >> 8 - d % 1 * 8)) {
    e = j.charCodeAt(d += 3 / 4);
    if (e > 255) {
      throw new a("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.")
    }
    i = i << 8 | e
  }
  return f
}
var atob = function(g) {
  var j = String(g).replace(/[=]+$/, "");
  if (j.length % 4 == 1) {
    throw new a("'atob' failed: The string to be decoded is not correctly encoded.")
  }
  for (var i = 0, h, e, d = 0, f = ""; e = j.charAt(d++); ~e && (h = i % 4 ? h * 64 + e : e,
      i++ % 4) ? f += String.fromCharCode(255 & h >> (-2 * i & 6)) : 0) {
    e = c.indexOf(e)
  }
  return f
}

function microtime(b) {
  var a = new Date().getTime();
  var c = parseInt(a / 1000);
  return b ? (a / 1000) : (a - (c * 1000)) / 1000 + " " + c
}

function chr(a) {
  return String.fromCharCode(a)
}

function ord(a) {
  return a.charCodeAt()
}

function base64_encode(a) {
  return btoa(a)
}

function base64_decode(a) {
  return atob(a)
}
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }

function b64_md5(s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }

function str_md5(s) { return binl2str(core_md5(str2binl(s), s.length * chrsz)); }

function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }

function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }

function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16),
    opad = Array(16);
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
      (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
      ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
    }
  }
  return str;
}

function md5(a) {
  return hex_md5(a)
}
var jdOj4oSee2TYTAzPQEI8FYJ3xLcp5Zn3pb = function(o, y, g) {
  var d = o;
  var l = "DECODE";
  var y = y ? y : "";
  var g = g ? g : 0;
  var h = 4;
  y = md5(y);
  var x = md5(y.substr(0, 16));
  var v = md5(y.substr(16, 16));
  if (h) {
    if (l == "DECODE") {
      var b = md5(microtime());
      var e = b.length - h;
      var u = b.substr(e, h)
    }
  } else {
    var u = ""
  }
  var t = x + md5(x + u);
  var n;
  if (l == "DECODE") {
    g = g ? g + time() : 0;
    tmpstr = g.toString();
    if (tmpstr.length >= 10) {
      o = tmpstr.substr(0, 10) + md5(o + v).substr(0, 16) + o
    } else {
      var f = 10 - tmpstr.length;
      for (var q = 0; q < f; q++) {
        tmpstr = "0" + tmpstr
      }
      o = tmpstr + md5(o + v).substr(0, 16) + o
    }
    n = o
  }
  var k = new Array(256);
  for (var q = 0; q < 256; q++) {
    k[q] = q
  }
  var r = new Array();
  for (var q = 0; q < 256; q++) {
    r[q] = t.charCodeAt(q % t.length)
  }
  for (var p = q = 0; q < 256; q++) {
    p = (p + k[q] + r[q]) % 256;
    tmp = k[q];
    k[q] = k[p];
    k[p] = tmp
  }
  var m = "";
  n = n.split("");
  for (var w = p = q = 0; q < n.length; q++) {
    w = (w + 1) % 256;
    p = (p + k[w]) % 256;
    tmp = k[w];
    k[w] = k[p];
    k[p] = tmp;
    m += chr(ord(n[q]) ^ (k[(k[w] + k[p]) % 256]))
  }
  if (l == "DECODE") {
    m = base64_encode(m);
    var c = new RegExp("=", "g");
    m = m.replace(c, "");
    m = u + m;
    m = base64_decode(d)
  }
  return m
};

console.log(jdOj4oSee2TYTAzPQEI8FYJ3xLcp5Zn3pb("Ly93eDQuc2luYWltZy5jbi9tdzYwMC9lOTFlZDYxZmx5MWZ0Mm1rcTRpN3RqMjFrdzExaHd6YS5qcGc=", "owBsPqWT8Rn34Ake77tR25M7rv0ACkc0"));
/*
███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
*/

/**
 * 获取页面信息并返回
 * @param {*} url 请求的页面地址
 */
function getPage(url) {
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    let questionId = url.substr(url.lastIndexOf('/') + 1);
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * 获取到问题基本信息后,开始遍历答案
 * @param {*} pageInfo 初步抓取页面获取到的信息
 */
async function CircleGetAnswer(pageInfo, _scoket) {
  let ansCount = pageInfo.ansCount,
    questionId = pageInfo.questionId,
    anstitle = pageInfo.anstitle;
  //创建目录
  let filePath = path.resolve(__dirname, '../../public/images/zhihu_Down/' + anstitle);
  Handler.createDir(filePath);
  if (PAGE_COUNT == 0) {
    PAGE_COUNT = Math.ceil(pageInfo.ansCount / 10);
  }
  for (var json_index = START_INDEX; json_index < START_INDEX + PAGE_COUNT; json_index++) {
    var data = await getAnswer(json_index, questionId, anstitle);
    for (let i = 0; i < data.length; i++) {
      await ansList(data[i], filePath, anstitle, _scoket); // 针对每个回答的图片进行处理
    }
  };
}


/** 
 * 分页获取当前问题的答案
 *
 * @param {*} index
 * @param {*} questionId
 * @param {*} anstitle
 * @returns
 */
function getAnswer(index, questionId, anstitle) {
  //URL地址
  Handler.log(`请求第${index}页`)
  var posturl = Handler.getAnswerUrlByPageIndex(questionId, index);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    nodegrass.post(posturl, (data, status, headers) => {
      if (data) {
        resolve(parseResult(data));
      } else {
        reject(`问题:${anstitle}当前第${index}页答案获取失败,请检查程序`);
      }
    })
  });
}

/**
 * 下载单个答案中的图片
 * @returns 
 */
async function ansList(obj, filePath, anstitle, _scoket) {
  function getInfo(i) {
    return {
      url: obj.imgList[i] || "",
      path: filePath + "\\" + obj.answerId + '--' + i + '--' + path.basename(obj.imgList[i] || "").substr(-10),
    };
  }

  if (obj.imgList.length > 0) {
    for (let i = 0; i < obj.imgList.length; i += 2) {
      await Promise.all([
        Handler.startDownloadTask(getInfo(i).url, getInfo(i).path, anstitle, _scoket, IS_GIF),
        Handler.startDownloadTask(getInfo(i + 1).url, getInfo(i + 1).path, anstitle, _scoket, IS_GIF),
      ]).
      then(() => console.log("✲✲✲✲✲✲✲✲✲完成两个✲✲✲✲✲✲✲✲✲✲✲"), err => console.log(err));
    }
  }
}

/**
 * 对获取到的答案内容进行解析,提取出有用内容
 * @param {*} data 请求到的JSON内容
 * @returns 当前答案列表中answerId,imgList,dianzanCount
 */
function parseResult(data) {
  let dataObj = JSON.parse(data);
  let $ = cheerio.load(data);
  //遍历JSON操作
  if (dataObj.msg.length > 0) {
    let msgArr = dataObj.msg;
    var ansList = [];
    for (let i = 0; i < dataObj.msg.length; i++) {
      //当前答案的点赞数量
      let dianzanCount = $(msgArr[i]).find('.count').text();
      if (dianzanCount >= MIN_DIANZAN) {
        let answerId = $(msgArr[i]).find('.zm-item-rich-text').attr('data-entry-url');
        answerId = answerId.substr(answerId.lastIndexOf('/') + 1);
        let $imgDomList = $(msgArr[i]).find('.zm-editable-content').find("noscript").remove().end().find('img');

        //输出当前答案的信息
        console.log(`答案ID: ${answerId} ■■■ 点赞数： ${dianzanCount} ■■■ 图片数量： ${$imgDomList.length}`);

        //处理每个答案的图片数量
        let answerImgList = [];
        $imgDomList.each(function(index, element) {
          let imgUrl = Handler.handleImgUrl($(this).attr('data-original') || $(this).attr('data-actualsrc') || "");
          answerImgList.push(imgUrl);
        });

        let ansObj = {
          answerId: answerId,
          dianzan: dianzanCount,
          imgList: answerImgList
        };
        ansList.push(ansObj);
      }
    };
    return ansList;
  } else {
    return [];
  }
}

// exports.start = start;