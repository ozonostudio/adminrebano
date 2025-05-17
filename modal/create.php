<div class="modal fade" id="create_tournament" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-600px">
        <div class="modal-content">
            <div class="modal-body py-lg-10 px-lg-10">
                <form class="form w-100" action="#" id="division_form">
                    <div class="fv-row mb-5">
                        <label class="d-flex align-items-center fs-5 fw-semibold mb-2">
                            <span class="required"><?= $lang['divname'] ?></span>
                            <span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['tourname2'] ?>">
                                <i class="fa-solid fa-circle-question text-gray-500 fs-6"></i>
                            </span>
                        </label>
                        <input type="text" class="form-control form-control form-control-solid" id="division_name" placeholder="" value="" required/>
                    </div>
                    <div class="fv-row mb-10">
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="start_date" class="form-label"><span class="required"><?= $lang['startDesc'] ?></span></label>
                                <div class="input-group log-event" id="kt_td_picker_linked_1">
                                    <input name="start_date" id="start_date" type="text" class="form-control" data-td-toggle="datetimepicker" required/>
                                    <span class="input-group-text">
                                        <i class="fa-regular fa-calendar-range fs-2"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <label for="end_date" class="form-label"><span class="required"><?= $lang['endDesc'] ?></span></label>
                                <div class="input-group log-event" id="kt_td_picker_linked_2">
                                    <input name="end_date" id="end_date" type="text" class="form-control" data-td-toggle="datetimepicker" required/>
                                    <span class="input-group-text">
                                        <i class="fa-regular fa-calendar-range fs-2"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid text-center">
                        <button type="button" class="btn btn-primary flex-shrink-0" name="" onclick="createDiv(this.name)" id="division_button">
                            <span class="indicator-label" data-kt-translate="sign-in-submit"><?= $lang['create'] ?></span>
                            <span class="indicator-progress">
                                <span data-kt-translate="general-progress"><?= $lang['wait'] ?></span>
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
    "use strict";
    document.addEventListener("DOMContentLoaded", function() {
        const linkedPicker1Element = document.getElementById("kt_td_picker_linked_1");
        const linked1 = new tempusDominus.TempusDominus(linkedPicker1Element,{
            restrictions: {
                minDate: new Date()
            },
            localization: {
                format: 'yyyy-MM-dd',
            },
            display: {
                viewMode: "calendar",
                components: {
                    decades: true,
                    year: true,
                    month: true,
                    date: true,
                    hours: false,
                    minutes: false,
                    seconds: false
                }
            }
        });
        const linked2 = new tempusDominus.TempusDominus(document.getElementById("kt_td_picker_linked_2"), {
            useCurrent: false,
            restrictions: {
                minDate: new Date()
            },
            localization: {
                format: 'yyyy-MM-dd',
            },
            display: {
                viewMode: "calendar",
                components: {
                    decades: true,
                    year: true,
                    month: true,
                    date: true,
                    hours: false,
                    minutes: false,
                    seconds: false
                }
            }
        });

        //using event listeners
        linkedPicker1Element.addEventListener(tempusDominus.Namespace.events.change, (e) => {
            linked2.updateOptions({
                restrictions: {
                minDate: e.detail.date,
                },
            });
        });

        //using subscribe method
        const subscription = linked2.subscribe(tempusDominus.Namespace.events.change, (e) => {
            linked1.updateOptions({
                restrictions: {
                maxDate: e.date,
                },
            });
        });
    });
</script>

<div class="modal fade" id="create_category" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">
            <div class="modal-body py-lg-10 px-lg-10">
                <form class="form w-100" action="#" id="category_form">
                    <div class="fv-row mb-7">
                        <label class="form-label required fw-bold"><?= $lang['catediv'] ?></label>
                        <input type="text" class="form-control form-control-solid" id="category_name" placeholder="" value=""/>
                    </div>
                    <div class="fv-row mb-7">
                        <label class="form-label required fw-bold"><?= $lang['colorcate'] ?></label>

                        <input type="text" id="category_color" class="form-control form-control-solid color" value="#067bc2" data-coloris/>
                    </div>

                    <div class="fv-row mb-10">
                        <label class="form-label mb-2 fw-bold"><?= $lang['gendercat'] ?></label>

                        <label class="d-flex flex-stack mb-5 cursor-pointer">
                            <span class="d-flex align-items-center me-2">
                                <span class="symbol symbol-50px me-6">
                                    <span class="symbol-label bg-light-primary">
                                        <i class="fa-regular fa-mars fs-1 text-primary"></i>
                                    </span>
                                </span>
                                <span class="d-flex flex-column">
                                    <span class="fs-5"><?= $lang['male'] ?></span>
                                </span>
                            </span>
                            <span class="form-check form-check-custom form-check-solid">
                                <input class="form-check-input" type="radio" name="category_gender" id="gender_male" value="m" checked/>
                            </span>
                        </label>

                        <label class="d-flex flex-stack mb-5 cursor-pointer">
                            <span class="d-flex align-items-center me-2">
                                <span class="symbol symbol-50px me-6">
                                    <span class="symbol-label bg-light-danger">
                                        <i class="fa-regular fa-venus fs-1 text-danger"></i>
                                    </span>
                                </span>
                                <span class="d-flex flex-column">
                                    <span class="fs-5"><?= $lang['female'] ?></span>
                                </span>
                            </span>
                            <span class="form-check form-check-custom form-check-solid">
                                <input class="form-check-input" type="radio" name="category_gender" id="gender_female" value="f"/>
                            </span>
                        </label>
                    </div>

                    <div class="fv-row row mb-10">
                        <div class="col-8">
                            <label class="form-label"><?= $lang['teamsnum'] ?></label>

                            <select class="form-select form-select-solid" id="category_teams" aria-label="Select example">
                                <option value="4">4 <?= $lang['teams'] ?></option>
                                <option value="6">6 <?= $lang['teams'] ?></option>
                                <option value="8">8 <?= $lang['teams'] ?></option>
                                <option value="10">10 <?= $lang['teams'] ?></option>
                                <option value="12">12 <?= $lang['teams'] ?></option>
                                <option value="14">14 <?= $lang['teams'] ?></option>
                                <option value="16">16 <?= $lang['teams'] ?></option>
                                <option value="18">18 <?= $lang['teams'] ?></option>
                                <option value="20">20 <?= $lang['teams'] ?></option>
                                <option value="22">22 <?= $lang['teams'] ?></option>
                                <option value="24">24 <?= $lang['teams'] ?></option>
                                <!-- <option value="28">28 <?= $lang['teams'] ?></option>
                                <option value="32">32 <?= $lang['teams'] ?></option> -->
                            </select>
                        </div>
                        <div class="col-4">
                            <label class="form-label"><?= $lang['singlegroup'] ?> 
                                <span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['singleinfo'] ?>">
                                    <i class="fa-solid fa-circle-question text-gray-500 fs-6"></i>
                                </span>
                            </label>
                            <div class="form-check form-switch form-check-custom form-check-solid mt-3">
                                <input class="form-check-input h-20px w-30px" type="checkbox" value="" id="singlegroup"/>
                            </div>
                        </div>
                    </div>

                    <div class="fv-row row mb-10">
                        <div class="col-6">
                            <label class="form-label"><?= $lang['gamesnum'] ?></label>
                            <div class="position-relative"
                                data-kt-dialer="true"
                                data-kt-dialer-min="1"
                                data-kt-dialer-suffix=" <?= $lang['games'] ?>">

                                <button type="button" class="btn btn-icon btn-active-color-gray-700 position-absolute translate-middle-y top-50 start-0" data-kt-dialer-control="decrease">
                                    <i class="fa-duotone fa-square-minus fs-2"></i>
                                </button>

                                <input type="text" id="category_games" class="form-control form-control-solid border-0 ps-12" data-kt-dialer-control="input" name="manageBudget" readonly value="1" />

                                <button type="button" class="btn btn-icon btn-active-color-gray-700 position-absolute translate-middle-y top-50 end-0" data-kt-dialer-control="increase">
                                    <i class="fa-duotone fa-square-plus fs-2"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-6">
                        <label class="form-label"><?= $lang['times'] ?></label>
                            <div class="position-relative"
                                data-kt-dialer="true"
                                data-kt-dialer-min="15"
                                data-kt-dialer-max="105"
                                data-kt-dialer-step="5"
                                data-kt-dialer-suffix=" Min">

                                <button type="button" class="btn btn-icon btn-active-color-gray-700 position-absolute translate-middle-y top-50 start-0" data-kt-dialer-control="decrease">
                                    <i class="fa-duotone fa-square-minus fs-2"></i>
                                </button>

                                <input type="text" id="category_time" class="form-control form-control-solid border-0 ps-12" data-kt-dialer-control="input" name="manageBudget" readonly value="15" />

                                <button type="button" class="btn btn-icon btn-active-color-gray-700 position-absolute translate-middle-y top-50 end-0" data-kt-dialer-control="increase">
                                    <i class="fa-duotone fa-square-plus fs-2"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    <div class="d-grid text-center">
                        <button type="button" class="btn btn-primary flex-shrink-0" onclick="createCate(this)" id="category_button">
                            <span class="indicator-label"><?= $lang['create'] ?></span>
                            <span class="indicator-progress">
                                <span data-kt-translate="general-progress"><?= $lang['wait'] ?></span>
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    KTUtil.onDOMContentLoaded(function() {
        Coloris({
            theme: 'pill',
            themeMode: 'auto',
            focusInput: false,
            margin: 2,
            selectInput: false,
            alpha: false,
            formatToggle: false,
            format: 'hex',
            closeButton: true,
            closeLabel: '<?= $lang['close'] ?>',
            clearButton: false,
            swatches: [
                '#067bc2',
                '#84bcda',
                '#80e377',
                '#ecc30b',
                '#f37748',
                '#d56062'
            ]
        });
    });

</script>