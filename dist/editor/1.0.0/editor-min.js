// compress by https://codebeautify.org/minify-js
const SVG_LIB="http://www.w3.org/2000/svg",SQUARE_COLOR_SIZE=40,MIN_DIMENSION=3,MAX_WIDTH_DIMENSION=125,MAX_HEIGTH_DIMENSION=50,TRANSLATE_X=10,TRANSLATE_Y=10,LINE_COLOR="#808080",RULE_COLOR="#ff00ff",ARROW_COLOR="#ff00ff",CALCULATED_EMPTY_COLOR="#808080";class editor{#t;#e;#i;#s;#r;#h;#o;#u;#n;#l;#a;#d;#c;constructor(t={}){this.#t=t.size||20,this.#e=t.width||5,this.#i=t.height||5,this.#s=t.gridLength||5,this.#r=t.palette||["#ffffff","#000000"],this.#h=this.#r[0],this.#o=this.#r[1],this.#u=!1,this.#n=[],this.#l=0,this.#a=null,this.#d=null,this.#c=null,document.body.onmousedown=t=>{if(1==t.button)return this.#g(),!1},document.body.onmouseup=()=>this.#A()}init(t){let e=document.getElementsByTagName("svg")[0];e&&e.remove(),t&&(this.#h=t.colors[0],this.#o=t.colors[1],this.#r=t.colors,this.#e=t.settings.width,this.#i=t.settings.height,this.#s=t.settings.gridLength),this.#b();for(let t=1;t<this.#r.length;t++)this.#m(t);this.#f();for(let t=0;t<125;t++)for(let e=0;e<50;e++)this.#z(t,e),this.#w(t,e);for(let t=0;t<=this.#e;t++)this.#y(0,t);for(let t=0;t<=this.#i;t++)this.#y(1,t);this.#p(0),this.#p(1),this.#I(0),this.#_(0),this.#I(1),this.#_(1),this.#I(2),this.#_(2),this.#C(),this.#S(),t&&(this.#q(),this.#E(t))}maximize(t){this.#t+=t||1,this.#B()}minimize(t){this.#t-=t||1,this.#t<1?this.#t+=t||1:this.#B()}undo(){this.#l>0&&(this.#l-=1,this.#x())}redo(){this.#l<this.#n.length-1&&(this.#l+=1,this.#x())}setGridLength(t){t>1&&(this.#s=t,this.#e=t,this.#i=t,this.#q())}setPalette(t){this.#r=t,this.#k();let e=this.#h;this.#h=t[0],this.#L(e),this.#o=t[1],this.#S(),this.#q()}generateJson(){let t={colors:[this.#h],settings:{width:this.#e,height:this.#i,gridLength:this.#s},points:[],horizontalNumbers:[],verticalNumbers:[]};for(let e=0;e<this.#i;e++){t.points[e]=[];for(let i=0;i<this.#e;i++){let s=document.getElementById("square_"+i+"."+e).getAttribute("fill");t.colors.includes(s)||t.colors.push(s),t.points[e].push(t.colors.findIndex((t=>t==s)))}}return t.horizontalNumbers=this.#N(t),t.verticalNumbers=this.#v(t),t.settings.horizontalNumbersLength=this.#D(t.horizontalNumbers),t.settings.verticalNumbersLength=this.#D(t.verticalNumbers),JSON.stringify(t,null,2)}#b(){let t=document.getElementById("editor");t.oncontextmenu=function(){return!1};let e=document.createElementNS(SVG_LIB,"svg"),i="translate(10,10)",s=document.createElementNS(SVG_LIB,"g");s.setAttribute("transform",i),s.setAttribute("id","palette"),e.appendChild(s);i="translate(10,70)",e.setAttribute("height",this.#t*(this.#i+3)+10+60),this.#t*(this.#e+3)>40*this.#r.length?e.setAttribute("width",this.#t*(this.#e+3)+10):e.setAttribute("width",40*this.#r.length+10);let r=document.createElementNS(SVG_LIB,"g");r.setAttribute("id","components"),r.setAttribute("transform",i),e.appendChild(r);let h=document.createElementNS(SVG_LIB,"g");h.setAttribute("id","main"),h.setAttribute("transform",i),e.appendChild(h);let o=document.createElementNS(SVG_LIB,"g");o.setAttribute("id","aux"),o.setAttribute("transform",i),e.appendChild(o);let u=document.createElementNS(SVG_LIB,"g");u.setAttribute("id","arrows"),u.setAttribute("transform",i),e.appendChild(u),t.appendChild(e)}#m(t){let e=document.createElementNS(SVG_LIB,"rect");e.setAttribute("id","squareColor_"+t),1==t?e.setAttribute("stroke-width","3"):e.setAttribute("stroke-width","1"),e.setAttribute("stroke","black"),e.setAttribute("height",40),e.setAttribute("width",40),e.setAttribute("fill",this.#r[t]),e.setAttribute("x",40*(t-1)+5),e.setAttribute("y",5),e.onclick=t=>this.#V(t),document.getElementById("palette").appendChild(e)}#f(){let t=document.createElementNS(SVG_LIB,"rect");t.setAttribute("id","background"),t.setAttribute("fill",this.#h),t.setAttribute("height",this.#t*this.#i),t.setAttribute("width",this.#t*this.#e),document.getElementById("components").appendChild(t)}#z(t,e){let i=document.createElementNS(SVG_LIB,"rect");i.setAttribute("id","square_"+t+"."+e),i.setAttribute("height",.9*this.#t),i.setAttribute("width",.9*this.#t),i.setAttribute("x",t*this.#t+.05*this.#t),i.setAttribute("y",e*this.#t+.05*this.#t),i.setAttribute("fill",this.#h),i.setAttribute("opacity","0"),document.getElementById("main").appendChild(i)}#w(t,e){let i=document.createElementNS(SVG_LIB,"rect");i.setAttribute("id","square_aux_"+t+"."+e),i.setAttribute("height",.9*this.#t),i.setAttribute("width",.9*this.#t),i.setAttribute("x",t*this.#t+.05*this.#t),i.setAttribute("y",e*this.#t+.05*this.#t),i.setAttribute("fill",this.#h),i.setAttribute("opacity","0"),i.onmouseover=t=>this.#G(t),i.onmouseout=t=>this.#J(t),i.onmousedown=t=>this.#O(t),i.onmousemove=t=>this.#M(t),document.getElementById("aux").appendChild(i)}#y(t,e){let i=document.createElementNS(SVG_LIB,"line");i.setAttribute("id","line_"+t+"."+e),i.setAttribute("stroke","#808080"),e%this.#s==0?i.setAttribute("stroke-width","2"):i.setAttribute("stroke-width","1"),0==t?(i.setAttribute("x1",e*this.#t),i.setAttribute("x2",e*this.#t),i.setAttribute("y1",0),i.setAttribute("y2",this.#i*this.#t)):(i.setAttribute("x1",0),i.setAttribute("x2",this.#e*this.#t),i.setAttribute("y1",e*this.#t),i.setAttribute("y2",e*this.#t)),document.getElementById("components").appendChild(i)}#p(t){let e=document.createElementNS(SVG_LIB,"text");e.setAttribute("id","calculated_"+t),e.setAttribute("font-family","serif"),e.setAttribute("font-size",this.#t),e.setAttribute("font-weight","bold"),e.setAttribute("fill","#808080"),0==t?(e.setAttribute("text-anchor","start"),e.setAttribute("x",(this.#e+.5)*this.#t)):(e.setAttribute("text-anchor","middle"),e.setAttribute("y",(this.#i+1)*this.#t)),e.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),document.getElementById("components").appendChild(e)}#I(t){let e=document.createElementNS(SVG_LIB,"text");e.setAttribute("id","decrease_arrow_"+t),e.setAttribute("font-size",this.#t),e.setAttribute("fill","#ff00ff"),e.setAttribute("opacity","0.5"),0==t?(e.setAttribute("text-anchor","end"),e.setAttribute("x",this.#e*this.#t/2+this.#t/2),e.setAttribute("y",this.#i*this.#t+this.#t),e.textContent="🢁"):1==t?(e.setAttribute("text-anchor","middle"),e.setAttribute("x",this.#e*this.#t+this.#t),e.setAttribute("y",this.#i*this.#t/2+this.#t/4),e.textContent="🢀"):(e.setAttribute("text-anchor","middle"),e.setAttribute("x",this.#e*this.#t+this.#t),e.setAttribute("y",this.#i*this.#t+this.#t),e.textContent="🢄"),e.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),e.onmouseover=t=>this.#R(t),e.onmouseout=t=>this.#T(t),e.onclick=t=>this.#K(t),document.getElementById("arrows").appendChild(e)}#_(t){let e=document.createElementNS(SVG_LIB,"text");e.setAttribute("id","increase_arrow_"+t),e.setAttribute("font-size",this.#t),e.setAttribute("fill","#ff00ff"),e.setAttribute("opacity","0.5"),0==t?(e.setAttribute("text-anchor","end"),e.setAttribute("x",this.#e*this.#t/2+this.#t/2),e.setAttribute("y",this.#i*this.#t+2*this.#t+this.#t/4),e.textContent="🢃"):1==t?(e.setAttribute("text-anchor","middle"),e.setAttribute("x",this.#e*this.#t+2*this.#t),e.setAttribute("y",this.#i*this.#t/2+this.#t/4),e.textContent="🢂"):(e.setAttribute("text-anchor","middle"),e.setAttribute("x",this.#e*this.#t+2*this.#t-this.#t/4),e.setAttribute("y",this.#i*this.#t+2*this.#t-this.#t/4),e.textContent="🢆"),e.setAttribute("style","-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"),e.onmouseover=t=>this.#H(t),e.onmouseout=t=>this.#P(t),e.onclick=t=>this.#X(t),document.getElementById("arrows").appendChild(e)}#S(){document.getElementById("editor").style="cursor: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3e%3cpath fill='%23"+this.#o.replace("#","")+"' stroke='black' d='M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z'/%3e%3c/svg%3e\") 0 32, pointer;"}#C(){for(;this.#l<this.#n.length-1;)this.#n.pop();this.#n.push((new XMLSerializer).serializeToString(document.getElementById("main"))),this.#n.length>1&&(this.#l+=1)}#x(){let t=document.getElementById("main");for(;t.firstChild;)t.removeChild(t.firstChild);let e=(new DOMParser).parseFromString(this.#n[this.#l],"image/svg+xml").documentElement;for(;e.firstChild;)t.appendChild(e.firstChild);this.#B(),this.#q()}#B(){this.#U(),this.#W();for(let t=0;t<=this.#e;t++)this.#Y(0,t);for(let t=0;t<=this.#i;t++)this.#Y(1,t);for(let t=0;t<125;t++)for(let e=0;e<50;e++)this.#F(t,e),this.#Q(t,e);this.#Z(0),this.#Z(1),this.#j(0),this.#$(0),this.#j(1),this.#$(1),this.#j(2),this.#$(2)}#U(){let t=document.getElementsByTagName("svg")[0];t.setAttribute("height",this.#t*(this.#i+3)+10+60),this.#t*(this.#e+3)>40*this.#r.length?t.setAttribute("width",this.#t*(this.#e+3)+10):t.setAttribute("width",40*this.#r.length+10)}#W(){let t=document.getElementById("background");t.setAttribute("height",this.#t*this.#i),t.setAttribute("width",this.#t*this.#e)}#Y(t,e){let i=document.getElementById("line_"+t+"."+e);0==t?(i.setAttribute("x1",e*this.#t),i.setAttribute("x2",e*this.#t),i.setAttribute("y1",0),i.setAttribute("y2",this.#i*this.#t)):(i.setAttribute("x1",0),i.setAttribute("x2",this.#e*this.#t),i.setAttribute("y1",e*this.#t),i.setAttribute("y2",e*this.#t))}#F(t,e){let i=document.getElementById("square_"+t+"."+e);i.setAttribute("height",.9*this.#t),i.setAttribute("width",.9*this.#t),i.setAttribute("x",t*this.#t+.05*this.#t),i.setAttribute("y",e*this.#t+.05*this.#t)}#Q(t,e){let i=document.getElementById("square_aux_"+t+"."+e);i.setAttribute("height",.9*this.#t),i.setAttribute("width",.9*this.#t),i.setAttribute("x",t*this.#t+.05*this.#t),i.setAttribute("y",e*this.#t+.05*this.#t)}#Z(t){let e=document.getElementById("calculated_"+t);e.setAttribute("font-size",this.#t),0==t?e.setAttribute("x",(this.#e+.5)*this.#t):e.setAttribute("y",(this.#i+1)*this.#t)}#j(t){let e=document.getElementById("decrease_arrow_"+t);e.setAttribute("font-size",this.#t),0==t?(e.setAttribute("x",this.#e*this.#t/2+this.#t/2),e.setAttribute("y",this.#i*this.#t+this.#t)):1==t?(e.setAttribute("x",this.#e*this.#t+this.#t),e.setAttribute("y",this.#i*this.#t/2+this.#t/4)):(e.setAttribute("x",this.#e*this.#t+this.#t),e.setAttribute("y",this.#i*this.#t+this.#t))}#$(t){let e=document.getElementById("increase_arrow_"+t);e.setAttribute("font-size",this.#t),0==t?(e.setAttribute("x",this.#e*this.#t/2+this.#t/2),e.setAttribute("y",this.#i*this.#t+2*this.#t+this.#t/4)):1==t?(e.setAttribute("x",this.#e*this.#t+2*this.#t),e.setAttribute("y",this.#i*this.#t/2+this.#t/4)):(e.setAttribute("x",this.#e*this.#t+2*this.#t-this.#t/4),e.setAttribute("y",this.#i*this.#t+2*this.#t-this.#t/4))}#q(){this.#U();let t=document.getElementById("components");for(;t.firstChild;)t.removeChild(t.firstChild);this.#f();for(let t=0;t<=this.#e;t++)this.#y(0,t);for(let t=0;t<=this.#i;t++)this.#y(1,t);let e=document.getElementById("arrows");for(;e.firstChild;)e.removeChild(e.firstChild);this.#p(0),this.#p(1),this.#I(0),this.#_(0),this.#I(1),this.#_(1),this.#I(2),this.#_(2);for(let t=0;t<125;t++)for(let e=0;e<50;e++){let i=document.getElementById("square_"+t+"."+e);t>=this.#e||e>=this.#i?i.setAttribute("opacity","0"):i.setAttribute("opacity","1")}}#tt(t,e){if(t<this.#e&&e<this.#i){let i=document.getElementById("square_"+t+"."+e);this.#u&&(i=document.getElementById("square_aux_"+t+"."+e));let s=i.getAttribute("fill"),r=1,h=t+1;for(;h<=this.#e-1;){let t=document.getElementById("square_"+h+"."+e),i=document.getElementById("square_aux_"+h+"."+e);if(t.getAttribute("fill")!=s&&(i.getAttribute("fill")!=s||s==this.#h))break;h++,r++}let o=t-1;for(;o>=0;){let t=document.getElementById("square_"+o+"."+e),i=document.getElementById("square_aux_"+o+"."+e);if(t.getAttribute("fill")!=s&&(i.getAttribute("fill")!=s||s==this.#h))break;o--,r++}let u=1,n=e+1;for(;n<=this.#i-1;){let e=document.getElementById("square_"+t+"."+n),i=document.getElementById("square_aux_"+t+"."+n);if(e.getAttribute("fill")!=s&&(i.getAttribute("fill")!=s||s==this.#h))break;n++,u++}let l=e-1;for(;l>=0;){let e=document.getElementById("square_"+t+"."+l),i=document.getElementById("square_aux_"+t+"."+l);if(e.getAttribute("fill")!=s&&(i.getAttribute("fill")!=s||s==this.#h))break;l--,u++}let a=document.getElementById("calculated_0"),d=document.getElementById("calculated_1");s!=this.#h?(a.setAttribute("fill",s),d.setAttribute("fill",s)):(a.setAttribute("fill","#808080"),d.setAttribute("fill","#808080")),a.textContent=r,d.textContent=u,a.setAttribute("y",this.#t*(e+1)),d.setAttribute("x",this.#t*(t+.5))}}#et(){for(let t=0;t<this.#e;t++)for(let e=0;e<this.#i;e++){let i=document.getElementById("square_aux_"+t+"."+e);"1"==i.getAttribute("opacity")&&(i.setAttribute("fill",this.#h),i.setAttribute("opacity","0"))}}#it(t,e){let i=document.getElementById("square_aux_"+t+"."+e),s=document.getElementById("square_"+t+"."+e);if(this.#c==this.#h)i.setAttribute("fill",this.#c),i.setAttribute("opacity","1");else{s.getAttribute("fill")==this.#h&&(i.setAttribute("fill",this.#c),i.setAttribute("opacity","1"))}}#k(){let t=document.getElementById("palette");for(;t.firstChild;)t.removeChild(t.firstChild);for(let t=1;t<this.#r.length;t++)this.#m(t)}#L(t){document.getElementById("background").setAttribute("fill",this.#h);for(let e=0;e<125;e++)for(let i=0;i<50;i++){document.getElementById("square_aux_"+e+"."+i).setAttribute("fill",this.#h);let s=document.getElementById("square_"+e+"."+i);s.getAttribute("fill")==t&&s.setAttribute("fill",this.#h)}}#N(t){let e,i,s,r=[];for(let e=0;e<t.points.length;e++)r[e]=[];for(let h=0;h<t.points.length;h++){e=0,i=-1,s=!1;for(let o=t.points[0].length-1;o>=0;o--)s?(e++,0!=t.points[h][o]&&t.points[h][o]==i||(0==t.points[h][o]&&(s=!1),r[h].push({number:e,color:i}),e=0)):t.points[h][o]>0&&t.points[h][o]!=i&&(s=!0),i=t.points[h][o];s&&(e++,r[h].push({number:e,color:i}))}return r}#v(t){let e,i,s,r=[];for(let e=0;e<t.points[0].length;e++)r[e]=[];for(let h=0;h<t.points[0].length;h++){e=0,i=-1,s=!1;for(let o=t.points.length-1;o>=0;o--)s?(e++,0!=t.points[o][h]&&t.points[o][h]==i||(0==t.points[o][h]&&(s=!1),r[h].push({number:e,color:i}),e=0)):t.points[o][h]>0&&t.points[o][h]!=i&&(s=!0),i=t.points[o][h];s&&(e++,r[h].push({number:e,color:i}))}return r}#D(t){let e=0,i=0;for(let s=0;s<t.length;s++)i=t[s].length,i>e&&(e=i);return e}#E(t){for(let e=0;e<this.#i;e++)for(let i=0;i<this.#e;i++){let s=document.getElementById("square_"+i+"."+e);s.setAttribute("fill",t.colors[t.points[e][i]]),s.setAttribute("opacity","1")}}#V(t){let e,i=t.target.getAttribute("id");i=i.replace("squareColor_",""),this.#o=this.#r[i],t.target.setAttribute("stroke-width","3");for(let t=1;t<this.#r.length;t++)e=document.getElementById("squareColor_"+t),t!=i&&e.setAttribute("stroke-width","1");this.#S()}#G(t){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]);if(s<this.#e&&r<this.#i){let t=document.getElementById("line_0."+s);t.setAttribute("stroke","#ff00ff"),s%this.#s!=0&&t.setAttribute("stroke-width","2"),s+=1,t=document.getElementById("line_0."+s),t.setAttribute("stroke","#ff00ff"),s%this.#s!=0&&t.setAttribute("stroke-width","2");let e=document.getElementById("line_1."+r);e.setAttribute("stroke","#ff00ff"),r%this.#s!=0&&e.setAttribute("stroke-width","2"),r+=1,e=document.getElementById("line_1."+r),e.setAttribute("stroke","#ff00ff"),r%this.#s!=0&&e.setAttribute("stroke-width","2"),document.getElementById("decrease_arrow_0").setAttribute("opacity","0"),document.getElementById("increase_arrow_0").setAttribute("opacity","0"),document.getElementById("decrease_arrow_1").setAttribute("opacity","0"),document.getElementById("increase_arrow_1").setAttribute("opacity","0"),document.getElementById("decrease_arrow_2").setAttribute("opacity","0"),document.getElementById("increase_arrow_2").setAttribute("opacity","0")}}#J(t){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]);if(s<this.#e&&r<this.#i){let t=document.getElementById("line_0."+s);t.setAttribute("stroke","#808080"),s%this.#s!=0&&t.setAttribute("stroke-width","1"),s+=1,t=document.getElementById("line_0."+s),t.setAttribute("stroke","#808080"),s%this.#s!=0&&t.setAttribute("stroke-width","1");let e=document.getElementById("line_1."+r);e.setAttribute("stroke","#808080"),r%this.#s!=0&&e.setAttribute("stroke-width","1"),r+=1,e=document.getElementById("line_1."+r),e.setAttribute("stroke","#808080"),r%this.#s!=0&&e.setAttribute("stroke-width","1"),document.getElementById("calculated_0").textContent="",document.getElementById("calculated_1").textContent="",document.getElementById("decrease_arrow_0").setAttribute("opacity","0.5"),document.getElementById("increase_arrow_0").setAttribute("opacity","0.5"),document.getElementById("decrease_arrow_1").setAttribute("opacity","0.5"),document.getElementById("increase_arrow_1").setAttribute("opacity","0.5"),document.getElementById("decrease_arrow_2").setAttribute("opacity","0.5"),document.getElementById("increase_arrow_2").setAttribute("opacity","0.5")}}#O(t){if(0==t.button){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split(".");this.#a=parseInt(i[0]),this.#d=parseInt(i[1]);let s=document.getElementById("square_"+this.#a+"."+this.#d);this.#a<this.#e&&this.#d<this.#i&&(this.#c=s.getAttribute("fill"),this.#c==this.#h?(t.target.setAttribute("fill",this.#o),t.target.setAttribute("opacity","1"),s.setAttribute("fill",this.#o),s.setAttribute("opacity","1"),this.#c=this.#o):this.#c==this.#o?(t.target.setAttribute("fill",this.#h),t.target.setAttribute("opacity","0"),s.setAttribute("fill",this.#h),s.setAttribute("opacity","0"),this.#c=this.#h):(t.target.setAttribute("fill",this.#o),s.setAttribute("fill",this.#o),this.#c=this.#o),this.#u=!0,this.#tt(this.#a,this.#d))}}#M(t){let e=t.target.getAttribute("id");e=e.replace("square_aux_","");let i=e.split("."),s=parseInt(i[0]),r=parseInt(i[1]);if(this.#u){let t;if(this.#et(),s>this.#a&&r==this.#d)for(t=this.#a;t<=s;)t<this.#e&&this.#it(t,this.#d),t++;else if(s<this.#a&&r==this.#d)for(t=s;t<=this.#a;)this.#it(t,this.#d),t++;else if(s==this.#a&&r>this.#d)for(t=this.#d;t<=r;)t<this.#i&&this.#it(this.#a,t),t++;else if(s==this.#a&&r<this.#d)for(t=r;t<=this.#d;)this.#it(this.#a,t),t++}this.#tt(s,r)}#R(t){t.target.setAttribute("opacity","1")}#T(t){t.target.setAttribute("opacity","0.5")}#K(t){let e=t.target.getAttribute("id").replace("decrease_arrow_","");0==e?(this.#i-=this.#s,this.#i<3&&(this.#i+=this.#s)):1==e?(this.#e-=this.#s,this.#e<3&&(this.#e+=this.#s)):(this.#i-=this.#s,this.#i<3&&(this.#i+=this.#s),this.#e-=this.#s,this.#e<3&&(this.#e+=this.#s)),this.#q()}#H(t){t.target.setAttribute("opacity","1")}#P(t){t.target.setAttribute("opacity","0.5")}#X(t){let e=t.target.getAttribute("id").replace("increase_arrow_","");0==e?(this.#i+=this.#s,this.#i>50&&(this.#i-=this.#s)):1==e?(this.#e+=this.#s,this.#e>125&&(this.#e-=this.#s)):(this.#i+=this.#s,this.#i>50&&(this.#i-=this.#s),this.#e+=this.#s,this.#e>125&&(this.#e-=this.#s)),this.#q()}#g(){let t=document.getElementById("palette").children,e=0;for(let i=0;i<t.length;i++)if(3==t[i].getAttribute("stroke-width")){e=i==t.length-1?0:i+1;break}this.#o=this.#r[e+1],t[e].setAttribute("stroke-width","3");for(let t=1;t<this.#r.length;t++){let i=document.getElementById("squareColor_"+t);t!=e+1&&i.setAttribute("stroke-width","1")}this.#S()}#A(){if(this.#u){for(let t=0;t<this.#e;t++)for(let e=0;e<this.#i;e++){let i=document.getElementById("square_aux_"+t+"."+e);if("1"==i.getAttribute("opacity")){let t=i.getAttribute("id");t=t.replace("square_aux_","square_");let e=document.getElementById(t),s=i.getAttribute("fill");e.setAttribute("fill",s),s==this.#h?e.setAttribute("opacity","0"):e.setAttribute("opacity","1"),i.setAttribute("fill",this.#h),i.setAttribute("opacity","0")}}this.#u=!1,this.#C()}}}