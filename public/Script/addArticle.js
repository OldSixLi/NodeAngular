var editor=new wangEditor('articleContent');
editor.create();
$(function() {
//tabindex设置
	$("input").each(function(index) {
		$(this).attr("tabindex", index + 1);
	}).on("keyup", function(e) {
		if (e.which == 13) {
			var that = $(this);
			var index = parseInt(that.attr("tabindex"));
			if (!isNaN(index)) {
				$("input[tabindex=" + (index + 1) + "]").focus();
			}
		}
	});

	//提交按钮校验
	$("#saveBtn").on("click", function() {
		$(".form-group").removeClass("has-error");
		var saveInfo = {
			title: $.trim($("#articleHeading").val()),
			typeid: $.trim($("#belongToClass").val()),
			source: $.trim($("#articleFrom").val()),
			source_url: $.trim($("#articleFromUrl").val()),
			author: $.trim($("#articleAuthor").val()),
			abstract: $.trim($("#articleAbstract").val()),
			context: $.trim(editor.$txt.html())
		};
		var __error = [];
		if (saveInfo.title === "") {
			__error.push("请输入文章标题！");
			$("#articleHeading").parent().addClass("has-error");
		}
		if (saveInfo.typeid === "") {
			__error.push("请选择所属栏目");
			$("#belongToClass").parent().addClass("has-error");
		}
		if (saveInfo.source === "") {
			__error.push("请输入文章来源！");
			$("#articleFrom").parent().addClass("has-error");
		}
		if (saveInfo.source_url === "") {
			__error.push("请输入文章来源地址！");
			$("#articleFromUrl").parent().addClass("has-error");
		}
		if (saveInfo.author === "") {
			__error.push("请输入文章作者！");
			$("#articleAuthor").parent().addClass("has-error");
		}
		if ( $.trim(editor.$txt.formatText()) === "") {
			__error.push("请输入正文内容！");
			$("#articleContent").parent().addClass("has-error");
		}
		if (__error.length > 0) {
			alert(__error.join("\r\n"));
			return false;
		}
		$(":button").attr("disabled", true);
		$.ajax({
			url: "weixin/aritcle/saveOrEditAritcle",
			data: saveInfo,
			dataType: "JSON",
			type: "POST"
		}).done(function(data) {
			if (data.success) {
				tool.replacelocalhost("system/user");
			} else {
				alert(data.message);
			}
		}).done(function(data) {
			$(":button").attr("disabled", false);
		});
		return false;
	});

});
