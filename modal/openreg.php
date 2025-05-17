<!-- Tournament edit : start -->
<div class="modal fade" id="open_registry" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-900px">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"><?= $lang['createreg'] ?></h3>

                <!--begin::Close-->
                <div class="form-check form-switch form-check-custom form-check-success form-check-solid">
                    <input class="form-check-input h-20px w-50px" type="checkbox" value="" id="openclosereg"/>
                </div>
                <!--end::Close-->
            </div>
            <div class="modal-body py-lg-10 px-lg-10">
                <div class="row">
                    <div class="col-12 text-center">
                        <span>Aquí puedes abrir o cerrar el formulario de registros a equipos para este Torneo. Para comenzar tienes que iniciar por crear la terminación del enlace que utilizaras para este formulario de registro.</span>
                    </div>
                    <div class="separator my-6"></div>
                    <div class="col-12">
                        <form class="form w-100" action="#" id="division_form">
                            <div class="fv-row">
                                <label class="d-flex align-items-center fs-5 fw-semibold mb-2">
                                    <span class="required">Dirección para el registro</span>
                                    <span class="ms-1" data-bs-toggle="tooltip" title="Es recomendable utilices algo corto">
                                        <i class="fa-solid fa-circle-question text-gray-500 fs-6"></i>
                                    </span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-body"><?= $url."/reg/" ?></span>
                                    <input type="text" class="form-control text-dark" id="form_slug" placeholder="" value="" required/>
                                    <button id="kt_clipboard_3" class="btn btn-icon btn-light-primary text-center">
                                        <i id="clipboardicon" class="fa-regular fa-clipboard fs-3"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-12 mt-10">
                        <div class="d-grid text-center">
                                <button type="button" class="btn btn-primary flex-shrink-0" onclick="saveOpenform(this)" id="openform_button">
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
</div>
<!-- Tournament edit : end -->

<script>

    const inputField = document.getElementById('form_slug');
    const target = document.getElementById('kt_clipboard_3');
    const clipboardIcon = document.getElementById('clipboardicon');

    inputField.addEventListener('input', function() {
        // Replace spaces with dashes
        const typedText = this.value.replace(/\s+/g, '-');
        this.value = typedText;
        target.setAttribute("data-clipboard", `${url}/reg/${typedText}`);
    });

    target.addEventListener('click', function(e){
        e.preventDefault();
        navigator.clipboard.writeText(target.dataset.clipboard).then(() => {
            clipboardIcon.classList.remove('fa-clipboard');
            clipboardIcon.classList.add('fa-check');
            setTimeout(function() {
                clipboardIcon.classList.remove('fa-check');
                clipboardIcon.classList.add('fa-clipboard');
            }, 2000);
            console.log(`copied: ${target.dataset.clipboard}`);
            }).catch(err => console.error('Failed to copy: ', err));
    });
</script>