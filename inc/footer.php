						<!--begin::Scrolltop-->
						<div id="kt_scrolltop" class="scrolltop" data-kt-scrolltop="true">
							<i class="fa-duotone fa-arrow-up-to-line fs-3" style="--fa-primary-color: #ffffff; --fa-secondary-color: #ffffff;"></i>
						</div>
						<!--end::Scrolltop-->
						<script src="<?= $url ?>/assets/js/scripts.bundle.js"></script>
						<script src="<?= $url ?>/assets/plugins/custom/formrepeater/formrepeater.bundle.js"></script>
						<script src="<?= $url ?>/assets/plugins/custom/draggable/draggable.bundle.js"></script>
						<script src="<?= $url ?>/assets/plugins/custom/coloris/coloris.bundle.js"></script>
						<script src="<?= $url ?>/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>
						<script src="<?= $url ?>/assets/plugins/custom/datatables/datatables.bundle.js"></script>
						<script src="<?= $url ?>/assets/js/common.js?<?php echo rand(); ?>"></script>
						<script src="<?= $url ?>/assets/js/tmngr.js?<?php echo rand(); ?>"></script>
						<?php if($currentfile == "tournaments.php"){ ?>
						<script src="<?= $url ?>/assets/js/cates.js?<?php echo rand(); ?>"></script>
						<script src="<?= $url ?>/assets/js/tour.js?<?php echo rand(); ?>"></script>
						<script src="<?= $url ?>/assets/js/seasons.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						<?php if($currentfile == "edit.php"){ ?>
						<script src="<?= $url ?>/assets/js/cates.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						<?php if($currentfile == "calendar.php"){ ?>
						<script src="<?= $url ?>/assets/js/caldata.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						<?php if($currentfile == "teams.php"){ ?>
						<script src="<?= $url ?>/assets/js/pdf.js?<?php echo rand(); ?>"></script>
						<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
						<?php } ?>
						<?php if($currentfile == "dashboard.php"){ ?>
						<script src="<?= $url ?>/assets/js/dash.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						<?php if($currentfile == "registro.php" || $currentfile == "tedit.php"){ ?>
						<script src="<?= $url ?>/assets/js/reg.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						<?php if($currentfile == "clasif.php"){ ?>
						<script src="<?= $url ?>/assets/js/ranked.js?<?php echo rand(); ?>"></script>
						<?php } ?>
						</div>
					</div>
				</div>
			</div>
			<!-- end::page -->
		</div>
		<!-- end::root -->
	</body>
</html>