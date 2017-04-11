 


		"use strict";

		var params = "&";
		//请求数据
		$(function() {
			//请求第一页的内容
			pageing();
		});

		$(function() {
			// 构建分级树
			var $tree = null;
			var deptTree = $("#deptTree");

				var project_id = $("#project_id").val();
			$.ajax(
			{url: "http://"+tool.getUrlArea()+"/csfwpt_console/weixin/aritcle/get_WixinAticleype_tree?projectId="+project_id, dataType: "JSON", type: "GET"}).done(function(data) {
				$tree = $.fn.zTree.init(deptTree, {
					data : {
						simpleData : {
							enable : true,
							pIdKey : "parentId",
							rootPId: 0
						}
					},
					callback: {
						onClick: function(eventjs, treeId, treeNode, clickFlag) {
							queryParams.deptId = treeNode.id;
							$("#currentPage").val(1);
							queryParams.queryString = "";
							pageing();
						}
					}
				}, data.bean);
				$tree.expandAll(true);
			});
			 pageing();
		});
		var  = $("#project_id").val();
		var queryParams = {
		currentPage : 1,
		queryString : "",
		deptId      : "1",
		project_id  :project_id
	};
		//已开具发票数据部分 翻页的异步请求方法
		function pageing() {
			queryParams.currentPage = $("#currentPage").val();
			//拼接的table字符串
			var htmlstr = "";
			$.ajax({
			url: "http://"+tool.getUrlArea()+"/csfwpt_console/weixin/aritcle/list",
			data: queryParams,
			dataType: "JSON",
			type: "POST"
		}).done(function(data) {
				if (data != null && data != "" && data != "null") {
					var content = data.bean.data; //获取主体数据
					if (content != null && content.length > 0) {
						for (var i = 0; i < content.length; i++) {
							//但行数据字符串
							var singleDataStr = (content[i].state === "0") ? "<tr class='tr-cancel'>" : "<tr>";
 							//拼接整行字符串
							singleDataStr += "<td>" + (10 * pageindex + i - 9) + "</td>" +
								"<td>" + content[i].typeName + "</td>" +
								"<td>" + content[i].title + "</td>" +
								"<td>" + content[i].addtime + "</td>" +
								"<td>" + content[i].state + "</td>" +
								"<td>" + content[i].readStats + "</td>" +
								"<td>" + content[i].collectionStats + "</td>" +
								"<td>" + "<button class='btn btn-link' onclick='editDetail(\"" + content[i].id + "\")'>修改</button>|" +"<button class='btn btn-link' >废除</button>"+ "</td>" +"</tr>";
							htmlstr += singleDataStr;
						}

						//添加数据至当前页面主体中
						$("#databody").html(htmlstr);
						$("#alreadyPage").show();

					} else {
						//TODO 未获取到数据时处理方式
						$("#databody").html('<tr><td colspan="100" class="text-center notFound">没有相关数据</td></tr> ');
						$("#alreadyPage").hide();
					}
				}
				tool.initPageDiv($("#alreadyPage"), //在哪里生成页码
					pageindex, //当前页
					data.bean.pageCount, //一共多少页
					10, //每次显示多少页
					$("#currentPage"), //将每次的分页的页码放到这个input里
					function() {
						pageing($("#currentPage").val(), params);
					}
				);
			});
		}
		//订单详情
		function editDetail(id) {
			var goToDetail = "http://" + tool.getUrlArea() + "/csfwpt_console/weixin/aritcle/toAddAritcle";
			window.location.href = goToDetail + "?locState=5&orderId=" + id;
		}
