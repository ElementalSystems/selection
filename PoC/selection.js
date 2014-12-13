
var game={};

function start()
{
  game.board=document.getElementById('board');
  game.scoreSpan=document.getElementById('score');
  game.foundCountSpan=document.getElementById('foundcount');
  game.totalCountSpan=document.getElementById('totalcount');
  game.timeLeftSpan=document.getElementById('timeleft');  
  game.oneRuleSpan=document.getElementById('onerule');    
  game.score=0;
  createLevel('lev1'); 
}

function setScoreboard()
{
  game.scoreSpan.innerHTML=Number(game.score);
  game.foundCountSpan.innerHTML=Number(game.foundCount);
  game.totalCountSpan.innerHTML=Number(game.totalCount);
  game.timeLeftSpan.innerHTML=Number((game.timeEnd-game.timeNow)/1000);    
}


function TargetClicked(event)
{
  game.board.removeChild(event.currentTarget);
  game.score+=1;
  game.foundCount+=1;
}

function NonTargetClicked(event)
{
  game.score-=1;
  game.board.removeChild(event.currentTarget);
}

function timerTick()
{
  game.timeNow=new Date().getTime();
  //check for status
  setScoreboard();
  setTimeout(timerTick,250);
}

function createLevel(level)
{
   var lev=document.getElementById(level);   
   var items=lev.getElementsByClassName('piece');
   game.oneRuleSpan.innerHTML=lev.getElementsByClassName('rule')[0].innerHTML;
   game.levelDefinition=lev;
   game.innerHTML="";
   game.totalCount=0;
   game.foundCount=0;
   game.timeInit=new Date().getTime();
   game.timeStart=game.timeInit+5000;
   game.timeEnd=game.timeStart+30000;
   game.inPlay=false;
   
   for (var i=0;i<items.length;i+=1) {
       var item=items[i];
	   var count=item.getAttribute('data-duplicate-count');
	   if (count==undefined) count=1;
	   for (var j=0;j<count;j+=1) {
	     var nitem=item.cloneNode(true);
		 game.board.appendChild(nitem);
	     nitem.style.marginLeft=String(Math.random()*(game.board.clientWidth-100))+'px';
	     nitem.style.marginTop=String(Math.random()*(game.board.clientHeight-100))+'px';
		 nitem.style.zIndex=String(Math.round(Math.random()*100));
	     if (nitem.classList.contains('target'))  {
		   nitem.onmousedown=TargetClicked;
		   game.totalCount+=1;
         } else
		   nitem.onmousedown=NonTargetClicked;		 
       }	   
   }
   setTimeout(timerTick,10);
}



