var BASE_URL = "http://192.168.1.108:8083/";
// var BASE_JSON_URL = "http://192.168.1.108:8082/";
// var BASE_URL = "";
var BASE_JSON_URL = "http://m.123mfl.com/";


var CART_NUM_STORE_NAME = "cookiec";
var USER_TOKEN_STORE_NAME = "userToken";
var JF_TYPE = {"-1":"消费支出","1":"评论收入",};

function getUuid() {
	var len = 32;
	//32长度
	var radix = 16;
	//16进制
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;
	if (len) {
		for ( i = 0; i < len; i++)
			uuid[i] = chars[0 | Math.random() * radix];
	} else {
		var r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for ( i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
}

function openWinByRouter(name,router,pId) {
	// api.closeFrameGroup({name:'product_group'});
	// var aa = parseInt(Math.random()*1000)+'aa';
	api.openWin({
		name:name,
		url:name+'.html#' + router,
            pageParam:{id:pId},
            reload:true,
            delay:100
	});
}


function openWin(name,pId) {
	//api.closeFrameGroup({name:'group'});
	// var aa = parseInt(Math.random()*1000)+'aa';
	api.openFrame({
		name:name,
		url:name+'.html',
            pageParam:{id:pId},
            reload:true,
            delay:100
	});
}
function openWinWithParam(name,paramjson) {
	// api.closeFrameGroup({name:'product_group'});
	// var aa = parseInt(Math.random()*1000)+'aa';
	api.openFrame({
		name:name,
		url:name+'.html',
            pageParam:paramjson,
            reload:true,
            delay:100
	});
}

function openFrame(name) {
	api.openFrame({
		name:name,

		url: name+'.html',
		reload:false

	});
}


function closeWin() {
	api.closeFrame();
}

function openIndexFrame(index) {
	openWin('../index',index);
}


