//compress by https://codebeautify.org/minify-js
const SVG_LIB="http://www.w3.org/2000/svg",SQUARE_COLOR_SIZE=40,TRANSLATE_X=10,TRANSLATE_Y=0,LINE_COLOR="#808080",MARK_COLOR="#808080",CALCULATED_EMPTY_COLOR="#808080",RULE_COLOR="#ff00ff",SIGNAL_CORRECT_COLOR="#adff2f",SIGNAL_ERROR_COLOR="#b22222",NUMBER_DEFAULT_COLOR="#ffffff";class nonogram{#t;#e;#i;#s;#r;#a;#l;#u;#h;#o;#n;#d;#c;#g;#b;constructor(t={}){this.#t=t.size||20,this.#e=t.showErrorsOnCheck||!1,this.#i=t.showErrorsImmediately||!1,this.#s=t.finishCallback||(()=>alert("Puzzle Finished!")),this.#r={},this.#a=!1,this.#l=!1,this.#u=[],this.#h=0,this.#o=null,this.#n=null,this.#d=null,this.#c=null,this.#g=null,this.#b=!1,document.body.onmousedown=t=>{if(1==t.button)return this.#m(),!1},document.body.onmouseup=()=>this.#A(),this.#f()}init(t,e=null){this.#r=t,this.#y(),this.#z(),this.#a=!1,this.#c=t.colors[1],this.#p();let i=this.#r.settings.horizontalNumbersLength*this.#t,s=this.#r.settings.verticalNumbersLength*this.#t;this.#S(i,s);for(let t=0;t<this.#r.settings.width;t++)for(let e=0;e<this.#r.settings.height;e++)this.#I(i,s,t,e),this.#_(i,s,t,e),this.#i&&this.#E(i,s,t,e),this.#q(i,s,t,e),this.#B(i,s,t,e);for(let t=0;t<=this.#r.settings.width;t++){if(t<this.#r.settings.width){this.#k(i,s,0,t);for(let e=1;e<=this.#r.verticalNumbers[t].length;e++)this.#x(i,s,0,t,e),this.#C(i,s,0,t,e)}this.#w(i,s,0,t)}for(let t=0;t<=this.#r.settings.height;t++){if(t<this.#r.settings.height){this.#k(i,s,1,t);for(let e=1;e<=this.#r.horizontalNumbers[t].length;e++)this.#x(i,s,1,t,e),this.#C(i,s,1,t,e)}this.#w(i,s,1,t)}this.#N(i,s,0),this.#N(i,s,1),this.loadState(e),this.#L(),this.#v()}maximize(t){this.#r&&(this.#t+=t||1,this.#V())}minimize(t){this.#r&&(this.#t-=t||1,this.#t<1?this.#t+=t||1:this.#V())}undo(){this.#r&&this.#h>0&&(this.#h-=1,this.#M())}redo(){this.#r&&this.#h<this.#u.length-1&&(this.#h+=1,this.#M())}check(){if(this.#r){let t,e,i,s,r,a,l,u=0;for(let h=0;h<this.#r.settings.width;h++){a=document.getElementById("signal_0."+h);for(let o=0;o<this.#r.settings.height;o++)t=document.getElementById("square_"+h+"."+o),e=t.getAttribute("fill"),i=t.getAttribute("opacity"),l=document.getElementById("signal_1."+o),e!=this.#r.colors[this.#r.points[o][h]]&&"1"==i?(this.#e&&(a.setAttribute("opacity","1"),a.setAttribute("fill","#b22222"),l.setAttribute("opacity","1"),l.setAttribute("fill","#b22222")),u++):(s=document.getElementById("mark_"+h+"."+o),r=s.getAttribute("opacity"),0!=this.#r.points[o][h]&&"1"==r&&(this.#e&&(a.setAttribute("opacity","1"),a.setAttribute("fill","#b22222"),l.setAttribute("opacity","1"),l.setAttribute("fill","#b22222")),u++))}return u}}solve(){if(this.#r){for(let t=0;t<this.#r.settings.height;t++)for(let e=0;e<this.#r.settings.width;e++){let i=document.getElementById("square_"+e+"."+t);i.setAttribute("fill",this.#r.colors[this.#r.points[t][e]]),i.setAttribute("opacity","1")}this.#O()}}getState(){let t="";if(this.#r)for(let e=0;e<this.#r.settings.height;e++){for(let i=0;i<this.#r.settings.width;i++){let s=document.getElementById("square_"+i+"."+e);t+=this.#r.colors.indexOf(s.getAttribute("fill"))+","}t+=";"}return t}loadState(t){if(this.#r){if(t){let e=t.split(";");for(let t=0;t<this.#r.settings.height;t++){let i=e[t].split(",");for(let e=0;e<this.#r.settings.width;e++){let s=document.getElementById("square_"+e+"."+t);s.setAttribute("fill",this.#r.colors[i[e]]),i[e]>0?s.setAttribute("opacity","1"):s.setAttribute("opacity","0")}}}this.#O()}}makeMove(t){if("PAINT"==t.action)for(let e=0;e<t.squares.length;e++){let i=document.getElementById("square_"+t.squares[e].i+"."+t.squares[e].j);i.setAttribute("fill",t.color),t.color==this.#r.colors[0]?i.setAttribute("opacity","0"):i.setAttribute("opacity","1")}else for(let e=0;e<t.squares.length;e++){let i=document.getElementById("mark_"+t.squares[e].i+"."+t.squares[e].j);"MARK"==t.action?i.setAttribute("opacity","1"):"UNMARK"==t.action&&i.setAttribute("opacity","0")}this.#L()}undoMove(t){if("PAINT"==t.action)for(let e=0;e<t.squares.length;e++){let i=document.getElementById("square_"+t.squares[e].i+"."+t.squares[e].j);i.setAttribute("fill",t.squares[e].previousColor),t.squares[e].previousColor==this.#r.colors[0]?i.setAttribute("opacity","0"):i.setAttribute("opacity","1")}else for(let e=0;e<t.squares.length;e++){let i=document.getElementById("mark_"+t.squares[e].i+"."+t.squares[e].j);"MARK"==t.action?i.setAttribute("opacity","0"):"UNMARK"==t.action&&i.setAttribute("opacity","1")}this.#L()}freeze(){this.#b=!0}unfreeze(){this.#b=!1}#f(){let t=document.getElementById("nonogram");t.oncontextmenu=function(){return!1};let e=document.createElementNS(SVG_LIB,"svg"),i=document.createElementNS(SVG_LIB,"g");i.setAttribute("id","palette"),e.appendChild(i);let s=document.createElementNS(SVG_LIB,"g");s.setAttribute("id","main"),e.appendChild(s);let r=document.createElementNS(SVG_LIB,"g");r.setAttribute("id","components"),e.appendChild(r);let a=document.createElementNS(SVG_LIB,"g");a.setAttribute("id","aux"),e.appendChild(a),t.appendChild(e)}#p(){let t="translate(10,0)";if(document.getElementById("palette").setAttribute("transform",t),this.#r.colors.length>2){t="translate(10,"+60+")";for(let t=1;t<this.#r.colors.length;t++)this.#R(t)}document.getElementById("main").setAttribute("transform",t),document.getElementById("components").setAttribute("transform",t),document.getElementById("aux").setAttribute("transform",t)}#R(t){let e=document.createElementNS(SVG_LIB,"rect");e.setAttribute("id","squareColor_"+t),1==t?e.setAttribute("stroke-width","3"):e.setAttribute("stroke-width","1"),e.setAttribute("stroke","black"),e.setAttribute("height",40),e.setAttribute("width",40),e.setAttribute("fill",this.#r.colors[t]),e.setAttribute("x",40*(t-1)+5),e.setAttribute("y",5),e.onclick=t=>this.#G(t),document.getElementById("palette").appendChild(e)}#S(t,e){let i=document.createElementNS(SVG_LIB,"rect");i.setAttribute("id","background"),i.setAttribute("fill",this.#r.colors[0]),i.setAttribute("height",this.#t*this.#r.settings.height),i.setAttribute("width",this.#t*this.#r.settings.width),i.setAttribute("x",t),i.setAttribute("y",e),document.getElementById("main").appendChild(i)}#I(t,e,i,s){let r=document.createElementNS(SVG_LIB,"text");r.setAttribute("id","mark_"+i+"."+s),r.setAttribute("text-anchor","middle"),r.setAttribute("font-family","serif"),r.setAttribute("font-size",this.#t),r.setAttribute("fill","#808080"),r.setAttribute("x",t+(i+.5)*this.#t),r.setAttribute("y",e+(s+.85)*this.#t),r.setAttribute("opacity","0"),r.textContent="•",r.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("main").appendChild(r)}#q(t,e,i,s){let r=document.createElementNS(SVG_LIB,"text");r.setAttribute("id","mark_aux_"+i+"."+s),r.setAttribute("text-anchor","middle"),r.setAttribute("font-family","serif"),r.setAttribute("font-size",this.#t),r.setAttribute("fill","#808080"),r.setAttribute("x",t+(i+.5)*this.#t),r.setAttribute("y",e+(s+.85)*this.#t),r.setAttribute("opacity","0"),r.textContent="•",r.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("aux").appendChild(r)}#E(t,e,i,s){let r=document.createElementNS(SVG_LIB,"text");r.setAttribute("id","error_mark_"+i+"."+s),r.setAttribute("text-anchor","middle"),r.setAttribute("font-family","serif"),r.setAttribute("font-size",this.#t),r.setAttribute("x",t+(i+.5)*this.#t),r.setAttribute("y",e+(s+.85)*this.#t),r.setAttribute("opacity","0"),r.textContent="✕",r.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("main").appendChild(r)}#_(t,e,i,s){let r=document.createElementNS(SVG_LIB,"rect");r.setAttribute("id","square_"+i+"."+s),r.setAttribute("fill",this.#r.colors[0]),r.setAttribute("opacity","0"),r.setAttribute("height",.9*this.#t),r.setAttribute("width",.9*this.#t),r.setAttribute("x",t+i*this.#t+.05*this.#t),r.setAttribute("y",e+s*this.#t+.05*this.#t),document.getElementById("main").appendChild(r)}#B(t,e,i,s){let r=document.createElementNS(SVG_LIB,"rect");r.setAttribute("id","square_aux_"+i+"."+s),r.setAttribute("fill",this.#r.colors[0]),r.setAttribute("opacity","0"),r.setAttribute("height",.9*this.#t),r.setAttribute("width",.9*this.#t),r.setAttribute("x",t+i*this.#t+.05*this.#t),r.setAttribute("y",e+s*this.#t+.05*this.#t),r.onmouseover=t=>this.#J(t),r.onmouseout=t=>this.#K(t),r.onmousedown=t=>this.#T(t),r.onmousemove=t=>this.#j(t),document.getElementById("aux").appendChild(r)}#k(t,e,i,s){let r=document.createElementNS(SVG_LIB,"text");r.setAttribute("id","signal_"+i+"."+s),r.setAttribute("font-size",this.#t),r.setAttribute("opacity","0"),0==i?(r.setAttribute("text-anchor","start"),r.setAttribute("x",t+s*this.#t),r.setAttribute("y",e+(this.#r.settings.height+1)*this.#t),r.textContent="⏶"):(r.setAttribute("text-anchor","end"),r.setAttribute("x",t+(this.#r.settings.width+1)*this.#t),r.setAttribute("y",e+(s+.9)*this.#t),r.textContent="⏴"),r.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("components").appendChild(r)}#x(t,e,i,s,r){let a=document.createElementNS(SVG_LIB,"rect");if(a.setAttribute("id","squareNumber_"+i+"."+s+"."+(r-1)),a.setAttribute("opacity","1"),a.setAttribute("height",this.#t),a.setAttribute("width",this.#t),0==i){a.setAttribute("x",t+s*this.#t),a.setAttribute("y",e-r*this.#t);let i=this.#r.verticalNumbers[s][r-1].color;a.setAttribute("fill",this.#r.colors[i])}else{a.setAttribute("x",t-r*this.#t),a.setAttribute("y",e+s*this.#t);let i=this.#r.horizontalNumbers[s][r-1].color;a.setAttribute("fill",this.#r.colors[i])}a.onclick=t=>this.#D(t),document.getElementById("components").appendChild(a)}#C(t,e,i,s,r){let a=document.createElementNS(SVG_LIB,"text");a.setAttribute("id","number_"+i+"."+s+"."+(r-1)),a.setAttribute("text-anchor","middle"),a.setAttribute("font-family","serif"),a.setAttribute("font-size",.9*this.#t),a.setAttribute("font-weight","normal"),a.setAttribute("fill","#ffffff"),0==i?(a.setAttribute("x",t+s*this.#t+.5*this.#t),a.setAttribute("y",e-r*this.#t+.8*this.#t),a.textContent=this.#r.verticalNumbers[s][r-1].number):(a.setAttribute("x",t-r*this.#t+.5*this.#t),a.setAttribute("y",e+s*this.#t+.8*this.#t),a.textContent=this.#r.horizontalNumbers[s][r-1].number),a.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),a.onclick=t=>this.#P(t),document.getElementById("components").appendChild(a)}#w(t,e,i,s){let r=document.createElementNS(SVG_LIB,"line");r.setAttribute("id","line_"+i+"."+s),r.setAttribute("stroke","#808080"),s%this.#r.settings.gridLength==0?r.setAttribute("stroke-width","2"):r.setAttribute("stroke-width","1"),0==i?(r.setAttribute("x1",t+s*this.#t),r.setAttribute("x2",t+s*this.#t),r.setAttribute("y1",e-this.#r.settings.verticalNumbersLength*this.#t),r.setAttribute("y2",e+this.#r.settings.height*this.#t)):(r.setAttribute("x1",t-this.#r.settings.horizontalNumbersLength*this.#t),r.setAttribute("x2",t+this.#r.settings.width*this.#t),r.setAttribute("y1",e+s*this.#t),r.setAttribute("y2",e+s*this.#t)),document.getElementById("components").appendChild(r)}#N(t,e,i){let s=document.createElementNS(SVG_LIB,"text");s.setAttribute("id","calculated_"+i),s.setAttribute("font-family","serif"),s.setAttribute("font-size",this.#t),s.setAttribute("font-weight","bold"),s.setAttribute("fill","#808080"),0==i?(s.setAttribute("text-anchor","start"),s.setAttribute("x",t+(this.#r.settings.width+1)*this.#t+this.#t/4)):(s.setAttribute("text-anchor","middle"),s.setAttribute("y",e+(this.#r.settings.height+1)*this.#t+this.#t)),s.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("components").appendChild(s)}#v(){document.getElementById("nonogram").style="cursor: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3e%3cpath fill='%23"+this.#c.replace("#","")+"' stroke='black' d='M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z'/%3e%3c/svg%3e\") 0 32, pointer;"}#y(){let t=document.getElementById("palette");for(;t.firstChild;)t.removeChild(t.firstChild);let e=document.getElementById("components");for(;e.firstChild;)e.removeChild(e.firstChild);let i=document.getElementById("main");for(;i.firstChild;)i.removeChild(i.firstChild);let s=document.getElementById("aux");for(;s.firstChild;)s.removeChild(s.firstChild);this.#u=[]}#z(){let t=document.getElementsByTagName("svg")[0];t.setAttribute("height",this.#t*this.#r.settings.verticalNumbersLength+this.#t*(this.#r.settings.height+3)+0+60),t.setAttribute("width",this.#t*this.#r.settings.horizontalNumbersLength+this.#t*(this.#r.settings.width+3)+10)}#O(){let t,e,i,s,r,a;this.#a=!0;for(let l=0;l<this.#r.settings.width;l++){t=!0,s=document.getElementById("signal_0."+l);for(let r=0;r<this.#r.settings.height;r++)if(e=document.getElementById("square_"+l+"."+r),i=e.getAttribute("fill"),i!=this.#r.colors[this.#r.points[r][l]]){t=!1,this.#a=!1,"1"==s.getAttribute("opacity")&&s.setAttribute("opacity","0");break}if(t){for(let t=0;t<this.#r.verticalNumbers[l].length;t++)r=document.getElementById("squareNumber_0."+l+"."+t),r.setAttribute("opacity","0"),a=document.getElementById("number_0."+l+"."+t),a.setAttribute("fill",r.getAttribute("fill")),a.setAttribute("font-weight","bold");"0"!=s.getAttribute("opacity")&&"#b22222"!=s.getAttribute("fill")||(s.setAttribute("fill","#adff2f"),s.setAttribute("opacity","1"))}}for(let l=0;l<this.#r.settings.height;l++){t=!0,s=document.getElementById("signal_1."+l);for(let r=0;r<this.#r.settings.width;r++)if(e=document.getElementById("square_"+r+"."+l),i=e.getAttribute("fill"),i!=this.#r.colors[this.#r.points[l][r]]){t=!1,this.#a=!1,"1"==s.getAttribute("opacity")&&s.setAttribute("opacity","0");break}if(t){for(let t=0;t<this.#r.horizontalNumbers[l].length;t++)r=document.getElementById("squareNumber_1."+l+"."+t),r.setAttribute("opacity","0"),a=document.getElementById("number_1."+l+"."+t),a.setAttribute("fill",r.getAttribute("fill")),a.setAttribute("font-weight","bold");"0"!=s.getAttribute("opacity")&&"#b22222"!=s.getAttribute("fill")||(s.setAttribute("fill","#adff2f"),s.setAttribute("opacity","1"))}}if(this.#a){let t;for(let e=0;e<this.#r.settings.height;e++)for(let i=0;i<this.#r.settings.width;i++)t=document.getElementById("mark_"+i+"."+e),t.setAttribute("opacity","0");document.getElementById("calculated_0").textContent="",document.getElementById("calculated_1").textContent="",this.#s()}}#V(){this.#z();let t=this.#r.settings.horizontalNumbersLength*this.#t,e=this.#r.settings.verticalNumbersLength*this.#t;this.#U(t,e);for(let i=0;i<this.#r.settings.width;i++)for(let s=0;s<this.#r.settings.height;s++)this.#Z(t,e,i,s),this.#F(t,e,i,s),this.#X(t,e,i,s),this.#Y(t,e,i,s);for(let i=0;i<=this.#r.settings.width;i++){if(i<this.#r.settings.width){this.#Q(t,e,0,i);for(let s=1;s<=this.#r.verticalNumbers[i].length;s++)this.#H(t,e,0,i,s),this.#W(t,e,0,i,s)}this.#$(t,e,0,i)}for(let i=0;i<=this.#r.settings.height;i++){if(i<this.#r.settings.height){this.#Q(t,e,1,i);for(let s=1;s<=this.#r.horizontalNumbers[i].length;s++)this.#H(t,e,1,i,s),this.#W(t,e,1,i,s)}this.#$(t,e,1,i)}this.#tt(t,e,0),this.#tt(t,e,1)}#U(t,e){let i=document.getElementById("background");i.setAttribute("height",this.#t*this.#r.settings.height),i.setAttribute("width",this.#t*this.#r.settings.width),i.setAttribute("x",t),i.setAttribute("y",e)}#Z(t,e,i,s){let r=document.getElementById("mark_"+i+"."+s);r.setAttribute("font-size",this.#t),r.setAttribute("x",t+(i+.5)*this.#t),r.setAttribute("y",e+(s+.85)*this.#t)}#F(t,e,i,s){let r=document.getElementById("mark_aux_"+i+"."+s);r.setAttribute("font-size",this.#t),r.setAttribute("x",t+(i+.5)*this.#t),r.setAttribute("y",e+(s+.85)*this.#t)}#X(t,e,i,s){let r=document.getElementById("square_"+i+"."+s);r.setAttribute("height",.9*this.#t),r.setAttribute("width",.9*this.#t),r.setAttribute("x",t+i*this.#t+.05*this.#t),r.setAttribute("y",e+s*this.#t+.05*this.#t)}#Y(t,e,i,s){let r=document.getElementById("square_aux_"+i+"."+s);r.setAttribute("height",.9*this.#t),r.setAttribute("width",.9*this.#t),r.setAttribute("x",t+i*this.#t+.05*this.#t),r.setAttribute("y",e+s*this.#t+.05*this.#t)}#Q(t,e,i,s){let r=document.getElementById("signal_"+i+"."+s);r.setAttribute("font-size",this.#t),0==i?(r.setAttribute("x",t+s*this.#t),r.setAttribute("y",e+(this.#r.settings.height+1)*this.#t)):(r.setAttribute("x",t+(this.#r.settings.width+1)*this.#t),r.setAttribute("y",e+(s+.9)*this.#t))}#W(t,e,i,s,r){let a=document.getElementById("number_"+i+"."+s+"."+(r-1));a.setAttribute("font-size",.9*this.#t),0==i?(a.setAttribute("x",t+s*this.#t+.5*this.#t),a.setAttribute("y",e-r*this.#t+.8*this.#t)):(a.setAttribute("x",t-r*this.#t+.5*this.#t),a.setAttribute("y",e+s*this.#t+.8*this.#t))}#H(t,e,i,s,r){let a=document.getElementById("squareNumber_"+i+"."+s+"."+(r-1));a.setAttribute("height",this.#t),a.setAttribute("width",this.#t),0==i?(a.setAttribute("x",t+s*this.#t),a.setAttribute("y",e-r*this.#t)):(a.setAttribute("x",t-r*this.#t),a.setAttribute("y",e+s*this.#t))}#$(t,e,i,s){let r=document.getElementById("line_"+i+"."+s);0==i?(r.setAttribute("x1",t+s*this.#t),r.setAttribute("x2",t+s*this.#t),r.setAttribute("y1",e-this.#r.settings.verticalNumbersLength*this.#t),r.setAttribute("y2",e+this.#r.settings.height*this.#t)):(r.setAttribute("x1",t-this.#r.settings.horizontalNumbersLength*this.#t),r.setAttribute("x2",t+this.#r.settings.width*this.#t),r.setAttribute("y1",e+s*this.#t),r.setAttribute("y2",e+s*this.#t))}#tt(t,e,i){let s=document.getElementById("calculated_"+i);s.setAttribute("font-size",this.#t),0==i?s.setAttribute("x",t+(this.#r.settings.width+1)*this.#t+this.#t/4):s.setAttribute("y",e+(this.#r.settings.height+1)*this.#t+this.#t)}#L(){for(;this.#h<this.#u.length-1;)this.#u.pop();this.#u.push((new XMLSerializer).serializeToString(document.getElementById("main"))),this.#u.length>1&&(this.#h+=1)}#M(){let t=document.getElementById("main");for(;t.firstChild;)t.removeChild(t.firstChild);let e=(new DOMParser).parseFromString(this.#u[this.#h],"image/svg+xml").documentElement;for(;e.firstChild;)t.appendChild(e.firstChild);this.#O(),this.#V()}#et(t,e){let i=document.getElementById("square_"+t+"."+e);this.#l&&(i=document.getElementById("square_aux_"+t+"."+e));let s,r,a=i.getAttribute("fill"),l=1,u=t+1;for(;u<=this.#r.settings.width-1&&(s=document.getElementById("square_"+u+"."+e),r=document.getElementById("square_aux_"+u+"."+e),s.getAttribute("fill")==a||r.getAttribute("fill")==a&&a!=this.#r.colors[0]);)u++,l++;let h=t-1;for(;h>=0&&(s=document.getElementById("square_"+h+"."+e),r=document.getElementById("square_aux_"+h+"."+e),s.getAttribute("fill")==a||r.getAttribute("fill")==a&&a!=this.#r.colors[0]);)h--,l++;let o=1,n=e+1;for(;n<=this.#r.settings.height-1&&(s=document.getElementById("square_"+t+"."+n),r=document.getElementById("square_aux_"+t+"."+n),s.getAttribute("fill")==a||r.getAttribute("fill")==a&&a!=this.#r.colors[0]);)n++,o++;let d=e-1;for(;d>=0&&(s=document.getElementById("square_"+t+"."+d),r=document.getElementById("square_aux_"+t+"."+d),s.getAttribute("fill")==a||r.getAttribute("fill")==a&&a!=this.#r.colors[0]);)d--,o++;let c=document.getElementById("calculated_0"),g=document.getElementById("calculated_1");a!=this.#r.colors[0]?(c.setAttribute("fill",a),g.setAttribute("fill",a)):(c.setAttribute("fill","#808080"),g.setAttribute("fill","#808080")),c.textContent=l,g.textContent=o;let b=this.#r.settings.verticalNumbersLength*this.#t;c.setAttribute("y",b+this.#t*(e+.9));let m=this.#r.settings.horizontalNumbersLength*this.#t;g.setAttribute("x",m+this.#t*(t+.5))}#it(){for(let t=0;t<this.#r.settings.width;t++)for(let e=0;e<this.#r.settings.height;e++){let i=document.getElementById("square_aux_"+t+"."+e);"1"==i.getAttribute("opacity")&&(t==this.#o&&e==this.#n||(i.setAttribute("fill",this.#r.colors[0]),i.setAttribute("opacity","0")));let s=document.getElementById("mark_aux_"+t+"."+e);"1"==s.getAttribute("opacity")&&(t==this.#o&&e==this.#n||s.setAttribute("opacity","0"))}}#st(t,e){let i=document.getElementById("square_aux_"+t+"."+e),s=document.getElementById("square_"+t+"."+e),r=document.getElementById("mark_aux_"+t+"."+e),a=document.getElementById("mark_"+t+"."+e);if(this.#g){s.getAttribute("fill")==this.#r.colors[0]&&r.setAttribute("opacity","1")}else if(this.#d==this.#r.colors[0])i.setAttribute("fill",this.#d),i.setAttribute("opacity","1"),r.setAttribute("opacity","0.1");else{let t=s.getAttribute("fill"),e=a.getAttribute("opacity");t==this.#r.colors[0]&&"0"==e&&(i.setAttribute("fill",this.#d),i.setAttribute("opacity","1"))}}#rt(t){0===t.indexOf("#")&&(t=t.slice(1)),3===t.length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]);let e=(255-parseInt(t.slice(0,2),16)).toString(16),i=(255-parseInt(t.slice(2,4),16)).toString(16),s=(255-parseInt(t.slice(4,6),16)).toString(16);return"#"+this.#at(e)+this.#at(i)+this.#at(s)}#at(t,e){return e=e||2,(new Array(e).join("0")+t).slice(-e)}#G(t){let e=t.target.getAttribute("id");e=e.replace("squareColor_",""),this.#c=this.#r.colors[e],t.target.setAttribute("stroke-width","3");for(let t=1;t<this.#r.colors.length;t++){let i=document.getElementById("squareColor_"+t);t!=e&&i.setAttribute("stroke-width","1")}this.#v()}#J(t){if(!this.#a&&!this.#b){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]),a=document.getElementById("line_0."+s);a.setAttribute("stroke","#ff00ff"),s%this.#r.settings.gridLength!=0&&a.setAttribute("stroke-width","2");let l=document.getElementById("line_1."+r);l.setAttribute("stroke","#ff00ff"),r%this.#r.settings.gridLength!=0&&l.setAttribute("stroke-width","2"),s+=1,r+=1,a=document.getElementById("line_0."+s),a.setAttribute("stroke","#ff00ff"),s%this.#r.settings.gridLength!=0&&a.setAttribute("stroke-width","2"),l=document.getElementById("line_1."+r),l.setAttribute("stroke","#ff00ff"),r%this.#r.settings.gridLength!=0&&l.setAttribute("stroke-width","2")}}#K(t){if(!this.#a&&!this.#b){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]),a=document.getElementById("line_0."+s);a.setAttribute("stroke","#808080"),s%this.#r.settings.gridLength!=0&&a.setAttribute("stroke-width","1");let l=document.getElementById("line_1."+r);l.setAttribute("stroke","#808080"),r%this.#r.settings.gridLength!=0&&l.setAttribute("stroke-width","1"),s+=1,r+=1,a=document.getElementById("line_0."+s),a.setAttribute("stroke","#808080"),s%this.#r.settings.gridLength!=0&&a.setAttribute("stroke-width","1"),l=document.getElementById("line_1."+r),l.setAttribute("stroke","#808080"),r%this.#r.settings.gridLength!=0&&l.setAttribute("stroke-width","1"),document.getElementById("calculated_0").textContent="",document.getElementById("calculated_1").textContent=""}}#T(t){if(!this.#a&&1!=t.button&&!this.#b){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split(".");this.#o=parseInt(i[0]),this.#n=parseInt(i[1]);let s=document.getElementById("square_"+this.#o+"."+this.#n);this.#d=s.getAttribute("fill");let r=document.getElementById("mark_aux_"+this.#o+"."+this.#n),a=document.getElementById("mark_"+this.#o+"."+this.#n),l=a.getAttribute("opacity");this.#g=!1,this.#d==this.#r.colors[0]?"0"==l?0==t.button?(t.target.setAttribute("fill",this.#c),t.target.setAttribute("opacity","1"),s.setAttribute("fill",this.#c),s.setAttribute("opacity","1"),this.#d=this.#c):(r.setAttribute("opacity","1"),a.setAttribute("opacity","1"),this.#g=!0):(0==t.button&&(t.target.setAttribute("fill",this.#c),t.target.setAttribute("opacity","1"),s.setAttribute("fill",this.#c),s.setAttribute("opacity","1"),this.#d=this.#c),r.setAttribute("opacity","0.1"),a.setAttribute("opacity","0")):0==t.button?this.#d!=this.#c?(t.target.setAttribute("fill",this.#c),s.setAttribute("fill",this.#c),this.#d=this.#c):(t.target.setAttribute("fill",this.#r.colors[0]),t.target.setAttribute("opacity","0"),s.setAttribute("fill",this.#r.colors[0]),s.setAttribute("opacity","0"),this.#d=this.#r.colors[0]):(t.target.setAttribute("fill",this.#r.colors[0]),t.target.setAttribute("opacity","0"),s.setAttribute("fill",this.#r.colors[0]),s.setAttribute("opacity","0"),r.setAttribute("opacity","1"),a.setAttribute("opacity","1"),this.#g=!0),this.#l=!0,this.#et(this.#o,this.#n)}}#j(t){if(!this.#a&&!this.#b){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]),a=0;if(this.#l)if(this.#it(),s>this.#o&&r==this.#n)for(a=this.#o;a<=s;)this.#st(a,this.#n),a++;else if(s<this.#o&&r==this.#n)for(a=s;a<=this.#o;)this.#st(a,this.#n),a++;else if(s==this.#o&&r>this.#n)for(a=this.#n;a<=r;)this.#st(this.#o,a),a++;else if(s==this.#o&&r<this.#n)for(a=r;a<=this.#n;)this.#st(this.#o,a),a++;this.#et(s,r)}}#D(t){if(!this.#a&&!this.#b){let e=t.target.getAttribute("opacity"),i=t.target.getAttribute("id");i=i.replace("squareNumber_","");let s=i.split("."),r=parseInt(s[0]),a=parseInt(s[1]),l=parseInt(s[2]),u=document.getElementById("number_"+r+"."+a+"."+l);"1"==e?(t.target.setAttribute("opacity","0"),u.setAttribute("fill",t.target.getAttribute("fill")),u.setAttribute("font-weight","bold")):(t.target.setAttribute("opacity","1"),u.setAttribute("fill","#ffffff"),u.setAttribute("font-weight","normal"))}}#P(t){if(!this.#a&&!this.#b){let e=t.target.getAttribute("fill"),i=t.target.getAttribute("id");i=i.replace("number_","");let s=i.split("."),r=parseInt(s[0]),a=parseInt(s[1]),l=parseInt(s[2]),u=document.getElementById("squareNumber_"+r+"."+a+"."+l);e==this.#r.colors[0]?(u.setAttribute("opacity","0"),t.target.setAttribute("fill",u.getAttribute("fill")),t.target.setAttribute("font-weight","bold")):(u.setAttribute("opacity","1"),t.target.setAttribute("fill","#ffffff"),t.target.setAttribute("font-weight","normal"))}}#m(){let t=document.getElementById("palette").children;if(t.length>0){let e=0;for(let i=0;i<t.length;i++)if(3==t[i].getAttribute("stroke-width")){e=i==t.length-1?0:i+1;break}this.#c=this.#r.colors[e+1],t[e].setAttribute("stroke-width","3");for(let t=1;t<this.#r.colors.length;t++){let i=document.getElementById("squareColor_"+t);t!=e+1&&i.setAttribute("stroke-width","1")}this.#v()}}#A(){if(this.#l&&this.#r){let t={action:this.#g?"MARK":"PAINT",color:this.#c,squares:[]};for(let e=0;e<this.#r.settings.width;e++)for(let i=0;i<this.#r.settings.height;i++){let s=document.getElementById("square_aux_"+e+"."+i);if("1"==s.getAttribute("opacity")){let r=s.getAttribute("id");r=r.replace("square_aux_","square_");let a=document.getElementById(r),l=s.getAttribute("fill"),u=a.getAttribute("fill");if(a.setAttribute("fill",l),l==this.#r.colors[0]?a.setAttribute("opacity","0"):a.setAttribute("opacity","1"),s.setAttribute("fill",this.#r.colors[0]),s.setAttribute("opacity","0"),t.squares.push({i:e,j:i,previousColor:u}),this.#i){let t=document.getElementById("error_mark_"+e+"."+i);l==this.#r.colors[this.#r.points[i][e]]||l==this.#r.colors[0]?t.setAttribute("opacity","0"):(t.setAttribute("fill",this.#rt(l)),t.setAttribute("opacity","1"))}}let r=document.getElementById("mark_aux_"+e+"."+i);if("1"==r.getAttribute("opacity")){let s=r.getAttribute("id");if(s=s.replace("mark_aux_","mark_"),document.getElementById(s).setAttribute("opacity","1"),r.setAttribute("opacity","0"),t.squares.push({i:e,j:i}),this.#i){document.getElementById("error_mark_"+e+"."+i).setAttribute("opacity","0")}}else if("0.1"==r.getAttribute("opacity")){let s=r.getAttribute("id");s=s.replace("mark_aux_","mark_"),document.getElementById(s).setAttribute("opacity","0"),r.setAttribute("opacity","0"),t.squares.push({i:e,j:i}),t.action="UNMARK"}}this.#l=!1,this.#O(),this.#L();let e=new CustomEvent("receiveMove",{detail:t});document.dispatchEvent(e)}}}