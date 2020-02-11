// 检查是否是手机端以及是否可用webgl，返回一个对象，包含两个字段：isMobile
function Check() {
    var info = {};
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        // 是手机端
        info.isMobile = true;
        if (/Android/i.test(navigator.userAgent)) {
            info.isAndroid = true;
        } else {
            info.isAndroid = false;
        }
    } else {
        // 不是手机端
        info.isMobile = false;
    }
    return info;
};

function iosErrorHandle(e) {
    var wechatNote = document.getElementsByClassName('wechatNote')[0];
    wechatNote.style.display = 'block';
    document.getElementById('iosTip').style.display = 'block';
    wechatNote.onclick = function(){
        wechatNote.style.display = 'none';
        document.getElementById('androidTip').style.display = 'none';
        document.getElementById('iosTip').style.display = 'none';
    }
}

function androidErrorHandle(e) {
    var wechatNote = document.getElementsByClassName('wechatNote')[0];
    wechatNote.style.display = 'block';
    document.getElementById('androidTip').style.display = 'block';
    wechatNote.onclick = function(){
        wechatNote.style.display = 'none';
        document.getElementById('androidTip').style.display = 'none';
        document.getElementById('iosTip').style.display = 'none';
    }
}

function showDragHelp(e) {
    var wechatNote = document.getElementsByClassName('dragNote')[0];
    wechatNote.style.display = 'block';
    wechatNote.onclick = function(){
        wechatNote.style.display = 'none';
    }
}

// 截屏并下载,传入文件统一前缀名,回调为 bool function(canvas)
function CaptureScreen(name, callback) {
    var videoBG = document.getElementsByTagName('video')[0];
    var allCanvas = document.getElementsByTagName('canvas');
    var canvasArray = new Array();

    for (i = 0; i < allCanvas.length; i++) {
        if (allCanvas[i].style.display != 'none') {
            if (videoBG != undefined && allCanvas[i].style.zIndex < videoBG.style.zIndex) {
                continue;
            }
            canvasArray.push(allCanvas[i]);
        }
    }

    canvasArray.sort(function(a, b) {
        return a.style.zIndex < b.style.zIndex;
    });

    var comb = document.createElement('canvas');
    comb.width = window.innerWidth * 2;
    comb.height = window.innerHeight * 2;


    var ctx = comb.getContext('2d');

    if (videoBG != undefined) {
        var offset = (videoBG.videoWidth - ctx.canvas.width / ctx.canvas.height * videoBG.videoHeight) / 2;
        ctx.drawImage(videoBG, offset, 0, videoBG.videoWidth - offset * 2, videoBG.videoHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    var loadedImg = 0;
    var ImgCount = canvasArray.length;

    var imgs = new Array();

    for (var i = 0; i < canvasArray.length; i++) {
        var j = i;
        var image = new Image();
        image.src = canvasArray[i].toDataURL("image/png");
        image.onload = function() {
            imgs[j] = image;
            loadedImg += 1;
        }
    }

    function waitForImgLoaded() {
        if (loadedImg < ImgCount) {
            requestAnimationFrame(waitForImgLoaded);
        } else {
            for (var i = 0; i < imgs.length; i++) {
                ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
            }

            var defaultAct = true;
            if (callback != undefined) {
                defaultAct = callback(comb);
            }
            if (defaultAct) {
                downloadFile(name + ' ' + new Date().Format('yyyy-MM-dd hh mm ss') + '.png', comb);
            }
        }
    }
    waitForImgLoaded();

    function downloadFile(fileName, canvas) {
        var aLink = document.createElement('a');
        var evt = document.createEvent("MouseEvents");
        evt.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        aLink.download = fileName;
        aLink.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        aLink.dispatchEvent(evt);
    }
}

// 日期格式化
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

};



var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部,

        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

