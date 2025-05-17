<?php
	require('inc/header.php');
    $id = $_GET['id'];
?>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        teamsLoad();
    });
    $("#page_name").html("<?= $lang['teamsreg'] ?>");
    $("#breadc").append('<li class="breadcrumb-item"><span class="bullet bg-primary w-5px h-2px"></span></li><li class="breadcrumb-item text-muted"><?= $lang['teamsreg'] ?></li>');
</script>
    <div class="row">
        <div class="col-12 card card-flush p-5 bg-light mb-10">
            <div class="card-header">
                <div class="card-title">
                    <div class="fs-1 fw-bold"><?= $lang['teamsreg'] ?></div>
                </div>
                <div class="card-toolbar">
                    <a href="<?= $url?>/registro"  type="button" class="btn btn-light-primary border border-primary">
                        <?= $lang['teamsregitry'] ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div id="teamsList" class="mb-10">
    </div>

<?php
	require('inc/footer.php');
?>