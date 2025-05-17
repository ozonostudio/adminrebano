<?php
	require('inc/header.php');
    $uuid = $_GET['uuid'];
    $div = $_GET['div'];
    $cat = $_GET['cat'];
?>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        loadRanked('<?= $uuid ?>', '<?= $div ?>', '<?= $cat ?>');
    })
</script>
<div class="row g-10 mb-10 justify-content-center align-items-center text-center" id="clasif">
</div>
<div id="standings" class="mb-10"></div>
<div class="row g-10 mb-20" id="scores"></div>

<?php
	require('inc/footer.php');
?>