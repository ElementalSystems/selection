function start()
{
  createLevel();
  

}

var board=0;


function createLevel()
{
   board=document.getElementsByClassName('board')[0];
   var items=board.getElementsByClassName('piece');
   var text="";
   var baseElCount=items.length;
   for (var i=0;i<baseElCount;i+=1) {
       var item=items[i];
	   var count=item.getAttribute('data-duplicate-count');
	   if (count==undefined) count=1;
	   for (var j=0;j<count;j+=1) {
	     var nitem=item.cloneNode(true);
	     nitem.style.marginLeft=String(Math.random()*(board.clientWidth-item.clientWidth))+'px';
	     nitem.style.marginTop=String(Math.random()*(board.clientHeight-item.clientHeight))+'px';
		 nitem.style.zIndex=String(Math.round(Math.random()*100));
	     board.appendChild(nitem);
       }	   
   }
}