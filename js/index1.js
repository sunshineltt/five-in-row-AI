window.onload=function(){
	var canvas=document.querySelector('#canvas');
	var ctx=canvas.getContext('2d');
  	var ROW=15;//棋盘星点  位置数据	//棋牌横竖的循环绘制
	var qizi={};//用空对象 来做字典
 	//var kaiguan=true;//标识  该 谁洛子
 	kaiguan = localStorage.x?false:true;

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
 	 var luozi=function(x,y,color){
 		var zx=40*x+20.5;
 		var zy=40*y+20.5;
	     var black=ctx.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
		black.addColorStop(0.1,'#555');
		black.addColorStop(1,'black');

		var white=ctx.createRadialGradient(zx-5,zy-5,1,zx,zy,18);
		white.addColorStop(0.1,'#fff');
		white.addColorStop(1,'#eee');
		 
		ctx.fillStyle=color?black:white;	
		//kaiguan=!kaiguan;	 
		ctx.beginPath();
		ctx.arc(zx,zy,18,0,Math.PI*2);
		ctx.fill();
	}
 
//用图片的方法
/*	var sucai=document.querySelector('#sucai');
	var luozi=function(x,y,color){
		var zx=40*x+2.5;
 		var zy=40*y+2.5;
 		if(color){
 			ctx.drawImage(sucai,0,0,44,44,zx,zy,38,38);
 		}else{
 			ctx.drawImage(sucai,48,0,44,44,zx,zy,38,38);
  		}
  	}
 */
	
	var kaiguan=localStorage.x?false:true;
	canvas.onclick=function(e){
 		//console.log(e.offsetX);
		var x=Math.round((e.offsetX-20.5)/40);
		var y=Math.round((e.offsetY-20.5)/40);
		//luozi(x,y,true);
 		if(qizi[x+'_'+y]){return;}
 		luozi(x,y,kaiguan);
		qizi[x+'_'+y]=kaiguan?'black':'white'; //下划线  键  的目的：用于
		
		if(kaiguan){
			if(panduan(x,y,'black')){
				alert('黑子赢');
				if(confirm('再来一局？')){
 					localStorage.clear();
 					location.reload();
					qizi={};
 					kaiguan=true;
					return;
				}else{
					canvas.onclick=null;
				}
			}
		}else{
			if(panduan(x,y,'white')){
				alert('白子赢');
				if(confirm('再来一局？')){
					localStorage.clear();
 					location.reload();
 					qizi={};
 					kaiguan=true;
					return;
				}else{
					canvas.onclick=null;
				}
			}
		}


 		kaiguan=!kaiguan;
		console.log(kaiguan);
  		localStorage.data=JSON.stringify(qizi);
   		if(!kaiguan){
			localStorage.x=1;
		}else{
			localStorage.removeItem('x');
		}

	}
	//悔棋   回退一步
	var regret=document.querySelector('.regret');
	regret.onclick=function(){
		alert(1)
		var newqizi={};
		for(var i in qizi){
			if(i!=(x+'_'+y)){
				newqizi[i]=qizi[i];
			}
		}
		qizi = newqizi;
        kaiguan = !kaiguan;
        ctx.clearRect(x*40+3,y*40+3,35,35);
	} 

 	var xy2id=function(x,y){return x+'_'+y;}//返回当前棋子的位置
 	
 	//判断是否成功
  	var panduan=function(x,y,color){
 		var shuju=filter(color);
 		var tx,ty,hang=1;shu=1;zuoxie=1;youxie=1;//tx,ty
 		tx=x;ty=y;while(shuju[xy2id(tx-1,ty)]){tx--;hang++};
 		tx=x;ty=y;while(shuju[xy2id(tx+1,ty)]){tx++;hang++};
 		if(hang>=5){return true;}

 		tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
	    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
	    if(shu >= 5){return true};

	    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
	    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
	    if(zuoxie >= 5){return true};

	    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
	    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
	    if(youxie >= 5){return true};
	 }


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
  	if(localStorage.data){
 		qizi=JSON.parse(localStorage.data);
 		for(var i in qizi){	//X_Y;
 			var x=i.split('_')[0];
 			var y=i.split('_')[1];
    		luozi(x,y,(qizi[i]=='black')?true:false);
  			//kaiguan = (qizi[i] == 'black')?true:false;//使用图片的
  		}
 		 
 	} 
 	//重置    将缓存清除
  /*var reset=document.querySelector('.reset');
  	reset.onclick=function(){
  		alert(2)
		localStorage.clear();
		location.reload();
 	}*/
 	document.ondblclick=function(){
    	localStorage.clear();
    	location.reload();
    }
 	

}