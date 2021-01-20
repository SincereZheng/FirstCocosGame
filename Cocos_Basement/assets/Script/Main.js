cc.Class({
    extends: cc.Component,

    properties: {
      player:{
          default:null,
          type:cc.Node
      },
      dici:{
          default:null,
          type:cc.Prefab
      },
      diciCount:0,
      bgAudio:{
           default:null, 
           url:cc.AudioClip                                       
       },
       jumpAudio:{
           default:null,
            url:cc.AudioClip 
       },
       playTime:999, //游戏时间，倒计时
       timeLabe:{
           default:null,
           type:cc.Label
       },
       scoreLabel:{
           default:null,
           type:cc.Label
       },
       //这里定义的初始值无效，要在界面那边去设置
       score:0,
       dc_duration:200,//地刺的间隔距离
       speed:1,
       speedoffset:0.01,
       speedCount:10
    },

    playerMoveLeft:function(){
        var goLeft= cc.moveTo(0.2,cc.v2(-this.node.width/2+80,this.player.y));
        var goL1= cc.moveTo(0.1,cc.v2(-this.node.width/2+80+30,this.player.y));
        var goL2= cc.moveTo(0.1,cc.v2(-this.node.width/2+80,this.player.y));
        var sque=cc.sequence(goL1,goL2);
        
        if(this.player.eulerAngles.y==0)
        {
            this.player.eulerAngles.y=0;
            this.player.runAction(sque);
        }
        else{
            this.player.eulerAngles.y=0;
            this.player.runAction(goLeft);
        }
        
    },
    playerMoveRight:function(){
        var goRight= cc.moveTo(0.2,cc.v2(this.node.width/2-80,this.player.y));
        var goR1= cc.moveTo(0.1,cc.v2(this.node.width/2-80-30,this.player.y));
        var goR2= cc.moveTo(0.1,cc.v2(this.node.width/2-80,this.player.y));
        var sque=cc.sequence(goR1,goR2);
        if(this.player.eulerAngles.y==180){
            this.player.eulerAngles.y=180;
            this.player.runAction(sque);
        }
        else{
            this.player.eulerAngles.y=180;
            this.player.runAction(goRight);
        }
       
    },
    //得到新的地刺
    NewDici:function(){
        this.diciCount+=1;
        var newDici = cc.instantiate(this.dici);
        this.node.addChild(newDici);
        var randD= Math.random();
        // if(randD>=0.5){
        //     newDici.eulerAngles.y=0;
        // }else{
        //     newDici.eulerAngles.y=this.dc_duration;
        // }
        newDici.setPosition(this.diciPosition(randD));
        
        // var goAction= cc.moveBy(1/this.speed,cc.Vec2(0,this.node.height + 80));
        // newDici.runAction(goAction);
    },
    //地刺的出现位置
    diciPosition:function(randD){
        
        var randX=0;
        var randY=0;
        //大于0.5在右边，小于0.5在左边出现
        if(randD>=0.5){
            randX=this.node.width/2-80;
        }else{
            randX=-this.node.width/2+80;
        }
        // if(this.diciCount<=8){
        //     randY=(this.node.height/2)-(this.dc_duration*this.diciCount)-this.dc_duration*1;
        // }else{
            randY=-this.node.height/2 - 80
        // }
        return cc.Vec2(randX,randY);
    },
    
    //监听玩家操控
    setInputControl:function(){
        var self = this;
        this.node.on("touchstart",(event)=>{
            cc.audioEngine.playEffect(self.jumpAudio,false);
            var target = event.getCurrentTarget();//获取事件所绑定的target
            var locationInNode = event.touch.getLocation();
            //cc.log('locationInNode: ' + locationInNode.x);
            if(locationInNode.x>self.node.width/2){
               self.playerMoveRight();//player向右移动
            }else{
               self.playerMoveLeft();//player向左移动
            }
            //把分数存储到本地
            // self.score+=1;
            // cc.sys.localStorage.setItem("score",self.score);
            
            // self.scoreLabel.string = self.score;
            // self.NewDici();
            // self.autoDiciRun();
            return true; //这里必须要写 return true
        },this)
        this.node.on("touchmove",()=>{
        },this)
    },
    autoDiciRun(){
        var that = this;
        var children = this.node.getChildren()
        children.forEach(function(child) {
            if(child.name.trim() == "dici"){
                var goAction= cc.moveBy(that.speed,cc.Vec2(0,that.dc_duration));
                child.runAction(goAction);
            }
        }, this);
    },
    // use this for initialization
    onLoad: function () {
       this.score=0;
       //设置音效的音量
       cc.audioEngine.setEffectsVolume(0.2);
       cc.audioEngine.playMusic(this.bgAudio,true);
       cc.director.preloadScene("OverScene");
       this.setInputControl();
       this.player.setPosition(-this.node.width/2+80,this.node.height/2-175);
        // for(var i=0;i<8;i++)
        // {
        //     this.NewDici();
        // }
        var x = 0
        
        
        this.scheduleOnce(function(){
            this.myschedule();
        },this.speed);
       
    },
    myschedule:function(){
        this.NewDici();
        this.autoDiciRun();

        this.playTime--;
        this.timeLabe.string = "倒计时:"+this.playTime;
        if(this.playTime<=0){
            cc.audioEngine.pauseMusic();
            cc.director.loadScene('OverScene');
        }

        this.score+=1;
        cc.sys.localStorage.setItem("score",this.score);
        
        this.scoreLabel.string = this.score;
        if(this.speed - this.speedoffset < 0)
            this.speedoffset = this.speedoffset / 10
        if(this.speed < 0.5){
            this.speedCount--
            if(this.speedCount == 0){
                this.speed = this.speed - this.speedoffset
                this.speedCount = 10
            }
        }else 
            this.speed = this.speed - this.speedoffset
        console.log(this.speed)

        this.scheduleOnce(function(){
            this.myschedule();
        },this.speed);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
