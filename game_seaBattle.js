game_name='seaBattle';
cell_size=80;

<!------------------------------------------------------------------------------------>
<!--                                 Setup Preview                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_seaBattle(setup,player){
	var setup_div= document.createElement("div");
	setup_div.style.backgroundColor="lightyellow";
	var par=document.createElement("p");
	par.innerText="Game Name: Sea Battle";
	setup_div.appendChild(par);
	var par=document.createElement("p");
	par.innerText="You are the "+((player=='player1')? 'Bomber' : 'Submarine')+".";
	setup_div.appendChild(par);

	return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>

function stateContent_seaBattle(setup,state,player) {
	var otherplayer=(player=='player1')? 'player2' : 'player1';
	var state_div= document.createElement("div");
	state_div.id='state_div';
	var active_cell=[-1, -1];
	chosen_cell=null;

	if(!state.game_over && checkFinished_seaBattle(setup,state,player)) gameOver_seaBattle(setup,state,'player1',state);

	var chosen_cells_input=document.createElement("input");
	state_div.appendChild(chosen_cells_input);
	chosen_cells_input.id="chosen_cells_input";
	chosen_cells_input.type="hidden";
	chosen_cells_input.value="";
	
	var canvas=document.createElement("canvas");
	var ctx=canvas.getContext("2d");
	canvas.style.position='relative';
	canvas.style.top='0px';
	canvas.style.left='20px';
	canvas.width='850';
	canvas.height='600';
	canvas.id='canvas';
	canvas.onmousedown = "";
	canvas.onmousemove = "";

	state_div.appendChild(canvas);
	
	drawBoard(canvas,setup,state,player,active_cell,chosen_cell);


	return state_div;
};

function drawBoard(canvas,setup,state,player,active_cell,chosen_cell) {
	var size=setup.size;
	var scale=(size+1/3)/(14+1/3);
	r=cell_size;
	
	var ctx = canvas.getContext("2d");
//	player=(player=='player1')?0:1;
	ctx.clearRect(0, 0, 850, 600);
	ctx.lineWidth = 1;

	ctx.fillStyle = "rgb(0,154,172)";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo((size+1)*r, 0);
	ctx.lineTo((size+1)*r, (size+1)*r);
	ctx.lineTo(0, (size+1)*r);
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle = "white";

	var size=setup.size;
//	alert(state.game_over);
	for(var y=0; y<size; y++) {
		for(var x=0; x<size; x++) {
			if(state.chosens.player1.x==x && state.chosens.player1.y==y && (state.game_over||player=='player1')) {
				ctx.fillStyle = "rgb(255,0,39)";
			} else if(state.chosens.player2.x1==x && state.chosens.player2.y1==y && (state.game_over||player=='player2')) {
				ctx.fillStyle = "rgb(0,154,172)";
			} else if(state.chosens.player2.x2==x && state.chosens.player2.y2==y && (state.game_over||player=='player2')) {
				ctx.fillStyle = "rgb(0,154,172)";
			} else if(chosen_cell!=null && x == chosen_cell[0] && y == chosen_cell[1]) {
				ctx.fillStyle = "rgb(0,154,172)";
			} else if(x == active_cell[0] && y == active_cell[1]) {
				ctx.fillStyle = "rgb(" + (x+(player=='player1'?241:0)) + "," + (y+(player=='player1'?0:140)) + "," + (player=='player1'?38:171) + ")";
			} else {
				ctx.fillStyle = "rgb(" + (x+241) + "," + (y+220) + ",178)";
			}
			drawSquare(ctx, x , y , r);
		}
	}
}

function drawSquare(ctx, x, y, r) {
	ctx.beginPath();
	ctx.moveTo(r/2+r*x,r/2+r*y);
	ctx.lineTo(r/2+r*(x+1),r/2+r*y);
	ctx.lineTo(r/2+r*(x+1),r/2+r*(y+1));
	ctx.lineTo(r/2+r*x,r/2+r*(y+1));
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_seaBattle(setup,state,player) {
	var action_div=document.createElement("div");
	action_div.id="action_div";

	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");

	if(checkFinished_seaBattle(setup,state,player)) gameOver_seaBattle(setup,state,'player1',state);

	if ((player=='player1' && state.chosens.player1.x != null) || (player=='player2' && state.chosens.player2.x2 != null) || state.game_over) {
		action_div.innerHTML="";
		return {action_div:action_div,input:null};
	} else {
		
		action_div.style.backgroundColor="lightgreen";
		
		var form=document.createElement("form");
		action_div.appendChild(form);
		form.id="submit_form";
		form.method="post";
		form.onsubmit="";
		form.action="";


		var new_state_input=document.createElement("input");
		form.appendChild(new_state_input);
		new_state_input.name="new_state_string";
		new_state_input.type="hidden";
		new_state_input.value="";
		var session_id_input=document.createElement("input");
		form.appendChild(session_id_input);
		session_id_input.name="session_id";
		session_id_input.type="hidden";
		session_id_input.value="";
		var button=document.createElement("input");
		form.appendChild(button);
		button.type="submit";
		button.id="submit_but";
		button.text="Submit";

		
		canvas.onmousemove = function(event) {
			var active_cell=getCell(event,ctx);
			drawBoard(canvas,setup,state,player,active_cell,chosen_cell);
		}

		canvas.onmousedown = function(event) {
			var active_cell=getCell(event,ctx);
			var chosen_cells_input=document.getElementById("chosen_cells_input");
			if (active_cell[0]==-1 && active_cell[0]==-1) {
				alert("The input is not valid.");
			} else {
				if (player=='player1') {
					chosen_cells_input.value=JSON.stringify({x:active_cell[0],y:active_cell[1]});
					button.click();
				} else if (chosen_cell==null) {
					chosen_cell=active_cell;
	//				drawBoard(canvas,setup,state,player,active_cell,chosen_cell);
				} else if (!adjacentCell(active_cell,chosen_cell)) {
					alert("The input is not valid.");
				} else {
					chosen_cells_input.value=JSON.stringify({x1:chosen_cell[0],y1:chosen_cell[1],x2:active_cell[0],y2:active_cell[1]});				
	//				drawBoard(canvas,setup,state,player,active_cell,chosen_cell);
					button.click();
				}
			}
//		alert(chosen_cells_input.value);
		}

		var input=document.getElementById('chosen_cells_input');
		
		return {action_div:action_div,input:input};

		}
}
function adjacentCell(cell1,cell2) {
	return (Math.abs(cell1[0]-cell2[0])+Math.abs(cell1[1]-cell2[1])==1);
}
function getCell(e,ctx) {
	top_margin=document.getElementById('state_div').getBoundingClientRect().top;
	left_margin=document.getElementById('state_div').getBoundingClientRect().left;
//	alert([left_margin,top_margin,e.clientX,e.clientY]);
	var color = ctx.getImageData(e.clientX-left_margin-20, e.clientY-top_margin, 1, 1).data;
	color[0] -= color[2]==38||color[2]==178 ? 241 : 0;
	color[1] -= color[2]==178 ? 220 : (color[2]==38 ? 0 : 140);
	if(color[0] >= 0 && color[0] <= 13 && color[1] >= 0 && color[1] <= 13 && (color[2] == 38 || color[2] == 171 || color[2] == 178))
	active_cell = [color[0], color[1]];
	else
	active_cell = [-1, -1];
	return active_cell;
}

function validate_seaBattle(setup,state,player,action) {
	return true;
}

function getAction_seaBattle(input) {
	var chosen=JSON.parse(input.value);
	var action=chosen;
	return action;
}


function newState_seaBattle(setup,state,player,action) {
	var chosen=action;
	state.chosens[player]=chosen;
	return state;
}

	
function score_seaBattle(setup,state) {
//	var new_state=gameOver_seaBattle(setup,state,'player1',state);
//	if (new_state==false) new_state=state;
	var score={player1: 0, player2: 0};
	if(state.game_over) {
		if(state.chosens['player1'].x==null && state.chosens['player2'].x2==null ) {
			score={player1: 0, player2: 0};
		} else if(state.chosens['player1'].x!=null && state.chosens['player2'].x2==null ) {
			score={player1: 1, player2: -1};
		} else if (state.chosens['player1'].x==null && state.chosens['player2'].x2!=null ) {
			score={player1: -1, player2: 1};
		} else if (state.chosens.player1.x==state.chosens.player2.x1 && state.chosens.player1.y==state.chosens.player2.y1) {
			score={player1: 1, player2: -1};
		} else if (state.chosens.player1.x==state.chosens.player2.x2 && state.chosens.player1.y==state.chosens.player2.y2) {
			score={player1: 1, player2: -1};
		}
	} else {
		if(state.chosens['player1'].x==null || state.chosens['player2'].x2==null ) {
			score={player1: 0, player2: 0};
		} else if(state.chosens.player1.x==state.chosens.player2.x1 && state.chosens.player1.y==state.chosens.player2.y1) {
			score={player1: 1, player2: -1};
		} else if (state.chosens.player1.x==state.chosens.player2.x2 && state.chosens.player1.y==state.chosens.player2.y2) {
			score={player1: 1, player2: -1};
		}
	}
	return score;
}


function refresh_seaBattle(setup,old_state,player,get_state) {
		return(!(JSON.stringify(old_state)==JSON.stringify(get_state)));
}


function composeState_seaBattle(old_state,new_state) {
//	alert(JSON.stringify(old_state));
//	alert(JSON.stringify(new_state));
	var state=new_state;		
	state.chosens={player1: ((new_state.chosens.player1.x==null) ? old_state.chosens.player1 : new_state.chosens.player1)
	,player2: ((new_state.chosens.player2.x2==null) ? old_state.chosens.player2 : new_state.chosens.player2)};
	return state;
};

function checkFinished_seaBattle(setup,state,player) {
	return (state.chosens['player1'].x!=null && state.chosens['player2'].x2!=null)
}

function isGameOver_seaBattle(setup,state,player,get_state){
	return (get_state.game_over);	
}

function gameOver_seaBattle(setup,state,player,get_state){
	var new_state=get_state;
//	if (get_state.chosens['player1'].x!=null && get_state.chosens['player2'].x2!=null) return false;
//	if (get_state.chosens['player1'].x==null) {new_state.not_played.player1=true};
//	if (get_state.chosens['player2'].x2==null) {new_state.not_played.player2=true};
	new_state.game_over=true;
	return new_state;
}

function new_seaBattle(players){
	var size=3;

	var setup ={player1:players[0], player2:players[1], size:size};
	var state={chosens:{player1:{x:null,y:null}, player2:{x1:null,y1:null,x2:null,y2:null}},game_over:false};
	var session={setup:setup,state:state};
	return session;
};
