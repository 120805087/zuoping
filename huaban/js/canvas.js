window.onload = function(){
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var copy = document.querySelector(".copy");
    var obj = new shape(canvas,copy,ctx);

    var file = document.getElementById("file");
    var img = new Image();

   /*清除蓝屏*/
    copy.onselectstart = function(){
        return false;
    }
    /*下拉菜单*/
    $(".icon-icon-forward").click(function(){
        $(this).next(".color_next_inner").slideToggle();
    })
    $(document).click(function(){
        $(".color_next_inner").slideUp();
    })
    $(".icon-icon-forward").click(function(event){
        event.stopPropagation();
    })
    $(".color_next_inner").click(function(event){
        event.stopPropagation();
    })
    /*文件操作*/
    $(".menus:eq(0) li").click(function(){
        var index = $(this).index();
        if(index==0){
            file.onchange = function(){
                var fileObj = this.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(fileObj);
                reader.onload = function(e){
                    img.src=e.target.result;
                    imgW = img.width;
                    imgH = img.height;
                    ctx.drawImage(img,obj.width/2-img.width/2,obj.height/2-img.height/2,img.width,img.height);
                    dataobj=ctx.getImageData(obj.width/2-img.width/2,obj.height/2-img.height/2,img.width,img.height);
                }
            }
        }else if(index==1){  /*保存文件*/
            var url = canvas.toDataURL();
            location.href=url.replace("image/png", "image/octet-stream");
        }else if(index==2){ /*新建画布*/
            if(obj.historys.length > 0){
                layer.confirm('您需要保存吗？', {
                    btn: ['需要','不需要'], //按钮
                    title:"提示"
                }, function(){
                    url = canvas.toDataURL();
                    location.href=url.replace("image/png", "image/octet-stream");
                    ctx.clearRect(0,0,obj.width,obj.height);
                    obj.historys = [];
                    layer.close(index);
                }, function(){
                    layer.msg('也可以这样', {
                        time: 10000, //10s后自动关闭
                        btn: ['明白了', '知道了']
                    });
                    ctx.clearRect(0,0,obj.width,obj.height);
                    obj.historys = [];
                });
            }
        }else if(index==3){  /*回退*/
            if(obj.historys.length == 0){
                ctx.clearRect(0,0,obj.width,obj.height);
                setTimeout(function(){
                    layer.msg('已经到最后一个了');
                },10)
            }else{
                if(obj.flag){
                   if(obj.historys.length==1){
                       obj.historys.pop();
                       ctx.clearRect(0,0,obj.width,obj.height);
                   }else{
                       obj.historys.pop();
                       ctx.putImageData(obj.historys[obj.historys.length-1],0,0);
                   }
                }else{
                   ctx.putImageData(obj.historys.pop(),0,0);
                }
                obj.flag = false;
            }
        }
    })
    /*点击效果*/
    $(".menus:eq(1) li").click(function(){
        var index = $(this).index();
        $(".menus:eq(2) li").css("background","#EEEEEE");
        $(".menus:eq(1) li").css("background","#EEEEEE").eq(index).css("background","yellow");
        if($(this).attr("data-role") == "pen"){
            obj.pen();
        }
        obj.isback = false;
        $(".xp").css("display","none");
    })

    /*橡皮*/
    $("#xp").click(function(){
        obj.isback = true;
         var xpObj = $(".xp");
        layer.prompt({
            formType: 2,
            value: '15',
            title: '请规定橡皮大小',
            area: ['200px', '25px'] //自定义文本域宽高
        }, function(value, index, elem){
            layer.close(index);
            obj.xpsize = value;
            xpObj.css("fontSize",value+"px");
            obj.xp(xpObj);
        });
    })
    /*放大缩小功能*/
    $("#scale").click(function(){
        layer.prompt({
            formType: 2,
            value: '1',
            title: '请输入放大(缩小)倍数',
            area: ['200px', '25px'] //自定义文本域宽高
        }, function(value, index, elem){
            layer.close(index);
            ctx.clearRect(0,0,obj.width,obj.height);
            ctx.save();
            ctx.translate(obj.width/2,obj.height/2);
            ctx.scale(value,value);
            ctx.drawImage(img,-imgW/2,-imgH/2,img.width,img.height);
            ctx.restore();
        });
    })
    /*模糊效果*/
    $("#blur").click(function(){
        blur(dataobj,10,obj.width/2-img.width/2,obj.height/2-img.height/2)
    })
    /*马赛克效果*/
    $("#msk").click(function(){
        msk(dataobj,30,obj.width/2-img.width/2,obj.height/2-img.height/2)
    })
    /*字体功能*/
    $("#zt").click(function(){
        var zitiObj = $(".zt");
        obj.ziti(zitiObj);
        setTimeout(function(){
            $(this).css("backgroundColor","#EEEEEE");
        },10)
    })
    $(".menus:eq(2) li").click(function(){
        /*背景*/
        var index = $(this).index();
        $(".menus:eq(1) li").css("background","#EEEEEE");
        $(".menus:eq(2) li").css("background","#EEEEEE").eq(index).css("background","yellow");
        /*功能*/
      if($(this).attr("data-role")!="sanjiao" && $(this).attr("data-role")!="bian" && $(this).attr("data-role")!="jiao") {
          obj.type = $(this).attr("data-role");
          obj.draw();
      }else if($(this).attr("data-role")=="jiao"){
          layer.prompt({
              formType: 2,
              value: '5',
              title: '请输入边数',
              area: ['200px', '25px'] //自定义文本域宽高
          }, function(value, index, elem){
              layer.close(index);
              obj.jiaoNum = value;
              obj.type = "jiao";
              obj.draw();
          });
      }else if($(this).attr("data-role")=="bian"){
          layer.prompt({
              formType: 2,
              value: '5',
              title: '请输入边数',
              area: ['200px', '25px'] //自定义文本域宽高
          }, function(value, index, elem){
              layer.close(index);
              obj.bianNum = value;
              obj.type = "bian";
              obj.draw();
          });
      }else{
          obj.bianNum = 3;
          obj.type = "bian";
          obj.draw();
      }
        obj.isback = false;
        $(".xp").css("display","none");
    })
    $(".menus:eq(3) li").click(function(){
        var index = $(this).index();
        $(".menus:eq(3) li").css("borderColor","#eee").eq(index).css("borderColor","red");
        obj.lineWidth = $(this).attr("data-role");
        obj.draw();
        obj.isback = false;
        $(".xp").css("display","none");
    })
    /*可选线宽*/
    $("input[type=number]").change(function(){
        obj.lineWidth = $(this).val();
        obj.draw();
    })
    $(".menus:eq(4) li").click(function(){
        var index = $(this).index();
        $(".menus:eq(4) li").css("borderColor","#eee").eq(index).css("borderColor","red");
        obj.strokeStyle = $(this).attr("data-role");
        obj.fillStyle = $(this).attr("data-role");
        obj.draw();
        obj.isback = false;
        $(".xp").css("display","none");
    })
    /*可选颜色*/
    $("input[type=color]:eq(0)").change(function(){
        obj.stype = "stroke";
        obj.strokeStyle = $(this).val();
        obj.draw();
    })
    $("input[type=color]:eq(1)").change(function(){
        obj.stype = "fill";
        obj.fillStyle = $(this).val();
        obj.draw();
    })

    /*模糊*/
    function blur(dataobj,num,x,y) {
        var width = dataobj.width, height = dataobj.height;
        console.log(dataobj)
        console.log(width)
        console.log(height)
        var arr=[];
        var num = num;
        for(var i = 0 ; i < height; i++){
            for(var j = 0 ; j < width; j++){
                var x1=j+num>height?j-num:j;
                var y1=i+num>width?i-num:i;
                var imgObj = ctx.getImageData((obj.width/2-imgW/2)+x1,(obj.height/2-imgH/2)+y1,num,num);

                var r = 0, g = 0, b = 0;
                for (var k = 0; k < imgObj.width * imgObj.height; k++) {
                    r += imgObj.data[k * 4];
                    g += imgObj.data[k * 4 + 1];
                    b += imgObj.data[k * 4 + 2];
                }
                r = parseInt(r / (imgObj.width * imgObj.height));
                g = parseInt(g / (imgObj.width * imgObj.height));
                b = parseInt(b / (imgObj.width * imgObj.height));
                arr.push(r,g,b,255);
            }
        }
        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i];
        }
        ctx.putImageData(dataobj,x,y);
    }
    /*马赛克*/
    function msk(dataobj,num,x,y){
        var  width = dataobj.width;
        var height = dataobj.height;
        var num = num;
        var w= width/num;
        var h = height/num;
        for(var i = 0; i<num;i++){
            for(var j = 0; j < num;j++){
                var imageObj = ctx.getImageData((obj.width/2-imgW/2)+j*w,(obj.height/2-imgH/2)+i*h,w,h);
                var r = 0, g = 0, b = 0;
                for(var k = 0; k < imageObj.width*imageObj.height;k++){
                    r += imageObj.data[4*k];
                    g += imageObj.data[4*k+1];
                    b += imageObj.data[4*k+2];
                }
                r = parseInt(r / (imageObj.width*imageObj.height));
                g = parseInt(g / (imageObj.width*imageObj.height));
                b = parseInt(b / (imageObj.width*imageObj.height));
                for(var k = 0 ; k < imageObj.width*imageObj.height;k++){
                    imageObj.data[k*4] = r;
                    imageObj.data[k*4+1] = g;
                    imageObj.data[k*4+2] = b;
                }
               ctx.putImageData(imageObj, x+j * w,y+i * h);
            }
        }
    }

}