// Team and Groups Functions --------------------------------

async function delGroup(e) {
    var uuid = e.dataset.tournament;
    var div = e.dataset.division;
    var cat = e.dataset.category;
    var g = e.dataset.group;

    const result = findtourData(tourData, uuid, div, cat, g);
    if (!result) {
        console.error('Data not found.');
        return;
    }
    const { tournament, category } = result;
    var groupIndex = category.groups.findIndex(function(group) {
        return group.group === g;
    });

    const remove = await removeConfirmation();

    if (remove) {
        const removedGroup = category.groups.splice(groupIndex, 1)[0];

        // Collect all team IDs from the removed group
        const removedTeamIDs = removedGroup.teams.map(team => team.teamid);

        // Remove the corresponding teams from the category.teams array
        removedTeamIDs.sort((a, b) => b - a); // Sort in descending order
        for (let id of removedTeamIDs) {
            category.teams.splice(id, 1);
        }

        // Adjust team IDs in the remaining groups
        for (let grp of category.groups) {
            for (let team of grp.teams) {
                // Decrement teamid for teams that had a higher index than the removed teams
                for (let removedID of removedTeamIDs) {
                    if (team.teamid > removedID) {
                        team.teamid -= 1;
                    }
                }
            }
        }

        // Rename the remaining groups
        for (var i = groupIndex; i < category.groups.length; i++) {
            category.groups[i].group = String.fromCharCode('A'.charCodeAt(0) + i);
        }

        console.log(category.teams);
        console.log(category.groups);

        update(uuid, tournament)
            .then(function () {
                loadCategory(uuid, div, cat);
            })
            .catch(function (error) {
                console.error('Delete failed:', error);
            });
    }
}


async function delTeam(element) {
    var uuid = $(element).data('tournament');
    var div = $(element).data('division');
    var cat = $(element).data('category');
    var g = $(element).data('group');
    var index = parseInt(element.dataset.teamindex);
    var teamID = parseInt($(element).data('teamid'));
    $(`team${g}${index}-del`).find('[data-bs-toggle="tooltip"]').tooltip('dispose');
    const remove = await removeConfirmation();
    if (remove) {
        const result = findtourData(tourData, uuid, div, cat, g);
        if (result) {
            const { tournament, group, category } = result;
            
            // Remove the team from the group
            group.teams.splice(index, 1);

            // Remove the team from the main teams array
            category.teams.splice(teamID, 1);

            // Update teamid in all groups to reflect the new indices
            for (let grp of category.groups) {
                for (let team of grp.teams) {
                    if (team.teamid > teamID) {
                        team.teamid -= 1;
                    }
                }
            }

            // Now reassign all team IDs in groups to ensure they are correct
            for (let i = 0; i < category.teams.length; i++) {
                for (let grp of category.groups) {
                    for (let team of grp.teams) {
                        if (team.teamid === i) {
                            team.teamid = i;
                        }
                    }
                }
            }

            console.log(group);
            console.log(category.teams);
            console.log(category.groups);

            // Update the server or UI as necessary
            update(uuid, tournament).then(function() {
                loadCategory(uuid, div, cat);
            }).catch(function() {
                console.error('Failed to update Tournament on the server.');
            });
        }
    }
}


async function saveTeam(element) {
    var tournamentUUID = $(element).data('tournament');
    var divisionID = $(element).data('division');
    var categoryID = $(element).data('category');
    var group = $(element).data('group');
    var teamIndex = $(element).data('teamindex');
    var gender = $(element).data('gender');
    var newTeamName = $('#team' + group + teamIndex).val();

    const save = await saveConfirmation();

    if(save){
        $.ajax({
            url: '/save.php', // Replace with the correct server endpoint to handle team saving
            type: 'POST',
            dataType: 'json',
            data: {
                json: JSON.stringify({ uuid: tournamentUUID }),
                data: newTeamName,
                type: 'addteam'
            },
            success: function(response) {
                var j = {
                    id: response.id, 
                    name: newTeamName, 
                    gender: gender, 
                    created: response.registered, 
                    pic: null 
                }
                updateTeam(response.id, j)
                    .then(function() {
                        console.log('Team updated.');
                    })
                    .catch(function() {
                        console.error('Failed to update Team on the server.');
                    });
                // Update the teamid data attribute with the returned ID
                $('#team' + group + teamIndex).attr('data-teamid', response.id);
                $('#team' + group + teamIndex + '-del').attr('data-teamid', response.id);
                $('#team' + group + teamIndex).removeClass('border-warning bg-light-warning');
                $(element).addClass('invisible');

                // Update tourData JSON
                const result = findtourData(tourData, tournamentUUID, divisionID, categoryID, group);
                if (result) {
                    const { tournament, category } = result;
                    var gindex = category.groups.findIndex(function(groupItem) {
                        return groupItem.group === group;
                    });
                    category.groups[gindex].teams[teamIndex].team = newTeamName;
                    category.groups[gindex].teams[teamIndex].teamid = response.id;

                    // Update the JSON data on the server
                    update(tournamentUUID, tournament)
                    .then(function() {
                        loadCategory(tournamentUUID, divisionID, categoryID);
                    })
                    .catch(function() {
                        console.error('Failed to update Tournament on the server.');
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error saving team:', error);
            }
        });
    }
}

function addTeam(e){
    const uuid = e.dataset.tournament;
    const div = e.dataset.division;
    const cate = e.dataset.category;
    const g = e.dataset.group;
    const result = findtourData(tourData, uuid, div, cate, g);
    if (result) {
        const { tournament, category, group } = result;

        let tnum = category.teams.length;

        group.teams.push({ teamid: tnum });
        category.teams.push(`${lang.team} ${(tnum)+1}`);

        update(uuid, tournament)
            .then(function() {
                console.log('Tournament updated.');
                loadCategory(uuid, div, cate);
            })
            .catch(function() {
                console.error('Failed to update Tournament on the server.');
            });
    }
}

function teamsLoad() {
    loadData().then(function(result) {
        if (result) {
            var html = `
            <div class="table-responsive">
                <table id="kt_datatable_zero_configuration" class="table table-hover table-row-bordered table-rounded border gy-7 gs-7">
                    <thead>
                        <tr class="text-center fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th>ID</th>
                            <th></th>
                            <th>${lang.team}</th>
                            <th>${lang.regdate}</th>
                            <th>${lang.players}</th>
                            <th>Status</th>
                            <th>UUID</th>
                            <th>${lang.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
            teamsData.forEach(team => {
                var players;
                if (team.players === null || team.players === undefined) {
                    players = 0;
                } else {
                    players = team.players.length;
                }
                if(team.pic){
                    var icon = `<img alt="Pic" src="${url}/${team.pic}" width="38px" height="38px" style="border-radius:40px;">`;
                }else{
                    var icon = `<i class="fa-regular fa-futbol fs-1"></i>`;
                }
                const monthAbbreviations = [
                    "jan", "feb", "mar", "apr", "may", "jun",
                    "jul", "aug", "sep", "oct", "nov", "dec"
                ];
                
                const inputDate = new Date(team.created);
                const monthIndex = inputDate.getMonth();
                const year = inputDate.getFullYear().toString().substr(-2);
                const day = inputDate.getDate();
                const hour = inputDate.getHours();
                const minute = inputDate.getMinutes();
                const created = `${day} ${monthAbbreviations[monthIndex]} '${year}`;

                var status = (team.active) ? `<span class="badge badge-success">${lang.valid}</span>` : `<span class="badge badge-danger">${lang.invalid}</span>` ;
                html += `
                        <tr>
                            <td class="pt-4 pb-4">${team.id}</td>
                            <td class="pt-4 pb-4">${icon}</td>
                            <td class="pt-4 pb-4" style="overflow: hidden; white-space: nowrap;" data-bs-toggle="tooltip" title="${team.name}"><a href="${url}/team/${team.id}"><strong>${team.name}</strong></a></td>
                            <td class="pt-4 pb-4">${created}</td>
                            <td class="pt-4 pb-4">${players}</td>
                            <td class="pt-4 pb-4">${status}</td>
                            <td class="pt-4 pb-4" style="overflow: hidden; white-space: nowrap;">${team.uuid}</td>
                            <td class="d-flex align-items-center pt-4 pb-4">
                                <a href="${url}/ted/${team.uuid}" class="btn btn-icon btn-active-light-primary w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.edit}">
                                    <i class="fa-regular fa-pen fs-4"></i>
                                </a>
                                <a href="#" onclick="printPlayers(${team.id}); return false;" class="btn btn-icon btn-active-light-info w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.pdf}">
                                    <i class="fa-regular fa-address-card fs-4"></i>
                                </a>
                                <a href="#" onclick="printTeam(${team.id}); return false;" class="btn btn-icon btn-active-light-success w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.pdf}">
                                    <i class="fa-solid fa-file-pdf fs-4"></i>
                                </a>
                                <a href="#" onclick="removeTeam(${team.id}); return false;" class="btn btn-icon btn-active-light-danger w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.delete}">
                                    <i class="fa-regular fa-trash fs-4"></i>
                                </a>
                            </td>
                        </tr>`;
            })
            html += `</tbody>
                </table>
            </div>`;
            $('#teamsList').html(html);
            $('#teamsList').find('[data-bs-toggle="tooltip"]').tooltip('enable');

            $("#kt_datatable_zero_configuration").DataTable();
        }
    });
}

async function removeTeam(id){
    const remove = await removeConfirmation();
    if(remove){
        var target = document.querySelector('#teamsList');
        var blockUI = new KTBlockUI(target, {
            overlayClass: "bg-danger bg-opacity-25 card",
        });
        blockUI.block();

        $.ajax({
            type: "POST",
            url: "/save.php",
            data: {
                json: JSON.stringify({ uuid: id }),
                type: 'delTeam',
            },
            success: function (data) {
                blockUI.release();
                blockUI.destroy();
                teamsLoad();
            },
        });
    }
}

function addGroup(e){
    const uuid = e.dataset.tournament;
    const div = e.dataset.division;
    const cate = e.dataset.category;
    const result = findtourData(tourData, uuid, div, cate);
    if (result) {
        const { tournament, category } = result;
        let tnum = category.teams.length;

        // category.groups.forEach(group => {
        //     tnum += group.teams.length;
        // });
        const letter = String.fromCharCode('A'.charCodeAt(0) + category.groups.length);
        var group = {
            group: `${letter}`,
            teams: [
                {teamid: tnum},
                {teamid: tnum+1},
                {teamid: tnum+2},
                {teamid: tnum+3}
            ]
        };

        category.groups.push(group  );
        category.teams.push(`${lang.team} ${tnum+1}`,`${lang.team} ${tnum+2}`,`${lang.team} ${tnum+3}`,`${lang.team} ${tnum+4}`);

        update(uuid, tournament)
            .then(function() {
                console.log('Tournament updated.');
                loadCategory(uuid, div, cate);
            })
            .catch(function() {
                console.error('Failed to update Tournament on the server.');
            });
    }
}

function validateGroupTeams(groups) {
    const totalGroups = groups.length;

    // Get the number of teams in the last group
    const lastGroupTeamCount = groups[totalGroups - 1].teams.length;

    // Check each group's team count
    for (let i = 0; i < totalGroups; i++) {
        const group = groups[i];
        const teamCount = group.teams.length;

        // Check if the group is one of the last two groups
        if (i >= totalGroups - 2) {
            if (teamCount !== lastGroupTeamCount) {
                return false;
            }
        } else {
            if (teamCount !== 4) {
                return false;
            }
        }
    }

    return true;
}

function validateTeamIds(groups) {
    for (const group of groups) {
        for (const team of group.teams) {
            if (team.teamid === null) {
                return false; // Found a team with null teamid
            }
        }
    }
    return true; // All teams have valid teamid values
}

function schedule(tourData, uuid, div, cat){
    const rdata = findtourData(tourData, uuid, div, cat);
    const { tournament, category } = rdata;
    
    var html = '';
    const isValidGroupTeams = validateGroupTeams(category.groups);
    const isValidTeamIds = validateTeamIds(category.groups);

    if(category.single && isValidTeamIds){
        // const generatedSchedule = generateSchedule(uuid, category);
        // category.schedule = generatedSchedule;
        // update(uuid, tournament);
        var colwidth = 12;
        html += `
        <div class="row mb-5">
            <div class="col-12 border p-5 pb-0 border-gray-300" style="border-radius: 1.5rem;">
                <div class="row">`;
        category.schedule.forEach( s => {
            if(s.group !== 'octag' && s.group !== 'quarterg' && s.group !== 'finalg' && s.group !== 'semifinalg' && s.group !== 'octa' && s.group !== 'quarter' && s.group !== 'final' && s.group !== 'semifinal'){
                html += `
                    <div class="col-${colwidth} mb-5">
                        <div class="card">
                            <div class="card-header min-h-50px ps-5 pe-0">
                                <div class="card-title">${lang.group} ${s.group}</div>
                            </div>
                            <div class="card-body p-3 pb-1">`;
                            s.rounds.forEach((round, index)=>{
                                html += `
                                <div class="card border rounded mb-2">
                                    <div class="card-header min-h-40px ps-5 pe-0 bg-light-secondary">
                                        <div class="card-title fs-5">${lang.round} ${index + 1}</div>
                                    </div>
                                    <div class="card-body p-2 pb-0">`;
                                    round.forEach((team)=>{
                                    html +=`
                                        <div class="list-group list-group-horizontal justify-content-center w-100 mb-2">
                                            <div class="list-group-item w-100 bg-body border">${category.teams[team[0].games[0].teamid]}</div>
                                            <span class="list-group-item bg-light-secondary border">VS</span>
                                            <div class="list-group-item w-100 bg-body border d-flex justify-content-end">${category.teams[team[0].games[1].teamid]}</div>
                                        </div>`;
                                    });

                                    html +=`
                                    </div>
                                </div>`;
                            });
                            html +=`
                            </div>
                        </div>
                    </div>`;
            }
        });
            html += `
                </div>
            </div>
        </div>`;

        html += `
        <div class="row">
            <div class="col-12 border p-5 pb-0 border-gray-500 bg-light" style="border-radius: 1.5rem;">
                <div class="row">`;
        category.schedule.forEach( sc => {
            if(sc.group === 'octag' || sc.group === 'quarterg' || sc.group === 'finalg' || sc.group === 'semifinalg' || sc.group === 'octa' || sc.group === 'quarter' || sc.group === 'final' || sc.group === 'semifinal'){
                // const title = (sc.group === 'quarter' || sc.group === 'quarterg') ? lang.quarter : (sc.group === 'final' || sc.group === 'finalg') ? 'Final' : (sc.group === 'semifinal' || sc.group === 'semifinalg') ? 'Semifinal' : (sc.group === 'octa' || sc.group === 'octag') ? lang.octa : 'Cuartos';
                const title = lang[sc.group];
                const borderColor = (sc.group === 'quarter' || sc.group === 'semifinal' || sc.group === 'octa' || sc.group === 'final') ? 'border-gray-500' : 'border-warning';
                html += `
                    <div class="col-${colwidth} mb-5">
                        <div class="card bg-light border ${borderColor}">
                            <div class="card-header min-h-50px ps-5 pe-0 ${borderColor}">
                                <div class="card-title">${title}</div>
                            </div>
                            <div class="card-body p-3 pb-1">`;
                            sc.rounds.forEach(round =>{
                                    round.forEach(team =>{
                                    html +=`
                                        <div class="list-group list-group-horizontal justify-content-center w-100 mb-2">
                                            <div class="list-group-item w-100 bg-body border">${team[0].games[0].team}</div>
                                            <span class="list-group-item bg-light-secondary border">VS</span>
                                            <div class="list-group-item w-100 bg-body border d-flex justify-content-end">${team[0].games[1].team}</div>
                                        </div>`;
                                    });
                            });
                            html +=`
                            </div>
                        </div>
                    </div>`;
            }
        });
        html +=`
                </div>
            </div>
        </div>`;
    }else if (isValidGroupTeams && isValidTeamIds) {
        // const generatedSchedule = generateSchedule(uuid, category);
        // category.schedule = generatedSchedule;
        // update(uuid, tournament);
        var colwidth = (category.schedule.length === 1 ) ? 12 : 6;
        html += `
        <div class="row mb-5">
            <div class="col-12 border p-5 pb-0 border-gray-300" style="border-radius: 1.5rem;">
                <div class="row">`;
        category.schedule.forEach( s => {
            if(s.group !== 'quarter' && s.group !== 'final' && s.group !== 'semifinal'){
                html += `
                    <div class="col-${colwidth} mb-5">
                        <div class="card">
                            <div class="card-header min-h-50px ps-5 pe-0">
                                <div class="card-title">${lang.group} ${s.group}</div>
                            </div>
                            <div class="card-body p-3 pb-1">`;
                            s.rounds.forEach((round, index)=>{
                                html += `
                                <div class="card border rounded mb-2">
                                    <div class="card-header min-h-40px ps-5 pe-0 bg-light-secondary">
                                        <div class="card-title fs-5">${lang.round} ${index + 1}</div>
                                    </div>
                                    <div class="card-body p-2 pb-0">`;
                                    round.forEach((team)=>{
                                    html +=`
                                        <div class="list-group list-group-horizontal justify-content-center w-100 mb-2">
                                            <div class="list-group-item w-100 bg-body border">${category.teams[team[0].games[0].teamid]}</div>
                                            <span class="list-group-item bg-light-secondary border">VS</span>
                                            <div class="list-group-item w-100 bg-body border d-flex justify-content-end">${category.teams[team[0].games[1].teamid]}</div>
                                        </div>`;
                                    });

                                    html +=`
                                    </div>
                                </div>`;
                            });
                            html +=`
                            </div>
                        </div>
                    </div>`;
            }
        });
            html += `
                </div>
            </div>
        </div>`;

        html += `
        <div class="row">
            <div class="col-12 border p-5 pb-0 border-gray-500 bg-light" style="border-radius: 1.5rem;">
                <div class="row">`;
        category.schedule.forEach( sc => {
            if(sc.group === 'quarter' || sc.group === 'final' || sc.group === 'semifinal'){
                const title = (sc.group === 'quarter' && lang.home === 'Home') ? 'Quarter' : (sc.group === 'final') ? 'Final' : (sc.group === 'semifinal') ? 'Semifinal' : 'Cuartos';
                html += `
                    <div class="col-${colwidth} mb-5">
                        <div class="card bg-light border border-gray-500">
                            <div class="card-header min-h-50px ps-5 pe-0 border-gray-500">
                                <div class="card-title">${title}</div>
                            </div>
                            <div class="card-body p-3 pb-1">`;
                            sc.rounds.forEach(round =>{
                                    round.forEach(team =>{
                                        const team1 = 
                                            (team[0].games[0].team === 'sfinal' && lang.home === 'Home') ? 'Semifinalist' :
                                            (team[0].games[0].team === 'sfinal' && lang.home !== 'Home') ? 'Semifinalista' :
                                            (team[0].games[0].team === 'finalist' && lang.home === 'Home') ? 'Finalist' :
                                            (team[0].games[0].team === 'finalist' && lang.home !== 'Home') ? 'Finalista' :
                                            team[0].games[0].team;

                                        const team2 = 
                                            (team[0].games[1].team === 'sfinal' && lang.home === 'Home') ? 'Semifinalist' :
                                            (team[0].games[1].team === 'sfinal' && lang.home !== 'Home') ? 'Semifinalista' :
                                            (team[0].games[1].team === 'finalist' && lang.home === 'Home') ? 'Finalist' :
                                            (team[0].games[1].team === 'finalist' && lang.home !== 'Home') ? 'Finalista' :
                                            team[0].games[1].team;
                                    html +=`
                                        <div class="list-group list-group-horizontal justify-content-center w-100 mb-2">
                                            <div class="list-group-item w-100 bg-body border">${team1}</div>
                                            <span class="list-group-item bg-light-secondary border">VS</span>
                                            <div class="list-group-item w-100 bg-body border d-flex justify-content-end">${team2}</div>
                                        </div>`;
                                    });
                            });
                            html +=`
                            </div>
                        </div>
                    </div>`;
            }
        });
        html +=`
                </div>
            </div>
        </div>`;

    } else {
        html += `
        <div class="d-flex flex-row flex-column-fluid" style="height: calc(100vh - 160px);">
            <div class="d-flex flex-row-fluid flex-center">`;
        if (!isValidTeamIds) {
            html += `
                <div class="w-100 d-block text-center mw-300px">
                    <i class="fa-duotone fa-triangle-exclamation text-warning fs-5tx mb-5"></i>
                    <div class="d-block w-100 fs-3 fw-bold">${lang.invalidteam}</div>
                </div>`;
        }else if (!isValidGroupTeams) {
            html += `
                <div class="w-100 d-block text-center mw-300px">
                    <i class="fa-duotone fa-triangle-exclamation text-warning fs-5tx mb-5"></i>
                    <div class="d-block w-100 fs-3 fw-bold">${lang.teamsmiss}</div>
                </div>`;
        }
        html += `
                </div>
            </div>`;
    }

    $('#cate_content').html(html);
}

function generateSchedule(uuid, category) {
    const groups = category.groups;
    const teams = category.teams;
    const games = category.games;
    const single = category.single;
    const schedule = [];
  
    const ultimate = [[[0, 1]],[[0, 2]],[[1, 2]]];
    const penultimate = [[[0, 1], [2, 2]],[[0, 2], [1, 1]],[[1, 2], [0, 0]]];
    const standard = [[[0, 1], [2, 3]],[[0, 2], [1, 3]],[[1, 2], [3, 0]]];
    
    const teams4 = [[[0,1],[2,3]],[[0,2],[1,3]],[[1,2],[3,0]]];
    const teams6 = [[[0,1],[2,3],[4,5]],[[0,2],[1,4],[3,5]],[[1,2],[3,4],[5,0]]];
    const teams8 = [[[0,1],[2,3],[4,5],[6,7]],[[0,2],[1,3],[4,6],[5,7]],[[1,2],[3,4],[5,6],[7,0]]];
    const teams10 = [[[0,1],[2,3],[4,5],[6,7],[8,9]],[[0,2],[1,3],[4,6],[5,8],[7,9]],[[1,2],[3,4],[5,6],[7,8],[9,0]]];
    const teams12 = [[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11]],[[0,2],[1,3],[4,6],[5,7],[8,10],[9,11]],[[1,2],[3,4],[5,6],[7,8],[9,10],[11,0]]];
    
    const teams14 = [[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13]],[[0,2],[1,3],[4,6],[5,7],[8,10],[9,13],[12,11]],[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,0]]];
    
    const teams16 = [[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15]],[[0,2],[1,3],[4,6],[5,7],[8,10],[9,11],[12,14],[13,15]],[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,0]]];
    const teams18 = [[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17]],[[0,15],[1,3],[4,6],[5,7],[8,10],[9,11],[12,17],[13,16],[14,2]],[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,0]]];
    const teams20 = [[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19]],[[0,18],[1,3],[4,6],[5,7],[8,10],[9,11],[12,17],[13,16],[14,2],[15,19]],[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,0]]];
    const teams24 = [
        [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19],[20,21],[22,23]],
        [[0,20],[1,3],[4,6],[5,7],[8,10],[9,11],[12,17],[13,16],[14,2],[15,19],[18,23],[22,21]],
        [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[23,0]]];
    const teams28 = [
        [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19],[20,21],[22,23],[24,25],[26,27]],
        [[0,2],[1,3],[4,6],[5,8],[7,9],[10,12],[11,14],[13,15],[16,18],[17,19],[20,22],[21,24],[23,25],[26,0],[27,1]],
        [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[23,24],[25,26],[27,0],[1,3]]
    ];
    
    const teams32 = [
        [[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29],[30,31]],
        [[0,2],[1,3],[4,6],[5,8],[7,9],[10,12],[11,14],[13,15],[16,18],[17,19],[20,22],[21,24],[23,25],[26,28],[27,30],[29,31]],
        [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[23,24],[25,26],[27,28],[29,30],[31,0]]
    ];
  
    groups.forEach(function(g, index){
        const groupSchedule = { group: g.group, rounds: [] };
        const isLastGroup = index === groups.length - 1;
        const isSecondLastGroup = index === groups.length - 2;
        
        let matchOrders;
        if (single) {
            switch (teams.length) {
                case 4:
                    matchOrders = teams4;
                    break;
                case 6:
                    matchOrders = teams6;
                    break;
                case 8:
                    matchOrders = teams8;
                    break;
                case 10:
                    matchOrders = teams10;
                    break;
                case 12:
                    matchOrders = teams12;
                    break;
                case 14:
                    matchOrders = teams14;
                    break;
                case 16:
                    matchOrders = teams16;
                    break;
                case 18:
                    matchOrders = teams18;
                    break;
                case 20:
                    matchOrders = teams20;
                    break;
                case 24:
                    matchOrders = teams24;
                    break;
                case 28:
                    matchOrders = teams28;
                    break;
                case 32:
                    matchOrders = teams32;
                    break;
                default:
                    matchOrders = standard;
            }
        } else {
            if (isLastGroup && groups[groups.length - 1].teams.length === 3 && isSecondLastGroup && groups[groups.length - 2].teams.length === 3) {
                matchOrders = ultimate;
            } else if (isSecondLastGroup && groups[groups.length - 2].teams.length === 3) {
                matchOrders = penultimate;
            } else {
                matchOrders = standard;
            }
        }
        
        for (let i = 1; i <= games; i++) {
            const roundMatches = [];
            const matchOrder = matchOrders[(i - 1) % matchOrders.length];
    
            for (const order of matchOrder) {
                const teamA = g.teams[order[0]];
                const teamB = (order[0] === order[1]) ? groups[index + 1].teams[order[1]] : g.teams[order[1]];
                // roundMatches.push([teamA, teamB]);
                var roundid = uuidv5(uuid, `${category.id}${teamA.teamid}${teamB.teamid}${g.group}${(i - 1)}`);
                roundMatches.push([
                    {
                        id: roundid,
                        games: [
                            { team: teams[teamA.teamid], teamid: teamA.teamid, result: null },
                            { team: teams[teamB.teamid], teamid: teamB.teamid, result: null },
                        ]
                    }
                ]);
            }
            groupSchedule.rounds.push(roundMatches);
        }
        schedule.push(groupSchedule);
    });
    
    const gl = groups.length;
    if(single){
        const octag = 'octag'; 
        const quarterg = 'quarterg';
        const semig = 'semifinalg';
        const finalg = 'finalg';

        const octa = 'octa'; 
        const quarter = 'quarter';
        const semi = 'semifinal';
        const final = 'final';

        const team1 = '1st';
        const team2 = '2nd';
        const team3 = '3rd';
        const team4 = '4th';
        const team5 = '5th';
        const team6 = '6th';
        const team7 = '7th';
        const team8 = '8th';
        const team9 = '9th';
        const team10 = '10th';
        const team11 = '11th';
        const team12 = '12th';
        const team13 = '13th';
        const team14 = '14th';
        const team15 = '15th';
        const team16 = '16th';
        const team17 = '17th';
        const team18 = '18th';
        const team19 = '19th';
        const team20 = '20th';
        const team21 = '21st';
        const team22 = '22nd';
        const team23 = '23rd';
        const team24 = '24th';

        const finalist = lang.finalist;

        switch (groups[0].teams.length) {
            case 4:
                var rid1 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid2 = uuidv5(uuid, team2 + team3 + semig + 0);
                var rid3 = uuidv5(uuid, finalist + finalist + finalg + 0);

                schedule.push(
                    { group: semig, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid3,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 6:
                var rid1 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid2 = uuidv5(uuid, team2 + team3 + semig + 0);
                var rid3 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid4 = uuidv5(uuid, team5 + team6 + final + 0);

                schedule.push(
                    { group: semig, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid3,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid4,
                            games: [
                                { team: team5, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 8:
                var rid1 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid2 = uuidv5(uuid, team2 + team3 + semig + 0);
                var rid3 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid4 = uuidv5(uuid, team5 + team8 + semi + 0);
                var rid5 = uuidv5(uuid, team6 + team7 + semi + 0);
                var rid6 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: semig, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid3,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid4,
                            games: [
                                { team: team5, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid5,
                            games: [
                                { team: team6, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid6,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 10:
                var rid1 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid2 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid3 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid4 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid5 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid6 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid7 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid8 = uuidv5(uuid, team9 + team10 + final + 0);

                schedule.push(
                    { group: quarterg, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid5,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid7,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid8,
                            games: [
                                { team: team9, teamid: null, result: null },
                                { team: team10, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 12:
                var rid1 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid2 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid3 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid4 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid5 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid6 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid7 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid8 = uuidv5(uuid, team9 + team12 + semi + 0);
                var rid9 = uuidv5(uuid, team10 + team11 + semi + 0);

                var rid10 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: quarterg, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid5,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid7,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid8,
                            games: [
                                { team: team9, teamid: null, result: null },
                                { team: team12, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid9,
                            games: [
                                { team: team10, teamid: null, result: null },
                                { team: team11, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid10,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 14:
                var rid1 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid2 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid3 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid4 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid5 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid6 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid7 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid8 = uuidv5(uuid, team11 + team12 + quarter + 0);
                var rid9 = uuidv5(uuid, team13 + team14 + quarter + 0);

                var rid10 = uuidv5(uuid, team9 + team11 + semi + 0);
                var rid11 = uuidv5(uuid, team10 + team13 + semi + 0);

                var rid12 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: quarterg, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid5,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid7,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarter, rounds: [[
                        [{
                            id: rid8,
                            games: [
                                { team: team11, teamid: null, result: null },
                                { team: team12, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid9,
                            games: [
                                { team: team13, teamid: null, result: null },
                                { team: team14, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid10,
                            games: [
                                { team: team9, teamid: null, result: null },
                                { team: team11, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid11,
                            games: [
                                { team: team10, teamid: null, result: null },
                                { team: team13, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid12,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 16:
                var rid1 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid2 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid3 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid4 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid5 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid6 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid7 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid8 = uuidv5(uuid, team9 + team16 + quarter + 0);
                var rid9 = uuidv5(uuid, team10 + team15 + quarter + 0);
                var rid10 = uuidv5(uuid, team11 + team14 + quarter + 0);
                var rid11 = uuidv5(uuid, team12 + team13 + quarter + 0);

                var rid12 = uuidv5(uuid, team1 + team4 + semi + 0);
                var rid13 = uuidv5(uuid, team2 + team3 + semi + 0);

                var rid14 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: quarterg, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid5,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid7,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarter, rounds: [[
                        [{
                            id: rid8,
                            games: [
                                { team: team9, teamid: null, result: null },
                                { team: team16, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid9,
                            games: [
                                { team: team10, teamid: null, result: null },
                                { team: team15, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid10,
                            games: [
                                { team: team11, teamid: null, result: null },
                                { team: team14, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid11,
                            games: [
                                { team: team12, teamid: null, result: null },
                                { team: team13, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid12,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid13,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid14,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 18:
                var rid1 = uuidv5(uuid, team1 + team16 + octag + 0);
                var rid2 = uuidv5(uuid, team2 + team15 + octag + 0);
                var rid3 = uuidv5(uuid, team3 + team14 + octag + 0);
                var rid4 = uuidv5(uuid, team4 + team13 + octag + 0);
                var rid5 = uuidv5(uuid, team5 + team12 + octag + 0);
                var rid6 = uuidv5(uuid, team6 + team11 + octag + 0);
                var rid7 = uuidv5(uuid, team7 + team10 + octag + 0);
                var rid8 = uuidv5(uuid, team8 + team9 + octag + 0);

                var rid9 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid10 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid11 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid12 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid13 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid14 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid15 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid16 = uuidv5(uuid, team17 + team18 + final + 0);

                schedule.push(
                    { group: octag, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team16, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team15, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team14, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team13, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid5,
                            games: [
                                { team: team5, teamid: null, result: null },
                                { team: team12, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team6, teamid: null, result: null },
                                { team: team11, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid7,
                            games: [
                                { team: team7, teamid: null, result: null },
                                { team: team10, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid8,
                            games: [
                                { team: team8, teamid: null, result: null },
                                { team: team9, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarterg, rounds: [[
                        [{
                            id: rid9,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid10,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid11,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid12,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid13,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid14,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid15,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid16,
                            games: [
                                { team: team17, teamid: null, result: null },
                                { team: team18, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 20:
                var rid1 = uuidv5(uuid, team1 + team16 + octag + 0);
                var rid2 = uuidv5(uuid, team2 + team15 + octag + 0);
                var rid3 = uuidv5(uuid, team3 + team14 + octag + 0);
                var rid4 = uuidv5(uuid, team4 + team13 + octag + 0);
                var rid5 = uuidv5(uuid, team5 + team12 + octag + 0);
                var rid6 = uuidv5(uuid, team6 + team11 + octag + 0);
                var rid7 = uuidv5(uuid, team7 + team10 + octag + 0);
                var rid8 = uuidv5(uuid, team8 + team9 + octag + 0);

                var rid9 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid10 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid11 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid12 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid13 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid14 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid15 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid16 = uuidv5(uuid, team17 + team20 + semi + 0);
                var rid17 = uuidv5(uuid, team18 + team19 + semi + 0);

                var rid18 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: octag, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team16, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team15, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team14, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team13, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid5,
                            games: [
                                { team: team5, teamid: null, result: null },
                                { team: team12, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team6, teamid: null, result: null },
                                { team: team11, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid7,
                            games: [
                                { team: team7, teamid: null, result: null },
                                { team: team10, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid8,
                            games: [
                                { team: team8, teamid: null, result: null },
                                { team: team9, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarterg, rounds: [[
                        [{
                            id: rid9,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid10,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid11,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid12,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid13,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid14,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid15,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid16,
                            games: [
                                { team: team17, teamid: null, result: null },
                                { team: team20, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid17,
                            games: [
                                { team: team18, teamid: null, result: null },
                                { team: team19, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid18,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
            case 24:
                var rid1 = uuidv5(uuid, team1 + team16 + octag + 0);
                var rid2 = uuidv5(uuid, team2 + team15 + octag + 0);
                var rid3 = uuidv5(uuid, team3 + team14 + octag + 0);
                var rid4 = uuidv5(uuid, team4 + team13 + octag + 0);
                var rid5 = uuidv5(uuid, team5 + team12 + octag + 0);
                var rid6 = uuidv5(uuid, team6 + team11 + octag + 0);
                var rid7 = uuidv5(uuid, team7 + team10 + octag + 0);
                var rid8 = uuidv5(uuid, team8 + team9 + octag + 0);

                var rid9 = uuidv5(uuid, team1 + team8 + quarterg + 0);
                var rid10 = uuidv5(uuid, team2 + team7 + quarterg + 0);
                var rid11 = uuidv5(uuid, team3 + team6 + quarterg + 0);
                var rid12 = uuidv5(uuid, team4 + team5 + quarterg + 0);

                var rid13 = uuidv5(uuid, team1 + team4 + semig + 0);
                var rid14 = uuidv5(uuid, team2 + team3 + semig + 0);

                var rid15 = uuidv5(uuid, finalist + finalist + finalg + 0);

                var rid16 = uuidv5(uuid, team17 + team24 + quarter + 0);
                var rid17 = uuidv5(uuid, team18 + team23 + quarter + 0);
                var rid18 = uuidv5(uuid, team19 + team22 + quarter + 0);
                var rid19 = uuidv5(uuid, team20 + team21 + quarter + 0);

                var rid20 = uuidv5(uuid, team1 + team4 + semi + 0);
                var rid21 = uuidv5(uuid, team2 + team3 + semi + 0);

                var rid22 = uuidv5(uuid, finalist + finalist + final + 0);

                schedule.push(
                    { group: octag, rounds: [[
                        [{
                            id: rid1,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team16, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid2,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team15, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid3,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team14, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid4,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team13, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid5,
                            games: [
                                { team: team5, teamid: null, result: null },
                                { team: team12, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid6,
                            games: [
                                { team: team6, teamid: null, result: null },
                                { team: team11, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid7,
                            games: [
                                { team: team7, teamid: null, result: null },
                                { team: team10, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid8,
                            games: [
                                { team: team8, teamid: null, result: null },
                                { team: team9, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarterg, rounds: [[
                        [{
                            id: rid9,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team8, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid10,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team7, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid11,
                            games: [
                                { team: team3, teamid: null, result: null },
                                { team: team6, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid12,
                            games: [
                                { team: team4, teamid: null, result: null },
                                { team: team5, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semig, rounds: [[
                        [{
                            id: rid13,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid14,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: finalg, rounds: [[
                        [{
                            id: rid15,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: quarter, rounds: [[
                        [{
                            id: rid16,
                            games: [
                                { team: team17, teamid: null, result: null },
                                { team: team24, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid17,
                            games: [
                                { team: team18, teamid: null, result: null },
                                { team: team23, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid18,
                            games: [
                                { team: team19, teamid: null, result: null },
                                { team: team22, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid19,
                            games: [
                                { team: team20, teamid: null, result: null },
                                { team: team21, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: semi, rounds: [[
                        [{
                            id: rid20,
                            games: [
                                { team: team1, teamid: null, result: null },
                                { team: team4, teamid: null, result: null }
                            ]
                        }],
                        [{
                            id: rid21,
                            games: [
                                { team: team2, teamid: null, result: null },
                                { team: team3, teamid: null, result: null }
                            ]
                        }]
                    ]]},
                    { group: final, rounds: [[
                        [{
                            id: rid22,
                            games: [
                                { team: finalist, teamid: null, result: null },
                                { team: finalist, teamid: null, result: null }
                            ]
                        }]
                    ]]}
                );
                break;
        }
    }else if(gl === 1){
        const teamA = '1A';
        const teamB = '2A';
        const gtitle = 'final'; 
        const rid = uuidv5(uuid, teamA + teamB + gtitle + 0);
        schedule.push({ group: gtitle, rounds: [[[
            {
                id: rid,
                games: [
                  { team: teamA, teamid: null, result: null },
                  { team: teamB, teamid: null, result: null }
                ]
            }
        ]]]});
    }else if(gl === 2){
        const gt1 = 'semifinal'; 
        const team1 = '1A';
        const team2 = '2B';
        const team3 = '1B';
        const team4 = '2A';
        const rid1 = uuidv5(uuid, team1 + team2 + gt1 + 0);
        const rid2 = uuidv5(uuid, team3 + team4 + gt1 + 0);

        const gt2 = 'final'; 
        const team5 = 'finalist';
        const rid3 = uuidv5(uuid, team5 + team5 + gt2 + 0);

        schedule.push({ group: gt1, rounds: [[
            [{
                id: rid1,
                games: [
                  { team: team1, teamid: null, result: null },
                  { team: team2, teamid: null, result: null }
                ]
            }],
            [{
                id: rid2,
                games: [
                  { team: team3, teamid: null, result: null },
                  { team: team4, teamid: null, result: null }
                ]
            }]
        ]]},
        { group: gt2, rounds: [[
            [{
                id: rid3,
                games: [
                  { team: team5, teamid: null, result: null },
                  { team: team5, teamid: null, result: null }
                ]
            }]
        ]]});
        // schedule.push({ group: 'semifinal', rounds: [[[{team: '1A'},{team: '2B'}],[{team: '1B'},{team: '2A'}]]]},{ group: 'final', rounds: [[[{team: 'finalist'},{team: 'finalist'}]]]});
    }else if(gl === 3){
        const gt1 = 'semifinal'; 
        const team1 = '1A';
        const team2 = 'wildcard';
        const team3 = '1B';
        const team4 = '1C';
        const rid1 = uuidv5(uuid, team1 + team2 + gt1 + 0);
        const rid2 = uuidv5(uuid, team3 + team4 + gt1 + 0);

        const gt2 = 'final'; 
        const team5 = 'finalist';
        const rid3 = uuidv5(uuid, team5 + team5 + gt2 + 0);

        schedule.push({ group: gt1, rounds: [[
            [{
                id: rid1,
                games: [
                  { team: team1, teamid: null, result: null },
                  { team: team2, teamid: null, result: null }
                ]
            }],
            [{
                id: rid2,
                games: [
                  { team: team3, teamid: null, result: null },
                  { team: team4, teamid: null, result: null }
                ]
            }]
        ]]},
        { group: gt2, rounds: [[
            [{
                id: rid3,
                games: [
                  { team: team5, teamid: null, result: null },
                  { team: team5, teamid: null, result: null }
                ]
            }]
        ]]});
        // schedule.push({ group: 'semifinal', rounds: [[[{team: '1A'},{team: 'wildcard'}],[{team: '1B'},{team: '1C'}]]]},{ group: 'final', rounds: [[[{team: 'finalist'},{team: 'finalist'}]]]});
    }else if(gl === 4){
        const gt3 = 'quarter'; 
        const team6 = '1A';
        const team7 = '2D';
        const team8 = '1B';
        const team9 = '2C';
        const team10 = '1C';
        const team11 = '2B';
        const team12 = '1D';
        const team13 = '2A';
        const rid4 = uuidv5(uuid, team6 + team7 + gt3 + 0);
        const rid5 = uuidv5(uuid, team8 + team9 + gt3 + 0);
        const rid6 = uuidv5(uuid, team10 + team11 + gt3 + 0);
        const rid7 = uuidv5(uuid, team12 + team13 + gt3 + 0);

        const gt1 = 'semifinal'; 
        const team1 = 'sfinal';
        const team2 = 'sfinal1';
        const team3 = 'sfinal2';
        const team4 = 'sfinal3';
        const rid1 = uuidv5(uuid, team1 + team2 + gt1 + 0);
        const rid2 = uuidv5(uuid, team3 + team4 + gt1 + 0);

        const gt2 = 'final'; 
        const team5 = 'finalist';
        const rid3 = uuidv5(uuid, team5 + team5 + gt2 + 0);

        schedule.push({ group: gt3, rounds: [[
            [{
                id: rid4,
                games: [
                  { team: team6, teamid: null, result: null },
                  { team: team7, teamid: null, result: null }
                ]
            }],
            [{
                id: rid5,
                games: [
                  { team: team8, teamid: null, result: null },
                  { team: team9, teamid: null, result: null }
                ]
            }],
            [{
                id: rid6,
                games: [
                  { team: team10, teamid: null, result: null },
                  { team: team11, teamid: null, result: null }
                ]
            }],
            [{
                id: rid7,
                games: [
                  { team: team12, teamid: null, result: null },
                  { team: team13, teamid: null, result: null }
                ]
            }]
        ]]},
        { group: gt1, rounds: [[
            [{
                id: rid1,
                games: [
                  { team: team1, teamid: null, result: null },
                  { team: team2, teamid: null, result: null }
                ]
            }],
            [{
                id: rid2,
                games: [
                  { team: team3, teamid: null, result: null },
                  { team: team4, teamid: null, result: null }
                ]
            }]
        ]]},
        { group: gt2, rounds: [[
            [{
                id: rid3,
                games: [
                  { team: team5, teamid: null, result: null },
                  { team: team5, teamid: null, result: null }
                ]
            }]
        ]]});
        // schedule.push({ group: 'quarter', rounds: [[[{team: '1A'},{team: '2D'}],[{team: '1B'},{team: '2C'}],[{team: '1C'},{team: '2B'}],[{team: '1D'},{team: '2A'}]]]},{ group: 'semifinal', rounds: [[[{team: 'sfinal'},{team: 'sfinal'}],[{team: 'sfinal'},{team: 'sfinal'}]]]},{ group: 'final', rounds: [[[{team: 'finalist'},{team: 'finalist'}]]]});
    }
    return schedule;
}

function generateMatchOrders(numTeams) {
    const matchOrders = [];
    for (let i = 0; i < numTeams / 2; i++) {
        const round = [];
        for (let j = 0; j < numTeams / 2; j++) {
            round.push([(i + j) % numTeams, (numTeams - 1 - j + i) % numTeams]);
        }
        matchOrders.push(round);
    }
    return matchOrders;
}