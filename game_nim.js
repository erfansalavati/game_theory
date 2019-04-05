game_name='nim';
<!------------------------------------------------------------------------------------>
<!--                                 Setup Preview                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_nim(setup,player){
		var setup_div= document.createElement("div");
		setup_div.style.backgroundColor="lightyellow";
		var par=document.createElement("p");
		par.innerText="Game: Nim";
		setup_div.appendChild(par);
//		var par=document.createElement("p");
//		par.innerText="Player 1: "+setup.player1;
//		setup_div.appendChild(par);
//		var par=document.createElement("p");
//		par.innerText="Player 2: "+setup.player2;
//		setup_div.appendChild(par);
		return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>

function stateContent_nim(setup,state,player) {
	var npiles=setup.npiles;
	var nchips=state.nchips;
	var maxchips=setup.maxchips;
	var state_div= document.createElement("div");
	state_div.id="state_div";
	var table=document.createElement("TABLE");
	state_div.appendChild(table);
	for (i = 0;i<=maxchips; i++) {
		var tr=table.insertRow();
		for (j = 0;j < npiles; j++) {
			var td = tr.insertCell();
//			td.appendChild(document.createTextNode('    '));
			td.style.width='4em';
			td.style.height='4em';			
			td.style.border = "thick solid white";
			if ((i>=maxchips-nchips[j])&(i<maxchips)) {
				td.style.backgroundColor='GoldenRod';
			}
			if (i==maxchips) {
				td.innerText=j+1;
				td.align='center';
			}
		}
	};
	return state_div;
};
<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_nim(setup,state,player) {
	turn=state.turn;
	var action_div=document.createElement("div");
	action_div.id="action_div";
	if (turn!=player) {
		action_div.innerHTML="It is not your turn!";
		return {action_div:action_div,input:null};
	} else {
		action_div.style.backgroundColor="lightgreen";
		var table=document.createElement("table");
		table.border=1;
		action_div.appendChild(table);
		var tr=table.insertRow();
		var td = tr.insertCell();
		td.innerText="Choose the pile and the number of chips";
		var td = tr.insertCell();
		var pile_input=document.createElement("input");
		pile_input.id="pile_input";
		pile_input.type="number";
		pile_input.value="";
		pile_input.name="pile_input";
		td.appendChild(pile_input);
		var td = tr.insertCell();
		var chips_input=document.createElement("input");
		chips_input.id="chips_input";
		chips_input.type="number";
		chips_input.value="";
		chips_input.name="chips_input";
		td.appendChild(chips_input);
		var td = tr.insertCell();
		var send_but=document.createElement("button");
		td.appendChild(send_but);
		send_but.innerHTML="Send";


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
		
		send_but.onclick=function() {
			button.click();
		}
		
		


	var input={pile:pile_input,chips:chips_input};
	return {action_div:action_div,input:input};
	}
}
	
	function getAction_nim(input) {
		action={chosen_pile:input.pile.value,chosen_chips:input.chips.value};
	return action;
}
	function validate_nim(setup,state,player,action) {
		var npiles=setup.npiles;
		var nchips=state.nchips;
		var chosen_pile=parseInt(action.chosen_pile);
		var chosen_chips=parseInt(action.chosen_chips);
		if (isNaN(chosen_pile)|isNaN(chosen_chips)) return false;		
		return ((nchips[chosen_pile-1]>=chosen_chips)&(chosen_chips>0)&(chosen_pile>0)&(chosen_pile<=npiles));
	}

	function newState_nim(setup,state,player,action) {
		state.turn=(state.turn=='player1') ? 'player2' : 'player1';
		var nchips=state.nchips;
		var chosen_pile=action.chosen_pile;
		var chosen_chips=action.chosen_chips;
		nchips[chosen_pile-1]=nchips[chosen_pile-1]-chosen_chips;
		state.nchips=nchips;
		return state;
	};

function composeState_nim(old_state,new_state) {
	return new_state;
};

function refresh_nim(setup,old_state,player,get_state) {
		return(!(JSON.stringify(old_state.nchips)==JSON.stringify(get_state.nchips)));
};

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function score_nim(setup,state) {
	return ((state.turn=='player1') ? ({player1:0,player2:1}) :({player1:1,player2:0}));
};

function gameOver_nim(setup,state,player,get_state){
	if (get_state.turn==player) {return false;}
	else {
		var other_player=(player=='player1')? 'player2' : 'player1';
		var npiles=setup.npiles;
		var turn=other_player;
		var nchips=new Array(npiles).fill(0);
		return {turn:turn, nchips:nchips};
	}
}


function new_nim(players){
	npiles=5;
	nchips=[Math.floor((Math.random() * 5) + 3),Math.floor((Math.random() * 4) + 2),Math.floor((Math.random() * 3) + 2),Math.floor((Math.random() * 5) + 3),Math.floor((Math.random() * 4) + 1)];
	maxchips=getMaxOfArray(nchips);	
	var game_name='nim';
	var setup = {player1:players[0], player2:players[1], npiles:npiles, nchips:nchips, maxchips:maxchips};
	var state={turn:'player1', nchips:nchips};
	var session={setup:setup,state:state};
	return session;
}
