// On click of register ->
// Get tournament id, user id
// Do a put request
// In api-routes -> do a query for any entries with tournament id and user id given.
// If yes, update it, if not, create one.

$(document).ready(function() {
	$(".registerUnregister").on("click", function(event) {
		event.preventDefault();
		var tournamentId = $(this).attr("data-tournamentId");
		var userId = $(this).attr("data-userId");
		// console.log("Inside register on click function.");
		var queryData = {
			"userId": userId,
			"tournamentId": tournamentId
		}
		// console.log("Gonna call ajax put.");
		var thisButton = $(this);
		thisButton.attr('disabled', true);
		
		if(thisButton.hasClass('register')) {
			$.ajax({
		      method: "PUT",
		      url: "/register/tournament",
		      data: queryData
		    })
		    .done(function(data) {
		    	// console.log(data);
		    	var currentTournament = thisButton.parent();
		    	// console.log(currentTournament);
		    	thisButton.remove();
		    	currentTournament.append("<button class='registerUnregister btn btn-lg btn-danger unregister' data-userId='" + userId + "' data-tournamentId = '" + tournamentId + "'>Unregister</button>");
		    	$("#registeredTournamentsList").append(currentTournament);
		    }).fail(function(data) {
		    	thisButton.attr('disabled', false);
		    	thisButton.parent().append("<p>Registration failed. Retry.</p>");
		    });
		}else if(thisButton.hasClass('unregister')) {
			$.ajax({
		      method: "PUT",
		      url: "/unregister/tournament",
		      data: queryData
		    })
		    .done(function(data) {
		    	// console.log(data);
		    	var currentTournament = thisButton.parent();
		    	// console.log(currentTournament);
		    	thisButton.remove();
		    	currentTournament.append("<button class='registerUnregister btn btn-lg btn-success register' data-userId='" + userId + "' data-tournamentId = '" + tournamentId + "'>Register</button>");
		    	$("#unregisteredTournamentsList").append(currentTournament);
		    }).fail(function(data) {
		    	thisButton.attr('disabled', false);
		    	thisButton.parent().append("<p>Unregistering failed. Retry.</p>");
		    });
		}
	});
});