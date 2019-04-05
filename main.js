function updateScores(usernames,scores) {
	for (i=0; i<usernames.length; i++) {
		user={'username':usernames[i],'score':scores[usernames[i]]};
		var user_string ={};
		user_string=JSON.stringify(user);
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() { };
		xhttp.open("GET", 'update_users.php?update_scores=true&user_string='+user_string, false);
		xhttp.send();
	}	
}

function calculateScores(sessions,usernames) {
	var scores={};
	for (i=0; i<users.length; i++) {
		scores[usernames[i]]=0;
	};
	for (i=0; i<sessions.length; i++) {
		var game_name=sessions[i]['game_name'];
		var state=JSON.parse(sessions[i]['state']);
		var setup=JSON.parse(sessions[i]['setup']);
		var score=window['score_'+game_name](setup,state);
		scores[setup['player1']]=scores[setup['player1']]+parseInt(score['player1']);
		scores[setup['player2']]=scores[setup['player2']]+parseInt(score['player2']);
	}

	return scores;
}

function gameOver(sessions) {
	for (i=0; i<sessions.length; i++) {
		var game_name=sessions[i]['game_name'];
		var session_id=sessions[i]['id'];
		var state=JSON.parse(sessions[i]['state']);
		var setup=JSON.parse(sessions[i]['setup']);
		var new_state=window['gameOver_'+game_name](setup,state,'player1',state);
		var new_state_string=JSON.stringify(new_state);
		
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() { };
		xhttp.open("GET", 'update_sessions.php?session_id='+session_id+'new_state_string='+new_state_string, false);
		xhttp.send();
	}
}

function deleteSession(session_id) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { };
	xhttp.open("GET", 'delete_sessions.php?session_id='+session_id, false);
	xhttp.send();	
}


function createGame(game_name,players) {
//	var session=window['new_'+game_name](['player1','player2']);
//	var all_players_string = JSON.stringify(all_players);	
	
//	window.location.href = 'create_sessions.php?session_string='+session_string
//		+'&game_name='+game_name
//		+'&all_players_string='+all_players_string;

	var players_string = JSON.stringify(players);
	var session=window['new_'+game_name](players);
	var session_string = JSON.stringify(session);
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { };
	xhttp.open("GET", 'create_sessions.php?session_string='+session_string
		+'&game_name='+game_name
		+'&players_string='+players_string, false);
	xhttp.send();
}

function createGameBatch(game_name,all_players) {
	for (i=0; i < all_players.length; i++) {
		createGame(game_name,all_players[i]);
	}
}

function preparePlayers(participants,game_name,num_players) {
	participants=shuffle(participants);
	var all_players=Array();
	for (i=1; i<=Math.floor(participants.length/num_players); i++) {
		var players=Array();
		all_players[i-1]=participants.slice((i-1)*num_players,i*num_players);
	}
	return all_players;
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function executeFunctionByName(functionName, context , args ) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}
