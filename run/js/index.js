window.onload = function(){
    var clientH = document.documentElement.clientHeight;
    var clientW = document.documentElement.clientWidth;
    var canvas = document.querySelector("canvas");
    var lif=document.querySelector(".pres")
    var jifen=document.querySelector(".jifen")
    var runa=document.querySelector(".runa")
    var hita=document.querySelector(".hita")
    var zidana=document.querySelector(".zidana")
    var jumpa=document.querySelector(".jumpa")
    canvas.width = clientW;
    canvas.height = clientH;
    var cobj = canvas.getContext("2d");

    var runs = document.querySelectorAll(".run");
    var jumps = document.querySelectorAll(".jump");
    var hinders = document.querySelectorAll(".hinder");

    /*子弹*/
    var zidans = document.querySelector(".zidan");

    /*开始按钮*/
    var start = document.getElementById("start_text");

    var gameObj = new game(canvas,cobj,runs,jumps,hinders,zidans,lif,jifen,runa,hita,zidana,jumpa);

    /*开始界面*/
    var ZY = document.getElementsByClassName("title")[0];
    var TY = document.getElementsByClassName("start")[0];

    /*cover*/
    var cover = document.getElementsByClassName("cover")[0];

    start.onclick = function(){
        gameObj.play(ZY,TY,cover);
        start.onclick = null;
    }
}