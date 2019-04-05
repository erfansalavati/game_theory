game_name='volunteering';
<!------------------------------------------------------------------------------------>
<!--                                 Setup Preview                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_volunteering(setup,player){
	var setup_div= document.createElement("div");
	setup_div.style.backgroundColor="lightyellow";
	var par=document.createElement("p");
	par.innerText="Game Name: Volunteering";
	setup_div.appendChild(par);
	var par=document.createElement("p");
	par.innerText="You are player "+((player=='player1')? 1 : 2)+".";
	setup_div.appendChild(par);

	return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>

function stateContent_volunteering(setup,state,player) {
	var otherplayer=(player=='player1')? 'player2' : 'player1';
	var state_div= document.createElement("div");
	
	var table=document.createElement("TABLE");
	state_div.appendChild(table);
	for (i = 0;i<=setup.nchoices['player1']; i++) {
		var tr=table.insertRow();
		for(j=0;j<=setup.nchoices['player2'];j++) {
			var td = tr.insertCell();
			td.style.width='4em';
			td.style.height='4em';
			td.style.border = '1px solid black';
			td.style.textAlign='center';
			if(i==0) {
				if (j!=0) td.innerText=setup.choices['player2'][j-1];
			}

			if(j==0) {
				if (i!=0) td.innerText=setup.choices['player1'][i-1];
			}
			
			if((i!=0)&(j!=0)) {
				var chosens={player1: setup.choices.player1[i-1], player2: setup.choices.player2[j-1]};
				td.innerText=payoffs_volunteering(setup,chosens)['player1']+' , '+payoffs_volunteering(setup,chosens)['player2'];		
				if (JSON.stringify(chosens)==JSON.stringify(state.chosens)) {
					td.style.backgroundColor='brown';
				}
			}
		}
	};
	
	
	if (state.chosens[player]==null) {
		state_div.appendChild(document.createTextNode("You have not made your choice yet!"));
	} else {
		state_div.appendChild(document.createTextNode('Your choice: '+state.chosens[player]));
		if (state.chosens[otherplayer]!=null) {
			state_div.appendChild(document.createElement('br'));
			state_div.appendChild(document.createTextNode('Your payoff: '+payoffs_volunteering(setup,state.chosens)[player]));
		};
	};
	return state_div;
};
<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_volunteering(setup,state,player) {
	var action_div=document.createElement("div");
	action_div.id="action_div";
	
	var button=document.createElement("input");
	button.type="submit";
	button.id="submit_but";
	button.text="Submit";

	if (state.chosens[player]!=null) {
		action_div.innerHTML="";
		return {action_div:action_div,input:null};
	} else {
	action_div.style.backgroundColor="lightgreen";
	var choices_div=document.createElement("div");
	action_div.appendChild(choices_div);
	var chosen_action_input=document.createElement("input");
	action_div.appendChild(chosen_action_input);
	chosen_action_input.type="hidden";
	chosen_action_input.value="";

	var actions_table= document.createElement("table");
	actions_table.border=1;
	choices_div.appendChild(actions_table);
	
	for (var i=0; i<setup.nchoices[player]; i++) {
		var tr=actions_table.insertRow();
		var action_button=document.createElement("button");
		tr.appendChild(action_button);
		action_button.innerHTML=setup.choices[player][i];
		action_button.value=setup.choices[player][i];
		action_button.onclick=function() {
			chosen_action_input.value=this.value;
			button.click();
		}
		var breakline=document.createElement("br");
		choices_div.appendChild(breakline);
	}


	
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
	form.appendChild(button);

	
	
	var input=chosen_action_input;
	return {action_div:action_div,input:input};
	}
	
}

function getAction_volunteering(input) {
	var input_value;
	input_value = input.value;
	action={chosen:input_value};
return action;
}

function validate_volunteering(setup,state,player,action) {
	return (setup.choices[player].includes(action.chosen));
}

function newState_volunteering(setup,state,player,action) {
	var chosen=action.chosen;
	state.chosens[player]=chosen;
	
	return state;
};

	
function payoffs_volunteering(setup,chosens){
	var p1ChosenInd=setup.choices['player1'].indexOf(chosens['player1']);
	var p2ChosenInd=setup.choices['player2'].indexOf(chosens['player2']);
	var payoff={player1:setup.payoff_matrix[p1ChosenInd*setup.nchoices['player1']+p2ChosenInd][0],
				player2:setup.payoff_matrix[p1ChosenInd*setup.nchoices['player1']+p2ChosenInd][1]};
	return payoff;
}

function score_volunteering(setup,state) {
	var score={player1: 0, player2: 0};
	if(checkFinished_volunteering(setup,state,'player1')){
		score = payoffs_volunteering(setup,state.chosens);
	}
	return score;
};


function refresh_volunteering(setup,old_state,player,get_state) {
		if (get_state.chosens[player]==null) return false;
		else 
		return(!(JSON.stringify(old_state)==JSON.stringify(get_state)));
};


function composeState_volunteering(old_state,new_state) {
//	alert(JSON.stringify(old_state));
//	alert(JSON.stringify(new_state));
	if((old_state.chosens.player1!=new_state.chosens.player1)&(old_state.chosens.player1!=null)&(new_state.chosens.player1!=null)){
		return null;
	} else if((old_state.chosens.player2!=new_state.chosens.player2)&(old_state.chosens.player2!=null)&(new_state.chosens.player2!=null)){
		return null;
	} else {
		var state=new_state;
		state.chosens={player1: ((new_state.chosens.player1==null) ? old_state.chosens.player1 : new_state.chosens.player1)
		,player2: ((new_state.chosens.player2==null) ? old_state.chosens.player2 : new_state.chosens.player2)};
		return state;
	}
};

function checkFinished_volunteering(setup,state,player) {
	return (state.chosens['player1']!=null && state.chosens['player2']!=null);
}

function isGameOver_volunteering(setup,state,player,get_state){
	return (get_state.game_over);
}

function gameOver_volunteering(setup,state,player,get_state){
	var new_state=get_state;
	new_state.game_over=true;
	return new_state;
}

function new_volunteering(players){
	var nchoices={player1:2,player2:2};
	var choices={player1:['silent','volunteer'],player2:['silent','volunteer']};
	var payoff_matrix=[[-10,-10],[0,-2],
					   [-2,0],[-1,-1]];

	var setup = {player1:players[0], player2:players[1], nchoices:nchoices, choices:choices, payoff_matrix:payoff_matrix};
	var state={chosens:{player1:null, player2:null},game_over:false};
	var session={setup:setup,state:state};
	return session;
};
