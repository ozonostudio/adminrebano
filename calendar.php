<?php
	require('inc/header.php');
    $uuid = $_GET['uuid'];
    $div = $_GET['div'];
?>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        loadCalendar('<?= $uuid ?>', '<?= $div ?>');
    })
</script>

<div class="div my-10" id="calendar_content">
</div>

<div id="warning-alert-modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-md modal-dialog-centered mw-550px">
		<div class="modal-content">
            <div class="card card-flush">
                <div class="card-header me-0">
                    <div class="card-title"><?= $lang['details'] ?></div>
                    <div class="card-toolbar">
                        <a class="btn btn-icon btn-sm btn-color-gray-400 btn-active-icon-danger me-2" id="removeEventCal" name="btnremove" onclick="delEvent(this.name)" data-bs-dismiss="modal" data-bs-toggle="tooltip" data-bs-dismiss="click" title="<?= $lang['delevent'] ?>" id="kt_modal_view_event_delete">
                            <i class="ki-outline ki-trash fs-2"></i>
                        </a>
                        <a class="btn btn-icon btn-sm btn-color-gray-500 btn-active-icon-primary" data-bs-toggle="tooltip" title="<?= $lang['close'] ?>" data-bs-dismiss="modal">
                            <i class="ki-outline ki-cross fs-2x"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <div class="d-flex">
                        <i class="fa-regular fa-ticket fs-1 text-muted me-5"></i>
                        <div class="mb-9">
                            <div class="d-flex align-items-center mb-1">
                                <span class="fs-2 fw-bold me-3" data-kt-calendar="event_name"></span>
                                <span class="badge badge-light-success" data-kt-calendar="all_day"></span>
                            </div>
                            <div class="fs-4 fw-bold" data-kt-calendar="category"></div>
                            <div class="fs-4 fw-bold" data-kt-calendar="round"></div>
                            <div class="d-flex align-items-center mt-2 mb-2">
                                <span class="bullet bullet-dot h-10px w-10px bg-success me-2"></span>
                                <div class="fs-6">
                                    <span class="fw-bold"><?= $lang['starts'] ?>:</span>
                                    <span data-kt-calendar="event_start_date"></span>
                                </div>
                            </div>
                            <div class="d-flex align-items-center mb-4">
                                <span class="bullet bullet-dot h-10px w-10px bg-danger me-2"></span>
                                <div class="fs-6">
                                    <span class="fw-bold"><?= $lang['ends'] ?>:</span>
                                    <span data-kt-calendar="event_end_date"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="fs-6" data-kt-calendar="event_description"></div>
                    </div>
                </div>
            </div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<?php
	require('inc/footer.php');
?>