<?php
	require('inc/header.php');
?>
<script>
    $("#page_name").html("<?= $lang['tournament'] ?>");
    $("#breadc").append('<li class="breadcrumb-item"><span class="bullet bg-primary w-5px h-2px"></span></li><li class="breadcrumb-item text-muted"><?= $lang['tour'] ?></li><li class="breadcrumb-item"><span class="bullet bg-info w-5px h-2px"></span></li><li class="breadcrumb-item text-muted"><?= $lang['tournament'] ?></li>');
</script>




<?php
	require('inc/footer.php');
?>