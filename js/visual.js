       /*
            HTML5新Audio API DEMO
           用法：html中加一个<canvas width='xxx' height='xxx' id='canvasFormAudio'></canvas>，
           一个<audio src="xxx" controls="controls" id="player"></audio>
           var audio =document.getElementById("player");这句要改一下，player是你audio标签的id,
           要引入jquery。。。这个用过jquery的都懂。。。
           然后引用这个js文件，然后你打开页面播放就有效果了，默认nowEffect=0就是第0个效果
           可以有三个0,1,2
       */
        var context1;
        var source;
        var analyserfa;
        var canvasFormAudio;
        var ctxfa;
        var nowEffect = 0;

        canvasFormAudio = document.getElementById('canvasFormAudio');
        ctxfa = canvasFormAudio.getContext("2d");
        try {
         //适应不同浏览器（-_-虽然我测试时只有chrome会正常显示就是了）
    	 context1 = new (window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext);
    } catch(e) {
    	 throw new Error('The Web Audio API is unavailable');
    }
    //获取Analyser
    analyserfa=context1.createAnalyser();

    window.addEventListener('load', function(e) {
        var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
        if(!isChrome) return;
  	     var audio =document.getElementById("player");
         //连接关系：source->analyserfa->destination
         //把destination看作你浏览器播放音频的设备，声卡或者其他（具体什么是浏览器的事，既然它支持audio标签那肯定能播放音频是吧。。）
         //source就是你音频文件的数据，Analyser是所谓的节点，就是对数据进行处理的对象。
         //如果你懂音频处理的话你可以在Anylyser里面作变声，加特技之类的操作。（反正我是不会。。）
 		 var source = context1.createMediaElementSource(audio);
 		 source.connect(analyserfa);
  		 analyserfa.connect(context1.destination);
  	
  		 drawSpectrumfa();
         drawSpectrumfa1();
         drawSpectrumfa2();
           }, false);

        function drawSpectrumfa() {
            //如果当前不是这个效果什么都不做，注意加入requestAnimationFrame否则下一帧不检测了，后面2个方法同
             if(nowEffect!=0) {
                requestAnimationFrame(drawSpectrumfa);
                return;
            }
            var WIDTH = canvasFormAudio.width;
            var HEIGHT= canvasFormAudio.height;
            var x,y,w,h;
            var bar_width = 5;
            var array =  new Uint8Array(128);
           
            analyserfa.getByteFrequencyData(array);
            
            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            ctxfa.fillStyle = "rgba(0,0,0,0.8)";
            ctxfa.fillRect(0, 0, WIDTH, HEIGHT);
            //定义渐变色
            var gradient = ctxfa.createLinearGradient(0, 0, 0, HEIGHT);
            gradient.addColorStop(1, '#0f0');
            gradient.addColorStop(0.5, '#ff0');
            gradient.addColorStop(0, '#f00');
            ctxfa.fillStyle = gradient;
           
            for ( var i = 0; i < (array.length); i++ ){
                var value = array[i];
                x = bar_width * i;
                y = HEIGHT;
                w = bar_width - 1;
                h = -(Math.floor(value / 255 * HEIGHT) + 1);
                ctxfa.fillRect(x, y, w, h)
            }
         	//html5做动画的新方法，我最早想到setInterval但是这个貌似时间间隔很不稳定，而且不精确
            //网上看了都是用requestAnimationFrame这个方法，当浏览器要刷新下一帧时就会调用你的参数里的方法
            //相当于浏览器决定你动画的FPS，这样对简单的动画播放很完美
            //如果你要在动画播放到某状态时做一件事那就比较麻烦了，因为每一帧的时间不确定，就算确定你也不能获得
            //网上查的资料，如果是浏览器调用这个方法时自己也要刷新的话，
            //按这个道理浏览器就是有固定的刷新频率。并不是内容改变了才刷新。
            //原来我一直以为浏览器是html内容改变了才刷新的，不知道到底是哪种，估计还是根据不同浏览器不同吧。。。
            requestAnimationFrame(drawSpectrumfa);
        }

        function drawSpectrumfa1() {
            if(nowEffect!=1) {
                requestAnimationFrame(drawSpectrumfa1);
                return;
            }
            var WIDTH = canvasFormAudio.width;
            var HEIGHT= canvasFormAudio.height;
            var array =  new Uint8Array(128);
            var gardding = 5;
            var maxHeight=0;
            analyserfa.getByteFrequencyData(array);
            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            ctxfa.fillStyle = "rgba(0,0,0,0.8)";
            ctxfa.fillRect(0, 0, WIDTH, HEIGHT);
            ctxfa.lineWidth = 5;

            ctxfa.beginPath();
            ctxfa.moveTo(0,HEIGHT-Math.floor(array[0] / 255 * HEIGHT) + 1);
            for ( var i = 1; i < (array.length); i++ ){
                var value = array[i];
                if(value>maxHeight) maxHeight = value;
                ctxfa.lineTo(gardding*i,HEIGHT-Math.floor(value / 255 * HEIGHT) + 8);  
                ctxfa.moveTo(gardding*i,HEIGHT-Math.floor(value / 255 * HEIGHT) + 8); 
            }
            ctxfa.strokeStyle="rgba("+maxHeight+",0,0,1)";
            ctxfa.stroke(); 
            requestAnimationFrame(drawSpectrumfa1);
        }

          function drawSpectrumfa2() {
             if(nowEffect!=2) {
                requestAnimationFrame(drawSpectrumfa2);
                return;
            }
            var WIDTH = canvasFormAudio.width;
            var HEIGHT= canvasFormAudio.height;
            var array =  new Uint8Array(16);
            var R = HEIGHT/2;
            analyserfa.getByteFrequencyData(array);
            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            ctxfa.fillStyle = "rgba(0,0,0,0.8)";
            ctxfa.fillRect(0, 0, WIDTH, HEIGHT);
            ctxfa.lineWidth = 6;
   
            for ( var i = 1; i < (array.length); i++ ){
                var value = array[i];
                ctxfa.strokeStyle="rgba("+value+","+value+",0,0.5)";
                ctxfa.beginPath();
                ctxfa.arc(WIDTH/2,HEIGHT/2,Math.floor(R*value/255),0,Math.PI*2,false);
                ctxfa.stroke();
            }
            
            requestAnimationFrame(drawSpectrumfa2);
        }