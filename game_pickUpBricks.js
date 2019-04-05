game_name='pickUpBricks';
<!------------------------------------------------------------------------------------>
<!--                                 Setup Content                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_pickUpBricks(setup,player){
		var setup_div= document.createElement("div");
		setup_div.style.backgroundColor="lightyellow";
		var par=document.createElement("p");
		par.innerText="Game Name: Number Reduction";
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Player 1: "+setup.player1;
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Player 2: "+setup.player2;
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Initial Number: "+setup.init_num;
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Modulus Number: "+setup.modulus;
		setup_div.appendChild(par);
		return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>


function stateContent_pickUpBricks(setup,state,player) {
	var state_div= document.createElement("div");
	state_div.id="state_div";
	var par=document.createElement("p");
	par.innerText="Last Number: "+state.last_num;
	state_div.appendChild(par);
	var par=document.createElement("p");
	par.innerText="Turn: "+state.turn;
	state_div.appendChild(par);
	
	return state_div;
};
<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_pickUpBricks(setup,state,player) {
	var action_div=document.createElement("div");
	action_div.id="action_div";
	if (state.turn!=player) {
		action_div.innerHTML="It is not your turn!";
		return {action_div:action_div,input:null};
	} else {
		var table=document.createElement("table");
		table.border=1;
		action_div.appendChild(table);
		var tr=table.insertRow();
		var td = tr.insertCell();
		td.innerText="Choose a number between "+Math.max((state.last_num-setup.modulus),0)+" and "+Math.max((state.last_num-1),0);;
		var td = tr.insertCell();
		number_input=document.createElement("input");
		number_input.id="chosen_number";
		number_input.type="number";
		number_input.value="";
		number_input.name="chosen_number";
		td.appendChild(number_input);
		var td = tr.insertCell();
		var button=document.createElement("button");
		button.id="submit";
		button.onclick="";
		button.innerText="Submit";
		td.appendChild(button);
	
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

		var input=number_input;
		return {action_div:action_div,input:input};
	}
}

<!------------------------------------------------------------------------------------>
<!--                                 Action Choose                                 -->
<!------------------------------------------------------------------------------------>

	function getAction_pickUpBricks(input) {
		action={chosen_number:input.value};
		return action;
	}
	

	function validate_pickUpBricks(setup,state,player,action) {
		chosen_number=action.chosen_number;
//		alert(chosen_number);
//		alert((chosen_number <Math.max((state.last_num-setup.modulus),0)) || (chosen_number > Math.max((state.last_num-1))));
		return(!((chosen_number <Math.max((state.last_num-setup.modulus),0)) || (chosen_number > Math.max((state.last_num-1)))));
	}

	
	function newState_pickUpBricks(setup,state,player,action) {
		chosen_num=action.chosen_num;
		state.turn=(state.turn=='player1') ? 'player2' : 'player1';
		state.last_num=chosen_number;
		return state;
	};

function composeState_pickUpBricks(old_state,new_state) {
		return new_state;
};

function refresh_pickUpBricks(setup,old_state,player,get_state) {
		return(!(JSON.stringify(old_state.last_num)==JSON.stringify(get_state.last_num)));
};

function score_pickUpBricks(setup,state) {
	return ((state.turn='player1') ? ({player1:0,player2:1}) :({player1:1,player2:0}));
};

function new_pickUpBricks(players){
//		var players=<?php echo($players_string); ?>;
	var setup = {player1:players[0], player2:players[1], init_num:20, modulus:4};
	var state = {last_num:20, turn:'player1'};
//		var players = [setup.player1,setup.player2];
	var session={setup:setup,state:state};
	return session;
};
