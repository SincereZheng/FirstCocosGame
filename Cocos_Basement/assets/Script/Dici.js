var tmpPlayer = require("Player");
cc.Class({
    extends: cc.Component,

    properties: {
       dieAudio:{
           default:null,
           url:cc.AudioClip
       }
    },

    
    onLoad: function () {
        var self= this;
        // this.node.on('touchstart',()=>{
        //     var goAction= cc.moveBy(0.2,cc.Vec2(0,140));
        //     self.node.runAction(goAction);
        //     return true; //这里必须要写 return true
        // },this)
    },
    noteBox:function(){
        return this.node.getBoundingBox();
    },
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
        var player = cc.find("Canvas/normal").getComponent(tmpPlayer);
        if(player.node.getBoundingBox().intersects(this.noteBox())){
            
            cc.audioEngine.playEffect(this.dieAudio,false);
            cc.director.loadScene('OverScene');
           //cc.log('碰撞');
        }

     },
});
