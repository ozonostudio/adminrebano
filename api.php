<?php
	require('inc/header.php');
    $uuid = $_GET['uuid'];
    $div = $_GET['div'];
?>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        api('<?= $uuid ?>', '<?= $div ?>');
    })
</script>

<?php
	require('inc/footer.php');
?>