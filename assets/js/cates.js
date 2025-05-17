// Category functions -------------------------------------

function addCate(uuid, id){
    var btn = document.getElementById("category_button");
    btn.setAttribute("data-tournament", uuid);
    btn.setAttribute("data-division", id);
	var categoryModal = new bootstrap.Modal(document.getElementById("create_category"), {});
	categoryModal.show();
}

function createCate(e){
    var uuid = e.dataset.tournament;
    var id = e.dataset.division;
    var name = $('#category_name').val();
    var cat = uuidv5(uuidv4(), name);
    var color = $('#category_color').val();
    var gender = $('input[name="category_gender"]:checked').val();
    var teams = $('#category_teams').val();
    var single = document.getElementById('singlegroup');
    var games = $('#category_games').val().replace(/( Games| Juegos)/g, "");
    var time = $('#category_time').val().replace(/ Min/g, "");
    var category = {name: name, id: cat, color: color, time: time, games: games, single: false, gender: gender, teams:[], groups: [], schedule: [], brackets: []};

    var submitButton = document.getElementById("category_button");
    
    const rdata = findtourData(tourData, uuid, id);
    const { tournament, division } = rdata;

    division.categories.push(category);

    submitButton.setAttribute('data-kt-indicator', 'on');
    submitButton.disabled = true;

    var groupCount = Math.ceil(teams / 4);

    if(single.checked){
        groupCount = 1;
        category.single = true;
    }

    const teamsPerGroup = Math.floor(teams / groupCount);
    const teamsLeft = teams % groupCount;

    let teamCounter = 1;
    for (let i = 0; i < groupCount; i++) {
        const groupLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        const groupTeams = [];
        const teamsInThisGroup = i < teamsLeft ? teamsPerGroup + 1 : teamsPerGroup;
        
        for (let j = 0; j < teamsInThisGroup; j++) {
            groupTeams.push({
            teamid: teamCounter-1,
            });
            category.teams.push(`${lang.team} ${teamCounter}`);
            teamCounter++;
        }
        
        category.groups.push({
            group: groupLetter,
            teams: groupTeams,
        });
    }
    console.log(category.teams);
    const generatedSchedule = generateSchedule(uuid, category);
    category.schedule = generatedSchedule;
    update(uuid, tournament)
        .then(function () {
            submitButton.removeAttribute("data-kt-indicator");
            submitButton.disabled = false;
            dismissModal('create_category');
            loadTournaments();
            $('#category_name').val('');
            $('#category_color').val('#067bc2');
            $("#category_form .clr-field").css("color", '#067bc2');
            $('#gender_male').prop('checked', true);
            $('#category_teams').val('4');
            $('#category_games').val(`1 ${lang.games}`);
            $('#category_time').val('15 Min');
        })
        .catch(function (error) {
            console.error('Update failed:', error);
        });
}

function removeMatchingEvents(tourData, cat, calendar) {
    // Extract the event IDs from the schedule rounds of the specified category
    const eventIdsToRemove = new Set();

    tourData.divisions.forEach(division => {
        division.categories.forEach(category => {
            if (category.id === cat) {
                category.schedule.forEach(schedule => {
                    schedule.rounds.forEach(round => {
                        round.forEach(matchups => {
                            matchups.forEach(event => {
                                eventIdsToRemove.add(event.id);
                            });
                        });
                    });
                });
            }
        });
    });

    // Filter the events in the specified calendar that do not match the IDs
    calendar.events = calendar.events.filter(event => !eventIdsToRemove.has(event.id));

    return tourData;
}

async function removeCate(uuid, id, cat){
    const rdata = findtourData(tourData, uuid, id, cat);
    const { tournament, division, category } = rdata;

    const remove = await removeConfirmation();
    if(remove){
        const updatedTourData = removeMatchingEvents(tournament, cat, division.calendar);
        const upTournamnent = updatedTourData;

        const updatedCategory = division.categories.filter((category) => category.id !== cat);
        division.categories = updatedCategory;

        update(uuid, tournament)
        .then(function () {
            loadTournaments();
        })
        .catch(function (error) {
            console.error('Delete failed:', error);
        });
    }
    
}

function editCate(uuid, id, cate){
    var btn = document.getElementById("edit_category_button");
    btn.setAttribute("data-tournament", uuid);
    btn.setAttribute("data-division", id);
    btn.setAttribute("data-category", cate);

    const rdata = findtourData(tourData, uuid, id, cate);
    const { category } = rdata;

    $('#edit_category_name').val(category.name);
    $('#edit_category_color').val(category.color);
    if(category.gender == 'm'){
        $('#edit_gender_male').prop('checked', true);
    }else{
        $('#edit_gender_female').prop('checked', true);
    }
    $("#edit_category_form .clr-field").css("color", category.color);
    $('#edit_category_games').val(`${category.games} ${lang.games}`);
    $('#edit_category_time').val(`${category.time} Min`);

    var editCategoryModal = new bootstrap.Modal(document.getElementById("edit_category"), {});
	editCategoryModal.show();
}

function saveCate(e){
    var uuid = e.dataset.tournament;
    var id = e.dataset.division;
    var cat = e.dataset.category;
    const rdata = findtourData(tourData, uuid, id, cat);
    const { tournament, category } = rdata;

    var btn = document.getElementById('edit_category_button');
    category.name = $('#edit_category_name').val();
    category.color = $('#edit_category_color').val();
    category.gender = $('input[name="edit_category_gender"]:checked').val();
    category.games = $('#edit_category_games').val().replace(/( Games| Juegos)/g, "");
    category.time = $('#edit_category_time').val().replace(/ Min/g, "");
    btn.setAttribute("data-kt-indicator", "on");
    update(uuid, tournament)
        .then(function () {
            btn.removeAttribute("data-kt-indicator");
            dismissModal('edit_category');
            loadTournaments();
            $('#edit_division_name').val('');
            $('#edit_start_date').val('');
            $('#edit_end_date').val('');
        })
        .catch(function (error) {
            console.error('Update failed:', error);
        });
}

function loadCategory( uuid, div, cat){

    loadData().then(function(result) {
        
        var tournamentList = $('#groups_side');
        tournamentList.empty();
        if (result) {
            
            const rdata = findtourData(tourData, uuid, div, cat);
            const { tournament, division, category } = rdata;

            console.log(category);

            $('#create_btn_placeholder').html(`
            <button type="button" onclick="addGroup(this);" class="btn btn-primary w-100" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}">
                <span class="indicator-label">
                    ${lang.addgroup}
                </span>
                <span class="indicator-progress">
                    ${lang.wait} <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
            </button>`);
            $("#page_name").html(`${lang.category} / ${category.name}`);
            $("#breadc").html(`
            <li class="breadcrumb-item text-muted"><a href="${url}" class="text-muted text-hover-primary">${lang.home}</a></li>
                <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
                <li class="breadcrumb-item text-muted"><a href="${url}/tournaments" class="text-muted text-hover-primary">${lang.tour}</a></li>
                <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
                <li class="breadcrumb-item text-muted"><a href="${url}/d/${uuid}/${div}" class="text-muted text-hover-primary">${division.name}</a></li>`);

            category.groups.forEach(function(group) {
                var html = `
                <div class="card border mb-5 border-gray-300">
                    <div class="card-header min-h-50px ps-5 pe-0">
                        <div class="card-title">
                            <span class="fs-4 fw-bold text-dark">${lang.group} ${group.group}</span>
                        </div>
                        <div class="card-toolbar">
                            <a href="#" onclick="delGroup(this); return false;" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}" data-group="${group.group}" class="btn btn-icon btn-active-light-danger w-30px h-30px me-3" data-bs-toggle="tooltip" title="${lang.delete}">
                                <i class="fa-regular fa-trash fs-3"></i>
                            </a>
                        </div>
                    </div>
                    <div class="card-body p-5 pb-2" id="categories_list">`;
                group.teams.forEach(function(team, index){
                    html += `
                        <div class="form-group pb-3 position-relative">
                            <a href="#" onclick="delTeam(this); return false;" id="team${group.group}${index}-del" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}" data-group="${group.group}" data-teamindex="${index}" data-teamid="${team.teamid}" class="btn btn-icon btn-active-light-danger w-30px h-30px me-3 position-absolute" style="right: 0px; top:6px;" data-bs-toggle="tooltip" title="${lang.delete}">
                                <i class="fa-regular fa-xmark fs-3"></i>
                            </a>
                            <a href="#" onclick="saveTeam(this); return false;" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}" data-group="${group.group}" data-teamindex="${index}" data-gender="${category.gender}" class="btn btn-icon btn-active-light-success w-30px h-30px me-3 position-absolute plusteam invisible" style="right: 32px; top:6px;" data-bs-toggle="tooltip" title="${lang.saveteam}">
                                <i class="fa-regular fa-floppy-disk fs-3"></i>
                            </a>
                            <input type="text" class="form-control my-input pe-20" id="team${group.group}${index}" data-teamid="${team.teamid}" value="${category.teams[team.teamid]}">
                            <div class="suggestions mt-1 bg-light border border-secondary h-125px scroll w-100 rounded p-3" data-for="team${group.group}${index}"></div>
                        </div>`;
                });
                if(category.single){
                    html += `
                    <button type="button" onclick="addTeam(this);" class="btn btn-secondary mb-3 w-100" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}" data-group="${group.group}">
                        <span class="indicator-label">
                            ${lang.addteam}
                        </span>
                        <span class="indicator-progress">
                            ${lang.wait} <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    </button>`;
                }else{
                    if(group.teams.length < 4){
                        html += `
                        <button type="button" onclick="addTeam(this);" class="btn btn-secondary mb-3 w-100" data-tournament="${tournament.uuid}" data-division="${division.id}" data-category="${category.id}" data-group="${group.group}">
                            <span class="indicator-label">
                                ${lang.addteam}
                            </span>
                            <span class="indicator-progress">
                                ${lang.wait} <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>`;
                    }
                }
                html += `
                    </div>
                </div>`;
                tournamentList.append(html);
                tournamentList.find('[data-bs-toggle="tooltip"]').tooltip('enable');
            });

            schedule(tourData, uuid, div, cat);

            $('.my-input').on('input', function() {
                const input = $(this);
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    
                    category.teams[input.data('teamid')] = input.val();
                    update(uuid, tournament)
                        .then(function () {
                            schedule(tourData, uuid, div, cat);
                        })
                        .catch(function (error) {
                            console.error('Delete failed:', error);
                        });
                }, 100);
            });
        };
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}