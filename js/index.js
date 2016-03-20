window.onload=function(){

	var canvas=document.querySelector('#canvas');
	var w=document.documentElement.clientWidth;
	console.log(w)
	if(w>=768){
		canvas.width=600;
		canvas.height=600;
	}
	var ctx=canvas.getContext('2d');
  	var ROW=15;//棋盘星点  位置数据	//棋牌横竖的循环绘制
	var qizi={};//用空对象 来做字典
 	//var kaiguan=true;//标识  该 谁洛子
  	ctx.strokeStyle='#333';
  	var huaqipan=function(){
  		for(var i=0;i<15;i++){
 			//所有横线
			ctx.beginPath();
			ctx.moveTo(20,i*40+20.5);
			ctx.lineTo(580,i*40+20.5);
			ctx.stroke();
	 		//所有竖线  
			ctx.beginPath();
			ctx.moveTo(i*40+20.5,20);
			ctx.lineTo(i*40+20.5,580);
			ctx.stroke();
 		}
 	//圆心的填充
	 	ctx.beginPath();
		ctx.arc(300,300,5,0,Math.PI*2);
		ctx.fill();
	 	//分布的四个小圆点
	 	var z=[140.5,460.5];
	 	ctx.fillStyle='green';
		for(var i=0;i<z.length;i++){
			for(var j=0;j<z.length;j++){
				ctx.beginPath();
				ctx.arc(z[j],z[i],3,0,Math.PI*2);
				ctx.fill();
	 		}
		}
   	}
  	huaqipan();
 	
 /* 接口和功能
 x,y:Number  落子的x,y坐标
 color:true   代表黑子
 color:false  代表白子
 */

 var canvas2=document.querySelector('#canvas2');
 var ctx2=canvas2.getContext('2d');
 	var kaiguan=localStorage.x?false:true;
 	 var luozi=function(x,y,color){
 		var zx=40*x+20.5;
 		var zy=40*y+20.5;
 		
	    var black=ctx2.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
		black.addColorStop(0.1,'#555');
		black.addColorStop(1,'black');

		var white=ctx2.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
		white.addColorStop(0.1,'#fff');
		white.addColorStop(1,'#eee');
		 
 		ctx2.fillStyle=(color=="black")?black:white;	

 		ctx2.beginPath();
		ctx2.arc(zx,zy,18,0,Math.PI*2);
		ctx2.fill();
 	}
  	var kongbai = {};
	  for (var i = 0; i < 15; i++) {
	    for (var j = 0; j < 15; j++) {
	      kongbai[ i + '_' + j] = true;
	    }
    }

  var ai = function () {
    var max = -1000000; var xx = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('_')[0]),Number(pos.split('_')[1]),'black');
      if( x > max ){
        max = x;
        xx.x = pos.split('_')[0];
        xx.y = pos.split('_')[1];
      }
    }

    var max2 = -1000000; var yy = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('_')[0]),Number(pos.split('_')[1]),'white');
      if( x > max2 ){
        max2 = x;
        yy.x = pos.split('_')[0];
        yy.y = pos.split('_')[1];
      }
    }
    if( max2 >= max){
      return yy;
    }
    return xx;
  }

  function handle(e) {
    var x =  Math.round( (e.offsetX-_yy)/_xx );
    var y =  Math.round( (e.offsetY-_yy)/_xx );
    if(e.type == 'tap'){
      var x =  Math.round( (e.position.x - canvas.offsetLeft - _yy)/_xx );
      var y =  Math.round( (e.position.y - canvas.offsetTop - _yy)/_xx );
    }

    if( qizi[x+'_'+y] ){return;}
    luozi(x,y,'black');
    qizi[ x + '_' + y ] = 'black';
    delete kongbai[ x + '_' + y ];

    if( panduan(x,y,'black') >= 5 ){
      alert('黑棋赢');
      window.location.reload();
    }

    var pos = ai();
    luozi(pos.x,pos.y,'white');
    qizi[ pos.x + '_' + pos.y ] = 'white';
    delete kongbai[ pos.x + '_' + pos.y ];
    if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
        alert('白棋赢');
        window.location.reload();
    };
  }
  touch.on(canvas,'tap',handle);
 

  var houziAI  = function () {
    do{
      var x = Math.floor( Math.random()*15 );
      var y = Math.floor( Math.random()*15 );
    }while( qizi[ x + '_' + y ] )
   	 return {x:x,y:y};
  }
  var xy2id = function(x,y) {
    return x + '_' + y;
  }
 

canvas2.onclick=function(e){
	//console.log(e.offsetX);
var x=Math.round((e.offsetX-20.5)/40);
var y=Math.round((e.offsetY-20.5)/40);
//luozi(x,y,true);
	if(qizi[x+'_'+y]){return;}
	luozi(x,y,"black");
    qizi[x+"_"+y]="black";
    delete kongbai[x+"_"+y];

    if( panduan(x,y,'black') >= 5 ){
      alert('黑棋赢');
      window.location.reload();
    }
    var pos=ai();
    luozi(pos.x,pos.y,"white");
    qizi[pos.x+"_"+pos.y] = 'white';

   // var pos=fangshouAI();
    // luozi(pos.x,pos.y,"white");
    // qizi[pos.x+"_"+pos.y]="white";
    delete kongbai[pos.x+"_"+pos.y];
    if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
        alert('白棋赢');
        window.location.reload();
    }

 	//悔棋   回退一步
/*	var regret=document.querySelector('.regret');
	regret.onclick=function(){
		var newqizi={};
		for(var i in qizi){
			if(i!=(x+'_'+y)){
				newqizi[i]=qizi[i];
			}
		}
		qizi = newqizi;
        kaiguan = !kaiguan;
        ctx2.clearRect(x*40+2,y*40+2,40,40);
 	}*/ 
}


  	var xy2id=function(x,y){return x+'_'+y;}//返回当前棋子的位置
  	//判断是否成功
  	var panduan=function(x,y,color){
 		var shuju=filter(color);
 		var tx,ty,hang=1;shu=1;zuoxie=1;youxie=1;//tx,ty
 		tx=x;ty=y;while(shuju[xy2id(tx-1,ty)]){tx--;hang++};
 		tx=x;ty=y;while(shuju[xy2id(tx+1,ty)]){tx++;hang++};
 		// if(hang>=5){return true;}

 		tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
	    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
	    // if(shu >= 5){return true};

	    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
	    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
	    // if(zuoxie >= 5){return true};

	    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
	    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
	    return Math.max(hang,shu,zuoxie,youxie);
	   // if(youxie >= 5){return true};
	   console.log(1)
	 }

	 // 在字典中 过滤 出来 黑白
	 var filter=function(color){//
 		var r={};
 		for(var i in qizi){
 			if(qizi[i]==color){
 				r[i]=qizi[i];
 			}
 		}
 		return r;
 	}
  	/* 如果本地存储中有棋盘数据，读取这些数据并绘制到页面中；*/
 /* 	if(localStorage.data){
 		qizi=JSON.parse(localStorage.data);
 		for(var i in qizi){	//X_Y;
 			var x=i.split('_')[0];
 			var y=i.split('_')[1];
    		luozi(x,y,(qizi[i]=='black')?true:false);
  			//kaiguan = (qizi[i] == 'black')?true:false;//使用图片的
  		}
 		 
 	} */
  //重置    将缓存清除
  /*var reset=document.querySelector('.reset');
  	reset.onclick=function(){
  		///alert(2);
		localStorage.clear();
		location.reload();
 	}
*/









 	
 
  

}