// Tournament functions ----------------------------------

function editTournament(id){
    var tournament = tourData.find(function (tournament) {
        return tournament.uuid === id;
    });
    $('#edi_tournament_name').val(tournament.name);
    var tourid = document.getElementById("edit_tour_button");
	tourid.setAttribute("name", id);
    if(tournament.pic){
        const fetchedImageUrl = tournament.pic;
        const imageInputPlaceholder = document.querySelector('.image-input-placeholder');
        imageInputPlaceholder.style.backgroundImage = `url(${fetchedImageUrl})`;
    }else{
        const light = document.querySelector('[data-bs-theme="dark"] .image-input-placeholder');
        if(light){
            light.style.backgroundImage = `url('${url}/assets/media/svg/files/blank-image-dark.svg')`;
        }else{
            const dark = document.querySelector('.image-input-placeholder');
            dark.style.backgroundImage = `url('${url}/assets/media/svg/files/blank-image.svg')`;
        }
    }
    var editTour = new bootstrap.Modal(document.getElementById("edit_tournament"), {});
	editTour.show();
}

function addTournament(button){
	var name = $('#tournament_name').val();
    var btn = document.getElementById(button);
    var form = validateInputs(document.getElementById('tournament_inputs'), btn);
	var uuid = uuidv5(uuidv4(), name);
    const created = getCurrentDateTime();
	var json = {uuid: uuid, name : name, created: created, pic: null, divisions: []};

    if(form){
        btn.setAttribute("data-kt-indicator", "on");
        $.ajax({
			type: "POST",
			url: "/save.php",
			data: {
				json: JSON.stringify(json),
				type: 'tournament',
			},
			success: function (data) {
                btn.removeAttribute("data-kt-indicator");
                $('#tournament_name').val('');
				loadTournaments();
			},
		});
    }
}

function loadTournaments(){
    var target = document.querySelector('#tournaments_full');
    var blockUI = new KTBlockUI(target, {
        overlayClass: "bg-primary bg-opacity-25 card",
    });
    blockUI.block();

    loadData().then(function(result) {
        var tournamentList = $('#tournament_list');
        var itsActive;
        var itsShow;
        tournamentList.empty();
        if (result) {
            tourData.forEach(function (tournament, index) {
                var numTour = tourData.length;

                const [datePart, timePart] = tournament.created.split(', ');
                const [month, day, year] = datePart.split('-');
                const formattedDate = `${month}/${day}/${year} ${timePart}`;
                const date = new Date(formattedDate);
                // For es-MX (Spanish - Mexico)
                const esMxOptions = { day: '2-digit', month: 'long', year: 'numeric' };
                const esMxDate = date.toLocaleDateString('es-MX', esMxOptions);
                // Convert to localized date in en-US format
                const enUsOptions = { month: 'long', day: 'numeric', year: 'numeric' };
                const enUsDate = date.toLocaleDateString('en-US', enUsOptions);
                var created = (lang.home === 'Home') ? enUsDate : esMxDate;
                //check last used
                var lastActive = KTCookie.get("last_active_collapsible");
                if (lastActive === tournament.uuid) {
                    itsActive = "active";
                    itsShow = "show";
                }else{
                    itsActive = "collapsed";
                    itsShow = "";
                }
                // Check if the tournament.pic is null, if yes, use a default image URL
                var imageUrl = tournament.pic ? tournament.pic : 'assets/media/avatars/tournament.jpg';
                var html = `
                <div class="py-1">
                    <div class="py-3 d-flex flex-stack flex-wrap">
                        <div class="d-flex align-items-center collapsible toggle tour ${itsActive}" data-uuid-tournament="${tournament.uuid}" data-bs-toggle="collapse" data-bs-target="#${tournament.uuid}">
                            <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                <i class="fa-regular fa-square-chevron-up toggle-on text-primary fs-2"></i>
                                <i class="fa-regular fa-square-chevron-down toggle-off fs-2"></i>
                            </div>
                            <div class="symbol symbol-40px symbol-circle">
                                <div class="symbol-label fs-2 fw-semibold text-success me-3" style="background-image:url(../../${imageUrl})"></div>
                            </div>
                            <div class="me-3">
                                <div class="d-flex align-items-center fw-bold">
                                    ${tournament.name}
                                    <span class="ms-1" data-bs-toggle="tooltip" title="${lang.refname}">
                                        <i class="fa-solid fa-circle-info text-gray-500 fs-6"></i>
                                    </span>
                                </div>
                                <div class="fs-7 fw-semibold text-gray-400">${lang.created}: ${created}</div>
                            </div>
                        </div>
                        <div class="d-flex my-3 ms-9">
                            <a href="#" onclick="addDiv('${tournament.uuid}'); return false;" class="btn btn-icon btn-active-light-success w-30px h-30px me-2" data-bs-toggle="tooltip" title="${lang.adddiv}">
                                <i class="fa-solid fa-rectangle-history-circle-plus fs-3"></i>
                            </a>
                            <a href="#" onclick="editTournament('${tournament.uuid}'); return false;"  class="btn btn-icon btn-active-light-primary w-30px h-30px me-2" data-bs-toggle="tooltip" title="${lang.settings}">
                            <i class="fa-regular fa-gear fs-3"></i>
                            </a>
                            <a href="#" onclick="remove('${tournament.uuid}'); return false;" class="btn btn-icon btn-active-light-danger w-30px h-30px me-2" data-bs-toggle="tooltip" title="${lang.delete}">
                            <i class="fa-regular fa-trash fs-3"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div id="${tournament.uuid}" class="collapse fs-6 ps-10 ${itsShow}">`;
                
                if(tournament.divisions.length !== 0){
                    tournament.divisions.forEach( function(div){
                        var divImage = div.pic ? div.pic : 'assets/media/avatars/division.jpg';
                        if(div.categories.length == 0){ var disabled = 'disabled'; }
                        html += `
                        <div class="row pb-2 ">
                            <div class="card border rounded mb-2 bg-light-secondary border-secondary">
                                <div class="card-header min-h-50px ps-5 pe-0 border-bottom border-secondary">
                                    <div class="card-title d-flex align-items-center collapsible toggle active" data-bs-toggle="collapse" data-bs-target="#${div.id}">
                                        <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                            <i class="fa-regular fa-square-chevron-up toggle-on fs-2"></i>
                                            <i class="fa-regular fa-square-chevron-down toggle-off fs-2"></i>
                                        </div>
                                        <div class="symbol symbol-40px symbol-circle">
                                            <div class="symbol-label fs-2 fw-semibold text-success me-3" style="background-image:url(../../${divImage})"></div>
                                        </div>
                                        <div class="me-3">
                                            <div class="d-flex align-items-center fs-5 fw-bold">${div.name}</div>
                                        </div>
                                    </div>
                                    <div class="card-toolbar">
                                        <a href="${url}/d/${tournament.uuid}/${div.id}" class="${disabled} btn btn-icon btn-active-light-primary w-30px h-30px me-2" data-bs-toggle="tooltip" title="${lang.view}">
                                            <i class="fa-regular fa-eye fs-3"></i>
                                        </a>
                                        <a href="${url}/cal/${tournament.uuid}/${div.id}" class="${disabled} btn btn-icon btn-active-light-primary w-30px h-30px me-2" data-bs-toggle="tooltip" title="${lang.editcal}">
                                            <i class="fa-regular fa-calendar-pen fs-3"></i>
                                        </a>
                                        <a href="" onclick="addCate('${tournament.uuid}', '${div.id}'); return false;" class="btn btn-icon btn-active-light-success w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.addcate}">
                                        <i class="fa-solid fa-square-plus fs-3"></i>
                                        </a>
                                        <a href="" onclick="editDiv('${tournament.uuid}', '${div.id}'); return false;" class="btn btn-icon btn-active-light-primary w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.settings}">
                                            <i class="fa-regular fa-gear fs-3"></i>
                                        </a>
                                        <a href="" onclick="removeDiv('${tournament.uuid}', '${div.id}'); return false;" class="btn btn-icon btn-active-light-danger w-30px h-30px me-3" data-bs-toggle="tooltip" title="${lang.delete}">
                                            <i class="fa-regular fa-trash fs-3"></i>
                                        </a>
                                    </div>
                                </div>
                                <div id="${div.id}" class="card-body collapse pb-5 show">
                                    <div class="row">`;

                                    if(div.categories.length !== 0){
                                        div.categories.forEach(function(cate){
                                            var genderColor = (cate.gender === 'm' || cate.gender === null || cate.gender === undefined) ? 'primary' : 'danger';
                                            var gender = (cate.gender === 'm' || cate.gender === null || cate.gender === undefined) ? lang.male : lang.female;
                                            html += `
                                            <div class="col-lg-4 col-sm-12 col-md-6 mb-5">
                                                <div class="card border">
                                                    <div class="card-header min-h-50px ps-5 pe-0">
                                                        <div class="card-title">
                                                            <i class="fa-duotone fa-circle-dot fs-1 pe-3" style="--fa-primary-color: ${cate.color}; --fa-secondary-color: ${cate.color};"></i>
                                                            ${cate.name}
                                                            <span class="ms-3 badge badge-light-${genderColor}">${gender}</span>
                                                        </div>
                                                        <div class="card-toolbar">
                                                            <a href="" onclick="editCate('${tournament.uuid}', '${div.id}', '${cate.id}'); return false;" class="btn btn-icon btn-active-light-primary w-30px h-30px me-1" data-bs-toggle="tooltip" title="${lang.catsettings}">
                                                                <i class="fa-regular fa-gear fs-3"></i>
                                                            </a>
                                                            <a href="" onclick="removeCate('${tournament.uuid}', '${div.id}', '${cate.id}'); return false;" class="btn btn-icon btn-active-light-danger w-30px h-30px me-3" data-bs-toggle="tooltip" title="${lang.delete}">
                                                                <i class="fa-regular fa-trash fs-3"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="card-body p-2 d-flex justify-content-center">
                                                        <a href="${url}/e/${tournament.uuid}/${div.id}/${cate.id}" class="btn btn-icon btn-active-light-primary w-30px h-30px me-6" data-bs-toggle="tooltip" title="${lang.editcate}">
                                                            <i class="fa-duotone fa-people-arrows fs-3"></i>
                                                        </a>
                                                        <a href="" class="btn btn-icon btn-active-light-primary w-30px h-30px me-6" data-bs-toggle="tooltip" title="${lang.embedlinkcat}">
                                                            <i class="fa-duotone fa-code fs-3"></i>
                                                        </a>
                                                        <a href="${url}/c/${tournament.uuid}/${div.id}/${cate.id}" class="btn btn-icon btn-active-light-primary w-30px h-30px me-6" data-bs-toggle="tooltip" title="${lang.rank}">
                                                            <i class="fa-duotone fa-ranking-star fs-3"></i>
                                                        </a>
                                                        <a href="" onclick="pdf('${tournament.uuid}', '${div.id}', '${cate.id}'); return false;"class="btn btn-icon btn-active-light-primary w-30px h-30px" data-bs-toggle="tooltip" title="${lang.pdf}">
                                                            <i class="fa-duotone fa-file-pdf fs-3"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            `;
                                        });
                                    }else{
                                        html +=`
                                        <div class="border rounded border-primary border-dotted p-5 mb-5 bg-light-primary d-flex flex-center">
                                            ${lang.nocate}
                                        </div>`;
                                    }
                        html += `
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                }else{
                    html += `
                    <div class="row pb-5">
                        <div class="border rounded border-primary border-dotted p-5 bg-light-primary d-flex flex-center">
                            ${lang.nodivsub}
                        </div>
                    </div>`;
                }

                html += `</div>`;

                if (index !== numTour - 1) {
                    html += `<div class="separator separator-dashed"></div>`;
                }
                tournamentList.append(html);
                tournamentList.find('[data-bs-toggle="tooltip"]').tooltip('enable');
                
                var collapsibles = document.querySelectorAll('.collapsible.toggle.tour');
                collapsibles.forEach(function (collapsible) {
                    collapsible.addEventListener('click', function (event) {
                        var uuid = event.currentTarget.getAttribute("data-uuid-tournament");
                        var isActive = event.currentTarget.classList.contains("active");
                        if(isActive){
                            KTCookie.remove("last_active_collapsible");
                        }else{
                            KTCookie.set("last_active_collapsible", uuid);
                        }
                    });
                });
            });
            blockUI.release();
            blockUI.destroy();
        }else{
            var html = `
            <div class="row d-flex flex-center h-100">
                <div class="mw-500px card card-flush border rounded border-primary p-8 border-dotted bg-light-primary text-center">
                    <span class="fs-4">${lang.notdesc}</span>
                </div>
            </div>`;
            tournamentList.append(html);
            tournamentList.find('[data-bs-toggle="tooltip"]').tooltip('enable');
            blockUI.release();
            blockUI.destroy();
        }
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

function saveTour(uuid){
    var tournament = tourData.find(function (tournament) {
        return tournament.uuid === uuid;
    });
    var btn = document.getElementById('edit_tour_button');
    const inputFile = document.querySelector('input[type="file"][name="avatar"]');
    tournament.name = $('#edi_tournament_name').val();
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
                    tournament.pic = data.url;
                    update(uuid, tournament)
                        .then(function () {
                            btn.removeAttribute("data-kt-indicator");
                            dismissModal('edit_tournament');
                            loadTournaments();
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
                dismissModal('edit_tournament');
                loadTournaments();
            })
            .catch(function (error) {
                console.error('Update failed:', error);
            });
    }
}

async function remove(id){
    const remove = await removeConfirmation();
    if(remove){
        var target = document.querySelector('#tournaments_full');
        var blockUI = new KTBlockUI(target, {
            overlayClass: "bg-danger bg-opacity-25 card",
        });
        blockUI.block();

        $.ajax({
            type: "POST",
            url: "/save.php",
            data: {
                json: JSON.stringify({ uuid: id }),
                type: 'remove',
            },
            success: function (data) {
                blockUI.release();
                blockUI.destroy();
                loadTournaments();
            },
        });
    }
}