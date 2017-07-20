/**
 * Created by PC150430-1 on 2017/4/27.
 */
var video = $(".play-view")[0];
var duration = video.duration;
var vol = video.volume;
var currentSrc = video.currentSrc;
var playerWrapper = $(".main");

var minute = 0;
var second = 0;
var int;
var intProgress;

//准备函数

function play() {
    var playBtn = $(".icon-play");
    playBtn.addClass("hide");
    playBtn.siblings().removeClass("hide");
    video.play();
    starTime();
    starProgress();
    $(video).attr("data-state","true");
}

function pause() {
    var pauseBtn = $(".icon-pause");
    pauseBtn.addClass("hide");
    pauseBtn.siblings().removeClass("hide");
    video.pause();
    pauseTime();
    pauseProgress();
    $(video).attr("data-state","false");
}

function starTime() {
    window.clearInterval(int);
    int = setInterval(timer,1000)
}

function timer() {
    var currentTime = video.currentTime;
    var second = Math.round(currentTime)%60;
    var minute = parseInt(Math.floor(currentTime)/60);
    var secondStr = second;
    var minuteStr = minute;
    if(second < 10){
        secondStr = "0" + second;
    }
    if(minute < 10){
        minuteStr = "0" + minute;
    }
    $(".progressTime").text(minuteStr + ":" + secondStr);
}

function pauseTime() {
    window.clearInterval(int);
}

function resetTime() {
    window.clearInterval(int);
    minute = second = 0;
    $(".progressTime").text("00:00")
}

function starProgress() {
    window.clearInterval(intProgress);
    intProgress = setInterval(progress,1000)
}

function starBuffer() {
    var intBuffer = setInterval(function () {
        var bufferEnd = video.buffered.end(0) || 0;
        var duration = video.duration;
        var bufferedWidth = (bufferEnd/duration)*100;
        $(".buffer-bar").width(bufferedWidth + "%");
        if (bufferEnd >= duration){
            clearInterval(intBuffer);
        }
    },1000)
}

function progress() {
    var currentTime = video.currentTime;
    duration = video.duration;
    var width = (currentTime/duration)*100;
    $(".progress-bar").css("width",width + "%");
}

function pauseProgress() {
    window.clearInterval(intProgress);
}

function showFullscreen(self) {
    $(video).css("width",window.screen.Width);
    $(video).css("height",window.screen.Height);
    $(".index-wrapper").css({
        "width":"100%",
        "height": "100%",
        "margin": "0 auto",
        "padding": "0"
    });
    $(".main").css({
        "width":"100%",
        "height": "100%"
    });
    self.addClass("hide");
    self.siblings().removeClass("hide");
}

function hideFullscreen(self) {
    $(video).css("width","100%");
    $(video).css("height","100%");
    $(".index-wrapper").removeAttr("style");
    $(".main").removeAttr("style");
    self.addClass("hide");
    self.siblings().removeClass("hide");
}

function launchFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

//初始化
$(document).ready(function () {
    video.autoplay = true;
    starTime();      //开始计时
    starProgress();  //开启进度条
    starBuffer();    //开启缓冲进度条
    showVol();       //获取音量并显示
});

//事件
//show--操作面板
playerWrapper.on("mouseover",function () {
    setTimeout(function () {
        $(playerWrapper).find(".control-wrapper").fadeIn();
    },500);

});

//hide--操作面板
playerWrapper.on("mouseout",function () {
    setTimeout(function () {
        $(playerWrapper).find(".control-wrapper").fadeOut();
    },1000);
});

//play--播放
$(".icon-play").on("click",function () {
    play();
});

//pause-->暂停按钮点击事件
$(".icon-pause").on("click",function () {
    pause();
});

//pause-->点击video暂停事件
$(video).on("click",function () {
    var state = $(video).attr("data-state");
    if (state == "true"){
        pause();
    }else if (state == "false"){
        play();
    }
});

//pause-->空格键暂停事件


//点击进度条
$(".progress").on("click",function (e) {
    var changeProgressWidth = e.pageX - $(this).offset().left;
    var perPos = changeProgressWidth/($(this).width());
    video.currentTime = (video.duration)*perPos;
    starTime();
    starProgress();
});

//音量显示
function showVol() {
    var volBarHeight = video.volume*100;
    $(".vol-bar").css("height",volBarHeight + "%");
}

$(".icon-vol").on("click",function () {
    $(".vol-box").toggle();
});

//控制音量
$(".vol-wrapper").on("click",function (e) {
    var changeVolHeight = 80 - (e.pageY - $(this).offset().top);
    video.volume = changeVolHeight/80;
    showVol();
});

//全屏
$(".icon-fullScreen").on("click",function () {
    launchFullscreen(document.documentElement);
    showFullscreen($(this))
});
//退出全屏
$(".icon-autoScreen").on("click",function () {
    exitFullscreen();  // 判断浏览器种类--浏览器全屏
    hideFullscreen($(this));
});

//按下Esc退出全屏
document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==27){
        exitFullscreen();  // 判断浏览器种类--浏览器全屏
        hideFullscreen($(this));
    }
};

