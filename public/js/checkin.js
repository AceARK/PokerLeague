// 1. We have data about users that have registered -> sequelize queries 
// to pull players with flag player_registered for tournament_id = $("tournament_id on /checkin in html-routes
// a. Get user_id from players where tournament_id = req.params.tournament_id.
// b. store that, and for each of the user_ids, get usernames

// SELECT username from USERS inner join PLAYERS ON player_id = user_id WHERE tournament_id = req.params.id AND 



// SELECT Userid from Players where tournament_id = req.params.id
