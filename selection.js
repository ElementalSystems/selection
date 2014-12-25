
var game={};
//game status values
// 0 - starting round
// 1 - end play
// 2 - end of round

function start(levelselectors,medalscore,roundLength)
{
  game.status=0
  game.medals=medalscore;
  game.rounds=generateRounds(levelselectors);
  //execute generator from parameters
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
  game.roundLength=roundLength;
  game.round=-1;
  game.roundcount=game.rounds.length;
  
  if (game.holder.classList.contains('start'))
	  game.holder.classList.remove('start');	
  
  
  nextRound()
}

function generateRounds(selectors)
{
  var rounds=[];
  for (var i=0;i<selectors.length;i+=1) {
    var full=".leveldefinition"+selectors[i];
    var list=document.querySelectorAll(full);    
	var ch=0;
	for (var j=0;j<10;j+=1) {
	  ch=Math.floor(Math.random()*list.length);
	  var rnd=list[ch];
	  if (rounds.indexOf(rnd)<0) break; //we didn't already use it	so use it
	}
	rounds.push(list[ch]);
  }
  return rounds;
}

function nextRound()
{
  game.round+=1;
  
  document.getElementById('completebonus').innerHTML='';	   
  document.getElementById('timebonus').innerHTML='';	   

  createLevel(game.rounds[game.round]);
  	
}

function showSummary()
{
	if (!game.holder.classList.contains('summary'))
		  game.holder.classList.add('summary');	
    //set up fields
	document.getElementById('gs_score').innerHTML=Number(game.score);
	document.getElementById('gs_goldlevel').innerHTML=Number(game.medals[2]);
	document.getElementById('gs_silverlevel').innerHTML=Number(game.medals[1]);
	document.getElementById('gs_bronzelevel').innerHTML=Number(game.medals[0]);
	
	var mClass='none';
	var mText='No Medal Awarded';
	if (game.score>=game.medals[2]) {
	  mClass='gold';
	  mText='Gold Medal';	  
	} else if (game.score>=game.medals[1]) {
	  mClass='silver';
	  mText='Silver Medal';	  
	} else if (game.score>=game.medals[0]) {
	  mClass='bronze';
	  mText='Bronze Medal';	  
	}
	document.getElementById('gs_medal').innerHTML=mText;
	
	var sum=document.getElementById('gamesummary');
	if (sum.classList.contains('gold')) sum.classList.remove('gold');
	if (sum.classList.contains('silver')) sum.classList.remove('silver');
	if (sum.classList.contains('bronze')) sum.classList.remove('bronze');
	sum.classList.add(mClass);
}

function showStart()
{
    if (game.holder.classList.contains('summary'))
		  game.holder.classList.remove('summary');	
	if (!game.holder.classList.contains('start'))
		  game.holder.classList.add('start');	
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
		if (game.holder.classList.contains('gameover'))
		  game.holder.classList.remove('gameover');
		game.status=1; //in play now
     }
   }
  else if (game.status==1) {
     if ((game.timeNow>game.timeEnd)||(game.foundCount>=game.totalCount)) { //End of round
	   endOfRound();
     }
  }
  setScoreboard();
  setTimeout(timerTick,500);    
}

function endOfRound()
{
	if (game.holder.classList.contains('inplay'))
	  game.holder.classList.remove('inplay');
	if (!game.holder.classList.contains('roundover'))
	  game.holder.classList.add('roundover');		  
	if (game.round==game.rounds.length-1) 
	  if (!game.holder.classList.contains('gameover'))
		game.holder.classList.add('gameover');		  

	if (game.foundCount>=game.totalCount) {
	   document.getElementById('completebonus').innerHTML='  (+3 Completion Bonus)';	   
	   game.score+=3;
	}
	
	var timeBonus=Math.round((game.timeEnd-game.timeNow)/2000);
	if (timeBonus>0) {
	   document.getElementById('timebonus').innerHTML='  (+'+Number(timeBonus)+' Bonus)';	   
	   game.score+=timeBonus;
	}	
	game.status=2;//game ended

}

function createLevel(lev)
{
   game.items=lev.getElementsByClassName('piece');
   game.itemGenerate=0;
   game.oneRuleSpan.innerHTML=lev.getElementsByClassName('rule')[0].innerHTML;
   game.levelDefinition=lev;
   game.board.innerHTML="";
   game.totalCount=0;
   game.foundCount=0;
   game.timeInit=new Date().getTime();
   game.timeStart=game.timeInit+5000;
   game.timeEnd=game.timeStart+game.roundLength*1000;
   game.status=0;
   
   createLevelItems();
   
   game.board.appendChild(game.goodHitIndicator);
   game.board.appendChild(game.badHitIndicator);
   game.goodHitIndicator=document.getElementById('goodhit');
   game.badHitIndicator=document.getElementById('badhit');  
   
   setTimeout(timerTick,10);
   if (game.holder.classList.contains('roundover'))
		  game.holder.classList.remove('roundover');
	
}

function createLevelItems()
{
   var more=false;
   for (var i=0;i<game.items.length;i+=1) {
	   var item=game.items[i];
	   var count=item.getAttribute('data-duplicate-count');	   
	   if (count==undefined) count=1;
	   if (game.itemGenerate>=count) continue;
	   more=true;
	   var nitem=item.cloneNode(true);
	   game.board.appendChild(nitem);
	   nitem.style.marginLeft=String(Math.random()*(game.board.clientWidth*.8))+'px';
	   nitem.style.marginTop=String(Math.random()*(game.board.clientHeight*.8))+'px';
	   nitem.style.zIndex=String(Math.round(Math.random()*100));
	   if (nitem.classList.contains('target'))  {
		   nitem.onmousedown=TargetClicked;
		   game.totalCount+=1;
	   } else {
		   nitem.onmousedown=NonTargetClicked;		 
	   }	   
   }
   game.itemGenerate+=1;
   if (more) setTimeout(createLevelItems,500);
}



