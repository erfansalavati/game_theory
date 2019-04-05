game_name='chomp';
<!------------------------------------------------------------------------------------>
<!--                                 Setup Preview                                  -->
<!------------------------------------------------------------------------------------>

function setupContent_chomp(setup,player){
		var setup_div= document.createElement("div");
		setup_div.style.backgroundColor="lightyellow";
		var par=document.createElement("p");
		par.innerText="Game Name: Chomp";
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Player 1: "+setup.player1;
		setup_div.appendChild(par);
		var par=document.createElement("p");
		par.innerText="Player 2: "+setup.player2;
		setup_div.appendChild(par);
		return setup_div;
}

<!------------------------------------------------------------------------------------>
<!--                                 State Content                                  -->
<!------------------------------------------------------------------------------------>

function stateContent_chomp(setup,state,player) {
	var squares=state.squares;
	var nrows=setup.nrows;
	var ncols=setup.ncols;
	var state_div= document.createElement("div");
	state_div.id="state_div";
	//	state_div.style.display="block";
	var table=document.createElement("TABLE");
	state_div.appendChild(table);
	for (i = 1;i <= nrows; i++) {
		var tr=table.insertRow();
		for (j = 1;j <= ncols; j++) {
		var td = tr.insertCell();
//			td.appendChild(document.createTextNode('    '));
			td.style.width='4em';
			td.style.height='4em';			
			td.style.border = '1px solid black';
			if (squares[i][j]) {
				td.style.backgroundColor='brown';
			}
		}
	};
	return state_div;
};
<!------------------------------------------------------------------------------------>
<!--                                 Action Content                                 -->
<!------------------------------------------------------------------------------------>

function actionContent_chomp(setup,state,player) {
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
		td.innerText="Choose a row and column number";
		var td = tr.insertCell();
		var button=document.createElement("button");
		button.id="submit";
		button.onclick="";
		button.innerText="Submit";
		td.appendChild(button);
		var td = tr.insertCell();
		var row_input=document.createElement("input");
		row_input.id="chosen_row";
		row_input.type="number";
		row_input.value="";
		row_input.name="chosen_row";
		td.appendChild(row_input);
		var td = tr.insertCell();
		var col_input=document.createElement("input");
		col_input.id="chosen_col";
		col_input.type="number";
		col_input.value="";
		col_input.name="chosen_col";
		td.appendChild(col_input);
		
		
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

		var input={row:row_input,col:col_input};
		return {action_div:action_div,input:input};
	}
}
	
	function getAction_chomp(input) {
		action={chosen_row:input.row.value,chosen_col:input.col.value};
	return action;
}
	function validate_chomp(setup,state,player,action) {
		var squares=state.squares;
		chosen_row=action.chosen_row;
		chosen_col=action.chosen_col;
		if (isNaN(chosen_row)|isNaN(chosen_col)) return false;		
		chosen_row=parseInt(chosen_row);
		chosen_col=parseInt(chosen_col);
		return squares[chosen_row][chosen_col];
	}

	function newState_chomp(setup,state,player,action) {
		state.turn=(state.turn=='player1') ? 'player2' : 'player1';
		var nrows=setup.nrows;
		var ncols=setup.ncols;
		var squares=state.squares;
		for (i = 1;i <=nrows; i++) {
			for (j=1;j<=ncols; j++) {
				if ((i>=chosen_row)&(j>=chosen_col)) {squares[i][j]=false}
			};
		};
		state.squares=squares;
		return state;
	};

function composeState_chomp(old_state,new_state) {
	return new_state;
};


function refresh_chomp(setup,old_state,player,get_state) {
		return(!(JSON.stringify(old_state.squares)==JSON.stringify(get_state.squares)));
};


function score_chomp(setup,state) {
	return((state.turn='player1') ? ({player1:0,player2:1}) :({player1:1,player2:0}));
};

function new_chomp(players){
	nrows=4;
	ncols=5;

	var game_name='chomp';
	var setup = {player1:players[0], player2:players[1], nrows:nrows, ncols:ncols};
	var squares= Array(nrows+1);
	for (i = 1; i <= nrows; i++) {
		squares[i] = Array(ncols+1);
		for (j = 1; j <= ncols; j++) {
			squares[i][j]=true;
		};
	};
	squares[1][1]=false;
	var state={turn:'player1', squares:squares};
	var session={setup:setup,state:state};
	return session;
}
