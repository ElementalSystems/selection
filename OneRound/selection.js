
var game={
  status:0,
  rounds: ['lev_col3','lev_col4','lev_col6','lev_col7','lev_col8']
  };
//game status values
// 0 - starting round
// 1 - end play
// 2 - end of round

function start()
{
  
  game.holder=document.getElementById('game');
  game.board=document.getElementById('board');
  game.scoreSpan=document.getElementById('score');
  game.foundCountSpan=document.getElementById('foundcount');
  game.totalCountSpan=document.getElementById('totalcount');
  game.timeLeftSpan=document.getElementById('timeleft');  
  game.timePrompt=document.getElementById('timeprompt');  
  game.oneRuleSpan=document.getElementById('onerule');    
  game.thisRoundSpan=document.getElementById('roundnumber');
  game.totalRoundSpan=document.getElementById('roundtotal');
  game.goodHitIndicator=document.getElementById('goodhit');
  game.badHitIndicator=document.getElementById('badhit');  
  game.score=0;
  game.round=-1;
  game.roundcount=game.rounds.length;
  nextRound()
}

function nextRound()
{
  game.round+=1;
  createLevel(game.rounds[game.round]);
  	
}

function setScoreboard()
{
  game.scoreSpan.innerHTML=Number(game.score);
  game.thisRoundSpan.innerHTML=Number(game.round+1);
  game.totalRoundSpan.innerHTML=Number(game.rounds.length);
  
  game.foundCountSpan.innerHTML=Number(game.foundCount);
  game.totalCountSpan.innerHTML=Number(game.totalCount);
  if (game.status==0) {
    game.timePrompt.innerHTML="Starting in...";
    game.timeLeftSpan.innerHTML=Number(Math.round((game.timeStart-game.timeNow)/1000));    
  }
  if (game.status==1) {
    game.timePrompt.innerHTML="Time Left";
    game.timeLeftSpan.innerHTML=Number(Math.round((game.timeEnd-game.timeNow)/1000));    
  }  
}


function centerIndicator(x,y,ind)
{
  ind.style.left=(x-ind.offsetWidth/2)+'px';
  ind.style.top=(y-ind.offsetHeight/2)+'px';
  if (ind.classList.contains('active'))
    ind.classList.remove('active');
  setTimeout(function(){
    ind.classList.add('active');	
  },10);
}

function TargetClicked(event)
{
  game.board.removeChild(event.currentTarget);
  game.score+=1;
  game.foundCount+=1;
  
  centerIndicator(event.clientX,event.clientY,game.goodHitIndicator);
  
}

function NonTargetClicked(event)
{
  game.score-=1;
  game.board.removeChild(event.currentTarget);
  centerIndicator(event.clientX,event.clientY,game.badHitIndicator);

}

function timerTick()
{
  game.timeNow=new Date().getTime();
  //check for status
  if (game.status==0)  { //starting up
    if (game.timeNow>game.timeStart) { //start of round
	    if (!game.holder.classList.contains('inplay'))
		  game.holder.classList.add('inplay');
		if (game.holder.classList.contains('roundover'))
		  game.holder.classList.remove('roundover');
		game.status=1; //inplay now
     }
   }
   else if (game.status==1) {
     if ((game.timeNow>game.timeEnd)||(game.foundCount>=game.totalCount)) { //start of round
	    if (game.holder.classList.contains('inplay'))
		  game.holder.classList.remove('inplay');
		if (!game.holder.classList.contains('roundover'))
		  game.holder.classList.add('roundover');		  
		game.status=2;//game ended
     }
  }
  setScoreboard();
  setTimeout(timerTick,500);    
}

function createLevel(level)
{
   var lev=document.getElementById(level);   
   var items=lev.getElementsByClassName('piece');
   game.oneRuleSpan.innerHTML=lev.getElementsByClassName('rule')[0].innerHTML;
   game.levelDefinition=lev;
   game.board.innerHTML="";
   game.totalCount=0;
   game.foundCount=0;
   game.timeInit=new Date().getTime();
   game.timeStart=game.timeInit+5000;
   game.timeEnd=game.timeStart+20000;
   game.status=0;
   
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
   game.board.appendChild(game.goodHitIndicator);
   game.board.appendChild(game.badHitIndicator);
   game.goodHitIndicator=document.getElementById('goodhit');
   game.badHitIndicator=document.getElementById('badhit');  
   
   setTimeout(timerTick,10);
   if (game.holder.classList.contains('roundover'))
		  game.holder.classList.remove('roundover');
	
}



