$(document).ready(function() {

if(sessionStorage.length === 0 ) {
	$.get("/loggedIn", function(data) {
		if(data.loggedIn){
			console.log(data);
		sessionStorage.userEmail = data.uniqueID[0];
		sessionStorage.role = data.uniqueID[1];
		sessionStorage.userID = data.uniqueID[2];
		sessionStorage.username = data.uniqueID[3];
		console.log(sessionStorage);
		}
	
	});
}
	// Tournament buttons functionality
// Edit button shows all edit buttons
$("#tournamentsList").on("click", ".tournamentData>.edit", function(event) {
	event.preventDefault();
	// Enable edit and remove non-editable css class
	$(this).parent().find(".editBoxes").attr('disabled', false).removeClass("non-editable");
	console.log("Edit enabled");
	// Get values from fields
	var date = $(this).parent().find(".tournamentDate").val();
	var time = $(this).parent().find(".tournamentTime").val();
	// console.log(moment(date, "ll").format("YYYY MM DD"));
	// Change textboxes to date and time types respectively with a formatted value recognizable by those types
	$(this).parent().find(".tournamentDate").attr('type', 'date').attr("value", moment(date, "ll").format("YYYY-MM-DD"));
	$(this).parent().find(".tournamentTime").attr('type', 'time').attr("value", moment(time, "hh:mm A").format("HH:mm"));
	// Hide the edit button
	$(this).hide();
	// Toggle display of Update, Delete and Undo edit buttons
	$(this).parent().find(".editButtons").toggleClass("hidden");
});
// Undo Edit button hides edit buttons and shows Edit button
$("#tournamentsList").on("click", ".tournamentData>.undoEditClick", function() {
	event.preventDefault();
	console.log("Undo edit");
	// Get new values from fields
	var date = $(this).parent().find(".tournamentDate").val();
	var time = $(this).parent().find(".tournamentTime").val();
	// Change textboxes back to text type with a value formatted back to original displayed format
	$(this).parent().find(".tournamentDate").attr('type', 'text').attr("value", moment(date, "YYYY-MM-DD").format("ll"));
	$(this).parent().find(".tournamentTime").attr('type', 'text').attr("value", moment(time, "HH:mm").format("LT"));
	// Disable edit and add non-editable css class
	$(this).parent().find(".editBoxes").attr('disabled', true).addClass("non-editable");
	// Show the edit button
	$(this).parent().children(".edit").show();
	// Toggle display of Update, Delete and Undo edit buttons
	$(this).parent().children(".editButtons").toggleClass("hidden");
});

// Update button puts modifies db data

// Delete buttons removes that tournament from db data

 
$("#logoutButton").on("click", function(){
	sessionStorage.clear();
});

	$(".non-editable").attr('disabled', true);
});




