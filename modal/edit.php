<!-- Tournament edit : start -->
<div class="modal fade" id="edit_tournament" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-800px">
        <div class="modal-content">
            <div class="modal-body py-lg-10 px-lg-10">
                <div class="row">
                    <div class="col-4">
                        <label class="d-block fw-semibold fs-6 mb-5">
                            <span><?= $lang['touravatar'] ?></span>
                            <span class="ms-1" data-bs-toggle="tooltip" title="E.g. Select a logo to represent the company that's running the campaign.">
                                <i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
                            </span>
                        </label>
                        <div class="image-input image-input-empty image-input-outline image-input-circle image-input-placeholder" data-kt-image-input="true">
                            <div class="image-input-wrapper w-125px h-125px"></div>
                            <label class="btn btn-icon btn-circle btn-active-color-primary w-35px h-35px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Change avatar">
                                <i class="fa-solid fa-pencil fs-5"></i>
                                <input type="file" name="avatar" accept=".png, .jpg, .jpeg" />
                                <input type="hidden" name="avatar_remove" />
                            </label>
                            <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="Cancel avatar">
                                <i class="fa-solid fa-xmark fs-2"></i>
                            </span>
                            <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Remove avatar">
                                <i class="fa-solid fa-xmark fs-2"></i>
                            </span>
                        </div>
                        <div class="form-text"><?= $lang['allowfiles'] ?></div>
                    </div>
                    <div class="col-8 mt-10">
                        <form class="form w-100" action="#" id="division_form">
                            <div class="fv-row mb-5">
                                <label class="d-flex align-items-center fs-5 fw-semibold mb-2">
                                    <span class="required"><?= $lang['tourname'] ?></span>
                                    <span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['refname'] ?>">
                                        <i class="fa-solid fa-circle-question text-gray-500 fs-6"></i>
                                    </span>
                                </label>
                                <input type="text" class="form-control form-control form-control-solid" id="edi_tournament_name" placeholder="" value="" required/>
                            </div>
                            <div class="d-grid text-center">
                                <button type="button" class="btn btn-primary flex-shrink-0" name="" onclick="saveTour(this.name)" id="edit_tour_button">
                                    <span class="indicator-label" data-kt-translate="sign-in-submit"><?= $lang['update'] ?></span>
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
    </div>
</div>
<!-- Tournament edit : end -->

<!-- Division edit : start -->
<div class="modal fade" id="edit_division" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-600px">
        <div class="modal-content">
            <div class="row modal-body py-lg-10 px-lg-10">
                <div class="col-4">
                    <label class="d-block fw-semibold fs-6 mb-5">
                        <span><?= $lang['divavatar'] ?></span>
                        <span class="ms-1" data-bs-toggle="tooltip" title="E.g. Select a logo to represent the company that's running the campaign.">
                            <i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
                        </span>
                    </label>
                    <style>.image-input-placeholder { background-image: url('assets/media/svg/files/blank-image.svg'); } [data-bs-theme="dark"] .image-input-placeholder { background-image: url('assets/media/svg/files/blank-image-dark.svg'); }</style>
                    <div class="image-input image-input-empty image-input-outline image-input-circle image-input-placeholder division-placeholder" data-kt-image-input="true">
                        <div class="image-input-wrapper w-125px h-125px"></div>
                        <label class="btn btn-icon btn-circle btn-active-color-primary w-35px h-35px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Change avatar">
                            <i class="fa-solid fa-pencil fs-5"></i>
                            <input type="file" data-type="avatar" name="avatar" accept=".png, .jpg, .jpeg" />
                            <input type="hidden" name="avatar_remove" />
                        </label>
                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="Cancel avatar">
                            <i class="fa-solid fa-xmark fs-2"></i>
                        </span>
                        <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Remove avatar">
                            <i class="fa-solid fa-xmark fs-2"></i>
                        </span>
                    </div>
                    <div class="form-text"><?= $lang['allowfiles'] ?></div>
                </div>
                <div class="col-8">
                    <div class="fv-row mb-5">
                        <label class="d-flex align-items-center fs-5 fw-semibold mb-2">
                            <span class="required"><?= $lang['divname'] ?></span>
                            <span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['tourname2'] ?>">
                                <i class="fa-solid fa-circle-question text-gray-500 fs-6"></i>
                            </span>
                        </label>
                        <input type="text" class="form-control form-control form-control-solid" id="edit_division_name" placeholder="" value="" required/>
                    </div>
                    <div class="fv-row mb-10">
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="start_date" class="form-label"><span class="required"><?= $lang['startDesc'] ?></span></label>
                                <div class="input-group log-event" id="div_start_date">
                                    <input name="start_date" id="edit_start_date" type="text" class="form-control" data-td-toggle="datetimepicker" required/>
                                    <span class="input-group-text">
                                        <i class="fa-regular fa-calendar-range fs-2"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <label for="end_date" class="form-label"><span class="required"><?= $lang['endDesc'] ?></span></label>
                                <div class="input-group log-event" id="div_end_date">
                                    <input name="end_date" id="edit_end_date" type="text" class="form-control" data-td-toggle="datetimepicker" required/>
                                    <span class="input-group-text">
                                        <i class="fa-regular fa-calendar-range fs-2"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid text-center">
                        <button type="button" class="btn btn-primary flex-shrink-0" onclick="saveDiv(this)" id="edit_div_button">
                            <span class="indicator-label" data-kt-translate="sign-in-submit"><?= $lang['update'] ?></span>
                            <span class="indicator-progress">
                                <span data-kt-translate="general-progress"><?= $lang['wait'] ?></span>
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    "use strict";
    let globalStartDiv;
    let globalEndDiv;
    document.addEventListener("DOMContentLoaded", function() {
        const linkedPicker1Element = document.getElementById("div_start_date");
        const startDiv = new tempusDominus.TempusDominus(linkedPicker1Element,{
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
        globalStartDiv = startDiv;
        const endDiv = new tempusDominus.TempusDominus(document.getElementById("div_end_date"), {
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
        globalEndDiv = endDiv;
        //using event listeners
        linkedPicker1Element.addEventListener(tempusDominus.Namespace.events.change, (e) => {
            endDiv.updateOptions({
                restrictions: {
                minDate: e.detail.date,
                },
            });
        });

        //using subscribe method
        const subscription = endDiv.subscribe(tempusDominus.Namespace.events.change, (e) => {
            startDiv.updateOptions({
                restrictions: {
                maxDate: e.date,
                },
            });
        });
    });
    function updateStart(newOptions) {
        globalStartDiv.updateOptions(newOptions);
    }
    function updateEnd(newOptions) {
        globalEndDiv.updateOptions(newOptions);
    }
</script>

<div class="modal fade" id="edit_category" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">
            <div class="modal-body py-lg-10 px-lg-10">
                <form class="form w-100" action="#" id="edit_category_form">
                    <div class="fv-row mb-7">
                        <label class="form-label required fw-bold"><?= $lang['catediv'] ?></label>
                        <input type="text" class="form-control form-control-solid" id="edit_category_name" placeholder="" value=""/>
                    </div>
                    <div class="fv-row mb-7">
                        <label class="form-label required fw-bold"><?= $lang['colorcate'] ?></label>

                        <input type="text" id="edit_category_color" class="form-control form-control-solid color" value="#067bc2" data-coloris/>
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
                                <input class="form-check-input" type="radio" name="edit_category_gender" id="edit_gender_male" value="m" checked/>
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
                                <input class="form-check-input" type="radio" name="edit_category_gender" id="edit_gender_female" value="f"/>
                            </span>
                        </label>
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

                                <input type="text" id="edit_category_games" class="form-control form-control-solid border-0 ps-12" data-kt-dialer-control="input" name="manageBudget" readonly value="1" />

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

                                <input type="text" id="edit_category_time" class="form-control form-control-solid border-0 ps-12" data-kt-dialer-control="input" name="manageBudget" readonly value="15" />

                                <button type="button" class="btn btn-icon btn-active-color-gray-700 position-absolute translate-middle-y top-50 end-0" data-kt-dialer-control="increase">
                                    <i class="fa-duotone fa-square-plus fs-2"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    <div class="d-grid text-center">
                        <button type="button" class="btn btn-primary flex-shrink-0" onclick="saveCate(this)" id="edit_category_button">
                            <span class="indicator-label"><?= $lang['update'] ?></span>
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