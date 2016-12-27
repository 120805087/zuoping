function game(canvas,cobj,runs,jumps,hinders,zidans,lif,jifen,runa,hita,zidana,jumpa){
    this.canvas = canvas;
    this.lif=lif;
    this.jifen=jifen;
    this.runa=runa;
    this.hita=hita;
    this.jumpa=jumpa;
    this.zidana=zidana;
    this.width = canvas.width;
    this.height = canvas.height;
    this.cobj = cobj;
    this.hinders = hinders;
    this.person = new person(canvas,cobj,runs,jumps);
    this.back = 0;
    this.speed = 5;
    this.hinderAll = [];
    this.score = 0;
    this.isfire = false;
    this.zidan = new zidan(canvas,cobj,zidans);
}
game.prototype = {
    play:function(ZY,TY,cover){
        ZY.style.animation = "cover1 1s linear forwards";
        TY.style.animation = "cover1 1s linear forwards";
        cover.style.animation = "cover1 1s linear forwards";
        this.run();
        this.key();
    },
    run:function(){
        var that = this;
        that.name = prompt("请输入你的用户名","fengnannan");
        var num = 0;
        var rand = (4+Math.ceil(6*Math.random()))*1000;
        setInterval(function(){
            num += 50;
            that.cobj.clearRect(0,0,that.width,that.height);
            that.person.num++;
            if(that.person.status=="runs"){
                that.person.state = that.person.num % 4;
            }else{
                that.person.state = 0;
            }

            that.person.draw();
            that.person.x += that.person.speedx;

            /*调整角色的位置*/
            if(that.person.x>that.width/3){
                that.person.x = that.width/3;
            }
            /*放障碍物*/
            if(num%rand==0){
                rand = (4+Math.ceil(6*Math.random()))*1000;
                num = 0;
                var hindersObj = new hinder(that.canvas,that.cobj,that.hinders);
                hindersObj.state = Math.floor(Math.random()*that.hinders.length);
                that.hinderAll.push(hindersObj);
            }
            for(var i = 0;i < that.hinderAll.length;i++){
                that.hinderAll[i].x-= that.hinderAll[i].speedx;
                that.hinderAll[i].draw();

                if(hitPix(that.canvas,that.cobj,that.person,that.hinderAll[i])){
                   if(!that.hinderAll[i].flag){
                       xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
            that.person.life--;
                       if(that.person.life == 0){
                           /*存储*/
                           var messages = localStorage.messages?JSON.parse(localStorage.messages):[];
                           /*取数据*/
                           var temp = {name:that.name,score:that.score};

                           if(messages.length>0){
                               /*排序*/
                               messages.sort(function(a,b){
                                   return a.score < b.score;
                               })
                               if(messages.length==5){
                                   messages[messages.length-1] = temp;
                               }else if(messages.length<5){
                                   messages.push(temp);
                               }
                           }else{
                               messages.push(temp);
                           }
                           /*重新保存*/
                           localStorage.messages = JSON.
                           stringify(messages);
                           console.log(messages);
                           // alert("Game over");
                           // location.reload();
                       }
                        that.hinderAll[i].flag = true;
        }
                }
                if(that.person.x>that.hinderAll[i].x+that.hinderAll[i].width){
                    if(!that.hinderAll[i].flag&&!that.hinderAll[i].flag1) {
                        that.score++;
                        document.title = that.score;
                        that.hinderAll[i].flag1 = true;
                    }
                }
            }
            /*操作子弹*/
            if(that.isfire){
                that.zidanspeedx+=that.zidan.jia;
                that.zidan.x+=that.zidan.speedx;
                that.zidan.draw();
            }
            /*检测子弹与障碍物碰撞*/
           for(var i = 0;i<that.hinderAll.length;i++){
               if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderAll[i])){
                       that.score++;
                       document.title = that.score;
                       that.hinderAll.splice(i,1);  /*清除障碍物*/

                       that.cobj.clearRect(that.zidan.x,that.zidan.y,that.zidan.width,that.zidan.height);
               }
           }

            /*背景动画*/
            that.back -= that.speed;
            that.canvas.style.backgroundPositionX = that.back + "px";
        },30)
    },
    key:function(){
        var that = this;
        var flag = true;
        document.onkeydown = function(e){
            if(e.keyCode == 87){
                that.person.status = "jumps";
                if(!flag){
                    return;
                }
                flag = false;
               var inita = 0;
                var speeda = 5;
                var r = 120;
                var y = that.person.y;
                var t = setInterval(function(){
                    inita += speeda;
                    if(inita>=180){
                        that.person.y = y;
                        clearInterval(t);
                        flag = true;
                        that.person.status = "runs";
                    }
                    var top = Math.sin(inita*Math.PI/180)*r;
                    that.person.y = y - top;
                },30)
            }else if(e.keyCode == 74){  /*子弹    */
                that.zidan.x=that.person.x+that.person.width/2;
                that.zidan.y=that.person.y+that.person.height/3;
                that.zidan.speedx=5;
                that.isfire=true;
            }
        }
    }
}

/*创建人物*/
function person(canvas,cobj,runs,jumps){
    this.canvas = canvas;
    this.cobj = cobj;
    this.runs = runs;
    this.jumps = jumps;
    this.x = 0;
    this.y = 253;
    this.width = 66;
    this.height = 80;
    this.status = "runs";
    this.state = 0;
    this.num = 0;
    this.speedx = 5;
    this.life = 1;
}
person.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,66,80,0,0,66,80);
        this.cobj.restore();
    }
}

/*创建障碍物*/
function hinder(canvas,cobj,hinders){
    this.canvas = canvas;
    this.cobj = cobj;
    this.hinders = hinders;
    this.x = canvas.width-20;
    this.y = 250;
    this.width = 92;
    this.height = 90;
    this.state = 0;
    this.speedx = 6;
}
hinder.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinders[this.state],0,0,92,90,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
/*血*/
function lizi(cobj){
    this.cobj = cobj;
    this.x = 200;
    this.y = 300;
    this.r = 1+2*Math.random();
    this.color = "red";
    this.speedx = 3-Math.random()*6;
    this.speedy = 3-Math.random()*6;
    this.speedr = 0.1;
    this.zhongli = 0.3;
}
lizi.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.fillStyle = this.color;
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    update:function(){
        this.x += this.speedx;
        this.speedy += this.zhongli;
        this.y += this.speedy;
        this.r -= this.speedr;
    }
}
function xue(cobj,x,y){
    var arr = [];

    for(var i = 0;i<30;i++)
    {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++)
        {

            arr[i].draw();
            arr[i].update();

            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    })
}
/*子弹*/
function zidan(canvas,cobj,zidans){
    this.canvas = canvas;
    this.cobj = cobj;
    this.zidans = zidans;
    this.x = 0;
    this.y = 0;
    this.width = 108;
    this.height = 50;
    this.speedx = 5;
    this.jia = 1;
}
zidan.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.zidans,0,0,216,119,0,0,this.width,this.height);
        this.cobj.restore();
    }
}