/**
 * 通用脚本库
 * @马少博 (1030809514@qq.com)
 * @date    2016-12-09 16:26:17
 * @version 1.0
 */
//将form表单内容序列化为JSON
var BasicUrl = "http://60.205.170.209:8080/admin/api/";
(function($) {
  $.fn.serializeJson = function() {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function() {
      if (serializeObj[this.name]) {
        if ($.isArray(serializeObj[this.name])) {
          serializeObj[this.name].push(this.value);
        } else {
          serializeObj[this.name] = [serializeObj[this.name], this.value];
        }
      } else {
        serializeObj[this.name] = this.value;
      }
    });
    return serializeObj;
  };
})(jQuery);

$(function() {
  if ($.datetimepicker) {
    $.datetimepicker.setLocale('ch'); //时间选择控件默认设置中文
  }
  /// <summary>悬浮于一级菜单时显示二级菜单的内容</summary>
  $("#mainMenu>li>a").each(function(index) {
    $(this).hover(function() {
      var position = $(this).offset();
      var selector = $(this).attr("data-SecondMenu");
      var marginleft = position.left - $(selector).find("li").size() * 45 + 45;
      $("#mainMenu>li").removeClass("active");
      $(this).parent().addClass("active");
      $(selector).toggleClass("active").css("padding-left", marginleft + 'px');
    });
  });
});

//分隔获取各个参数
function UrlSearch() {
  var name, value;
  var str = location.href; //取得整个地址栏
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  var arr = str.split("&"); //各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}
//分页控件的初始化
function initPageDiv($dom, now, all, each, $dom2, change) {
  if (parseInt(now) > parseInt(all)) {
    return;
  }
  var options = {
    bootstrapMajorVersion: 3,
    currentPage: now, // 当前页
    totalPages: all, // 共几页
    numberOfPages: each, // 每次显示几页
    itemTexts: function(type, page, current) { // 修改显示文字
      switch (type) {
        case "first":
          return "首页";
        case "prev":
          return "<";
        case "next":
          return ">";
        case "last":
          return "尾页";
        case "page":
          return page;
      }
    },
    onPageClicked: function(event, originalEvent, type, page) { // 异步换页
      $dom2.val(page);
      change();
    }
  }
  $dom.bootstrapPaginator(options);
};


//判断浏览器版本
function myBrowser() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
  if (isIE) {
    var IE5 = IE55 = IE6 = IE7 = IE8 = false;
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    IE55 = fIEVersion == 5.5;
    IE6 = fIEVersion == 6.0;
    IE7 = fIEVersion == 7.0;
    IE8 = fIEVersion == 8.0;
    if (IE55) {
      return "IE55";
    }
    if (IE6) {
      return "IE6";
    }
    if (IE7) {
      return "IE7";
    }
    if (IE8) {
      return "IE8";
    }
  } //isIE end
  if (isFF) {
    return "FF";
  }
  if (isOpera) {
    return "Opera";
  }
};

function uploadPic(btn) {
  $("#imageRes").click();
  var divId = $(btn).parent().attr("id");
  $("#hidden_divname").val(divId); //当前上传图片的父元素div的ID
}

/*上传协议*/
function uploadImage() {
  var options = {
    dataType: 'json',
    success: function(data) {
      if (data.success == true) {
        tool.confirm("确定课程描述图片",
          "<img style='width:100%' src=" + data.message + " onclick='show(this)'>",
          function() {
            //发请求对数据库进行修改 
            $("#uplpadBlock img").attr("src", data.message);
            $("#iconUrls").val(data.message);
          },
          function() {},
          function() {});
      } else {
        tool.alert('提示', '上传图片必须为JPG、PNG、JEPG', function() {});
      }
    }
  };
  $('#headForm').ajaxSubmit(options);
}

var JSTOOL = function() {
  this.changeSelect = function($dom, hasSearch) {
    var selectNum = 0;
    if (typeof(hasSearch) != 'undefined') {
      if (hasSearch == false) {
        selectNum = -1;
      }
    }
    $dom.select2({
      tags: true,
      maximumSelectionLength: 3,
      minimumResultsForSearch: selectNum
        // 最多能够选择的个数
    });
  };
  /* 弹窗 */
  this.alert = function(title, content, callback, className) {
    var confirm = callback && typeof callback === "function" ? callback :
      function() {};
    if (myBrowser() == "IE8") {

      $.alert({
        buttons: {
          ok: {
            label: '',
            className: 'btn-primary'
          }
        },
        message: content,
        callback: function() {
          confirm();
        },
        title: title,
      });


    } else {
      var alertClass = "";
      if (typeof className == "undefined") {
        alertClass = 'offset4 col-md-4 col-md-offset-4';
      } else {
        alertClass = className;
      }
      $.alert({
        title: title,
        content: content,
        confirm: confirm,
        confirmButton: '确定',
        backgroundDismiss: false,
        confirmButtonClass: 'btn-primary',
        animation: 'zoom',
        closeAnimation: 'scale',
        columnClass: alertClass
      });
    }
  };
  this.confirm = function(title, content, okCallback, cancelCallback) {
    var confirm = okCallback && typeof okCallback === "function" ? okCallback :
      function() {};
    var cancel = cancelCallback && typeof cancelCallback === "function" ? cancelCallback :
      function() {};
    if (myBrowser() == "IE8") {
      window.confirm({
        buttons: {
          confirm: {
            label: '确认',
            className: 'btn-primary'
          },
          cancel: {
            label: '取消',
            className: 'btn-danger'
          }
        },
        message: content,
        callback: function(result) {
          if (result) {
            confirm();
          } else {
            cancel();
          }
        },
        title: title,
      });
    } else {
      var confirm = okCallback && typeof okCallback === "function" ? okCallback : function() {};
      var cancel = cancelCallback && typeof cancelCallback === "function" ? cancelCallback : function() {};
      $.confirm({
        title: title,
        offsetTop: 10,
        content: content,
        confirm: confirm,
        cancel: cancel,
        confirmButton: '确定',
        cancelButton: '取消',
        confirmButtonClass: 'btn-primary',
        cancelButtonClass: 'btn-danger',
        backgroundDismiss: false,
        animation: 'zoom',
        closeAnimation: 'scale'
      });
    }
  };
  this.dialog = function(title, content) {
    window.top.$.dialog({
      title: title,
      content: content,
      animation: 'zoom',
      closeAnimation: 'scale'
    });
  };
};
var tool = new JSTOOL();