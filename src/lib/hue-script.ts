export const HUE_BOOTSTRAP_IIFE = `
(function(){
  try {
    // Neon-leaning palette for vivid output
    var hues = [50, 90, 120, 140, 155, 170, 185, 200, 215, 235, 255, 270, 285, 300, 315, 330, 345];
    var H = hues[Math.floor(Math.random() * hues.length)];
    var S = 100;
    function srgbToLinear(c){ return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
    function hslToRgb(h,s,l){
      var C=(1-Math.abs(2*l-1))*s, Hp=h/60, X=C*(1-Math.abs((Hp%2)-1));
      var r=0,g=0,b=0; if(0<=Hp&&Hp<1){r=C;g=X;} else if(1<=Hp&&Hp<2){r=X;g=C;}
      else if(2<=Hp&&Hp<3){g=C;b=X;} else if(3<=Hp&&Hp<4){g=X;b=C;} else if(4<=Hp&&Hp<5){r=X;b=C;} else if(5<=Hp&&Hp<6){r=C;b=X;}
      var m=l-C/2; return [r+m,g+m,b+m];
    }
    function relativeLuminance(h, sPct, lPct){
      var s=sPct/100, l=lPct/100; var rgb=hslToRgb(h, s, l);
      var R=srgbToLinear(rgb[0]), G=srgbToLinear(rgb[1]), B=srgbToLinear(rgb[2]);
      return 0.2126*R + 0.7152*G + 0.0722*B;
    }
    function getL(darkMode){
      var minRatio=4.5;
      var targetYAgainstWhite=(1.0+0.05)/minRatio - 0.05;
      var targetYAgainstBlack=minRatio*0.05 - 0.05;
      var low=0, high=100, l=darkMode ? 66 : 50;
      for(var i=0;i<14;i++){
        var y=relativeLuminance(H, S, l);
        if(!darkMode){ if(y <= targetYAgainstWhite){ low=l; l=(l+high)/2; } else { high=l; l=(l+low)/2; } }
        else { if(y >= targetYAgainstBlack){ high=l; l=(l+low)/2; } else { low=l; l=(l+high)/2; } }
      }
      return Math.max(0, Math.min(100, l));
    }
    var lightL = getL(false);
    var darkL = Math.max(getL(true), 64);
    var lightFadedL = Math.max(0, lightL - 30);
    var darkFadedL = Math.min(100, darkL + 30);
    
    var style = document.createElement('style');
    style.id = 'dynamic-accents';
    style.innerHTML = ":root { --accent1: "+H+" "+S+"% "+lightL+"%; --accent2: "+H+" "+S+"% "+lightFadedL+"%; } .dark { --accent1: "+H+" "+S+"% "+darkL+"%; --accent2: "+H+" "+S+"% "+darkFadedL+"%; }";
    document.head.appendChild(style);
  } catch(e) {}
})();
`


