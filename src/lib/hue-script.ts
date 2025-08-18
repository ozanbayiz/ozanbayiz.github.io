export const HUE_BOOTSTRAP_IIFE = `
(function(){
  try {
    var hues = [0, 20, 30, 40, 50, 65, 120, 140, 160, 190, 200, 210, 230, 250, 270, 300, 340];
    var H = hues[Math.floor(Math.random() * hues.length)];
    var root = document.documentElement;
    var isDark = root.classList.contains('dark');
    function setVar(name, h, s, l){ root.style.setProperty(name, h+" "+s+"% "+l+"%"); }
    function srgbToLinear(c){ return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
    function hslToRgb(h,s,l){
      var C=(1-Math.abs(2*l-1))*s, Hp=h/60, X=C*(1-Math.abs((Hp%2)-1));
      var r=0,g=0,b=0; if(0<=Hp&&Hp<1){r=C;g=X;} else if(1<=Hp&&Hp<2){r=X;g=C;}
      else if(2<=Hp&&Hp<3){g=C;b=X;} else if(3<=Hp&&Hp<4){g=X;b=C;} else if(4<=Hp&&Hp<5){r=X;b=C;} else if(5<=Hp&&Hp<6){r=C;b=X;}
      var m=l-C/2; return [r+m,g+m,b+m];
    }
    function relativeLuminance(h, sPct, lPct){
      var s=sPct/100, l=lPct/100; var rgb=hslToRgb(H, s, l);
      var R=srgbToLinear(rgb[0]), G=srgbToLinear(rgb[1]), B=srgbToLinear(rgb[2]);
      return 0.2126*R + 0.7152*G + 0.0722*B;
    }
    function ensureContrast(h, sPct, initialLPct, darkMode){
      var minRatio=4.5;
      var targetYAgainstWhite=(1.0+0.05)/minRatio - 0.05; // ~0.1833
      var targetYAgainstBlack=minRatio*0.05 - 0.05; // ~0.175
      var low=0, high=100, l=initialLPct;
      for(var i=0;i<14;i++){
        var y=relativeLuminance(h, sPct, l);
        if(!darkMode){ if(y <= targetYAgainstWhite){ low=l; l=(l+high)/2; } else { high=l; l=(l+low)/2; } }
        else { if(y >= targetYAgainstBlack){ high=l; l=(l+low)/2; } else { low=l; l=(l+high)/2; } }
      }
      return Math.max(0, Math.min(100, l));
    }
    if (!isDark) {
      var s=100; var lMain=ensureContrast(H, s, 50, false);
      var l2=Math.max(0, lMain-14), l3=Math.min(100, lMain+14), l4=Math.min(100, lMain+30);
      setVar('--accent', H, s, lMain);
      setVar('--accent2', H, s, l2);
      setVar('--accent3', H, s, l3);
      setVar('--accent4', H, s, l4);
      root.style.setProperty('--accent-foreground','0 0% 100%');
    } else {
      var sD=80; var lMainD=ensureContrast(H, sD, 66, true);
      var l2D=Math.max(0, lMainD-16), l3D=Math.min(100, lMainD+8), l4D=Math.min(100, lMainD+20);
      setVar('--accent', H, sD, lMainD);
      setVar('--accent2', H, sD, l2D);
      setVar('--accent3', H, sD, l3D);
      setVar('--accent4', H, sD, l4D);
      root.style.setProperty('--accent-foreground','0 0% 100%');
    }
  } catch(_){
  }
})();
`


