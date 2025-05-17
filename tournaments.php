<?php
    require('inc/header.php');
?>
<script>
    $("#page_name").html("<?= $lang['tour'] ?>");
    $("#breadc").append('<li class="breadcrumb-item"><span class="bullet bg-primary w-5px h-2px"></span></li><li class="breadcrumb-item text-muted"><?= $lang['tour'] ?></li>');
</script>
    <div class="row">
        <div class="col-12 card card-flush p-5 bg-light mb-5">
            <div class="card-header">
                <div class="card-title">
                    <div class="fs-1 fw-bold"><?= $lang['touracts'] ?></div>
                </div>
                <div class="card-toolbar">
                    <div class="input-group" id="tournament_inputs">
                        <input type="text" id="tournament_name" class="form-control border-primary" placeholder="<?= $lang['tourname'] ?>" aria-label="<?= $lang['tourname'] ?>" required/>
                        <button onclick="addTournament(this.id);"  type="button" class="btn btn-light-primary border border-primary" id="tournament_button">
                            <span class="indicator-label">
                                <?= $lang['createtour'] ?>
                            </span>
                            <span class="indicator-progress">
                                <?= $lang['wait'] ?> <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row min-h-475px" id="tournaments_full">
        <div class="card card-flush">
            <div class="card-body" id="tournament_list">
                
                
            </div>
        </div>
    </div>

<?php
    require('inc/footer.php');
    require('./modal/create.php');
    require('./modal/edit.php');
    require('./modal/openreg.php');
    require('./modal/pdf.php');
?>

<script src="<?= $url ?>/assets/js/scripts.bundle.js"></script>

<script>
    $(document).ready(function () {
        loadTournaments();
    });
</script>