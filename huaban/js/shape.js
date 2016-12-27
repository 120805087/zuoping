function shape(canvas,copy,cobj){
    this.canvas = canvas;
    this.cobj = cobj;
    this.copy = copy;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.historys  = [];
    this.type = "line";
    this.stype = "stroke";
    this.fillStyle = "#000";
    this.strokeStyle = "#000";
    this.lineWidth = 1;
    this.bianNum = 5;
    this.jiaoNum = 5;
    this.isback = true;
    this.xpsize = 15;
    this.flag = true;
}
shape.prototype = {
    init:function(){
        this.cobj.fillStyle = this.fillStyle;
        this.cobj.strokeStyle = this.strokeStyle;
        this.cobj.lineWidth = this.lineWidth;
    },
    draw:function(){
        this.init();
        var that = this;
        that.copy.onmousedown = function(e){
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.copy.onmousemove = function(e){
                that.flag = true;
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.beginPath();
                that[that.type](startx,starty,endx,endy);

            }
            that.copy.onmouseup = function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.stype]();
    },
    arc:function(x,y,x1,y1){
        var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.stype]();
    },
    bian:function(x,y,x1,y1){
        var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var angel = 360/this.bianNum*Math.PI/180;

        for(var i = 0;i < this.bianNum; i++){
            this.cobj.lineTo(Math.cos(i*angel)*r+x,Math.sin(i*angel)*r+y);
        }
        this.cobj.closePath();
        this.cobj[this.stype]();
    },
    jiao:function(x,y,x1,y1){
        var dr = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var xr = dr/3;
        var angel = 360/(this.jiaoNum*2)*Math.PI/180;

        for(var i = 0;i < this.jiaoNum*2; i++){
            if(i%2==0){
                this.cobj.lineTo(Math.cos(i*angel)*dr+x,Math.sin(i*angel)*dr+y);
            }else{
                this.cobj.lineTo(Math.cos(i*angel)*xr+x,Math.sin(i*angel)*xr+y);
            }
        }
        this.cobj.closePath();
        this.cobj[this.stype]();
    },
    pen:function(){
        this.init();
        var that = this;
        that.copy.onmousedown = function(e){
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove = function(e){
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();

            }
            that.copy.onmouseup = function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
            }
        }
    },
    xp:function(xpObj){
        var that = this;
        that.copy.onmousemove = function(e) {
            if(!that.isback){
                return;
            }
            var ox = e.offsetX;
            var oy = e.offsetY;
            var lefts = ox-that.xpsize/2;
            var tops = oy-that.xpsize/2;
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.width-that.xpsize){
                lefts=that.width-that.xpsize;
            }
            if(tops<0){
                tops=0;
            }
            if(tops>that.height-that.xpsize){
                tops=that.height-that.xpsize;
            }
            xpObj.css({display: "block",left:lefts,top:tops});
        }
        that.copy.onmousedown = function(){
            if(!that.isback){
                return;
            }
            that.copy.onmousemove = function(e){
                var ox = e.offsetX;
                var oy = e.offsetY;
                var lefts = ox-that.xpsize/2;
                var tops = oy-that.xpsize/2;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-that.xpsize){
                    lefts=that.width-that.xpsize;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-that.xpsize){
                    tops=that.height-that.xpsize;
                }
                xpObj.css({display: "block",left:lefts,top:tops});
                that.cobj.clearRect(lefts,tops,that.xpsize,that.xpsize);
            }
            that.copy.onmouseup = function(){
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.xp(xpObj);
            }
        }
    },
    ziti:function(ztObj){
        var that = this;
        that.copy.onmousemove = function(e) {
            // if(!that.isback){
            //     return;
            // }
            var ox = e.offsetX;
            var oy = e.offsetY;
            var lefts = ox-that.xpsize/2;
            var tops = oy-that.xpsize/2;
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.width-that.xpsize){
                lefts=that.width-that.xpsize;
            }
            if(tops<0){
                tops=0;
            }
            if(tops>that.height-that.xpsize){
                tops=that.height-that.xpsize;
            }
            ztObj.css({display: "block",left:lefts,top:tops});
        }
        that.copy.onmousedown = function(e){
            var startx = e.offsetX;
            var starty = e.offsetY;
            layer.prompt({
                formType: 2,
                title: '请输入要填充的文字',
                area: ['200px', '25px'] //自定义文本域宽高
            }, function(value, index, elem){
                layer.close(index);
                that.cobj.fillText(value,startx,starty);
                that.pen();
                that.copy.onmousemove = null;
                ztObj.css({display:"none"});
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            });
        }

    }
}