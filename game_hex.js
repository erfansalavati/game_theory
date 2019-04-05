

game_name='hex';
<!------------------------------------------------------------------------------------>
<!--                                 Setup Preview                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_hex(setup,player){
	var setup_div= document.createElement("div");
	setup_div.style.backgroundColor="lightyellow";
	var par=document.createElement("p");
	par.innerText="Game Name: Hex";
	setup_div.appendChild(par);
	var par=document.createElement("p");
	par.innerText="You are player "+((player=='player1')? 1 : 2)+".";
	setup_div.appendChild(par);

	return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>

function stateContent_hex(setup,state,player) {
	var otherplayer=(player=='player1')? 'player2' : 'player1';
	var state_div= document.createElement("div");
	state_div.id='state_div';
	var sel=[-1, -1];


	var chosen_cell_row_input=document.createElement("input");
	var chosen_cell_col_input=document.createElement("input");
	state_div.appendChild(chosen_cell_row_input);
	state_div.appendChild(chosen_cell_col_input);
	chosen_cell_row_input.id="chosen_cell_row_input";
	chosen_cell_row_input.type="hidden";
	chosen_cell_col_input.id="chosen_cell_col_input";
	chosen_cell_col_input.type="hidden";

	
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
	
	drawBoard(canvas,setup,state,player,sel);


	
//	if (state.turn==player) {
//		state_div.appendChild(document.createTextNode("Choose a cell."));
//	} else {
//		state_div.appendChild(document.createTextNode('It is not your turn'));
//	};
	return state_div;
};


function drawBoard(canvas,setup,state,player,sel) {
	var r=setup.rad;
	var w= r*2*(Math.sqrt(3)/2);
	var length=setup.length;
	var scale=(length+1/3)/(14+1/3);
	var board=state.board;
	var ctx = canvas.getContext("2d");
	player=(player=='player1')?0:1;
	ctx.clearRect(0, 0, 850, 600);
	ctx.lineWidth = 1;

	ctx.fillStyle = "rgb(0,154,172)";
	ctx.beginPath();
	ctx.moveTo(w+w*14.65*scale, 2*r+(-r)*scale);
	ctx.lineTo(w+w*22.5*scale, 2*r+22.5*r*scale);
	ctx.lineTo(w+(-w)*scale, 2*r+(-r)*scale);
	ctx.lineTo(w+w*6.85*scale, 2*r+22.5*r*scale);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = "rgb(255,0,39)";
	ctx.beginPath();
	ctx.moveTo(w+(-w)*scale, 2*r+(-r)*scale);
	ctx.lineTo(w+w*14.65*scale, 2*r+(-r)*scale);
	ctx.lineTo(w+w*6.85*scale, 2*r+22.5*r*scale);
	ctx.lineTo(w+w*22.5*scale, 2*r+22.5*r*scale);
	ctx.closePath();
	ctx.fill();

	var num = 0;
	ctx.strokeStyle = "white";
	var length=setup.length;
	for(var y=0; y<length; y++) {
		for(var x=0; x<length; x++) {
			if(board[x][y] == 0)
			ctx.fillStyle = "rgb(255,0,39)";
			else if(board[x][y] == 1)
			ctx.fillStyle = "rgb(0,154,172)";
			else if(x == sel[0] && y == sel[1])
			ctx.fillStyle = "rgb(" + (x+(player==0?241:0   )) + "," + (y+(player==0?0:140)) + "," + (player==0?38:171) + ")";
			else
			ctx.fillStyle = "rgb(" + (x+241) + "," + (y+220) + ",178)";
			drawHexagon(ctx, (x+y)*w - y*(w/2)+2*w, y*1.5*r+3*r, r);
			num++;
		}
	}
}

function drawHexagon(ctx, x, y, r) {
	ctx.beginPath();
	ctx.moveTo(x, y-r);
	for(var i=0; i<6; i++)
		ctx.lineTo(x+r*Math.cos(Math.PI*(1.5+1/3*i)), y+r*Math.sin(Math.PI*(1.5+1/3*i)));
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}




<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_hex(setup,state,player) {
	var action_div=document.createElement("div");
	action_div.id="action_div";

	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");
	
	var p1 = checkWin(setup,state,'player1');
	var p2 = checkWin(setup,state,'player2');
	if(p1 != false) {drawPath(canvas,setup,p1);}
	else if(p2 != false) { drawPath(canvas,setup, p2); }

	if ((state.turn!=player)|(p1 != false)|(p2 != false)) {
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
			var sel=getCell(event,ctx);
			drawBoard(canvas,setup,state,player,sel);
		}

		canvas.onmousedown = function(event) {
			var sel=getCell(event,ctx);
			var chosen_cell_row_input=document.getElementById("chosen_cell_row_input");
			var chosen_cell_col_input=document.getElementById("chosen_cell_col_input");
			chosen_cell_row_input.value=sel[0];
			chosen_cell_col_input.value=sel[1];
			button.click();
		}

		var input={row:document.getElementById('chosen_cell_row_input'),
					col:document.getElementById('chosen_cell_col_input')};
		return {action_div:action_div,input:input};
	}
}

function getCell(e,ctx) {
	top_margin=document.getElementById('state_div').getBoundingClientRect().top;
	left_margin=document.getElementById('state_div').getBoundingClientRect().left;

	var color = ctx.getImageData(e.clientX-left_margin-20, e.clientY-top_margin, 1, 1).data;
	color[0] -= color[2]==38||color[2]==178 ? 241 : 0;
	color[1] -= color[2]==178 ? 220 : (color[2]==38 ? 0 : 140);
	if(color[0] >= 0 && color[0] <= 13 && color[1] >= 0 && color[1] <= 13 && (color[2] == 38 || color[2] == 171 || color[2] == 178))
	sel = [color[0], color[1]];
	else
	sel = [-1, -1];
	return sel;
}

function drawPath(canvas,setup,p) {
var r=setup.rad;
var w=r*2*(Math.sqrt(3)/2);
var ctx = canvas.getContext("2d");

ctx.lineWidth = 10;
ctx.beginPath();
ctx.moveTo((p[0][0]+p[0][1])*w - (p[0][1]-4)*(w/2), (p[0][1]+2)*1.5*r);
for(var i=1; i<p.length; i++)
ctx.lineTo((p[i][0]+p[i][1])*w - (p[i][1]-4)*(w/2), (p[i][1]+2)*1.5*r);
ctx.stroke();
}


function getAction_hex(input) {
	action={row:input.row.value,col:input.col.value};
return action;
}

function validate_hex(setup,state,player,action) {
	return ((action.row !=-1)&(action.col !=-1));
}

function newState_hex(setup,state,player,action) {
	var sel=[action.row,action.col];
	var board=state.board;
	if(sel[0] != -1 && sel[1] != -1) {
		board[sel[0]][sel[1]] = (player=='player1')?0:1;
	}
	state.board=board;
	state.turn=(state.turn=='player1')?'player2':'player1';
	return state;
};


function findArr(a, b)
{
for(var i=0; i<a.length; i++)
if(JSON.stringify(a[i]) == JSON.stringify(b))
return i;
return -1;
}

function getConnections(board,x, y, c, open, closed) {
	length=board.length;
	var a = [-1, 0, 1, 0, 0, -1, 0, 1, 1, -1, -1, 1];
	var ret = [];
	for(var i=0; i<6; i++)
	if(x+a[i*2] >= 0 && x+a[i*2] < length && y+a[i*2+1] >= 0 && y+a[i*2+1] < length)
	if(board[x+a[i*2]][y+a[i*2+1]] == c && findArr(open, [x+a[i*2],y+a[i*2+1]]) == -1 && findArr(closed, [x+a[i*2],y+a[i*2+1]]) == -1)
	ret.push([x+a[i*2],y+a[i*2+1]]);
	return ret;
}

	
function checkWin(setup,state,player) {
	var c=(player=='player1')?0:1;
	var length=setup.length;
	var board=state.board;

	var open = [], openPrev = [], closed = [], closedPrev = [];
	for(var a=0; a<length; a++) {
		if(board[c==0?a:0   ][c==0?0:a] == c) {
			open.length = openPrev.length = closed.length = closedPrev.length = 0;
			var pathFound = false;
			open.push([c==0?a:0   , c==0?0:a]);
			openPrev.push(-1);
			while(open.length > 0) {
				var u = open[0];
				open.splice(0, 1);
				var uI = openPrev.splice(0, 1);
				closed.push(u);
				closedPrev.push(uI);
				if(u[c==0?1:0   ] == length-1) {
					pathFound = true;
					break;
				}
				var connections = getConnections(board,u[0], u[1], c, open, closed);
				for(var i=0; i<connections.length; i++) {
					open.push(connections[i]);
					openPrev.push(closed.length-1);
				}
			}
			if(pathFound) {
				var path = [];
				var u = closed.length-1;
				while(closedPrev[u] != -1) {
					path.push(closed[u]);
					u = closedPrev[u];
				}
				path.push([c==0?a:0   , c==0?0:a]);
				path.reverse();
				active = false;
				return path;
			}
		}
	}
	return false;
}


	
	
function score_hex(setup,state) {
	var score={player1: 0, player2: 0};
	var turn=state.turn;
	var p1=(checkWin(setup,state,'player1')!=false);
	var p2=(checkWin(setup,state,'player2')!=false);
	if ((!p1)&(!p2)) {
		var not_turn=(turn=='player1')?'player2':'player1';
		score[turn]=-1;
		score[not_turn]=1;
	} else {
		score.player1=p1?1:-1;
		score.player2=p2?1:-1;
	}
	return score;
};

function composeState_hex(old_state,new_state) {
		return new_state;
};

function refresh_hex(setup,old_state,player,get_state) {
		return(!(JSON.stringify(old_state.board)==JSON.stringify(get_state.board)));
};


function new_hex(players){
	var length=4;
	var radius=20;
	var board=new Array(length);
	for(var i=0; i<length; i++) {
		board[i] = new Array(length);
		for(var j=0; j<length; j++)
		board[i][j] = -1;
	}
	
	var setup = {player1:players[0], player2:players[1], length:length, rad:radius};
	var state={turn:'player1',board:board};
	var session={setup:setup,state:state};
	return session;
};


