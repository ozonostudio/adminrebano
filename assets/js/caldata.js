// Calendar --------------------------------------------------
var rresources;
var revents;
var timeout;
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

function loadCalendar(uuid, div){
    loadData().then(function(result) {
        if (result) {
            const rdata = findtourData(tourData, uuid, div);
            const { tournament, division } = rdata;
            
            $('#groups_side').html(`<div id="external-events" class="scrollext"></div>`);
            $("#page_name").html(`${lang.cal}`);
            $("#breadc").html(`
            <li class="breadcrumb-item text-muted"><a href="${url}" class="text-muted text-hover-primary">${lang.home}</a></li>
            <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
            <li class="breadcrumb-item text-muted"><a href="${url}/tournaments" class="text-muted text-hover-primary">${lang.tour}</a></li>
            <li class="breadcrumb-item"><span class="bullet bg-primary w-4px h-4px"></span></li>
            <li class="breadcrumb-item text-muted"><a href="${url}/d/${uuid}/${div}" class="text-muted text-hover-primary">${division.name}</a></li>`);

            // Add fields section
            $('#create_btn_placeholder').html(`
            <div class="card card-flush rounded border shadow-sm">
                <div class="card-header collapsible cursor-pointer rotate min-h-40px ps-5 pe-4" data-bs-toggle="collapse" data-bs-target="#fields_col">
                    <div class="card-title fs-4">${lang.fieldedit}</div>
                    <div class="card-toolbar rotate-180">
                        <i class="fa-duotone fa-square-caret-down fs-1"></i>
                    </div>
                </div>
                <div id="fields_col" class="collapse show">
                    <div class="card-body p-2">
                        <div id="inputFields">
                        </div>
                        <button type="button" id="addField" class="btn btn-primary w-100 mt-0" data-tournament="${tournament.uuid}" data-division="${division.id}">
                            <span class="indicator-label">
                                ${lang.addfield}
                            </span>
                            <span class="indicator-progress">
                                ${lang.wait} <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>`);

            var endDate = new Date(division.end);
            endDate.setDate(endDate.getDate() + 1);
            var endplus = endDate.toISOString().split('T')[0];
            

            calendarEl = document.getElementById('calendar_content');
            calendar = new FullCalendar.Calendar(calendarEl, {
                slotDuration: "00:05:00",
                initialDate: division.start,
                resourceOrder: 'index',
                dayMinWidth: 100,
                slotMinTime: "00:00:00",
                slotMaxTime: "24:00:00",
                themeSystem: "bootstrap",
                locale: 'es',
                bootstrapFontAwesome: !1,
                buttonText: { today: "Hoy", month: "Mes", week: "Semana", day: "Día", list: "Lista", prev: `${lang.prev}`, next: `${lang.next}` },
                initialView: "resourceTimeGridDay",
                handleWindowResize: !0,
                headerToolbar: { left: "prev", center: "title", right: "next" },
                titleFormat: { month: 'long', day: 'numeric' },
                validRange: {
                    start: division.start,
                    end: endplus
                },
                resources: rresources,
                events: revents,
                allDaySlot: false,
                eventOverlap: false,
                editable: !0,
                height: window.innerHeight - 160,
                eventDurationEditable: true,
                droppable: true,
                drop: function(info) {
                    var parent = info.resource._resource.parentId;
                    var oldDateObj = new Date(info.dateStr);
                    var end = new Date();
                    var min = info.draggedEl.getAttribute('data-time').substring(3);
                    
                    if(parent){
                        calendar.addEvent({
                            id: info.draggedEl.id + '-sub',
                            className: 'sub-round',
                            start: info.dateStr,
                            end: end.setTime(oldDateObj.getTime() + (min * 60 * 1000)),
                            display: 'background',
                            color: '#424e5a',
                            resourceId: parent
                        });
                    }
                    info.draggedEl.parentNode.removeChild(info.draggedEl);
                    clearTimeout(timeout);
                    timeout = setTimeout(function() { check(); }, 500);
                },
                eventDragStart: function(e) {
                    var subid = calendar.getEventById( e.event._def.publicId + '-sub' );
                    var parid = calendar.getResourceById(e.event._def.resourceIds[0])._resource.parentId;
                    if(parid && subid){
                        subid.remove();
                    }
                },
                eventDrop: function(e) {
                    var subid = calendar.getEventById( e.event._def.publicId + '-sub' );
                    var parid = calendar.getResourceById(e.event._def.resourceIds[0])._resource.parentId;
                    if(parid && !subid){
                        calendar.addEvent({
                            id: e.event._def.publicId + '-sub',
                            className: 'sub-round',
                            start: e.event.start.toISOString(),
                            end: e.event.end.toISOString(),
                            display: 'background',
                            color: '#424e5a',
                            resourceId: parid
                        });
                    }
                    clearTimeout(timeout);
                    timeout = setTimeout(function() { check(); }, 500);
                },
                eventResizeStart: function(e) {
                    var subid = calendar.getEventById( e.event._def.publicId + '-sub' );
                    var parid = calendar.getResourceById(e.event._def.resourceIds[0])._resource.parentId;
                    if(parid && subid){
                        subid.remove();
                    }
                },
                eventResize: function(e) {
                    var subid = calendar.getEventById( e.event._def.publicId + '-sub' );
                    var parid = calendar.getResourceById(e.event._def.resourceIds[0])._resource.parentId;
                    if(parid && !subid){
                        calendar.addEvent({
                            id: e.event._def.publicId + '-sub',
                            className: 'sub-round',
                            start: e.event.start.toISOString(),
                            end: e.event.end.toISOString(),
                            display: 'background',
                            color: '#424e5a',
                            resourceId: parid
                        });
                    }
                    clearTimeout(timeout);
                    timeout = setTimeout(function() { check(); }, 500);
                },
                eventClick: function(e) {
                    if(e.event.title){
                        var myModal = new bootstrap.Modal(document.getElementById("warning-alert-modal"), {});
                        myModal.show();
                        
                        s = new Date(e.event.start.toISOString());
                        n = new Date(e.event.end.toISOString());
                        var format = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
                          
                        var startEn = new Intl.DateTimeFormat('en-US', format).format(s);
                        var startEs = new Intl.DateTimeFormat('es-ES', format).format(s);

                        var endEn = new Intl.DateTimeFormat('en-US', format).format(n);
                        var endEs = new Intl.DateTimeFormat('es-ES', format).format(n);

                        var start = (lang.home === 'Home') ? startEn : startEs;
                        var end = (lang.home === 'Home') ? endEn : endEs;

                        var eventData = {
                            event_name: e.event.title,
                            all_day: `${lang.group} ${e.event.extendedProps.group}`,
                            event_description: `${lang.eventdesc}`,
                            event_start_date: start,
                            event_end_date: end,
                            category: `${lang.category}: ${e.event.extendedProps.category}`,
                            round: `${lang.round}: ${e.event.extendedProps.round}`,
                        };

                        document.querySelectorAll('[data-kt-calendar]').forEach(function(spanElement) {
                            var attributeKey = spanElement.getAttribute('data-kt-calendar');
                            
                            if (eventData.hasOwnProperty(attributeKey)) {
                              spanElement.textContent = eventData[attributeKey];
                            }
                        });
                        
                        document.getElementById("removeEventCal").setAttribute("name", e.event.id);
                    }
                }
            });
            calendar.render();
            // start: resources loader --------------------
            const resources = division.calendar.resources;
            if(resources){
                resources.forEach(function(resource) {
                    $('#inputFields').append(`
                    <div class="pb-3 position-relative" id="b-${resource.id}">
                        <a href="#" onclick="delField(this.id); return false;" id="${resource.id}" class="btn btn-icon btn-active-light-danger w-25px h-25px position-absolute" style="right: 5px; top:5px;">
                            <i class="fa-regular fa-xmark fs-4"></i>
                        </a>
                        <a href="#" onclick="subField(this.id); return false;" id="${resource.id}" class="btn btn-icon btn-active-light-primary w-25px h-25px position-absolute" style="right: 31px; top:5px;" data-bs-toggle="tooltip" title="${lang.subfield}">
                            <i class="fa-solid fa-split fs-4"></i>
                        </a>
                        <input type="text" class="form-control form-control-sm pe-20" name="cal_fields" id="f-${resource.id}" value="${resource.title}">
                    </div>`);
                    
                    if(resource.children !== undefined){
                        resource.children.forEach(function(sub){
                            $(`#b-${resource.id}`).append(`
                            <div id="b-${sub.id}" class="position-relative ms-5 mt-1">
                                <a href="#" onclick="delField(this.id); return false;" id="${sub.id}" class="btn btn-icon btn-active-light-danger w-25px h-25px position-absolute" style="right: 5px; top:5px;">
                                    <i class="fa-regular fa-xmark fs-4"></i>
                                </a>
                                <input class="form-control form-control-sm disabled-input" id="f-${sub.id}" value="${sub.title}" disabled>
                            </div>`);
                        })
                    }
                    
                    calendar.addResource({
                    id: resource.id,
                    title: resource.title,
                    children: resource.children
                    });
                    $('#inputFields').find('[data-bs-toggle="tooltip"]').tooltip('enable');
                    
                });
                var events = division.calendar.events;
                events.forEach(function(e) {
                    if(e.extendedProps){
                        if(e.extendedProps.cid){
                            const tdata = findCategoryById(tourData, e.extendedProps.cid);
                            const { tournament, division, category } = tdata;

                            const team1 = e.extendedProps.team1 === 'null' ? e.extendedProps.name1 : category.teams[e.extendedProps.team1];
                            const team2 = e.extendedProps.team2 === 'null' ? e.extendedProps.name2 : category.teams[e.extendedProps.team2];
                            
                            e.title = `${team1} vs ${team2}`;
                        }
                    }
                    calendar.addEvent(e);
                });
            }else{
                var i = uuidv4();
                var lvls = JSON.parse(JSON.stringify(calendar.getTopLevelResources()));
                var z = lvls.length;
                
                var lists = document.getElementById('inputFields');
                calendar.addResource({
                    id: `0${z+1}-${i}`,
                    title: `${lang.field} ${z+1}`
                });
                $('#inputFields').append(`
                <div class="pb-3 position-relative" id="b-0${z+1}-${i}">
                    <a href="#" onclick="delField(this.id); return false;" id="0${z+1}-${i}" class="btn btn-icon btn-active-light-danger w-25px h-25px position-absolute" style="right: 5px; top:5px;" data-bs-toggle="tooltip" title="${lang.delete}">
                        <i class="fa-regular fa-xmark fs-4"></i>
                    </a>
                    <a href="#" onclick="subField(this.id); return false;" id="0${z+1}-${i}" class="btn btn-icon btn-active-light-primary w-25px h-25px position-absolute" style="right: 31px; top:5px;" data-bs-toggle="tooltip" title="${lang.subfield}">
                        <i class="fa-solid fa-split fs-4"></i>
                    </a>
                    <input type="text" class="form-control form-control-sm pe-20" name="cal_fields" id="f-0${z+1}-${i}" value="${lang.field} ${z+1}">
                </div>`);
            }
            // end: resources loader ----------------------

            // start: events loader -----------------------
            const calendarEvents = calendar.getEvents();
            var evlist = '';
            division.categories.forEach(category =>{
                var genderColor = (category.gender === 'm' || category.gender === null || category.gender === undefined) ? 'primary' : 'danger';
                var gender = (category.gender === 'm' || category.gender === null || category.gender === undefined) ? lang.male : lang.female;
                evlist += `
                <div class="card shadow-sm rounded card-flush border border-gray-200 bg-light mb-5">
                    <div class="card-header collapsible cursor-pointer rotate min-h-40px ps-3 pe-4" data-bs-toggle="collapse" data-bs-target="#${category.id}">
                        <div class="card-title">
                            <i class="fa-duotone fa-circle-dot fs-1 pe-3" style="--fa-primary-color: ${category.color}; --fa-secondary-color: ${category.color};"></i>
                            ${category.name}
                            <span class="ms-3 badge badge-light-${genderColor}">${gender}</span>
                        </div>
                        <div class="card-toolbar rotate-180">
                            <i class="fa-solid fa-caret-down fs-3"></i>
                        </div>
                    </div>
                    <div id="${category.id}" class="collapse show">
                        <div class="card-body p-1">`;

                        category.schedule.forEach(group =>{
                            var title;
                            if (group.group === 'quarter' || group.group === 'final' || group.group === 'semifinal') {
                                title = (group.group === 'quarter' && lang.home === 'Home') ? 'Quarter' : (group.group === 'final') ? 'Final' : (group.group === 'semifinal') ? 'Semifinal' : 'Cuartos';
                            }else if(group.group === 'octag' || group.group === 'quarterg' || group.group === 'finalg' || group.group === 'semifinalg'){
                                title = lang[group.group];
                            }else{
                                title = `${lang.group} ${group.group}`;
                            }
                            evlist += `
                            <div class="card rounded card-flush border-gray-400 bg-light border mt-1">
                                <div class="card-header border-bottom-0 collapsible cursor-pointer rotate min-h-30px ps-3 pe-4" data-bs-toggle="collapse" data-bs-target="#${category.id}-${group.group}">
                                    <div class="card-title">
                                        <span class="fs-7">${title}</span>
                                    </div>
                                    <div class="card-toolbar rotate-180">
                                        <i class="fa-solid fa-caret-down fs-5"></i>
                                    </div>
                                </div>
                                <div id="${category.id}-${group.group}" class="collapse show">
                                    <div class="card-body p-1">`;
                                        group.rounds.forEach((round, index) =>{
                                            const gameid = uuidv5(uuid, category.id + group.group + index);
                                            const headerg = (group.group !== 'quarter' && group.group !== 'final' && group.group !== 'semifinal') ? `<div class="card-header min-h-30px ps-3 pe-4"> <div class="card-title"> <span class="fs-7 text-muted">${lang.round} ${index+1}</span> </div></div>` : '' ;
                                        evlist += `
                                        <div class="card rounded mt-1">
                                            ${headerg}
                                            <div class="card-body p-1" id="${gameid}">`;
                                            round.forEach((match, i) => {
                                                // console.log(match[0].id);
                                                // var uuid1 = uuidv5(uuid, match[0].games[0].team + match[0].games[1].team + group.group + index);
                                                if (!isEventExists(match[0].id, calendarEvents)) {
                                                    // const team1 = (!lang[match[0].games[0].team]) ? category.teams[match[0].games[0].teamid] : lang[match[0].games[0].team];
                                                    // const team2 = (!lang[match[0].games[1].team]) ? category.teams[match[0].games[1].teamid] : lang[match[0].games[1].team];

                                                    const team1 = (!lang[match[0].games[0].team]) ? (match[0].games[0].teamid !== null ? category.teams[match[0].games[0].teamid] : match[0].games[0].team) : lang[match[0].games[0].team];
                                                    const team2 = (!lang[match[0].games[1].team]) ? (match[0].games[1].teamid !== null ? category.teams[match[0].games[1].teamid] : match[0].games[1].team) : lang[match[0].games[1].team];

                                                    const decont = `${team1} vs ${team2}`;
                                                    evlist += 
                                                    `<div class="p-3 fw-bold external-event list-group-item eventItem${category.id}" data-catid="${category.id}" data-content="${encodeURIComponent(decont)}" id="${match[0].id}" data-group="${group.group}" data-color="${category.color}" data-cate="${category.name}" data-game="${index+1}" data-cat="${gameid}" data-cont="${team1} vs ${team2}" data-team1="${match[0].games[0].teamid}" data-team2="${match[0].games[1].teamid}"  data-name1="${match[0].games[0].team}" data-name2="${match[0].games[1].team}" data-time="00:${category.time}"><span>${decont}</span></div>`;
                                                }
                                            });
                                            evlist += `
                                            </div>
                                        </div>
                                        `;
                                        })
                                    evlist += `
                                    </div>
                                </div>
                            </div>`;
                        });

                        evlist += `
                        </div>
                    </div>
                </div>`;
            });
            $('#external-events').html(evlist);

            // end: events loader -------------------------
            new FullCalendar.Draggable(document.getElementById("external-events"), {
                itemSelector: ".external-event",
                eventData: function(e) {
                    const tdata = findCategoryById(tourData, e.getAttribute('data-catid'));
                    const { tournament, division, category } = tdata;

                    const team1 = e.getAttribute('data-team1') === 'null' ? e.getAttribute('data-name1') : category.teams[e.getAttribute('data-team1')];
                    const team2 = e.getAttribute('data-team2') === 'null' ? e.getAttribute('data-name2') : category.teams[e.getAttribute('data-team2')];

                    return {
                        id: e.id,
                        title: `${team1} vs ${team2}`,
                        duration: e.getAttribute('data-time'),
                        overlap: false,
                        backgroundColor: e.getAttribute('data-color'),
                        extendedProps: {
                            id: e.id,
                            uuid: uuid,
                            recreate: e,
                            cid : e.getAttribute('data-catid'),
                            catid : e.getAttribute('data-cat'),
                            group: e.getAttribute('data-group'),
                            category: e.getAttribute('data-cate'),
                            round: e.getAttribute('data-game'),
                            color: e.getAttribute('data-color'),
                            time: e.getAttribute('data-time'),
                            content: e.getAttribute('data-content'),
                            team1: e.getAttribute('data-team1'),
                            team2: e.getAttribute('data-team2'),
                            name1: e.getAttribute('data-name1'),
                            name2: e.getAttribute('data-name2'),
                        }
                    };
                }
            });
            document.getElementById('addField').onclick = function(){
                var i = uuidv4();
                var lvls = JSON.parse(JSON.stringify(calendar.getTopLevelResources()));
                var z = lvls.length;
                
                var lists = document.getElementById('inputFields');
                calendar.addResource({
                    id: `0${z+1}-${i}`,
                    title: `${lang.field} ${z+1}`
                });
                $('#inputFields').append(`
                <div class="pb-3 position-relative" id="b-0${z+1}-${i}">
                    <a href="#" onclick="delField(this.id); return false;" id="0${z+1}-${i}" class="btn btn-icon btn-active-light-danger w-25px h-25px position-absolute" style="right: 5px; top:5px;">
                        <i class="fa-regular fa-xmark fs-4"></i>
                    </a>
                    <a href="#" onclick="subField(this.id); return false;" id="0${z+1}-${i}" class="btn btn-icon btn-active-light-primary w-25px h-25px position-absolute" style="right: 31px; top:5px;" data-bs-toggle="tooltip" title="${lang.subfield}">
                        <i class="fa-solid fa-split fs-4"></i>
                    </a>
                    <input type="text" class="form-control form-control-sm pe-20" name="cal_fields" id="f-0${z+1}-${i}" value="${lang.field} ${z+1}">
                </div>`);
                $('#inputFields').find('[data-bs-toggle="tooltip"]').tooltip('enable');
                clearTimeout(timeout);
                timeout = setTimeout(function() { check(); }, 500);
            };

            $(document).on('input', 'input[name="cal_fields"]', function() {
                var input = $(this);
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    calendar.addResource({
                        id: input.attr('id').replace("f-", ""),
                        title: input.val()
                    });
                    check();
                }, 500);
            });

            function delField(id) {
                // Children -------------------------------------
                var children = calendar.getResourceById(id).getChildren();
                children.forEach((a) => {
                    var evChild = calendar.getResourceById(a.id).getEvents();
                    evChild.forEach((b) => {
                        // $('#' + b.extendedProps.catid).append(b.extendedProps.recreate);
                        $('#' + b.extendedProps.catid).append(`<div class="p-3 fw-bold external-event list-group-item " data-catid="${b.extendedProps.cid}" data-content="${b.extendedProps.content}" id="${b.extendedProps.id}" data-group="${b.extendedProps.group}" data-color="${b.extendedProps.color}" data-cate="${b.extendedProps.category}" data-game="${b.extendedProps.round}" data-cat="${b.extendedProps.catid}" data-cont="${b.title}" data-time="${b.extendedProps.time}" data-team1="${b.extendedProps.team1}" data-team2="${b.extendedProps.team2}"><span>${decodeURIComponent(b.extendedProps.content)}</span></div>`);
                        calendar.getEventById(b.id).remove();
                        calendar.getEventById(b.id + '-sub').remove();
                    });
                    calendar.getResourceById(a.id).remove();
                });
                // Main Resoures ----------------------------------
                var events = calendar.getResourceById(id).getEvents();
                events.forEach((c) => {
                    // $('#' + c.extendedProps.catid).append(c.extendedProps.recreate);
                    $('#' + c.extendedProps.catid).append(`<div class="p-3 fw-bold external-event list-group-item " data-catid="${c.extendedProps.cid}" data-content="${c.extendedProps.content}" id="${c.extendedProps.id}" data-group="${c.extendedProps.group}" data-color="${c.extendedProps.color}" data-cate="${c.extendedProps.category}" data-game="${c.extendedProps.round}" data-cat="${c.extendedProps.catid}" data-cont="${c.title}" data-time="${c.extendedProps.time}" data-team1="${c.extendedProps.team1}" data-team2="${c.extendedProps.team2}"><span>${decodeURIComponent(c.extendedProps.content)}</span></div>`);
                    calendar.getEventById(c.id).remove();
                    var subid = calendar.getEventById(c.id + '-sub');
                    if(subid){
                        subid.remove();
                    }
                    
                });
                $('#b-' + id + '').remove();
                calendar.getResourceById('' + id + '').remove();
                check();
            }
            
            function subField(id) {
                var i = uuidv4();
                var children = calendar.getResourceById(id).getChildren();
                var childIds = children.map(function(child) { return child.id });
                var num = childIds.length;
                var x = num+1;
                
                $(`#b-${id}`).append(`
                <div id="b-0${x}-${i}" class="position-relative ms-5 mt-1">
                    <a href="#" onclick="delField(this.id); return false;" id="0${x}-${i}" class="btn btn-icon btn-active-light-danger w-25px h-25px position-absolute" style="right: 5px; top:5px;" data-bs-toggle="tooltip" title="${lang.delete}">
                        <i class="fa-regular fa-xmark fs-4"></i>
                    </a>
                    <input class="form-control form-control-sm disabled-input" id="f-0${x}-${i}" value="${alphabet[num]}" disabled>
                </div>`);
                var name = document.getElementById('f-' + id).value;
                calendar.addResource(
                    {id: '0' + x +'-'+ i , parentId: id, title: `${alphabet[num]}`}
                );
                check();
            }

            function check() {
	
                var data = {resources: [], events: []};
                var redata = JSON.parse(JSON.stringify(calendar.getTopLevelResources()));
                
                redata.forEach((a, index) => {
                    // Resources -------------------------------------------
                    var resource = { id: a.id, title: a.title, order: index };
                    // console.log(index);
                    
                    var r = calendar.getResourceById(a.id).getChildren();
                    var e = calendar.getResourceById(a.id).getEvents();
                    
                    if (r.length > 0) {
                        resource.children = [];
                        r.forEach((c) => {
                            resource.children.push({ id: c.id, title: c.title });
                            var ec = calendar.getResourceById(c.id).getEvents();
                            ec.forEach((f) => {
                                var events = {id: f.id, start: f.start.toISOString(), end: f.end.toISOString(), field: `${calendar.getResourceById(a.id).title} (${calendar.getResourceById(f._def.resourceIds[0]).title})`, resourceId: f._def.resourceIds[0], backgroundColor: f._def.ui.backgroundColor};
                                if(f.title){
                                    events.title = f.title;
                                }else{
                                    events.display = 'background';
                                }
                                if(Object.keys(f.extendedProps).length > 0){
                                    events.extendedProps = f.extendedProps;
                                }
                               data.events.push(events);
                            });
                        });
                    }
                   data.resources.push(resource);
                    // Events -------------------------------------------
                    e.forEach((b) => {
                        var events = {id: b.id, start: b.start.toISOString(), end: b.end.toISOString(), field: calendar.getResourceById(b._def.resourceIds[0]).title, resourceId: b._def.resourceIds[0], backgroundColor: b._def.ui.backgroundColor};
                        if(b.title){
                            events.title = b.title;
                        }else{
                            events.display = 'background';
                        }
                        if(Object.keys(b.extendedProps).length > 0){
                            events.extendedProps = b.extendedProps;
                        }
                       data.events.push(events);
                    });
                });
                
                division.calendar = data;
                update(uuid, tournament);
            }

            function isEventExists(eventId, events) {
                for (let i = 0; i < events.length; i++) {
                    if (events[i].id === eventId) {
                        return true;
                    }
                }
                return false;
            }

            function delEvent(e) {
                var d = calendar.getEventById(e);
                var eventInfo = {
                    id: d.id,
                    recreate: `<div class="p-3 fw-bold external-event list-group-item " data-catid="${d.extendedProps.cid}" data-content="${d.extendedProps.content}" id="${d.extendedProps.id}" data-group="${d.extendedProps.group}" data-color="${d.extendedProps.color}" data-cate="${d.extendedProps.category}" data-game="${d.extendedProps.round}" data-cat="${d.extendedProps.catid}" data-cont="${d.title}" data-time="${d.extendedProps.time}" data-team1="${d.extendedProps.team1}" data-team2="${d.extendedProps.team2}"><span>${decodeURIComponent(d.extendedProps.content)}</span></div>`
                };
            
                $("#" + d.extendedProps.catid).append(eventInfo.recreate);
            
                var n = calendar.getEventById(e + "-sub");
                if (n) {
                n.remove();
                }
                d.remove();
            
                var eventData = JSON.stringify(eventInfo);
                check();
                return eventData;
            }

            window.delField = delField;
            window.delEvent = delEvent;
            window.subField = subField;
        }
    })
};