// Ranked data -----------------------------------------------
var timeout;
function loadRanked( uuid, div, cat){

    loadData().then(function(result) {
        if (result) {
            
            const rdata = findtourData(tourData, uuid, div, cat);
            const { tournament, division, category } = rdata;

            const single = category.single;

            $("#page_name").html(`${lang.rank} / ${category.name}`);
            $("#breadc").html(`
            <li class="breadcrumb-item text-muted"><a href="${url}" class="text-muted text-hover-primary">${lang.home}</a></li>
                <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
                <li class="breadcrumb-item text-muted"><a href="${url}/tournaments" class="text-muted text-hover-primary">${lang.tour}</a></li>
                <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
                <li class="breadcrumb-item text-muted"><a href="${url}/d/${uuid}/${div}" class="text-muted text-hover-primary">${division.name}</a></li>`);

            var clas = '';
            const sl = category.schedule.length;
            // console.log(JSON.stringify(category));
            if(sl === 0){
                var warn = `
                <div class="d-flex flex-row flex-column-fluid" style="height: calc(100vh - 230px);">
                    <div class="d-flex flex-row-fluid flex-center">
                        <div class="w-100 d-block text-center mw-300px">
                            <i class="fa-duotone fa-triangle-exclamation text-warning fs-5tx mb-5"></i>
                            <div class="d-block w-100 fs-3 fw-bold">${lang.teamsmiss} <a href="${url}/cal/${uuid}/${div}" class="fw-bold">${lang.assign}</a></div>
                        </div>
                    </div>
                </div>`;
                $('#clasif').html(warn);
            }else{
                $('#clasif').html(`<div class="col-12 fs-1 fw-bold mb-10">${lang.clasif}</div>`);
                $('#scores').html('');
                console.log(check());
                
                // if(!check()){
                    var cols;
                    var column;
                    var colb;

                    if(single){
                        switch (category.groups[0].teams.length) {
                            case 4:
                                cols = ['semifinalg', 'finalg'];
                                column = 6;
                                break;
                            case 6:
                                cols = ['semifinalg', 'finalg', 'final'];
                                column = 4;
                                break;
                            case 8:
                                cols = ['semifinalg', 'finalg', 'semifinal', 'final'];
                                column = 6;
                                break;
                            case 10:
                                cols = ['quarterg', 'semifinalg', 'finalg', 'final'];
                                column = 4;
                                break;
                            case 12:
                                cols = ['quarterg', 'semifinalg', 'finalg', 'semifinal', 'final'];
                                column = 4;
                                break;
                            case 14:
                                cols = ['quarterg', 'semifinalg', 'finalg', 'quarter', 'semifinal', 'final'];
                                column = 4;
                                break;
                            case 16:
                                cols = ['quarterg', 'semifinalg', 'finalg', 'quarter', 'semifinal', 'final'];
                                column = 4;
                                break;
                            case 18:
                                cols = ['octag', 'quarterg', 'semifinalg', 'finalg', 'final'];
                                column = 3;
                                break;
                            case 20:
                                cols = ['octag', 'quarterg', 'semifinalg', 'finalg', 'semifinal', 'final'];
                                column = 3;
                                break;
                            case 24:
                                cols = ['octag', 'quarterg', 'semifinalg', 'finalg', 'quarter', 'semifinal', 'final'];
                                column = 3;
                                break;
                        }
                    }else{
                        if (sl === 2){
                            cols = ['final'];
                        }else if (sl === 4 || sl === 5){
                            cols = ['semifinal', 'final'];
                        }else if (sl === 7){
                            cols = ['quarter', 'semifinal', 'final'];
                        }
                    }

                    if(single){
                        colb = column;
                    }else{
                        colb = (12 / cols.length);
                    }

                    var scoresRow = document.getElementById("scores");
                    cols.forEach((col_value, index) => {
                        // Create the main column div
                        var colDiv = document.createElement("div");
                        colDiv.className = `col-lg-${colb} col-sm-6 col-md-4 col-12 d-flex flex-column flex-row-auto`;
                    
                        // Create the header row
                        var headerRow = document.createElement("div");
                        headerRow.className = "row justify-content-center align-items-center text-center";
                        headerRow.id = "header";
                        var headerCol = document.createElement("div");
                        headerCol.className = "col-12 pb-10";
                        var headerSpan = document.createElement("span");
                        headerSpan.className = "fw-bold fs-2";
                        headerSpan.textContent = lang[col_value];
                    
                        headerCol.appendChild(headerSpan);
                        headerRow.appendChild(headerCol);
                    
                        // Create the content row
                        var contentRow = document.createElement("div");
                        contentRow.className = "row d-flex flex-column-fluid justify-content-center align-items-center text-center";
                        contentRow.id = col_value;
                    
                        // Append the header and content rows to the main column div
                        colDiv.appendChild(headerRow);
                        colDiv.appendChild(contentRow);
                    
                        // Append the main column div to the "scores" row
                        scoresRow.appendChild(colDiv);
                    });
                // };
                var allteams = [];

                category.groups.forEach((gp) => {
                    gp.teams.forEach((t) => {
                        allteams.push(t);
                    });
                });

                category.schedule.forEach((g, i) => {
                    g.rounds.forEach((r,ri) => {
                        r.forEach((match, mi) => {
                            const event = division.calendar?.events?.find(event => event.id === match[0].id) || null;
                            const monthAbbreviations = [
                                "jan", "feb", "mar", "apr", "may", "jun",
                                "jul", "aug", "sep", "oct", "nov", "dec"
                            ];
                            var start;
                            if (event){
                                const inputDate = new Date(event.start);
                                const monthIndex = inputDate.getMonth();
                                const year = inputDate.getFullYear().toString().substr(-2);
                                const day = inputDate.getDate();
                                const hour = inputDate.getHours();
                                const minute = inputDate.getMinutes();
                                start = `${day} ${monthAbbreviations[monthIndex]} '${year}, @ ${hour}:${minute < 10 ? '0' : ''}${minute} ${hour >= 12 ? 'p.m.' : 'a.m.'}`;
                            }else{
                                start = 'undefined';
                            }

                            const team1 = match[0].games[0];
                            const team2 = match[0].games[1];

                            const name1 = (!lang[team1.team]) ? category.teams[team1.teamid] : lang[team1.team];
                            const name2 = (!lang[team2.team]) ? category.teams[team2.teamid] : lang[team2.team];

                            const tdata1 = teamsData.find(team => team.id === team1.teamid);
                            const tdata2 = teamsData.find(team => team.id === team2.teamid);

                            const field = (!event) ? `<div class="py-3"><a href="${url}/cal/${uuid}/${div}" class="fw-bold">${lang.define}</a></div>` : `<div class="fw-bold">${event.field} ${lang.round} ${ri + 1}</div><div>${start}</div>`;

                            if(tdata1){
                                if(tdata1.pic){
                                    var icon = `<img alt="Pic" src="${url}/${tdata1.pic}" width="38px" height="38px" style="border-radius:40px;">`;
                                }else{
                                    var icon = `<i class="fa-regular fa-futbol fs-1"></i>`;
                                }
                            }else{
                                var icon = `<i class="fa-regular fa-futbol fs-1"></i>`;
                            }

                            if(tdata2){
                                if(tdata2.pic){
                                    var icon2 = `<img alt="Pic" src="${url}/${tdata2.pic}" width="38px" height="38px" style="border-radius:40px;">`;
                                }else{
                                    var icon2 = `<i class="fa-regular fa-futbol fs-1"></i>`;
                                }
                            }else{
                                var icon2 = `<i class="fa-regular fa-futbol fs-1"></i>`;
                            }

                            var score1 = (team1.result) ? team1.result : '';
                            var score2 = (team2.result) ? team2.result : '';

                            var score1w = (!score1) ? 'bg-light-warning' : '';
                            var score2w = (!score2) ? 'bg-light-warning' : '';

                            const gteam = (g.group !== 'quarter' && g.group !== 'semifinal' && g.group !== 'final' && g.group !== 'octag' && g.group !== 'quarterg' && g.group !== 'semifinalg' && g.group !== 'finalg') ? `<span class="badge badge-light-primary me-2">${g.group}</span>` : '';

                            const input1 = (g.group !== 'quarter' && g.group !== 'semifinal' && g.group !== 'final' && g.group !== 'octag' && g.group !== 'quarterg' && g.group !== 'semifinalg' && g.group !== 'finalg') ? `<span class="input-group-text border-bottom-0" style="width: calc(100% - 78px);">${gteam} ${name1}</span>` : `<select class="form-select input-group-text rounded-0 border-bottom-0" data-match="${match[0].id}" data-index="${i}" data-round="${ri}" data-set="${mi}" data-team="0" name="inputTeam">${getOptions(team1.teamid, team1.team)}</select>`;
                            const input2 = (g.group !== 'quarter' && g.group !== 'semifinal' && g.group !== 'final' && g.group !== 'octag' && g.group !== 'quarterg' && g.group !== 'semifinalg' && g.group !== 'finalg') ? `<span class="input-group-text" style="width: calc(100% - 78px);">${gteam} ${name2}</span>` : `<select class="form-select input-group-text rounded-0" data-match="${match[0].id}" data-index="${i}" data-round="${ri}" data-set="${mi}" data-team="1" name="inputTeam">${getOptions(team2.teamid, team2.team)}</select>`;

                            function getOptions(selected, current) {
                                let options = '';
                                // Add an option for null teamid
                                options += `<option value="" ${selected === null ? 'selected' : ''}>${current}</option>`;
                                // Add options for all teams
                                allteams.forEach(team => {
                                    options += `<option value="${team.teamid}" ${team.teamid === parseInt(selected) ? 'selected' : ''}>${category.teams[team.teamid]}</option>`;
                                });
                                return options;
                            }
                            var matches = `
                            <div class="col-12 border rounded p-0 mb-3 border-primary bg-light-primary">
                                <div class="input-group input-group-sm mb-0">
                                    <span class="input-group-text w-40px h-40px justify-content-center align-items-center text-center border-bottom-0" style="border-bottom-left-radius: 0px !important;">${icon}</span>
                                    ${input1}
                                    <input class="input-group-text w-40px border-bottom-0 ${score1w}" id="${team1.teamid}" data-match="${match[0].id}" data-index="${i}" data-round="${ri}" data-set="${mi}" data-team="0" name="score" style="border-bottom-right-radius: 0px !important;" placeholder="-" value="${score1}" maxlength="2" size="1">
                                </div>
                                <div class="input-group input-group-sm mb-0">
                                    <span class="input-group-text w-40px h-40px justify-content-center align-items-center text-center" style="border-radius: 0px !important;">${icon2}</span>
                                    ${input2}
                                    <input class="input-group-text w-40px ${score2w}" id="${team2.teamid}" data-match="${match[0].id}" data-index="${i}" data-round="${ri}" data-set="${mi}" data-team="1" name="score" style="border-radius: 0px !important;" placeholder="-" value="${score2}" maxlength="2" size="1">
                                </div>
                                <div class="px-4 py-2 text-muted">
                                    ${field}
                                </div>
                            </div>`;
                            
                            if(g.group !== 'octa' && g.group !== 'quarter' && g.group !== 'semifinal' && g.group !== 'final' && g.group !== 'octag' && g.group !== 'quarterg' && g.group !== 'semifinalg' && g.group !== 'finalg'){
                                clas += `
                                <div class="col-lg-3 col-6 col-md-4 mt-1">
                                    <div class="row">
                                        ${matches}
                                    </div>
                                </div>`;
                            }else{
                                // if(!check()){
                                    var tgame = matches ;
                                    $(`#${g.group}`).append(tgame);
                                // }
                            }
                        });
                    });
                });
                $('#clasif').append(clas);
            }

            

            const color1 = "#ecc30b"; // Yellow color
            const color2 = "#000000"; // Black color
            const adjustedColor1 = readability(color1);
            const adjustedColor2 = readability(color2);

            function check(){
                const excludedGroups = ['quarter', 'semifinal', 'final', 'octag', 'quarterg', 'semifinalg', 'finalg'];

                const hasIncompleteResultsFlag = category.schedule.some(group =>
                    !excludedGroups.includes(group.group) &&
                    group.rounds.flat().some(matchups =>
                        matchups.some(game =>
                            game.games.some(({ result }) => result === null || result === "")
                        )
                    )
                );
                createTable();
                return hasIncompleteResultsFlag;
            }

            function createTable(){
                const standingsDiv = document.getElementById('standings');
                $('#standings').html('');
                const groups = category.groups;
                const schedule = category.schedule;

                // Implement tie-breaking functions here
                // Function to compare teams based on accumulated score
                const accumulatedScore = (teamA, teamB) => {
                    if (teamA.points === teamB.points) {
                      return 0; // Tie, move to the next tiebreaker rule
                    }
                    return teamB.points - teamA.points; // Higher points first
                };
                
                // Function to compare teams based on goal difference
                const goalDifference = (teamA, teamB) => {
                    if (teamA.goalDifference === teamB.goalDifference) {
                        return 0; // Tie, move to the next tiebreaker rule
                    }
                    return teamB.goalDifference - teamA.goalDifference; // Higher goal difference first
                };
                
                // Function to compare teams based on direct result
                const directResult = (teamA, teamB, groupSchedule) => {
                    const headToHeadMatch = groupSchedule.rounds.find(round => {
                      const match = round.find(match => {
                        const team1 = match[0].games[0].teamid;
                        const team2 = match[0].games[1].teamid;
                        return (team1 === teamA.teamid && team2 === teamB.teamid) ||
                               (team1 === teamB.teamid && team2 === teamA.teamid);
                      });
                      return match !== undefined;
                    });
                  
                    if (headToHeadMatch) {
                      const result1 = headToHeadMatch[0].games[0].result;
                      const result2 = headToHeadMatch[0].games[1].result;
                  
                      if (result1 !== null && result1 !== "" && result2 !== null && result2 !== "") {
                        const score1 = parseInt(result1);
                        const score2 = parseInt(result2);
                        
                        if (score1 > score2) {
                          return -1; // Team A won the head-to-head match
                        } else if (score1 < score2) {
                          return 1; // Team B won the head-to-head match
                        }
                      }
                    }
                  
                    return 0; // No conclusive result, move to the next tiebreaker rule
                };
                
                
                // Function to compare teams based on productivity
                const productivity = (teamA, teamB) => {
                    if (teamA.goalsFor === teamB.goalsFor) {
                      return 0; // Tie, move to the next tiebreaker rule
                    }
                    return teamB.goalsFor - teamA.goalsFor; // Higher goalsFor first
                };
                
                // Function to compare teams based on penalty shootout
                const penaltyShootout = (teamA, teamB) => {
                    console.log(`Penalty shootout: ${teamA.team} vs ${teamB.team}`);
                    // TODO: Implement logic to simulate penalty shootout and return the result
                    return 0; // Placeholder value, adjust as needed
                }

                const finalResultsByGroups = {};

                const lastGroup = groups[groups.length - 1];
                const penultimateGroup = groups[groups.length - 2];

                if (lastGroup.teams.length === 3 && penultimateGroup.teams.length === 3) {
                    // Remove one team from the last group and add it to the penultimate group
                    const teamToMove = lastGroup.teams.pop(); // Remove the last team from the last group
                    penultimateGroup.teams.push(teamToMove); // Add the team to the penultimate group
                }

                groups.forEach(group => {
                    const groupTable = document.createElement('div');
                    groupTable.className = 'table-responsive mb-10';
                    groupTable.innerHTML = `
                    <div class="card">
                        <div class="card-header"><div class="fs-4 fw-bold card-title">${lang.group} ${group.group}</div></div>
                        <div class="card-body p-5">
                            <table class="table table-rounded mb-0 table-striped border gy-4 gs-7 border-gray-500">
                                <thead>
                                    <tr class="fw-semibold fs-6 text-gray-800 border-bottom border-gray-200">
                                        <th width="2%"></th>
                                        <th width="34%">${lang.team}</th>
                                        <th width="8%">${lang.pg}</th>
                                        <th width="8%">${lang.w}</th>
                                        <th width="8%">${lang.d}</th>
                                        <th width="8%">${lang.l}</th>
                                        <th width="8%">${lang.gf}</th>
                                        <th width="8%">${lang.ga}</th>
                                        <th width="8%">${lang.gd}</th>
                                        <th width="8%">PTS</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    `;

                    const tableBody = groupTable.querySelector('tbody');

                    const teamStats = {};

                    group.teams.forEach(team => {
                        teamStats[team.teamid] = {
                        team: category.teams[team.teamid],
                        id: team.teamid,
                        playedGames: 0,
                        wins: 0,
                        draws: 0,
                        losses: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalDifference: 0,
                        points: 0,
                        };
                    });
                    const groupSchedule = schedule.find(schedGroup => schedGroup.group === group.group);
                    // console.log(groupSchedule);

                    if (groupSchedule) {
                        groupSchedule.rounds.forEach(round => {
                        round.forEach(match => {
                            const team1 = match[0].games[0].teamid;
                            const team2 = match[0].games[1].teamid;
                            const result1 = match[0].games[0].result === null || match[0].games[0].result === "" ? 0 : parseInt(match[0].games[0].result);
                            const result2 = match[0].games[1].result === null || match[0].games[1].result === "" ? 0 : parseInt(match[0].games[1].result);

                            
                            if (match[0].games[0].result !== null && match[0].games[0].result !== "") {
                                teamStats[team1].playedGames += 1;
                            }
                            if (match[0].games[1].result !== null && match[0].games[1].result !== "") {
                                teamStats[team2].playedGames += 1;
                            }
                            if (result1 > result2) {
                                teamStats[team1].points += 3;
                                teamStats[team1].wins += 1;
                                teamStats[team2].losses += 1;
                            } else if (result1 < result2) {
                                teamStats[team2].points += 3;
                                teamStats[team2].wins += 1;
                                teamStats[team1].losses += 1;
                            } else {
                                if (match[0].games[0].result !== null && match[0].games[0].result !== "") {
                                    teamStats[team1].points += 1;
                                    teamStats[team1].draws += 1;
                                }
                                if (match[0].games[1].result !== null && match[0].games[1].result !== "") {
                                    teamStats[team2].points += 1;
                                    teamStats[team2].draws += 1;
                                }
                            }
                    
                            teamStats[team1].goalsFor += result1;
                            teamStats[team1].goalsAgainst += result2;
                            teamStats[team1].goalDifference += result1 - result2;
                    
                            teamStats[team2].goalsFor += result2;
                            teamStats[team2].goalsAgainst += result1;
                            teamStats[team2].goalDifference += result2 - result1;
                        });
                        });
                    }

                    // Define the tiebreaker rules
                    const tiebreakerRules = [
                        accumulatedScore,
                        goalDifference,
                        directResult,
                        productivity,
                        penaltyShootout
                    ];
                    

                    const sortedTeams = Object.values(teamStats).sort((a, b) => {
                        if (a.playedGames === 0 || b.playedGames === 0) {
                          // If either team hasn't played any games, no need to apply tiebreakers
                          return 0;
                        }
                    
                        for (const rule of tiebreakerRules) {
                          const comparison = rule(a, b, groupSchedule);
                          if (comparison !== 0) {
                            return comparison;
                          }
                        }
                        return 0; // If all rules are inconclusive, no change in order
                      });

                    finalResultsByGroups[group.group] = sortedTeams;

                    const tableRows = sortedTeams.map((team, index) => `
                        <tr>
                            <td>${(index + 1)}</td>
                            <td>${team.team}</td>
                            <td>${team.playedGames}</td>
                            <td>${team.wins}</td>
                            <td>${team.draws}</td>
                            <td>${team.losses}</td>
                            <td>${team.goalsFor}</td>
                            <td>${team.goalsAgainst}</td>
                            <td>${team.goalDifference}</td>
                            <td>${team.points}</td>
                        </tr>
                    `).join('');

                    tableBody.innerHTML = tableRows;
                    standingsDiv.appendChild(groupTable);
                });
                // console.log(finalResultsByGroups);
            }

            function replaceParts(text, replacement, position) {
                // Split the text into parts
                var parts = text.split(" vs ");
            
                // Determine which parts to replace
                if (position === 0) {
                    parts[0] = replacement;
                } else if (position === 1) {
                    parts[1] = replacement;
                }
            
                // Join the parts back together
                var newText = parts.join(" vs ");
            
                return newText;
            }

            $(document).on('input', 'input[name="score"]', function() {
                var input = $(this);
              clearTimeout(timeout);
              timeout = setTimeout(function() {
                category.schedule[input.data('index')].rounds[input.data('round')][input.data('set')][0].games[input.data('team')].result = input.val();
                update(uuid, tournament)
                    .then(function () {
                        // loadStandings();
                        loadRanked(uuid, div, cat);
                        check();
                    })
                    .catch(function (error) {
                        console.error('Delete failed:', error);
                    });
              }, 100);
            });

            $(document).on('change', 'select[name="inputTeam"]', function() {
                var input = $(this);
                clearTimeout(timeout);
                timeout = setTimeout(function() {

                    category.schedule[input.data('index')].rounds[input.data('round')][input.data('set')][0].games[input.data('team')].teamid = input.val();
                    category.schedule[input.data('index')].rounds[input.data('round')][input.data('set')][0].games[input.data('team')].team = input.find('option:selected').text();

                    division.calendar?.events?.forEach(event => {
                        if (event.id === input.data('match')) {
                            event.title = replaceParts(event.title, input.find('option:selected').text(), input.data('team'));
                            if(input.data('team') === 0){
                                event.extendedProps.team1 = input.val();
                                event.extendedProps.name1 = input.find('option:selected').text();
                            }else{
                                event.extendedProps.team2 = input.val();
                                event.extendedProps.name2 = input.find('option:selected').text();
                            }
                            console.log(event);
                        }
                    });
                    // console.log(category.schedule);
                    update(uuid, tournament)
                    .then(function () {
                        // loadStandings();
                        loadRanked(uuid, div, cat);
                        check();
                    })
                    .catch(function (error) {
                        console.error('Delete failed:', error);
                    });
                }, 100);
            });
        }
    });
};