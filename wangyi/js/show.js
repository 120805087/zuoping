window.onload=function(){
    function resize(originSize,type){
        var type=type||"x";
        if(type=="x"){
            var widths=document.documentElement.clientWidth;
            var scale=widths/originSize*100+"px";
        }else if(type=="y"){
            var heights=document.documentElement.clientHeight;
            var scale=heights/originSize*100+"px";
        }
        document.getElementsByTagName("html")[0].style.fontSize=scale;
    }
    resize(1334,"y");
}