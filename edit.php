<?php
	require('inc/header.php');
    $uuid = $_GET['uuid'];
    $div = $_GET['div'];
    $cat = $_GET['cat'];
?>
<script>
     $("#menu_buttons").html('<a href="<?= $url ?>/cal/<?= $uuid ?>/<?= $div ?>" class="btn btn-icon btn-active-color-primary flex-shrink-0 bg-body w-40px h-40px fs-7 fw-bold" ><i class="fa-regular fa-calendar-pen fs-1"></i></a>');
    document.addEventListener("DOMContentLoaded", function() {
        
        loadCategory('<?= $uuid ?>', '<?= $div ?>', '<?= $cat ?>');
    });
</script>


<div class="div my-10" id="cate_content">
</div>



<?php
	require('inc/footer.php');
?>