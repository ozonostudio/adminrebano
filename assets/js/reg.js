// Open Form Tournament functions -------------------------------------

function openReg(uuid, id){
    const rdata = findtourData(tourData, uuid, id);
    const { division } = rdata;

    $('#form_slug').val(division.slug);

    var btn = document.getElementById("openform_button");
    btn.setAttribute("data-tournament", uuid);
    btn.setAttribute("data-division", id);

    const copybtn = document.getElementById('kt_clipboard_3');
    copybtn.setAttribute("data-clipboard", `${url}/reg/${division.slug}`);

    var opencloseregCheckbox = document.getElementById('openclosereg');
    opencloseregCheckbox.checked = division.openform;

	var openregModal = new bootstrap.Modal(document.getElementById("open_registry"), {});
	openregModal.show();
}

function saveOpenform(e){
    var uuid = e.dataset.tournament;
    var id = e.dataset.division;

    const rdata = findtourData(tourData, uuid, id);
    const { tournament, division } = rdata;
    
    var btn = document.getElementById('openform_button');
    division.slug = $('#form_slug').val();
    var opencloseregCheckbox = document.getElementById('openclosereg');
    var isChecked = opencloseregCheckbox.checked;

    division.openform = isChecked ? true : false;

    btn.setAttribute("data-kt-indicator", "on");
    
    update(uuid, tournament).then(function () {
        btn.removeAttribute("data-kt-indicator");
        loadTournaments();
    }).catch(function (error) {
        console.error('Update failed:', error);
    });
}

function loadFormData(slug){
    loadData().then(function(result) {
        var formData = $('#formContent');
        if (result) {
            var cates;
            var catess = ['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20', 'U21', 'U22'];
            catess.forEach(cate => {
                cates += `<option value="${cate}">${cate}</option>`;
            });
            var html = `
            <div class="py-10 d-flex justify-content-center w-100">
                <div class="row w-900px">
                    <div class="col-12 text-center">
                        <h1><strong>${lang.teamsregitry}</strong></h1>
                    </div>
                    <div class="col-12 mt-10" id="alert-form">
                        <div class="alert alert-primary d-flex align-items-center p-5">
                            <i class="fa-solid fa-bell fs-2hx text-primary me-4"></i>
                            <div class="d-flex flex-column">
                                <h4 class="mb-1 text-primary"><strong>${lang.info}</strong></h4>
                                <span>${lang.forminfo} <strong>${lang.savereg}</strong>.</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 card card-flush mt-3">
                        <div class="card-body" id="body-form">
                            <div class="row">

                                <div class="col-3">
                                    <style>.image-input-placeholder { background-image: url('${url}/assets/media/svg/files/blank-image.svg'); } [data-bs-theme="dark"] .image-input-placeholder { background-image: url('${url}/assets/media/svg/files/blank-image-dark.svg'); }</style>
                                    <div class="image-input image-input-empty image-input-outline image-input-placeholder division-placeholder" data-kt-image-input="true">
                                        <div class="image-input-wrapper w-125px h-125px"></div>
                                        <label class="btn btn-icon btn-circle btn-active-color-primary w-35px h-35px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="${lang.teamlogo}">
                                            <i class="fa-solid fa-pencil fs-5"></i>
                                            <input type="file" data-type="avatar" name="avatar" accept=".png, .jpg, .jpeg" />
                                            <input type="hidden" name="avatar_remove" />
                                        </label>
                                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="${lang.cancel}">
                                            <i class="fa-solid fa-xmark fs-2"></i>
                                        </span>
                                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="${lang.remove}">
                                            <i class="fa-solid fa-xmark fs-2"></i>
                                        </span>
                                    </div>
                                </div>

                                <div class="col-9">
                                    <div class="form-floating mb-7">
                                        <input type="email" class="form-control" id="teamName" placeholder="name@example.com"/>
                                        <label for="teamName">${lang.teamname}</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-floating col-6">
                                            <select class="form-select" id="teamCategory" aria-label="Floating label select example">
                                                ${cates}                                           
                                            </select>
                                            <label for="teamCategory">${lang.category}</label>
                                        </div>
                                        <div class="form-floating col-6">
                                            <select class="form-select" id="teamGender" aria-label="Floating label select example">
                                                <option value="m">${lang.male}</option>
                                                <option value="f">${lang.female}</option>
                                            </select>
                                            <label for="teamCategory">${lang.gender}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="final-form">
                        <div class="col-12 card card-flush mt-3 bg-light p-0">
                            <div class="card-header bg-body">
                                <h3 class="card-title">${lang.players}</h3>
                            </div>
                            <div class="card-body pt-0">
                                <div id="insertplayers">
                                
                                </div>
                                <div class="col-12 mt-10 border-dashed border border-gray-500 p-5 rounded w-100 text-center">
                                    <button type="button" onclick="addPlayer();" class="btn btn-color-success border border-success btn-light-success btn-active-success">${lang.addplayer}</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 w-100 mt-10 text-center">
                            <button type="button" class="btn btn-primary h-60px w-400px flex-shrink-0" onclick="saveReg()" id="btn_savereg">
                                <span class="indicator-label" data-kt-translate="sign-in-submit">${lang.savereg}</span>
                                <span class="indicator-progress">
                                    <span data-kt-translate="general-progress">${lang.wait}</span>
                                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            formData.append(html);
            formData.find('[data-bs-toggle="tooltip"]').tooltip('enable');
            KTImageInput.createInstances('[data-kt-image-input]');
        }
    });
}

function addPlayer(pid){
    var id;
    var name = "";
    var date = "";
    var docs = "";
    var pimg;
    if(pid){
        playersData.forEach(function(player){
            if(player.id === pid){
                id = player.uuid;
                name = player.name;
                date = player.birth;
                if(player.docs.length > 0){
                    docs += `<div class="list-group ps-3 mt-5">`;
                    player.docs.forEach(doc => {
                        var details = getFileDetails(doc);
                        docs += `
                        <a href="${url}/${doc}" class="list-group-item list-group-item-action flex-column align-items-start">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="my-1"><i class="fa-regular fa-file fs-3 me-3"></i> ${details.name}.${details.extension}</h5>
                                <small></small>
                            </div>
                        </a>`;
                    });
                    docs += `</div>`;
                }

                if(player.pic){
                    pimg = `url(${url}/${player.pic})`;
                }else{
                    const htmlElement = document.documentElement;
                    const theme = htmlElement.dataset.bsTheme;
                    if(theme === "dark"){
                        pimg = `url('${url}/assets/media/svg/files/blank-image-dark.svg')`;
                    }else{
                        pimg = `url('${url}/assets/media/svg/files/blank-image.svg')`;
                    }
                }
            }
        });
    }else{
        id = uuidv5(uuidv4(), new Date());
        const htmlElement = document.documentElement;
        const theme = htmlElement.dataset.bsTheme;
        if(theme === "dark"){
            pimg = `url('${url}/assets/media/svg/files/blank-image-dark.svg')`;
        }else{
            pimg = `url('${url}/assets/media/svg/files/blank-image.svg')`;
        }
        pid = "";
    }
    
    var playerList = $('#insertplayers');
    var html = `
    <div class="row" id="player-${id}" data-playerid="${pid}" name="player">
        <div class="col-11">
            <div class="row mt-10">
                <div class="col-3">
                    <div style="background-image: ${pimg};" class="image-input image-input-empty image-input-outline image-input-placeholder division-placeholder" data-kt-image-input="true" id="playerPic-${id}">
                        <div class="image-input-wrapper w-125px h-125px"></div>
                        <label class="btn btn-icon btn-circle btn-active-color-primary w-35px h-35px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="${lang.playerpic}">
                            <i class="fa-solid fa-pencil fs-5"></i>
                            <input type="file" data-type="avatar" name="avatar" accept=".png, .jpg, .jpeg" />
                            <input type="hidden" name="avatar_remove" />
                        </label>
                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="${lang.cancel}">
                            <i class="fa-solid fa-xmark fs-2"></i>
                        </span>
                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="${lang.remove}">
                            <i class="fa-solid fa-xmark fs-2"></i>
                        </span>
                    </div>
                </div>

                <div class="col-9">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="playerName" value="${name}"/>
                                <label for="playerName">${lang.playername}</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="birthPlayer-${id}" value="${date}"/>
                                <label for="birthPlayer-${id}">${lang.birthday}</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="fv-row">
                                <!--begin::Dropzone-->
                                <div class="dropzone p-0 mt-5 border rounded border-dashed bg-body border-primary min-h-50px" id="files_${id}">
                                    <div class="dz-message needsclick">
                                        <i class="ki-duotone ki-file-up fs-3x text-primary"><span class="path1"></span><span class="path2"></span></i>
                                        <div class="ms-4">
                                            <h3 class="fs-5 fw-bold text-gray-900 mb-1">${lang.dropfiles}</h3>
                                            <span class="fs-7 fw-semibold text-gray-500">${lang.max10}</span>
                                        </div>
                                    </div>
                                </div>
                                <!--end::Dropzone-->
                            </div>
                        </div>
                        ${docs}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center">
            <a href="#" onclick="delPlayer(this); return false;" data-player="${id}" data-id="${pid}" class="btn btn-icon-danger btn-active-danger" data-bs-toggle="tooltip" title="${lang.delete}">
                <i class="fa-regular fa-trash fs-3 pe-0"></i>
            </a>
        </div>
        <div class="separator mt-10 mb-0 border-gray-300"></div>
    </div>
    `;
    playerList.append(html);
    playerList.find('[data-bs-toggle="tooltip"]').tooltip('enable');
    KTImageInput.createInstances('[data-kt-image-input]');
    $(`#birthPlayer-${id}`).flatpickr();

    // Get the dynamically generated dropzone container
    var dropzoneContainer = $(`#files_${id}`);

    const upzone = document.getElementById(`files_${id}`);

    // Initialize Dropzone for the dynamically generated container
    Dropzone.autoDiscover = false; // To prevent Dropzone from auto-discovering all elements
    var myDropzone = new Dropzone(dropzoneContainer[0], {
        url: "/drop.php", // Set the url for your upload script location
        paramName: "file", // The name that will be used to transfer the file
        maxFiles: 10,
        maxFilesize: 10, // MB
        addRemoveLinks: false,
    });
    var upfiles = []
    myDropzone.on("success", function(file, response) {
        var jsonResponse = JSON.parse(response);
        var uploadedUrl = jsonResponse.url;
        upfiles.push(uploadedUrl);
        upzone.setAttribute("data-uploadedfiles", upfiles);
    });
};

var delPlayers = [];

function delPlayer(id){
    if(id.dataset.id){
        delPlayers.push(id.dataset.id);
    }
    var player = document.getElementById(`player-${id.dataset.player}`);
    $(player).find('[data-bs-toggle="tooltip"]').tooltip('dispose');
    player.remove();
};

function saveReg(tid) {
    var btn = document.getElementById('btn_savereg');
    var newTeamName = $('#teamName').val();
    var category = $('#teamCategory').val();
    var gender = $('#teamGender').val();
    const logo = document.querySelector('input[type="file"][name="avatar"]');
    var divElements = document.getElementsByName('player');

    btn.setAttribute("data-kt-indicator", "on");
    btn.disabled = true;

    var players = [];
    var promises = []; // Array to store promises for each AJAX call

    // Upload function to handle file uploads and return the URL
    function uploadFile(file) {
        return new Promise(function(resolve, reject) {
            var formData = new FormData();
            formData.append('avatar', file);

            $.ajax({
                url: '/up.php',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    if (response.success) {
                        resolve(response.url);
                    } else {
                        reject(response.error);
                    }
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    // Function to save player data
    function savePlayer(id, name, birth, avatarUrl, uploadedFiles) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/save.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    json: JSON.stringify({ uuid: id }),
                    data: name,
                    type: 'addplayer'
                },
                success: function(response) {
                    var json = {
                        id: response.id,
                        uuid: id,
                        name: name,
                        created: response.registered,
                        birth: birth,
                        pic: avatarUrl,
                        docs: uploadedFiles
                    };
                    updatePlayer(response.id, json)
                        .then(function() {
                            players.push({ player: response.id });
                            resolve();
                        })
                        .catch(function(error) {
                            console.error('Failed to update player on the server:', error);
                            reject(error);
                        });
                },
                error: function(xhr, status, error) {
                    console.error('Error saving player:', error);
                    reject(error);
                }
            });
        });
    }
    
    if(tid){
        teamsData.forEach( team => {
            if(team.uuid === tid){
                divElements.forEach(function(divElement) {
                    var id = uuidv5(uuidv4(), new Date());
                    var name = divElement.querySelector('#playerName').value;
                    var birth = divElement.querySelector('input[id^="birthPlayer-"]').value;
                    const avatar = divElement.querySelector('input[type="file"][name="avatar"]').files[0];
                    var upfiles = divElement.querySelector('[id^="files_"]');

                    if(divElement.dataset.playerid){ // if Player exist
                        var pid = divElement.dataset.playerid;
                        playersData.forEach(player => {
                            if(player.id == pid){
                                player.name = name;
                                player.birth = birth;
                                if(upfiles.dataset.uploadedfiles){
                                    const filesList = upfiles.dataset.uploadedfiles.split(',');
                                    filesList.forEach(function(file){
                                        player.docs.push(file);
                                    });
                                };
                                if (avatar) {
                                    promises.push(uploadFile(avatar)
                                        .then(function(avatarUrl) {
                                            player.pic = avatarUrl;
                                            return new Promise(function(resolve, reject) {
                                                updatePlayer(pid, player)
                                                    .then(function() {
                                                        resolve();
                                                    })
                                                    .catch(function(error) {
                                                        console.error('Failed to update player on the server:', error);
                                                        reject(error);
                                                    });
                                            });
                                        })
                                        .catch(function(error) {
                                            console.error('Error uploading player avatar:', error);
                                        })
                                    );
                                }else{
                                    return new Promise(function(resolve, reject) {
                                        updatePlayer(pid, player)
                                            .then(function() {
                                                resolve();
                                            })
                                            .catch(function(error) {
                                                console.error('Failed to update player on the server:', error);
                                                reject(error);
                                            });
                                    });
                                }
                            };
                        });
                    }else{
                        var uploadedFiles = [];
                        // var uploadedFiles = upzone.dataset.uploadedfiles.split(',');
                        if(upfiles.dataset.uploadedfiles){
                            const filesList = upfiles.dataset.uploadedfiles.split(',');
                            filesList.forEach(function(file){
                                uploadedFiles.push(file);
                            });
                        };

                        // Check if avatar file exists
                        if (avatar) {
                            promises.push(uploadFile(avatar)
                                .then(function(avatarUrl) {
                                    return savePlayer(id, name, birth, avatarUrl, uploadedFiles);
                                })
                                .catch(function(error) {
                                    console.error('Error uploading player avatar:', error);
                                })
                            );
                        } else {
                            promises.push(savePlayer(id, name, birth, null, uploadedFiles));
                        }
                    }

                });

                // After all player data is saved, proceed with saving team data
                Promise.all(promises).then(function() {
                    // Collect player IDs
                    var playerIds = players.map(player => ({ player: player.player }));

                    var id = uuidv5(uuidv4(), new Date());
                    var logoPromise = logo.files[0] ? uploadFile(logo.files[0]) : Promise.resolve(team.pic);

                    logoPromise.then(function(logoUrl) {
                        team.name = newTeamName;
                        team.category = category;
                        team.gender = gender;
                        team.pic = logoUrl;

                        team.players = team.players.filter(player => !delPlayers.includes(player.player.toString()));
                        team.players = team.players.concat(playerIds);

                        updateTeam(team.id, team)
                            .then(function() {
                                console.log('Team updated.');
                                var alertForm = $('#alert-form');
                                var bodyForm = $('#body-form');
                                var finalForm = $('#final-form');
                                alertForm.html(``);
                                bodyForm.html(`
                                <div class="row">
                                    <div class="col-12 text-center">
                                        <h1>Registro guardado correctamente</h1>
                                        <div class="my-10 border border-primary rounded p-5">Si hay algún problema o aclaración, el identificador de este equipo es <strong>${team.uuid}</strong>.</div>
                                    </div>
                                </div>
                                `);
                                finalForm.html(``);
                            })
                            .catch(function(error) {
                                console.error('Failed to update team on the server:', error);
                            });
                    }).catch(function(error) {
                        console.error('Error uploading team logo:', error);
                        btn.removeAttribute("data-kt-indicator");
                        btn.disabled = false;
                    });
                }).catch(function(error) {
                    console.error('One or more AJAX calls failed:', error);
                    btn.removeAttribute("data-kt-indicator");
                    btn.disabled = false;
                });
            }
        });
    }else{
        // Iterate through each div element with the name "player"
        divElements.forEach(function(divElement) {
            var id = uuidv5(uuidv4(), new Date());
            var name = divElement.querySelector('#playerName').value;
            var birth = divElement.querySelector('input[id^="birthPlayer-"]').value;
            const avatar = divElement.querySelector('input[type="file"][name="avatar"]').files[0];
            var upfiles = divElement.querySelector('[id^="files_"]');

            var uploadedFiles = [];
            // var uploadedFiles = upzone.dataset.uploadedfiles.split(',');
            if(upfiles.dataset.uploadedfiles){
                const filesList = upfiles.dataset.uploadedfiles.split(',');
                filesList.forEach(function(file){
                    uploadedFiles.push(file);
                });
            };

            // Check if avatar file exists
            if (avatar) {
                promises.push(uploadFile(avatar)
                    .then(function(avatarUrl) {
                        if(divElement.dataset.playerid){
                            console.log(true);
                        }
                        return savePlayer(id, name, birth, avatarUrl, uploadedFiles);
                    })
                    .catch(function(error) {
                        console.error('Error uploading player avatar:', error);
                    })
                );
            } else {
                promises.push(savePlayer(id, name, birth, null, uploadedFiles));
            }
        });

        // After all player data is saved, proceed with saving team data
        Promise.all(promises).then(function() {
            var id = uuidv5(uuidv4(), new Date());
            var logoPromise = logo.files[0] ? uploadFile(logo.files[0]) : Promise.resolve(null);

            logoPromise.then(function(logoUrl) {
                $.ajax({
                    url: '/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        json: JSON.stringify({ uuid: id }),
                        data: newTeamName,
                        type: 'addteam'
                    },
                    success: function(response) {
                        var j = {
                            id: response.id,
                            uuid: id,
                            name: newTeamName,
                            created: response.registered,
                            category: category,
                            gender: gender,
                            pic: logoUrl,
                            active: false,
                            players: players
                        };
                        updateTeam(response.id, j)
                            .then(function() {
                                console.log('Team updated.');
                                var alertForm = $('#alert-form');
                                var bodyForm = $('#body-form');
                                var finalForm = $('#final-form');
                                alertForm.html(``);
                                bodyForm.html(`
                                <div class="row">
                                    <div class="col-12 text-center">
                                        <h1>Registro guardado correctamente</h1>
                                        <div class="my-10 border border-primary rounded p-5">Para poder editar o modificar la información del equipo utiliza este enlace: <strong><a href="${url}/ted/${j.uuid}">${url}/ted/${j.uuid}</a></strong>.</div>
                                    </div>
                                </div>
                                `);
                                finalForm.html(``);
                            })
                            .catch(function(error) {
                                console.error('Failed to update team on the server:', error);
                            });
                    },
                    error: function(xhr, status, error) {
                        console.error('Error saving team:', error);
                    },
                    complete: function() {
                        btn.removeAttribute("data-kt-indicator");
                        btn.disabled = false;
                    }
                });
            }).catch(function(error) {
                console.error('Error uploading team logo:', error);
                btn.removeAttribute("data-kt-indicator");
                btn.disabled = false;
            });
        }).catch(function(error) {
            console.error('One or more AJAX calls failed:', error);
            btn.removeAttribute("data-kt-indicator");
            btn.disabled = false;
        });
    }
};

function editTeamform(id){

    loadData().then(function(result) {
        var formData = $('#formContent');
        var teamHeader = $('#teamheader');
        if (result) {
            teamsData.forEach(function(team){
                if(team.uuid == id){
                    if(!team.active){
                        const cate = { name: null, color: null, gender: null};
                        var cates = "";

                        var catess = ['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20', 'U21', 'U22'];

                        catess.forEach(cate => {
                            cates += `<option value="${cate}" ${cate === team.category ? 'selected' : ''}>${cate}</option>`;
                        });

                        if(team.pic){
                            pimg = `url(${url}/${team.pic})`;
                        }else{
                            const light = document.querySelector('[data-bs-theme="dark"] .image-input-placeholder');
                            if(light){
                                pimg = `url('${url}/assets/media/svg/files/blank-image-dark.svg')`;
                            }else{
                                pimg = `url('${url}/assets/media/svg/files/blank-image.svg')`;
                            }
                        }

                        teamHeader.append(`
                            <div class="col-12 card card-flush mt-3">
                                <div class="card-body" id="body-form">
                                    <div class="row">

                                        <div class="col-3">
                                            <div style="background-image: ${pimg};" class="image-input image-input-empty image-input-outline image-input-placeholder division-placeholder" data-kt-image-input="true">
                                                <div class="image-input-wrapper w-125px h-125px"></div>
                                                <label class="btn btn-icon btn-circle btn-active-color-primary w-35px h-35px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="${lang.teamlogo}">
                                                    <i class="fa-solid fa-pencil fs-5"></i>
                                                    <input type="file" data-type="avatar" name="avatar" accept=".png, .jpg, .jpeg" />
                                                    <input type="hidden" name="avatar_remove" />
                                                </label>
                                                <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="${lang.cancel}">
                                                    <i class="fa-solid fa-xmark fs-2"></i>
                                                </span>
                                                <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="${lang.remove}">
                                                    <i class="fa-solid fa-xmark fs-2"></i>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="col-9">
                                            <div class="form-floating mb-7">
                                                <input type="text" class="form-control" id="teamName" value="${team.name}"/>
                                                <label for="teamName">${lang.teamname}</label>
                                            </div>
                                            <div class="row">
                                                <div class="form-floating col-6">
                                                    <select class="form-select" id="teamCategory" aria-label="Floating label select example">
                                                        ${cates}                                           
                                                    </select>
                                                    <label for="teamCategory">${lang.category}</label>
                                                </div>
                                                <div class="form-floating col-6">
                                                    <select class="form-select" id="teamGender" aria-label="Floating label select example">
                                                        <option value="m">${lang.male}</option>
                                                        <option value="f">${lang.female}</option>
                                                    </select>
                                                    <label for="teamCategory">${lang.gender}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        );

                        team.players.forEach(function(player){
                            addPlayer(player.player);
                        });

                    }else{
                        var html = `
                        <div class="min-h-500px w-100 d-flex justify-content-center align-items-center">Registro Cerrado</div>
                        `;
                    }
                    // formData.append(html);
                    
                    formData.find('[data-bs-toggle="tooltip"]').tooltip('enable');
                    KTImageInput.createInstances('[data-kt-image-input]');
                }
            });
        };
    });
};