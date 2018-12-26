import EventEmitter from '../module/eventEmitter';
import {reSizeBackground, rePostionContents} from '../util/cavasResize';
import bg from '../../img/bg.png';
import obj1 from '../../img/obj1.png';
import obj2 from '../../img/obj2.png';
import obj1Mask from '../../img/obj1_mask.png';
import obj2Mask from '../../img/obj2_mask.png';
import obj1Shadow from '../../img/obj1_shadow.png';
import obj2Shadow from '../../img/obj2_shadow.png';
import mask from '../../img/mask.png';
import particle from '../../img/particle_1.png';
import ef1 from '../../img/ef1.png';
import ef2 from '../../img/ef2.png';
import ef3 from '../../img/ef3.png';
import ef4 from '../../img/ef4.png';
import light from '../../img/light.png';

import smoke from '../../img/smoke.png';

import subTitle from '../../img/sub_title.png';


export default class Intro extends EventEmitter{
    constructor(){
        super();
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas;
        this.canvasObj = {};
        this.canvasFilters = {};
        this.lightCon;
        this.particles = [];
        this.smokeCon;
        this.smokes = [];        
        this.mouseX = this.w/2;
        this.contentSize = {w:1920, h:1200};
        this.ef_alpha = 0;
        this.ef_alpha_l = 0.008;
        this.checkIE = window.navigator.userAgent.indexOf('MSIE ') > 0;
        this.isIntro = true;
        this.showMotion = new TimelineMax({paused: true, onComplete:()=>{this._showComplete()}});
        this._init();
        this._motionSet();   
        
        window.addEventListener("resize", this._resize.bind(this));
    }
    _init(){
        
        this._drawCanvas();
        this.canvas.ticker.add(()=> {
            let angle = -(this.mouseX - this.w/2)/1150;
            this.ef_alpha += this.ef_alpha_l;
            if(this.ef_alpha>=1){
                this.ef_alpha_l *=-1;
            }
            if(this.ef_alpha<=0){
                this.ef_alpha_l *=-1;
            }
            for(let i = 0; i< 2000; i++)
            {
                let particle = this.particles[i];
                if(this.isIntro)particle.start();
                if(!this.isIntro)particle.show();
                
            }
            for(let i = 0; i< 100; i++)
            {
                let smoke = this.smokes[i];
                if(this.isIntro)smoke.start();
                if(!this.isIntro)smoke.show();
            }
            this.canvasObj.ef1_2.alpha = this.ef_alpha;
            this.canvasObj.ef1_3.alpha = 1-this.ef_alpha;
            if(this.isIntro)return;

            if(!this.checkIE){
                this.canvasObj.mask.x +=(this.mouseX-this.canvasObj.mask.x)*0.03;
                this.canvasObj.mask1.x +=(this.mouseX-this.canvasObj.mask1.x)*0.03;
                this.canvasObj.light.rotation =angle;
            }
            this.canvasObj.overlay.x+=(this.mouseX-this.canvasObj.overlay.x)*0.03;
            this.canvasObj.overlay2.x+=(this.mouseX-this.canvasObj.overlay2.x)*0.03;
            
            
            this.canvasObj.obj1Shadow.x +=(this.w/2+30+angle*90- this.canvasObj.obj1Shadow.x)*0.03;
            this.canvasObj.obj2Shadow.x +=(this.w/2-20+angle*90- this.canvasObj.obj2Shadow.x)*0.03;

            this.canvasObj.ef2.rotation +=(angle/3 - this.canvasObj.ef2.rotation) *0.03;
            this.canvasObj.ef4.alpha = (this.ef_alpha)/2+0.5;
           

        });  
        window.addEventListener("mousemove", this.mouseMove.bind(this)); 
        window.addEventListener("mouseout", ()=>{
            this.mouseX = this.w/2;
        }); 
    }
    _drawCanvas(){
        this.canvas = new PIXI.Application(this.w, this.h, {transparent:true, autoStart:true, antialias:true});
        document.querySelector('.canvas-con').appendChild(this.canvas.view);

        this.lightCon = new PIXI.Container();        
        if(!this.checkIE){
            this.canvasObj.light = new PIXI.Sprite.fromImage(light);
            this.canvasObj.light.anchor.set(0.5, 0);
            this.canvasObj.light.x = this.w/2 ;
            this.canvasObj.light.scale = new PIXI.Point(4, 1);
        }
        for(let i = 0; i < 2000; i++){
             let particle = new Particle(this.w, this.h, i);
             this.lightCon.addChild(particle);
             this.particles.push(particle);             
         }
        
        if(!this.checkIE) this.lightCon.mask = this.canvasObj.light;
        this.canvas.stage.addChild(this.lightCon);
        if(!this.checkIE) this.canvas.stage.addChild(this.canvasObj.light);
        
        this.smokeCon = new PIXI.Container();        

        for(let i = 0; i < 100; i++){
             let smoke = new Smoke(this.w, this.h, i);
             this.smokeCon.addChild(smoke);
             this.smokes.push(smoke);             
        }
        
        this.canvas.stage.addChild(this.smokeCon);
        this.canvasObj.bgCon = new PIXI.Container();
        this.canvas.stage.addChild(this.canvasObj.bgCon);
        this.canvasObj.bg = new PIXI.Sprite.fromImage(bg);
        this.canvasObj.bgCon.addChild(this.canvasObj.bg);

        
        
        this.canvasObj.objCon = new PIXI.Container();
        this.canvas.stage.addChild(this.canvasObj.objCon);

        //obj1
        this.canvasObj.obj1 = new PIXI.Sprite.fromImage(obj1);
        this.canvasObj.obj1Mask = new PIXI.Sprite.fromImage(obj1Mask);        
        this.canvasObj.obj1Shadow = new PIXI.Sprite.fromImage(obj1Shadow);
        this.canvasObj.obj1.anchor.set(0.5);
        this.canvasObj.obj1Mask.anchor.set(0.5);
        this.canvasObj.obj1Shadow.anchor.set(0.5);
        this.canvasObj.obj1.x = this.canvasObj.obj1Mask.x = this.canvasObj.obj1Shadow.x = this.w/2+30;
        this.canvasObj.obj1.y = this.canvasObj.obj1Mask.y = this.canvasObj.obj1Shadow.y = 990;

        this.canvasObj.obj1Shadow.x += 10;
        this.canvasObj.obj1Shadow.y += 30;
        
        // this.canvasFilters.objFilter =  new PIXI.filters.DropShadowFilter ();
        // this.canvasFilters.objFilter.rotation = 90;
        // this.canvasFilters.objFilter.distance =50;
        // this.canvasFilters.objFilter.alpha = 0.7;
        // this.canvasFilters.objFilter.blur = 0;

        //obj2
        this.canvasObj.obj2 = new PIXI.Sprite.fromImage(obj2);
        this.canvasObj.obj2Mask = new PIXI.Sprite.fromImage(obj2Mask);        
        this.canvasObj.obj2Shadow = new PIXI.Sprite.fromImage(obj2Shadow);
        this.canvasObj.obj2.anchor.set(0.5);
        this.canvasObj.obj2Mask.anchor.set(0.5);
        this.canvasObj.obj2Shadow.anchor.set(0.5);
        this.canvasObj.obj2.x = this.canvasObj.obj2Mask.x = this.canvasObj.obj2Shadow.x = this.w/2-20;
        this.canvasObj.obj2.y = this.canvasObj.obj2Mask.y = this.canvasObj.obj2Shadow.y = 930;

        this.canvasObj.obj2Shadow.x += 10;
        this.canvasObj.obj2Shadow.y += 15;

        // this.canvasFilters.objFilter2 =  new PIXI.filters.DropShadowFilter ();
        // this.canvasFilters.objFilter2.rotation = 90;
        // this.canvasFilters.objFilter2.distance =20;
        // this.canvasFilters.objFilter2.alpha = 0.7;
        // this.canvasFilters.objFilter2.blur = 0;

        // this.canvasObj.obj1.filters = [this.canvasFilters.objFilter];
        // this.canvasObj.obj2.filters = [this.canvasFilters.objFilter2];      

        if(!this.checkIE){
            this.canvasObj.overlay = new PIXI.Sprite.fromImage(mask);
            this.canvasObj.overlay.anchor.set(0.5, 0);
            this.canvasObj.overlay.x = this.w/2;
            this.canvasObj.overlay.alpha= 1
            this.canvasObj.overlay.y = 300;
            this.canvasObj.overlay.scale = new PIXI.Point(0.3, 1);

            this.canvasObj.overlay2 = new PIXI.Sprite.fromImage(mask);
            this.canvasObj.overlay2.anchor.set(0.5, 0);
            this.canvasObj.overlay2.x = this.w/2;
            this.canvasObj.overlay2.alpha= 1
            this.canvasObj.overlay2.y = 300;
            this.canvasObj.overlay2.scale = new PIXI.Point(0.3, 1);
           
        }else{            
            this.canvasObj.overlay = new PIXI.Graphics(0, 0);
            this.canvasObj.overlay.beginFill(0xFFFF00);
            this.canvasObj.overlay.drawRect(-200, 0, 400, 800);
            this.canvasObj.overlay.x = this.w/2;
            this.canvasObj.overlay.y = 600;

            this.canvasObj.overlay2 = new PIXI.Graphics(0, 0);
            this.canvasObj.overlay2.beginFill(0xFFFF00);
            this.canvasObj.overlay2.drawRect(-220, 0, 400, 800);
            this.canvasObj.overlay2.x = this.w/2;
            this.canvasObj.overlay2.y = 600;
        }
        

        this.canvasObj.objCon.addChild(this.canvasObj.obj2Shadow) 
        this.canvasObj.objCon.addChild(this.canvasObj.obj2)
        this.canvasObj.objCon.addChild(this.canvasObj.obj2Mask)
        this.canvasObj.objCon.addChild(this.canvasObj.overlay2)         
        this.canvasObj.objCon.addChild(this.canvasObj.obj1Shadow) 
        this.canvasObj.objCon.addChild(this.canvasObj.obj1) 
        this.canvasObj.objCon.addChild(this.canvasObj.obj1Mask)
        this.canvasObj.objCon.addChild(this.canvasObj.overlay)    
        this.canvasObj.obj1Mask.mask = this.canvasObj.overlay; 
        this.canvasObj.obj2Mask.mask = this.canvasObj.overlay2;   
        
        

        if(!this.checkIE){
            this.canvasObj.mask = new PIXI.Sprite.fromImage(mask);
            this.canvasObj.mask.anchor.set(0.5, 0);
            this.canvasObj.mask.x = this.w/2 -100 ;
            this.canvasObj.mask.y = 340;
        
        
            this.canvasObj.mask1 = new PIXI.Sprite.fromImage(mask);
            this.canvasObj.mask1.anchor.set(0.5, 0);
            this.canvasObj.mask1.x = this.w/2 -100 ;
            this.canvasObj.mask1.y = 280;
            this.canvasObj.mask1.scale = new PIXI.Point(1.05, 1.05);


            this.canvasObj.objCon.mask = this.canvasObj.mask1;
            this.canvasObj.bgCon.mask = this.canvasObj.mask;
            this.canvas.stage.addChild(this.canvasObj.mask1);       
            this.canvas.stage.addChild(this.canvasObj.mask);

        }
        
        //effect
        this.canvasObj.ef1 = new PIXI.Sprite.fromImage(ef1);
        this.canvasObj.ef1.anchor.set(0.5, 0);
        this.canvasObj.ef1.x = this.w/2 ;
        this.canvasObj.ef1.alpha = 0.4
       // this.canvasObj.ef1.blendMode = PIXI.BLEND_MODES.SCREEN;
        
        this.canvasObj.ef1_2 = new PIXI.Sprite.fromImage(ef1);
        this.canvasObj.ef1_2.anchor.set(0.5, 0);
        this.canvasObj.ef1_2.x = this.w/2 ;
        this.canvasObj.ef1_2.y = -30 ;
       // this.canvasObj.ef1_2.rotation = 0.05
        this.canvasObj.ef1_2.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.canvasObj.ef1_3 = new PIXI.Sprite.fromImage(ef1);
        this.canvasObj.ef1_3.anchor.set(0.5, 0);
        this.canvasObj.ef1_3.x = this.w/2 ;
        this.canvasObj.ef1_3.y = -30 ;
        this.canvasObj.ef1_3.rotation = -0.05
       // this.canvasObj.ef1_3.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.canvasObj.ef2 = new PIXI.Sprite.fromImage(ef2);
        this.canvasObj.ef2.anchor.set(1, 0);
        this.canvasObj.ef2.x = this.w/2 ;
       // this.canvasObj.ef2.blendMode = PIXI.BLEND_MODES.SCREEN;

        

        this.canvasObj.ef3 = new PIXI.Sprite.fromImage(ef3);
        this.canvasObj.ef3.anchor.set(0.5, 0);
        this.canvasObj.ef3.x = this.w/2 ;
       // this.canvasObj.ef3.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.canvasObj.ef4 = new PIXI.Sprite.fromImage(ef4);
        this.canvasObj.ef4.anchor.set(0.5, 0);
        this.canvasObj.ef4.x = this.w/2 -170;
        this.canvasObj.ef4.y = 0;
        
      //  this.canvasObj.ef4.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.canvasObj.subTitle = new PIXI.Sprite.fromImage(subTitle);
        this.canvasObj.subTitle.anchor.set(0.5, 0);
        this.canvasObj.subTitle.x = this.w/2 ;
        this.canvasObj.subTitle.y = 405 ;
       
        this.canvas.stage.addChild(this.canvasObj.subTitle);
        //this.canvas.stage.addChild(this.canvasObj.counter);

        this.canvas.stage.addChild(this.canvasObj.ef1);
        this.canvas.stage.addChild(this.canvasObj.ef1_2);
        this.canvas.stage.addChild(this.canvasObj.ef1_3);
        this.canvas.stage.addChild(this.canvasObj.ef2);
        this.canvas.stage.addChild(this.canvasObj.ef3);
        this.canvas.stage.addChild(this.canvasObj.ef4);
        
        let textureArray = [];

        for (let i=0; i < 60; i++)
        {
            let texture = PIXI.Texture.fromImage(`img/logo_intro/start_${i}.png`);
            textureArray.push(texture);
        };

        this.canvasObj.logoIntro = new PIXI.extras.AnimatedSprite(textureArray);
        this.canvasObj.logoIntro.anchor.set(0.5, 0);
        this.canvasObj.logoIntro.x = this.w/2 ;
        this.canvasObj.logoIntro.y = 63 ;
        this.canvasObj.logoIntro.loop  = false;
        this.canvasObj.logoIntro.animationSpeed = 0.4
       
        this.canvas.stage.addChild(this.canvasObj.logoIntro);

        this.canvasObj.logoIntro.onComplete = ()=>{
            this.canvasObj.logoIntro.alpha = 0;
            this.canvasObj.logoLoop.alpha = 1;
            this.canvasObj.logoLoop.play();
        }

        let textureArray2 = [];

        for (let i=0; i < 90; i++)
        {
            let texture2 = PIXI.Texture.fromImage(`img/logo_loop/loop_${i}.png`);
            textureArray2.push(texture2);
        };

        this.canvasObj.logoLoop = new PIXI.extras.AnimatedSprite(textureArray2);
        this.canvasObj.logoLoop.anchor.set(0.5, 0);
        this.canvasObj.logoLoop.alpha = 0;
        this.canvasObj.logoLoop.x = this.w/2 ;
        this.canvasObj.logoLoop.y = 63 ;
        this.canvasObj.logoLoop.animationSpeed = 0.4
        this.canvas.stage.addChild(this.canvasObj.logoLoop);

        //this.canvasObj.logoIntro.onComplete = ()=>{console.log('finish')}

    }
    _motionSet(){    
        if(!this.checkIE){
            this.showMotion
                .fromTo(this.canvasObj.ef1, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}})
                .call(()=>{ this.canvasObj.logoIntro.play()}, null, null, '-=1')            
                .fromTo(this.canvasObj.subTitle, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1, brightness: 3}}, '+=0.5')
                .to(this.canvasObj.subTitle, 1, { pixi: {brightness: 1}})
                .fromTo(this.canvasObj.ef1_2, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                .fromTo(this.canvasObj.ef1_3, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                .fromTo(this.canvasObj.ef4, 2, { pixi: {alpha: 0}}, { pixi: {alpha: 1}, ease:Bounce.easeOut}, '-=0.5')            
                .fromTo(this.canvasObj.ef2, 1, { pixi: {alpha: 0, y:-100, rotation:20}}, { pixi: {alpha: 1, y:0, rotation:0}}, '-=1.8')
                .fromTo(this.canvasObj.ef3, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                .fromTo(this.canvasObj.mask, 2, { pixi: {alpha:0, scale:0.1, y:560}}, { pixi: {alpha:1, scale:1, y:340}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.mask1, 2, { pixi: {scale:0.1, y:560}}, { pixi: {scale:1.05, y:280}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.overlay, 2, { pixi: {x:this.w}}, { pixi: {x:this.w/2-200}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.overlay2, 2, { pixi: {x:this.w}}, { pixi: {x:this.w/2-200}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.obj1Shadow, 2, { pixi: {y:this.canvasObj.obj1Shadow.y-20}}, { pixi: {y:this.canvasObj.obj1Shadow.y}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.obj2Shadow, 2, { pixi: {y:this.canvasObj.obj2Shadow.y-20}}, { pixi: {y:this.canvasObj.obj2Shadow.y}, ease:Cubic.easeOut}, '-=2')           
                .fromTo(document.querySelector('.flip-counter'), 1, {y:120},{ y: 0, ease:Cubic.easeOut}, '-=2')
                .call(()=>{ this.emit('flipStart', this);  this.isIntro = false;}, null, null, '-=1')  
                .fromTo(this.smokeCon, 5, { pixi: {alpha:0, y:100}}, { pixi: {alpha:1, y:0}}, '-=3')     
        }else{
            this.showMotion
                .fromTo(this.canvasObj.ef1, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}})
                .call(()=>{ this.canvasObj.logoIntro.play()}, null, null, '-=1')            
                .fromTo(this.canvasObj.subTitle, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1, brightness: 3}}, '+=0.5')
                .to(this.canvasObj.subTitle, 1, { pixi: {brightness: 1}})
                .fromTo(this.canvasObj.ef1_2, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                .fromTo(this.canvasObj.ef1_3, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                .fromTo(this.canvasObj.ef4, 2, { pixi: {alpha: 0}}, { pixi: {alpha: 1}, ease:Bounce.easeOut}, '-=0.5')            
                .fromTo(this.canvasObj.ef2, 1, { pixi: {alpha: 0, y:-100, rotation:-20, scale:0.8}}, { pixi: {alpha: 1, y:0, rotation:0, scale:1}}, '-=1.8')
                .fromTo(this.canvasObj.ef3, 1, { pixi: {alpha: 0}}, { pixi: {alpha: 1}}, '-=1')
                //.fromTo(this.canvasObj.mask1, 2, { pixi: {scale:0.1, y:560}}, { pixi: {scale:1.05, y:280}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.overlay, 2, { pixi: {x:this.w}}, { pixi: {x:this.w/2-200}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.overlay2, 2, { pixi: {x:this.w}}, { pixi: {x:this.w/2-200}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.obj1Shadow, 2, { pixi: {y:this.canvasObj.obj1Shadow.y-20}}, { pixi: {y:this.canvasObj.obj1Shadow.y}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.obj2Shadow, 2, { pixi: {y:this.canvasObj.obj2Shadow.y-20}}, { pixi: {y:this.canvasObj.obj2Shadow.y}, ease:Cubic.easeOut}, '-=2')           
                .fromTo(document.querySelector('.flip-counter'), 1, {y:120},{ y: 0, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.objCon, 2, { pixi: {alpha:0, y:100}}, { pixi: {alpha:1, y:0}, ease:Cubic.easeOut}, '-=2')
                .fromTo(this.canvasObj.bgCon, 2, { pixi: {alpha:0, y:100}}, { pixi: {alpha:1, y:0}, ease:Cubic.easeOut}, '-=2')
                .call(()=>{ this.emit('flipStart', this);  this.isIntro = false;}, null, null, '-=1')  
                .fromTo(this.smokeCon, 5, { pixi: {alpha:0, y:100}}, { pixi: {alpha:1, y:0}}, '-=3')     
        }     
            this.showMotion.play();
            // this.canvas.stage.addChild(this.canvasObj.ef1);
            // this.canvas.stage.addChild(this.canvasObj.ef1_2);
            // this.canvas.stage.addChild(this.canvasObj.ef1_3);
            // this.canvas.stage.addChild(this.canvasObj.ef2);
            // this.canvas.stage.addChild(this.canvasObj.ef3);
            // this.canvas.stage.addChild(this.canvasObj.ef4);
    };    
    _showComplete(){
        //this.isIntro = false;
    }
    mouseMove(e){
        this.mouseX =this.w/2 + (e.clientX - this.w/2) /3.5;

        
    }
    _resize(){

    }
}

class Particle extends PIXI.Sprite{
    constructor(w, h, num){
        super();
        this.w = w; 
        this.h = h;
        this.x =500;
        this.y = 500;    
        this.startAlpha =  Math.random()*0.7+0.3;
        this.alpha = this.startAlpha;
        this.speedX = 1;
        this.speedY = 1;
        this.dSpeed = 0.3;       
        this.anchor.set(0.5);
        this.img = new PIXI.Sprite.fromImage(particle);
        this.angle = Math.random()*2 - 1;  
        this._draw();
    }
    _draw(){
        let scale = Math.random()*0.5+0.1
        this.addChild(this.img);        
        this.scale = new PIXI.Point(scale, scale);
        this.x = Math.random() *this.w;
        this.y = Math.random()* this.h;
    }

    _update(){
        this.angle +=0.0001;
        this.x += Math.sin(this.angle);
        this.y += this.dSpeed;    
        if(this.y > this.h){
            this.x = Math.random() *this.w;
            this.y =-20;
        }
    }

    start(){
        if(Math.random()<0.005){
            this.alpha =0;
        }else{
            this.alpha += (this.startAlpha-this.alpha)*0.1//this.startAlpha(this.startAlpha-this.alpha)*0.3
        }
    }

    show(){        
        this._update();
    }
}

class Smoke extends PIXI.Sprite{
    constructor(w, h, num){
        super();
        this.w = w; 
        this.h = h;
        this.x =500;
        this.y = 500;      
        this.alpha = Math.random()*0.7;
        this.dSpeed = 0.005;   
        if(num%2){
            this.dSpeed *= -1;
        }
        this.xSpeed = Math.floor(Math.random()*3 - 1) /10; 
        this.img = new PIXI.Sprite.fromImage(smoke);    
        this.img.anchor.set(0.5);
        this._draw();
    }
    _draw(){        
        let scale = Math.random()*0.3+0.7
        this.addChild(this.img);        
        this.scale = new PIXI.Point(scale, scale);
        this.x = Math.random() *this.w;
        this.y = Math.random()* 600 + 600 +800;
    }

    _update(){
        this.alpha +=this.dSpeed;
        this.x +=this.xSpeed;      
        if(this.alpha >= 0.9){
            this.dSpeed *= -1;
        }
        if(this.alpha <= 0){
            this.dSpeed *= -1;
            this.x = Math.random() *this.w;
            this.y = Math.random()* 600 + 600;
            this.xSpeed =Math.floor(Math.random()*3 - 1) /10; 
        }
    }

    start(){
        //this.y =800;
        this._update();
    }

    show(){        
        this._update();
    }
}


