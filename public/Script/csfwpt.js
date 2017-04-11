"use strict";
var _console = window.console;
window.console = _console || {};
window.console.info = _console.info || function() {};
window.console.debug = _console.debug || function() {};
window.console.log = _console.log || function() {};
var JSTOOL = function() {
	/*
	 * 美化所有checkbox与radio
	 * 
	 * $('input').iCheck('check'); — 将输入框的状态设置为checked
	 * $('input').iCheck('uncheck'); — 移除 checked 状态
	 * $('input').iCheck('toggle'); — toggle checked state
	 * $('input').iCheck('disable'); — 将输入框的状态设置为 disabled
	 * $('input').iCheck('enable'); — 移除 disabled 状态
	 * $('input').iCheck('update'); — apply input changes, which were done
	 * outside the plugin $('input').iCheck('destroy'); — 移除iCheck样式
	 */
	this.changeCheck = function($dom) {
		$dom.iCheck({
			checkboxClass : 'icheckbox_flat-blue',
			radioClass : 'iradio_flat-blue'
		});
	};
	/*
	 * 可以参考http://www.cnblogs.com/wuhuacong/p/4761637.html 美化select
	 */
	this.changeSelect = function($dom, hasSearch) {
		var selectNum = 0;
		if (typeof (hasSearch) != 'undefined') {
			if (hasSearch == false) {
				selectNum = -1;
			}
		}
		$dom.select2({
			tags : true,
			maximumSelectionLength : 3,
			minimumResultsForSearch : selectNum
		// 最多能够选择的个数
		});
	};
	/*
	 * 分页插件
	 */
	this.initPageDiv = function($dom, now, all, each, $dom2, change) {
		if (parseInt(now) > parseInt(all)) {
			return;
		}
		var options = {
			currentPage : now,// 当前页
			totalPages : all,// 共几页
			numberOfPages : each,// 每次显示几页
			itemTexts : function(type, page, current) { // 修改显示文字
				switch (type) {
				case "first":
					return "第一页";
				case "prev":
					return "上一页";
				case "next":
					return "下一页";
				case "last":
					return "最后一页";
				case "page":
					return page;
				}
			},
			onPageClicked : function(event, originalEvent, type, page) { // 异步换页
				$dom2.val(page);
				change();
			}
		}
		$dom.bootstrapPaginator(options);
	};
	/*
	 * switch 选项插件
	 * 
	 */
	this.changeToSwitch = function($dom, left, right, onText, offText) {
		$dom.bootstrapSwitch({
			onText : onText,
			offText : offText,
			onColor : "success",
			offColor : "info",
			size : "small",
			onSwitchChange : function(event, state) {
				if (state == true) {
					left();
				} else {
					right();
				}
			}
		});
	};
	/* 日期框 */
	this.datePicker = function($dom, dataformat) {
		var _format = dataformat || "yyyymmdd"
		$dom.datetimepicker({
			format : _format,// "dd MM yyyy - HH:ii P",
			showMeridian : true,
			autoclose : true,
			todayBtn : true,
			minView : 2,
			language : 'zh-CN'
		});
	};
	/* 弹窗 */
	this.alert = function(title, content, callback, className) {
		var confirm = callback && typeof callback === "function" ? callback
				: function() {
				};
		var alertClass = "";
		if (typeof className == "undefined") {
			alertClass = 'col-md-4 col-md-offset-4';
		} else {
			alertClass = className;
		}
		window.top.$.alert({
			title : title,
			content : content,
			confirm : confirm,
			confirmButton : '确定',
			backgroundDismiss : false,
			confirmButtonClass : 'btn-primary',
			animation : 'zoom',
			closeAnimation : 'scale',
			columnClass : alertClass
		});
	};
	this.confirm = function(title, content, okCallback, cancelCallback) {
		var confirm = okCallback && typeof okCallback === "function" ? okCallback
				: function() {
				};
		var cancel = cancelCallback && typeof cancelCallback === "function" ? cancelCallback
				: function() {
				};
		window.top.$.confirm({
			title : title,
			content : content,
			confirm : confirm,
			cancel : cancel,
			confirmButton : '确定',
			cancelButton : '取消',
			confirmButtonClass : 'btn-primary',
			cancelButtonClass : 'btn-danger',
			backgroundDismiss : false,
			animation : 'zoom',
			closeAnimation : 'scale'
		});
	};
	this.dialog = function(title, content) {
		window.top.$.dialog({
			title : title,
			content : content,
			animation : 'zoom',
			closeAnimation : 'scale'
		});
	};
	// 处理空防止报错
	this.null2empty = function(str) {
		if (str == null) {
			return "";
		}
		return str;
	};
	// 刷新当前页面
	this.replacelocalhost = function(url) {
		var base = document.getElementsByTagName("base")[0];
		if (base) {
			window.location.replace(base.getAttribute("href") + url);
		} else {
			window.location.replace(url);
		}
	};
	// 获取跳页时父页面传来的参数
	this.getParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null){
			return unescape(r[2]);
		}else{
			return null;
		}
	}
	
	// 获取域名
	this.getUrlArea = function() {
		var r = window.location.host;
		return r;
	}
	
	//防参数乱码  index为参数在url参数列表的顺序号
	this.getDecodeUrl = function(index){
		var url=decodeURI(location.href);
		var result = url.split("?")[1].split("&")[index].split("=")[1];
		return result;
	}

	//处理缓存中json字符串的方法
	this.changeJsonToObj = function(json){
		var goods = json.split("#");
		var obj = new Array();
		if(json!=""){
			for(var i=0; i<goods.length; i++){
				obj.push(JSON.parse(goods[i]));
			}
		}
		return obj;
	}
	
	this.deleteGoodsFromCart = function(ids,ifToBalance){
		var r = "";
		var goodsInStorage = tool.changeJsonToObj(localStorage.getItem("cartGoodsJsonInStorage"));
		var temp = []; //临时数组1 
		var goodsInStorageResult = [];//临时数组2 
		var idss = ids.split(",")
		console.info(idss)
		if(idss.length!=0){
			for(var i=0; i<idss.length; i++){
				temp[idss[i]] = true;
				//删除 用于判断商品是否在购物车中的变量
				localStorage.removeItem(idss[i]);
				//改变购物车标签商品数量角标
				var n = localStorage.getItem("numOfCartGoodsInStorage");
				localStorage.setItem("numOfCartGoodsInStorage",n-1);
			}
			//删除缓存中json字符串中被选中的商品信息
			if(goodsInStorage.length!=0){
				for(var j=0; j<goodsInStorage.length; j++){
					if(!temp[goodsInStorage[j].ID]){
						goodsInStorageResult.push(goodsInStorage[j]);
					}
				}
			}
			console.info(goodsInStorageResult)
			//将删除后的对象转为json存入缓存及数据库
			var cartGoodsJsonInStorage = "";
			if(goodsInStorageResult.length!=0){
				cartGoodsJsonInStorage = JSON.stringify(goodsInStorageResult[0]);
				for(var n=1; n<goodsInStorageResult.length; n++){
					cartGoodsJsonInStorage += "#"+JSON.stringify(goodsInStorageResult[n]);
				}
				console.info(cartGoodsJsonInStorage)
				localStorage.setItem("cartGoodsJsonInStorage",cartGoodsJsonInStorage);
			}
			$.ajax({
				url: "http://"+window.location.host+"/csfwpt_console/restful/shopping/chart",
				data : {
						goodsInfo : cartGoodsJsonInStorage
					},
				dataType: "TEXT",
				type: "POST"
			}).done (function(data) {
				console.info(data);
				if(ifToBalance==0 || ifToBalance=="0"){
					if(data=="SUCCESS"){
						createPage();
					}else if(data=="FAIL"){
						$("#loadingToast").hide();
						$("#info").text("删除失败，请联系管理员");
				    	$("#dialog1").fadeIn(200);
					}
				}else{
					if(data=="SUCCESS"){
						console.info("pay")
						//模拟支付成功
						var url = "pay_success.html";
						window.location.href = encodeURI(url);
					}else if(data=="FAIL"){
						console.info("fail");
					}
				}
			});
		}
		return r;
	}
	
	this.changePageUrl = function(title,url){
		//改变当前页url
		function pushHistory() {  
	        var state = {  
	            title: title,  
	            url: url
	        };  
	        window.history.replaceState(state, title, url);  
	    } 
		//支付后续操作如果后退直接后退到输入税号页
		var bool=false;  
        setTimeout(function(){  
            bool=true;  
        },100);  
	    pushHistory();
		window.addEventListener("popstate", function(e) {
			if(bool){  
				window.history.go(-1);
            } else{
				pushHistory();
            } 
		}, false);
	}

	this.changeParentPageUrl = function(title,url){
		//改变当前页url
		function pushHistory() {  
	        var state = {  
	            title: title,  
	            url: url
	        };  
	        window.parent.history.replaceState(state, title, url);  
	    } 
		//支付后续操作如果后退直接后退到输入税号页
		var bool=false;  
        setTimeout(function(){  
            bool=true;  
        },100);  
	    pushHistory();
		window.addEventListener("popstate", function(e) {
			if(bool){  
				window.history.go(-1);
            } else{
				pushHistory();
            } 
		}, false);
	}
};
var tool = new JSTOOL();
// 复制到剪切板
function paste() {
	if (window.clipboardData) {
		window.clipboardData.clearData();
		clipboardData.setData("Text", $.trim($("#sqFrame").val()));
		tool.alert("提示", "复制成功！");
	} else {
		tool.alert("提示", "复制失败！请手动复制");
	}
};


//查询钥匙盘信息
function getKeyno(){
	var keyInfo = window.top['_CACHE'].searchKeyInfo();
//	if (!keyInfo.success) {
//		tool.alert("提示", "查询钥匙盘信息失败，失败原因：" + keyInfo.message, function() {});
//	}else{
		//获取kpzdbs，开票终端表示
//			var key = keyInfo.bean.keyno;
		var key = "33123456789";
		if(key!=null && key!="" && key!="null"){
			return key.substring(2,key.length);
//				alert(tool.keyno)
		}
//	}
}