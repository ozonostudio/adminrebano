// Divisions functions ----------------------------------

function addDiv(id){
	var tourid = document.getElementById("division_button");
	tourid.setAttribute("name", id);
	var modals = new bootstrap.Modal(document.getElementById("create_tournament"), {});
	modals.show();
}

async function removeDiv(uuid, id){
    var tournament = tourData.find(function (tournament) {
        return tournament.uuid === uuid;
    });
    const remove = await removeConfirmation();
    if(remove){
        const updatedDivisions = tournament.divisions.filter((division) => division.id !== id);
        tournament.divisions = updatedDivisions;
        update(uuid, tournament)
            .then(function () {
                loadTournaments();
            })
            .catch(function (error) {
                console.error('Delete failed:', error);
            });
    }
}

function createDiv(id){
    var tournament = tourData.find(function (tournament) {
        return tournament.uuid === id;
    });
    const createTournamentModal = document.getElementById('create_tournament');
    const isValid = validateInputs(createTournamentModal, /* optional btn parameter */);
    var btn = document.getElementById('division_button')
    var name = $('#division_name').val();
    var uuid = uuidv5(uuidv4(), name);
    var start = $('#start_date').val();
    var end = $('#end_date').val();
    var division = {name: name, id: uuid, pic: null, start: start, end: end, categories: [], calendar: []};
    if(isValid){
        btn.setAttribute("data-kt-indicator", "on");
        tournament.divisions.push(division);
        update(id, tournament)
            .then(function () {
                btn.removeAttribute("data-kt-indicator");
                dismissModal('create_tournament');
                loadTournaments();
                $('#division_name').val('');
                $('#start_date').val('');
                $('#end_date').val('');
            })
            .catch(function (error) {
                console.error('Update failed:', error);
            });
    }
}

function editDiv (uuid, id){
    
    const rdata = findtourData(tourData, uuid, id);
    const { division } = rdata;

    $('#edit_division_name').val(division.name);
    const startDate = new Date(division.start);
    startDate.setDate(startDate.getDate() + 1);
    startDate.toISOString().slice(0, 10)
    $('#edit_start_date').val(division.start);
    updateStart(
        {defaultDate: new Date(startDate.toISOString().slice(0, 10))}
    );
    const endDate = new Date(division.end);
    endDate.setDate(endDate.getDate() + 1);
    endDate.toISOString().slice(0, 10)
    $('#edit_end_date').val(division.end);
    updateEnd(
        {defaultDate: new Date(endDate)}
    );
    if(division.pic){
        const fetchedImageUrl = division.pic;
        const imageInputPlaceholder = document.querySelector('.division-placeholder');
        imageInputPlaceholder.style.backgroundImage = `url(${fetchedImageUrl})`;
    }else{
        const light = document.querySelector('[data-bs-theme="dark"] .division-placeholder');
        if(light){
            light.style.backgroundImage = `url('${url}/assets/media/svg/files/blank-image-dark.svg')`;
        }else{
            const dark = document.querySelector('.division-placeholder');
            dark.style.backgroundImage = `url('${url}/assets/media/svg/files/blank-image.svg')`;
        }
    }
    var tourid = document.getElementById("edit_div_button");
	tourid.setAttribute("data-tournament", uuid);
    tourid.setAttribute("data-division", id)
    var editDiv = new bootstrap.Modal(document.getElementById("edit_division"), {});
	editDiv.show();
}

function saveDiv (e){
    var uuid = e.dataset.tournament;
    var id = e.dataset.division;
    
    const rdata = findtourData(tourData, uuid, id);
    const { tournament, division } = rdata;

    var btn = document.getElementById('edit_div_button');
    const inputFile = document.querySelector('input[type="file"][data-type="avatar"]');
    division.name = $('#edit_division_name').val();
    division.start = $('#edit_start_date').val();
    division.end = $('#edit_end_date').val();
    btn.setAttribute("data-kt-indicator", "on");
    if (inputFile.files && inputFile.files[0]) {
        
        const file = inputFile.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        $.ajax({
            url: './up.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.success) {
                    division.pic = data.url;
                    update(uuid, tournament)
                        .then(function () {
                            btn.removeAttribute("data-kt-indicator");
                            dismissModal('edit_division');
                            loadTournaments();
                            $('#edit_division_name').val('');
                            $('#edit_start_date').val('');
                            $('#edit_end_date').val('');
                        })
                        .catch(function (error) {
                            console.error('Update failed:', error);
                        });
                } else {
                    console.error('File upload failed.');
                }
            },
            error: function(error) {
                console.error('An error occurred during file upload:', error);
            }
        });
    }else{
        update(uuid, tournament)
            .then(function () {
                btn.removeAttribute("data-kt-indicator");
                dismissModal('edit_division');
                loadTournaments();
                $('#edit_division_name').val('');
                $('#edit_start_date').val('');
                $('#edit_end_date').val('');
            })
            .catch(function (error) {
                console.error('Update failed:', error);
            });
    }
}