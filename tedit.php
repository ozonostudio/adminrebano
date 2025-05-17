<?php
	require('inc/header.php');
    $id = $_GET['id'];
?>

    <div id="formContent">
        <div class="py-10 d-flex justify-content-center w-100">
            <div class="row w-900px">
                <div class="col-12 text-center" id="teamheader">
                </div>
                <div id="final-form">
                    <div class="col-12 card card-flush mt-3 bg-light p-0">
                        <div class="card-header bg-body">
                            <h3 class="card-title"><?= $lang['players'] ?></h3>
                        </div>
                        <div class="card-body pt-0">
                            <div id="insertplayers">
                            
                            </div>
                            <div class="col-12 mt-10 border-dashed border border-gray-500 p-5 rounded w-100 text-center">
                                <button type="button" onclick="addPlayer();" class="btn btn-color-success border border-success btn-light-success btn-active-success"><?= $lang['addplayer'] ?></button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 w-100 mt-10 text-center">
                        <button type="button" class="btn btn-primary h-60px w-400px flex-shrink-0" onclick="saveReg('<?= $id ?>')" id="btn_savereg">
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


<script>
    $(document).ready(function () {
        editTeamform('<?= $id ?>');
    });
</script>

<?php
	require('inc/footer.php');
?>