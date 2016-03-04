apiready = function() {
	var id = api.pageParam.id;
	var temptoken = $api.getStorage('temptoken');
	var token = $api.getStorage('token');
	var cartCount = 0;
	if ($api.getStorage(CART_NUM_STORE_NAME) != null) {
		cartCount = $api.getStorage(CART_NUM_STORE_NAME);
	}

	function initSubProduct() {
		var productid = id;
		api.ajax({
			url : BASE_JOSN_URL + "json/product!choice.action",
			method : 'post',
			data : {
				values : {
					productid : productid
				}
			},
		}, function(ret, err) {
			var dat = ret;
			$("#firstSpec").html('');
			for (var i = 0; i < dat.length; i++) {
				var html = '<dd class="condition-list first-list" attr-inventory="' + dat[i].inventory + '" attr-id="' + dat[i].id + '" attr-activity="' + dat[i].active + '"  attr-pic="' + dat[i].pic + '" attr-min="' + dat[i].min + '" attr-max="' + dat[i].max + '" attr-pic="' + dat[i].pic + '" attr-price="' + dat[i].price + '" ><span class="num">' + dat[i].name + '</span>';
				$("#nowinventory").html(dat[i].inventory);
				if (dat[i].active > 0) {
					if (dat[i].active == 1) {
						html += '<span class="tag">秒杀中</span>';
					} else {
						html += '<span class="tag">限时购</span>';
					}
				}
				html += '</dd>';
				$("#firstSpec").append(html);
			}
			$(".condition-list").eq(0).trigger("click");
		})
	}


	api.ajax({
		url : BASE_JOSN_URL + 'app/product.action',
		method : 'post',
		cache : true,
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				"id" : id
			}
		}
	}, function(ret, err) {
		var template = $('#sc-productinfo').html();
		$('#div-productinfo').html(doT.template( template )(ret));
		var product = ret.product;
		$("#tocart_productname").html(product.name);
		$("#display_price").html(product.bottomPrice + "~" + product.topPrice);
		$("#tocart_firstname").html(product.firstSpecName);
		$("#tocart_secondname").html(product.secondSpecName);
		$("#tocart_cover").attr("src", product.cover);
		$("#cartcount").html(cartCount);

	});

	$(document).on('click', '.condition-list', function() {
		var price = $(this).attr("attr-price");
		$("#display_price").html(price);
		if ($(this).hasClass("nodown")) {
			var min = $(this).attr("attr-min");
			var max = $(this).attr("attr-max");
			if (!max) {
				max = 9999;
			}
			var inventory = $(this).attr("attr-inventory");
			$("#d1").html("");
			$("#d1").Spinner(min, min, inventory > max ? max : inventory);
		}
		if ($(this).hasClass("first-list")) {
			var pic = $(this).attr("attr-pic");
			$("#display_pic").attr("src", pic);
		}
		var nownum = $(this).attr("attr-inventory");
		$("#nowinventory").html(nownum);
		$(this).addClass("active").siblings().removeClass("active");
		if ($(this).attr("attr-activity") != 0) {
			if ($(this).attr("attr-activity") == 1) {
				$(".sp-d-p-addbtn").find("a").html("一键秒杀商品");
			} else {
				$(".sp-d-p-addbtn").find("a").html("限时购买商品");
			}
		} else {
			if (nownum * 1 > 0) {
				$(".sp-d-p-addbtn").find("a").html("加入购物车");
				$(".sp-d-p-addbtn").removeClass("clicked");
			} else {
				$(".sp-d-p-addbtn").addClass("clicked");
				$(".sp-d-p-addbtn").find("a").html("没有库存了");
			}
		}
		if ($(this).hasClass("second-list")) {
			return;
		}
		var id = $(this).attr("attr-id");
		var _pic = $(this).attr("attr-pic");
		var _this = $(this);
		api.ajax({
			url : BASE_JOSN_URL + "json/product!choice.action",
			method : 'post',
			dataType : 'json',
			data : {
				values : {
					id : id
				}
			},
		}, function(ret, err) {
			var dat = ret;
			$("#secondSpec").html('');
			var length = dat.length;
			if (length > 0) {
				for (var i = 0; i < dat.length; i++) {
					$("#sp-d-p-group2").show();
					var html = '<dd class="condition-list second-list nodown" attr-inventory="' + dat[i].inventory + '" attr-id="' + dat[i].id + '" attr-activity="' + dat[i].active + '"  attr-pic="' + dat[i].pic + '" attr-min="' + dat[i].min + '" attr-max="' + dat[i].max + '" attr-pic="' + dat[i].pic + '" attr-price="' + dat[i].price + '" ><span class="num">' + dat[i].name + '</span>';
					if (dat[i].active > 0) {
						if (dat[i].active == 1) {
							html += '<span class="tag">秒杀中</span>';
						} else {
							html += '<span class="tag">限时购</span>';
						}
					}
					html += '</dd>';
					$("#secondSpec").append(html);
				}
			} else {
				$(_this).addClass("nodown");
				var min = $(_this).attr("attr-min");
				var max = $(_this).attr("attr-max");
				if (!max) {
					max = 9999;
				}
				var inventory = $(_this).attr("attr-inventory");
				$("#d1").html("");
				$("#d1").Spinner(min < 1 ? 1 : min, min < 1 ? 1 : min, inventory > max ? max : inventory);
			}
		});
	});
	$(document).on('click', ".sp-d-p-addbtn", function() {
		var model = $(".condition-list.active span").text();
		var num = $(".Amount").val();
		var length = $(".active.nodown").length;
		var _this = $(this);
		if (length < 1) {
			$.alert("请选择商品规格");
			return;
		}
		if ($(this).hasClass("clicked")) {
			return false;
		}
		$(this).addClass("clicked");
		var id = $(".active.nodown").attr("attr-id");
		var activity = $(".active.nodown").attr("attr-activity");
		if (activity != 0) {
			if (token == null) {
				api.alert({
					msg : '请登录后操作'
				});
				api.openWin({
					name : 'login',
					url : 'login.html'
				});
				return false;
			}
			api.ajax({
				url : BASE_JOSN_URL + "json/seckill!order.action?id=" + id,
				method : 'post',
				dataType : 'json',
				data : {
					values : {
						id : id,
						token : token
					}
				},
			}, function(ret, err) {
				var dat = ret;
				if (dat.success) {
					window.location.href = "pay!sure.action?id=" + dat.url;
				} else {
					$.alert("商品促销活动已经结束");
					window.location.href = "product!details.action?id=${id}";
				}
			})
			return false;
		}

		api.ajax({
			url : BASE_JOSN_URL + "json/cart!edit.action",
			method : 'post',
			dataType : 'json',
			data : {
				values : {
					id : id,
					num : num,
					temptoken : temptoken,
					token : token
				}
			},
		}, function(ret, err) {
			var dat = ret;
			if (dat.success) {
				if (dat.add == 1) {
					var aftercount = 0;
					aftercount = cartCount * 1 + 1;
					$api.setStorage(CART_NUM_STORE_NAME, aftercount);
					$(".badge").text(aftercount);
				}
				$.closeModal('.popup-about');
			} else {
				alert("添加失败");
			}
			$(_this).removeClass("clicked");
		})
	});
	//星级方法
	xingji('.yhpj-xingji');

	//弹出条件选择
	$(document).on('click', '.open-about', function() {
		$.popup('.popup-about');
		$('.popup-overlay').addClass('close-popup');
		//点击透明层关闭,不是必须
	});

	$(document).on('click', '.cancel', function() {
		$('.popup-overlay').removeClass('modal-overlay-visible');
		$('.kf-popup').removeClass('popblock');
	})
	//数量加减方法
	$("#d1").Spinner(1, 1, 999);
	initSubProduct();
	$(".condition-list").eq(0).trigger("click");
}