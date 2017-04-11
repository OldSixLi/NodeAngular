"use strict";
var project_id = $("#project_id").val();
var queryParams = {
    project_id: project_id,
    typeId: $("#hidden_typeid").val(),
    treeLevel: "",
    currentPage: 1
};

$(function() {
    // 构建分级树
    var $tree = null;
    var deptTree = $("#deptTree");
    $.ajax({
        url: "http://" + tool.getUrlArea() + "/csfwpt_console/weixin/aritcle/get_WixinAticleype_tree?projectId=" + project_id,
        dataType: "JSON",
        type: "GET"
    }).done(function(data) {
        $tree = $.fn.zTree.init(deptTree, {
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: "parentId",
                    rootPId: 0
                }
            },
            callback: {
                onClick: function(eventjs, treeId, treeNode, clickFlag) {
                    queryParams.typeId = treeNode.id;
                    queryParams.treeLevel = treeNode.level;
                    $("#hidden_typeid").val(treeNode.id);
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

//已开具发票数据部分 翻页的异步请求方法
function pageing() {
    queryParams.currentPage = $("#currentPage").val();
    //拼接的table字符串
    var htmlstr = "";
    $.ajax({
        url: "http://" + tool.getUrlArea() + "/csfwpt_console/weixin/aritcle/list",
        data: queryParams,
        dataType: "JSON",
        type: "POST"
    }).done(function(data) {
        if (data != null && data != "" && data != "null") {
            var content = data.bean.data; //获取主体数据
            if (content != null && content.length > 0) {
                for (var i = 0; i < content.length; i++) {
                    //但行数据字符串
                    var singleDataStr = "<tr>";
                    //(content[i].state === "0") ? "<tr class='tr-cancel'>" :
                    var state = content[i].state == "Y" ? "正常" : "废除";
                    var time = getLocalTime(content[i].addtime);
                    //拼接整行字符串
                    singleDataStr += "<td>" + (10 * queryParams.currentPage + i - 9) + "</td>" +
                        "<td>" + content[i].typeName + "</td>" +
                        "<td style='text-align:left;'>" + content[i].title + "</td>" +
                        "<td>" + time + "</td>" +
                        "<td>" + state + "</td>" +
                        "<td>" + content[i].readStats + "</td>" +
                        "<td>" + content[i].collectionStats + "</td>" +
                        "<td>" + "<button class='btn btn-link' onclick='editDetail(\"" + content[i].id + "\")'>修改</button>|" +
                        "<button class='btn btn-link' onclick='deleteArticle(\"" + content[i].id + "\")' >废除</button>" + "</td>" + "</tr>";
                    htmlstr += singleDataStr;
                }
                //添加数据至当前页面主体中
                $("#databody").html(htmlstr);
                $("#alreadyPage").show();

            } else {
                $("#databody").html('<tr><td colspan="100" class="text-center notFound">没有相关数据</td></tr> ');
                $("#alreadyPage").hide();
            }
        }
        tool.initPageDiv($("#alreadyPage"), //在哪里生成页码
            queryParams.currentPage, //当前页
            data.bean.pageCount, //一共多少页
            10, //每次显示多少页
            $("#currentPage"), //将每次的分页的页码放到这个input里
            function() {
                pageing();
            }
        );
    });
}
//订单详情
function editDetail(id) {
    var goToDetail = "<c:url value='/weixin/aritcle/toEditAritcle'/>";
    window.location.href = goToDetail + "?project_id=" + project_id + "&id=" + id;
}
//时间戳转换为时间
function getLocalTime(tm) {
    var tt = new Date(parseInt(tm)).toLocaleString('chinese', {
        hour12: false
    }).replace(/\//g, "-");
    return tt;
}
//删除文章方法
function deleteArticle(id) {
    tool.confirm("提示",
        "是否确认作废此文章",
        function() {
            $.ajax({
                type: "post",
                url: "http://" + tool.getUrlArea() + "/csfwpt_console/weixin/aritcle/voidArticle",
                data: {
                    id: id
                },
                dataType: "json"
            }).done(function(data) {
                if (data.success) {
                    tool.alert("提示", "作废成功");
                    pageing();
                } else {

                }
            });
        },
        function() {});
}
//修改文章方法
function addArticle() {
    var project_id = $("#project_id").val();
    var typeid = $("#hidden_typeid").val() == "" ? 0 : parseInt($("#hidden_typeid").val());
    var goToDetail = "<c:url value='/weixin/aritcle/toAddAritcle'/>";
    window.location.href = goToDetail + "?project_id=" + project_id + "&typeId=" + typeid;
}
