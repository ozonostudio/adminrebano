// Load Dashboard ---------------------------------------

function loadDashboard(){

    loadData().then(function(result) {
        $("#page_name").html(`${lang.dash}`);
        $("#breadc").html(`
            <li class="breadcrumb-item text-muted"><a href="${url}" class="text-muted text-hover-primary">${lang.home}</a></li>`);
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        var currentYear = currentDate.getFullYear();
        var currentMonthTournaments = 0;
        var previousMonthTournaments = 0;

        var bootstrapColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
        var filteredTeams = [];
        var teamsList = $('#teamsList');

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        // console.log(JSON.stringify(tourData));

        if (result) {
            tourData.forEach(function (tournament, index) {
                var createdParts = tournament.created.split(/[-, :]/);
                var createdYear = parseInt(createdParts[2]);
                var createdMonth = parseInt(createdParts[0]);

                if (createdYear === currentYear && createdMonth === currentMonth) {
                    currentMonthTournaments++;
                } else if (createdYear === currentYear && createdMonth === currentMonth - 1) {
                    previousMonthTournaments++;
                }
                
            });
            var percentage = 0;
            if (previousMonthTournaments !== 0) {
                percentage = (currentMonthTournaments - previousMonthTournaments) / previousMonthTournaments * 100;
            }else{
                percentage = currentMonthTournaments * 100;
            }

            teamsData.forEach(function (team) {
                var createdDate = new Date(team.created);
                var teamsMonth = createdDate.getMonth() + 1;
                var teamsYear = createdDate.getFullYear();
            
                if (teamsYear === currentYear && teamsMonth === currentMonth) {
                    filteredTeams.push(team);
                }
            });

            var limitedTeams = filteredTeams.slice(0, 7);

            limitedTeams.forEach(function (team, index) {
                var firstLetter = team.name.substring(0, 1);
                var randomColorClass = bootstrapColors[index];
            
                var teamLink = `<a href="${url}/team/${team.id}" class="symbol symbol-35px symbol-circle" data-bs-toggle="tooltip" title="${team.name}">`;
            
                if (team.pic) {
                    teamLink += `<img alt="Pic" src="${url}/${team.pic}" />`;
                } else {
                    teamLink += `<span class="symbol-label bg-${randomColorClass} text-inverse-${randomColorClass} fw-bold"> ${firstLetter}</span>`;
                }
            
                teamLink += '</a>';
                teamsList.append(teamLink);
            });

            if(filteredTeams.length > 7){
                var extraTeamsLink = `<a href="${url}/teams" class="symbol symbol-35px symbol-circle" data-bs-toggle="tooltip" title="${lang.viewmore}"><span class="symbol-label bg-dark text-gray-300 fs-8 fw-bold">+${filteredTeams.length - 7}</span></a>`;
                teamsList.append(extraTeamsLink);
            }

            teamsList.find('[data-bs-toggle="tooltip"]').tooltip('enable');

            $('#totalTeams').html(teamsData.length);
            $('#teamsMonth').html(`${filteredTeams.length} ${lang.thismonth}`);
            $('#tourMonth').html(currentMonthTournaments);
            const monthpercent = (currentMonthTournaments < previousMonthTournaments) ? `<i class="fa-regular fa-arrow-down-left fs-3 me-1 text-danger"></i><div class="fw-bold text-danger me-2">${percentage.toFixed(2)}%</div>` : `<i class="fa-regular fa-arrow-up-right fs-3 me-1 text-success"></i><div class="fw-bold text-success me-2">${percentage.toFixed(2)}%</div>`;
            $('#percentageChange').html(monthpercent);

            const filteredEvents = [];

            for (const tournament of tourData) {
            if (tournament.divisions && tournament.divisions.length > 0) {
                for (const division of tournament.divisions) {
                if (division.calendar && division.calendar.events && division.calendar.events.length > 0) {
                    for (const event of division.calendar.events) {
                    const eventStartDate = new Date(event.start);
                    if (eventStartDate >= currentDate && eventStartDate <= endDate) {
                        filteredEvents.push(event);
                    }
                    }
                }
                }
            }
            }
            createTabs(filteredEvents);
        }else{
            $('#tourMonth').html(0);
            $('#percentageChange').html(`<i class="fa-regular fa-arrow-down-left-and-arrow-up-right-to-center fs-3 me-1 text-warning"></i><div class="fw-bold text-warning me-2">0%</div>`);
            $('#teamsMonth').html(`0 ${lang.thismonth}`);
            $('#totalTeams').html(0);
            createTabs([]);
        }
    })
}

function formatDateTo24Hour(timeString) {
    const date = new Date(timeString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function fetchTabContent(day, json) {
    const eventsForDay = json.filter(event => {
        if (!event.id.endsWith("-sub")) {
            const eventDate = new Date(event.start);
            return eventDate.getDay() === day;
        }
    });

    if (eventsForDay.length === 0) {
        return `<div class="text-center text-muted">${lang.noevents}</div>`;
    }

    // Generate the content for the events
    let content = '';
    for (const event of eventsForDay) {
        // Generate the content for each event
        // You can modify this part to match your desired event format
        content += `
        <div class="d-flex align-items-center mb-6">
            <span data-kt-element="bullet" class="bullet bullet-vertical d-flex align-items-center min-h-70px mh-100 me-4" style="background-color:${event.backgroundColor};"></span>
            <div class="flex-grow-1 me-5">
                <div class="text-gray-800 fw-semibold fs-2">${formatDateTo24Hour(event.start)} - ${formatDateTo24Hour(event.end)}</div>
                <div class="text-gray-700 fw-semibold fs-6">${event.title}</div>
            </div>
            <a href="#" class="btn btn-sm btn-light" data-bs-toggle="modal" data-bs-target="#kt_modal_create_project">${lang.view}</a>
        </div>
    `;
    }

    return content;
}

function createTabs(json){
    const daysOfWeek = ( lang.home === 'Home') ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const today = new Date().getDay(); // Get the current day (0 - Sunday, 1 - Monday, ...)

    const dayTabs = document.getElementById('dayTabs');
    const tabContent = document.getElementById('tabContent');

    for (let i = 0; i < 7; i++) {
        const day = (today + i) % 7; // Ensure we wrap around to the beginning of the week
        const dayOfWeek = daysOfWeek[day];

        // Create the day tab
        const tab = document.createElement('li');
        tab.classList.add('nav-item', 'p-0', 'ms-0');
        const tabLink = document.createElement('a');
        tabLink.classList.add('nav-link', 'btn', 'd-flex', 'flex-column', 'flex-center', 'rounded-pill', 'min-w-45px', 'py-4', 'px-3', 'btn-active-danger');
        tabLink.setAttribute('data-bs-toggle', 'tab');
        tabLink.href = `#teams_events${day}`;
        tabLink.innerHTML = `
            <span class="fs-7 fw-semibold">${dayOfWeek}</span>
            <span class="fs-6 fw-bold">${new Date().getDate() + i}</span>
        `;
        if (i === 0) {
            tabLink.classList.add('active');
        }
        tab.appendChild(tabLink);
        dayTabs.appendChild(tab);

        // Create the tab content container
        const tabPane = document.createElement('div');
        tabPane.classList.add('tab-pane', 'fade', 'hover-scroll', 'h-350px');
        if (i === 0) {
            tabPane.classList.add('show', 'active');
        }
        tabPane.id = `teams_events${day}`;

        // Fetch tab content and update the content placeholder
        fetchTabContent(day, json).then(content => {
        	tabPane.innerHTML = content;
        });
        tabContent.appendChild(tabPane);
    }
}