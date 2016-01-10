        var context1;
        var source;
        var analyserfa;
        var canvasFormAudio;
        var ctxfa;
        var nowEffect = 0;

        canvasFormAudio = document.getElementById('canvasFormAudio');
        ctxfa = canvasFormAudio.getContext("2d");
        try {
       
    	 context1 = new (window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext);
    } catch(e) {
    	 throw new Error('The Web Audio API is unavailable');
    }

    analyserfa=context1.createAnalyser();

    window.addEventListener('load', function(e) {
  	     var audio =document.getElementById("player");
 		 var source = context1.createMediaElementSource(audio);
 		 source.connect(analyserfa);
  		 analyserfa.connect(context1.destination);
  	
  		 drawSpectrumfa();
         drawSpectrumfa1();
         drawSpectrumfa2();
           }, false);

        function drawSpectrumfa() {
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

         	
            requestAnimationFrame(drawSpectrumfa);
        }

        function drawSpectrumfa1() {
            if(nowEffect!=1) {
                requestAnimationFrame(drawSpectrumfa1);
                return;
            }
            var WIDTH = canvasFormAudio.width;
            var HEIGHT= canvasFormAudio.height;
            var array =  new Uint8Array(160);
            var gardding = 4;
            analyserfa.getByteFrequencyData(array);
            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            ctxfa.fillStyle = "rgba(0,0,0,0.8)";
            ctxfa.fillRect(0, 0, WIDTH, HEIGHT);
            ctxfa.lineWidth = 5;

            ctxfa.beginPath();
            ctxfa.moveTo(0,HEIGHT-Math.floor(array[0] / 255 * HEIGHT) + 1);
            for ( var i = 1; i < (array.length); i++ ){
                var value = array[i];
                ctxfa.strokeStyle="rgba("+value+",0,0,1)";
                ctxfa.lineTo(gardding*i,HEIGHT-Math.floor(value / 255 * HEIGHT) + 8);  
                ctxfa.moveTo(gardding*i,HEIGHT-Math.floor(value / 255 * HEIGHT) + 8); 
            }
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
            var array =  new Uint8Array(128);
            var R = HEIGHT/2;
            analyserfa.getByteFrequencyData(array);
            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            ctxfa.fillStyle = "rgba(0,0,0,0.8)";
            ctxfa.fillRect(0, 0, WIDTH, HEIGHT);
            ctxfa.lineWidth = 1;
   
            for ( var i = 1; i < (array.length); i++ ){
                var value = array[i];
                ctxfa.strokeStyle="rgba("+value+","+value+",0,0.5)";
                ctxfa.beginPath();
                ctxfa.arc(WIDTH/2,HEIGHT/2,Math.floor(R*value/255),0,Math.PI*2,false);
                ctxfa.stroke();
            }
            
            
            requestAnimationFrame(drawSpectrumfa2);
        }