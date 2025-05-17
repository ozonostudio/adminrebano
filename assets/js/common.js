var uuid = $('#uuid').attr('name');
var tourData = [];
var teamsData = [];
var playersData = [];
var timeout;
var url = $('#kt_app_body').data('site-base');
function sha1(t){function r(t,r){return t<<r|t>>>32-r}const o=[1732584193,4023233417,2562383102,271733878,3285377520],n=function(t){const r=8*t.length;for(t+=String.fromCharCode(128);8*t.length%512!=448;)t+=String.fromCharCode(0);return t+=String.fromCharCode(r>>>24&255,r>>>16&255,r>>>8&255,255&r)}(t),e=n.length;for(let t=0;t<e;t+=64){const e=n.substr(t,64),c=[];for(let t=0;t<16;t++)c[t]=e.charCodeAt(4*t)<<24|e.charCodeAt(4*t+1)<<16|e.charCodeAt(4*t+2)<<8|e.charCodeAt(4*t+3);for(let t=16;t<80;t++){const o=c[t-3]^c[t-8]^c[t-14]^c[t-16];c[t]=r(o,1)}let f=o[0],h=o[1],l=o[2],C=o[3],a=o[4];for(let t=0;t<80;t++){let o,n;t<20?(o=h&l|~h&C,n=1518500249):t<40?(o=h^l^C,n=1859775393):t<60?(o=h&l|h&C|l&C,n=2400959708):(o=h^l^C,n=3395469782);const e=r(f,5)+o+a+n+c[t]&4294967295;a=C,C=l,l=r(h,30),h=f,f=e}o[0]=o[0]+f&4294967295,o[1]=o[1]+h&4294967295,o[2]=o[2]+l&4294967295,o[3]=o[3]+C&4294967295,o[4]=o[4]+a&4294967295}return o.map((function(t){let r="";for(let o=7;o>=0;o--)r+=(t>>>4*o&15).toString(16);return r})).join("")}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function goto(url){
	window.location.href = url;
}

function edit(url){
	window.location.href = '/manager/'.url;
}

function uuidv5(name_space, string) {
  const n_hex = name_space.replace(/[-{}]/g, '');
  let binary_str = '';

  for (let i = 0; i < n_hex.length; i += 2) {
	binary_str += String.fromCharCode(parseInt(n_hex.substr(i, 2), 16));
  }
  const hashing = sha1(binary_str + string);
//   return `${hashing.substr(0, 8)}-${hashing.substr(8, 4)}-${((parseInt(hashing.substr(12, 4), 16) & 0x0fff) | 0x5000).toString(16)}-${((parseInt(hashing.substr(16, 4), 16) & 0x3fff) | 0x8000).toString(16)}-${hashing.substr(20, 12)}`;
    return `${hashing.slice(0, 8)}-${hashing.slice(8, 12)}-${((parseInt(hashing.slice(12, 16), 16) & 0x0fff) | 0x5000).toString(16)}-${((parseInt(hashing.slice(16, 20), 16) & 0x3fff) | 0x8000).toString(16)}-${hashing.slice(20, 32)}`;
}

function getCurrentDateTime() {
    const now = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const formattedDate = now.toLocaleString('en-US', options).replace(/\//g, '-');
    return formattedDate;
}

function insertBeforeElement(elementId, htmlContent) {
    const elementToInsertBefore = document.getElementById(elementId);
    elementToInsertBefore.insertAdjacentHTML('afterbegin', htmlContent);
}

function readability(hexColor) {
    // Remove the '#' symbol if present
    hexColor = hexColor.replace('#', '');

    // Convert the hex color to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Calculate perceived brightness using the formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Choose black or white based on brightness
    if (brightness >= 128) {
        return '#000000'; // Black
    } else {
        return '#FFFFFF'; // White
    }
}

function setLanguage(value) {
    const days = 365;
    const name = 'lang';
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    window.location.reload();
}

var lang;
$.getJSON('/inc/lang/translate.php', function(data) {
  lang = data;
});

function login(){
    const form = document.getElementById('login_form');
    const submitButton = document.getElementById('log_submit');
    var validator = FormValidation.formValidation(
        form,
        {
            fields: {
                'username': {
                    validators: {
                        notEmpty: {
                            message: 'Se requiere un nombre de usuario'
                        }
                    }
                },
                'password': {
                    validators: {
                        notEmpty: {
                            message: 'Se requiere una contraseña'
                        }
                    }
                },
            },
    
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );
    if (validator) {
        validator.validate().then(function (status) {
            if (status == 'Valid') {
                var username = $('#username').val();
                var password = $('#password').val();
                var actionString = 'login';

                submitButton.setAttribute('data-kt-indicator', 'on');
                submitButton.disabled = true;
                
                $.ajax({
                    url : 're.php',
                    type : 'POST',
                    data : {
                        username : username,
                        password : password,
                        action : actionString
                    },
                    success : function(response) {
                        if (response.trim() == 'error') {
                            Swal.fire({
                                text: "Error al conectar con la base de datos!",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        } else {
                            setTimeout(function () {
                                submitButton.removeAttribute('data-kt-indicator');
                                submitButton.disabled = false;
                                window.location.href = "dashboard";
                            }, 2000);
                        }
                    }
                });
            }
        });
    }
}

function validateInputs(tourDiv, btn) {
    const inputElements = tourDiv.querySelectorAll('input[required]');
  
    for (let i = 0; i < inputElements.length; i++) {
        const inputElement = inputElements[i];
  
        // Check if the input value is empty
        if (inputElement.value.trim() === '') {
            inputElement.classList.add('border-danger', 'is-invalid');
            if (btn) {
                btn.classList.add('border-danger', 'is-invalid', 'bg-light-danger', 'text-dark', 'btn-active-danger');
            }
            return false;
        } else {
            inputElement.classList.remove('border-danger', 'is-invalid');
            if (btn) {
                btn.classList.remove('border-danger', 'is-invalid', 'bg-light-danger', 'text-dark', 'btn-active-danger');
            }
        }
    }
    return true;
}

function update(uuid, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/save.php',
            type: 'POST',
            dataType: 'json',
            data: {
                json: JSON.stringify({ uuid: uuid }),
                data: JSON.stringify(data),
                type: 'update'
            },
            success: function (response) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                reject(false);
            },
        });
    });
}

function updateTeam(teamid, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/save.php',
            type: 'POST',
            dataType: 'json',
            data: {
                json: JSON.stringify({ uuid: teamid }),
                data: JSON.stringify(data),
                type: 'updateTeam'
            },
            success: function (response) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                reject(false);
            },
        });
    });
}

function updatePlayer(teamid, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/save.php',
            type: 'POST',
            dataType: 'json',
            data: {
                json: JSON.stringify({ uuid: teamid }),
                data: JSON.stringify(data),
                type: 'updatePlayer'
            },
            success: function (response) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                reject(false);
            },
        });
    });
}

function dismissModal(id) {
    var myModalEl = document.getElementById(id)
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}

function removeConfirmation() {
    var id = uuidv5(uuidv4(), new Date());
    return new Promise((resolve) => {
        const modalElement = document.createElement('div');
        modalElement.id = id;

        modalElement.innerHTML = `
        <div class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" id="${id}-12">
            <div class="modal-dialog modal-dialog-centered mw-500px">
                <div class="modal-content bg-light-danger d-flex flex-center flex-column p-8">
                    <div class="modal-body">
                        <div class="text-center">
                            <i class="fa-duotone fa-hexagon-exclamation fs-5tx text-danger mb-5"></i>
                            <h1 class="fw-bold mb-5">${lang.aresure}</h1>
                            <div class="separator separator-dashed border-danger opacity-25 mb-5"></div>
                            
                            <div class="mb-9 text-dark">${lang.erasedesc}</div>
                            
                            <div class="d-flex flex-center flex-wrap">
                                <button type="button" class="btn btn-outline btn-outline-danger btn-active-danger m-2" data-bs-dismiss="modal">${lang.cancel}</button>
                                <button type="button" class="btn btn-danger m-2" id="confirmButton">${lang.continue}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Append the modal to the body
        document.body.appendChild(modalElement);
        const confirmButton = modalElement.querySelector('#confirmButton');

        confirmButton.addEventListener('click', () => {
            resolve(true);
            dismissModal(`${id}-12`);
        });

        const modalWarning = new bootstrap.Modal(modalElement.querySelector('.modal'));
        modalWarning.show();

        modalElement.addEventListener('hidden.bs.modal', () => {
            resolve(false);
            dismissModal(`${id}-12`);
        });
    });
}

function saveConfirmation() {
    var id = uuidv5(uuidv4(), new Date());
    return new Promise((resolve) => {
        const modalElement = document.createElement('div');
        modalElement.id = id;

        modalElement.innerHTML = `
        <div class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" id="${id}-12">
            <div class="modal-dialog modal-dialog-centered mw-500px">
                <div class="modal-content bg-light-success d-flex flex-center flex-column p-8">
                    <div class="modal-body">
                        <div class="text-center">
                            <i class="fa-duotone fa-floppy-disk fs-5tx text-success mb-5"></i>
                            <h1 class="fw-bold mb-5">${lang.aresure}</h1>
                            <div class="separator separator-dashed border-success opacity-25 mb-5"></div>
                            
                            <div class="mb-9 text-dark">${lang.addreg}</div>
                            
                            <div class="d-flex flex-center flex-wrap">
                                <button type="button" class="btn btn-outline btn-outline-success btn-active-success m-2" data-bs-dismiss="modal">${lang.cancel}</button>
                                <button type="button" class="btn btn-success m-2" id="confirmButton">${lang.continue}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Append the modal to the body
        document.body.appendChild(modalElement);
        const confirmButton = modalElement.querySelector('#confirmButton');

        confirmButton.addEventListener('click', () => {
            resolve(true);
            dismissModal(`${id}-12`);
        });

        const modalWarning = new bootstrap.Modal(modalElement.querySelector('.modal'));
        modalWarning.show();

        modalElement.addEventListener('hidden.bs.modal', () => {
            resolve(false);
            dismissModal(`${id}-12`);
        });
    });
}

function pdf(uuid,id,cate){
    
    const rdata = findtourData(tourData, uuid, id, cate);
    const { tournament, division, category } = rdata;

    var pdfModal = new bootstrap.Modal(document.getElementById("pdf_modal"), {});
	pdfModal.show();
    
    var div = document.createElement('div');
    div.id = 'pdf_preview';

    div.innerHTML = `
    <div class="bg-white row mw-650px text-dark" data-bs-theme="light">
        <div class="col-12 text-center">
            <img class="mt-5 rounded-circle" src="${division.pic}" style="width: 100px;"/>
            <div class="fs-3 fw-bolder d-sm-bold mt-2 text-uppercase">${division.name}</div>
        </div>
    </div>`;
      
    var pdf = new jspdf.jsPDF('p', 'pt', 'letter');
    document.body.appendChild(div);

    pdf.html(document.getElementById('pdf_preview'), {
        callback: function (pdf) {
            pdf.save(`${division.name.replace(/\s+/g, '-')}_${category.name.replace(/\s+/g, '-')}.pdf`);
            div.parentNode.removeChild(div);
        }
    });
}

function loadData(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/data.php', // Replace with the correct path to load_tournaments.php
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if(data.response === 'done'){
                    tourData = data.data;
                    teamsData = data.teams;
                    playersData = data.players;
                    resolve(true);
                }else{
                    resolve(false);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error loading tournaments:', error);
                reject(false);
            },
        });
    });
};

function findtourData(data, uuid, div, cat, g) {
    const tournament = data.find(tournament => tournament.uuid === uuid);
    if (!tournament) return { tournament: null };
  
    if (!div) return { tournament };
  
    const division = tournament.divisions.find(division => division.id === div);
    if (!division) return { tournament, division };
  
    if (!cat) return { tournament, division };
  
    const category = division.categories.find(category => category.id === cat);
    if (!category) return { tournament, division, category };
  
    if (!g) return { tournament, division, category };
  
    const group = category.groups.find(groupItem => groupItem.group === g);
    if (!group) return { tournament, division, category, group };
  
    return {
        tournament,
        division,
        category,
        group
    };
}

function findCategoryById(data, categoryId) {
    for (const tournament of data) {
        for (const division of tournament.divisions) {
            const category = division.categories.find(category => category.id === categoryId);
            if (category) {
                return { tournament, division, category };
            }
        }
    }
    return null;
}

function getFileDetails(file) {
    // Split the file path by '/'
    var parts = file.split('/');
    // Get the filename (last part after splitting by '/')
    var filename = parts[parts.length - 1];
    // Split the filename by '.' to get the name and extension
    var filenameParts = filename.split('.');
    // Get the extension (last part after splitting by '.')
    var extension = filenameParts[filenameParts.length - 1];
    // Remove the extension from the filename
    var name = filename.replace('.' + extension, '');

    return {
        name: name,
        extension: extension
    };
}