        var context1;
        var source;
        var analyserfa;
        var canvasFormAudio;
        var ctxfa;

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
  
           }, false);

        function drawSpectrumfa() {
            var WIDTH = canvasFormAudio.width;
            var HEIGHT= canvasFormAudio.height;
            var x,y,w,h;
            var bar_width = 6;
            var array =  new Uint8Array(128);
           
            analyserfa.getByteFrequencyData(array);

            ctxfa.clearRect(0, 0, WIDTH, HEIGHT);
            //定义渐变色
            var gradient = ctxfa.createLinearGradient(0, 0, 0, 300);
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