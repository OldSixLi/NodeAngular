/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * collection.js
 * @Date: 2018年6月13日16:38:25
 * @Last Modified by: 马少博
 * @Last Modified time:2018年6月13日16:38:28
 */
/* jshint esversion: 6 */
let nodegrass = require('nodegrass');
let Handler = require('./handle');
let path = require('path');
let fs = require("fs");
let cheerio = require('cheerio');
let NUM = 1;

// collect();

async function collect() {
  let htmlStr = '';

  for (let pageIndex = 1; pageIndex <= 18; pageIndex++) {
    let page = await getPage(`https://www.zhihu.com/collection/69867602?page=${pageIndex}`)
      .then(d => pageInfoParse(d));

    for (let index = 0; index < page.length; index++) {
      const obj = page[index];
      htmlStr += `<h4>${NUM++}.<a href="${obj.href}" target="_blank">${obj.title}</a></h4><br>\r\n`;
    }
  }
  console.log(htmlStr);
}

getPage(`https://music.163.com/discover/playlist/?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=35`).then(d => console.log(d), err => console.log(err))
  /*
  '########:::::'###:::::'######:::'########:
   ##.... ##:::'## ##:::'##... ##:: ##.....::
   ##:::: ##::'##:. ##:: ##:::..::: ##:::::::
   ########::'##:::. ##: ##::'####: ######:::
   ##.....::: #########: ##::: ##:: ##...::::
   ##:::::::: ##.... ##: ##::: ##:: ##:::::::
   ##:::::::: ##:::: ##:. ######::: ########:
  ..:::::::::..:::::..:::......::::........::
  */
  /**
   * 获取页面信息并返回
   * @param {*} url 请求的页面地址
   */
function getPage(url) {
  console.log(url);
  //返回一个promise对象才可以调用then等函数
  return new Promise(function(resolve, reject) {
    let questionId = url.substr(url.lastIndexOf('/') + 1);
    nodegrass.get(url, (data, status, headers) => {
      if (!data) {
        reject('未抓取到数据');
      } else {
        resolve(data);
      }
    });
  });
}


/**
 * 处理页面信息 (转化为可用对象)
 * @returns 
 */
function pageInfoParse(data) {
  let $ = cheerio.load(data);
  let $list = $('.zm-item .zm-item-title').find('a');
  let pageArr = [];
  $list.each(function(index, element) {
    let title = $(this).text();
    let href = "https://www.zhihu.com" + $(this).attr('href');
    let id = href.substr(href.lastIndexOf('/') + 1);
    pageArr.push({ title: title, href: href, id: id });
  });

  return pageArr;
}