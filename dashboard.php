<?php
	require('inc/header.php');
	$payments = 14328.74;
?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
        loadDashboard();
    })
</script>

		
<div class="row">
	<div class="col-lg-6">
		<div class="row">
			<div class="col-12">
				<div class="row">
					<div class="col-6 d-flex flex-column-auto">
						<div class="card w-100 card-flush min-h-250px mb-5 d-flex flex-column-auto">
							<div class="card-header flex-nowrap border-0 pt-9">
								<div class="card-title m-0">
									<div class="symbol bg-light me-5">
										<i class="fs-1 text-info fa-regular fa-trophy p-4"></i>
									</div>
									<div class="fs-4 fw-semibold text-gray-600 m-0"><?= $lang['touracts'] ?></div>
								</div>
							</div>
							<div class="card-body d-flex flex-column px-9 pt-6 pb-8">
								<div class="fs-2tx fw-bold mb-3" id="tourMonth"></div>
								<div class="mb-5 mt-auto fs-6">
									<span id="percentageChange"></span>
									<div class="fw-semibold text-gray-400"><?= $lang['toureg'] ?>
										<span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['compprev'] ?>">
											<i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-6 d-flex flex-column-auto">
						<div class="card w-100 card-flush min-h-250px mb-5 d-flex flex-column-auto">
							<div class="card-header flex-nowrap border-0 pt-9">
								<div class="card-title m-0">
									<div class="symbol bg-light me-5">
										<i class="fs-1 text-warning fa-solid fa-people-group p-4"></i>
									</div>
									<div class="fs-4 fw-semibold text-gray-600 m-0"><?= $lang['teamsreg'] ?></div>
								</div>
							</div>
							<div class="card-body d-flex flex-column px-9 pt-6 pb-8">
								<div class="fs-2tx fw-bold mb-3" id="totalTeams"></div>
								<span class="fs-6 fw-bolder text-gray-800 d-block mb-2" id="teamsMonth"></span>
								<div class="symbol-group symbol-hover flex-nowrap" id="teamsList"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="card card-flush min-h-300px mb-5">
					<div class="card-header pt-5">
						<div class="card-title d-flex flex-column">
							<div class="d-flex align-items-center">
								<span class="fs-4 fw-semibold text-gray-400 me-1 align-self-start">$</span>
								<span class="fs-2hx fw-bold text-dark me-2 lh-1 ls-n2"><?= number_format($payments, 2, '.', ',') ?> <span class="text-muted fs-2 fw-semibold">USD</span></span>
								<span class="badge badge-light-success fs-base">
								<i class="ki-outline ki-arrow-up fs-5 text-success ms-n1"></i>2.6%</span>
							</div>
							<span class="text-gray-400 pt-1 fw-semibold fs-6"><?= $lang['payrec'] ?></span>
						</div>
					</div>
					<div class="card-body d-flex align-items-end px-0 pb-0">
						<div id="kt_card_widget_6_chart" class="w-100" style="height: 150px"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-6 mb-5">
		<div class="card h-md-100">
			<div class="card-header border-0 pt-5">
				<h3 class="card-title align-items-start flex-column">
					<span class="card-label fw-bold text-dark"><?= $lang['calweek'] ?></span>
					<span class="text-muted mt-1 fw-semibold fs-7"><?= $lang['weekdesc'] ?></span>
				</h3>
				<div class="card-toolbar">
					<a href="#" class="btn btn-sm btn-light"><?= $lang['viewcal'] ?></a>
				</div>
			</div>
			<div class="card-body pt-7 px-0">
				<ul class="nav nav-stretch nav-pills nav-pills-custom nav-pills-active-custom d-flex justify-content-between mb-8 px-5" id="dayTabs">
				</ul>
				<div class="tab-content mb-2 px-9" id="tabContent">
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row g-5 g-xl-10 mb-5 mb-xl-10">
	<div class="col-xl-12">
		<div class="card pt-4 mb-6 mb-xl-9">
			<div class="card-header border-0">
				<div class="card-title">
					<h2 class="fw-bold mb-0"><?= $lang['toureg'] ?></h2>
				</div>
			</div>
			<div id="kt_customer_view_payment_method" class="card-body pt-0">
				<?php
				foreach ($jdata as $id => $tour) {
				?>
				<div class="py-0" data-kt-customer-payment-method="row">
					<div class="py-3 d-flex flex-stack flex-wrap">
						<div class="d-flex align-items-center collapsible rotate" data-bs-toggle="collapse" href="#<?= $tour['uuid'] ?>" role="button" aria-expanded="false" aria-controls="<?= $tour['uuid'] ?>">
							<div class="me-3 rotate-90">
								<i class="ki-outline ki-right fs-3"></i>
							</div>
							<div class="symbol symbol-40px symbol-circle">
								<div class="symbol-label fs-2 fw-semibold text-success me-3" style="background-image:url(<?= $url . '/' . $tour['pic'] ?>)"></div>
							</div>
							<div class="me-3">
								<div class="d-flex align-items-center">
									<div class="text-gray-800 fw-bold">
										<?= $tour['name'] ?>
										<span class="ms-1" data-bs-toggle="tooltip" title="<?= $lang['refname'] ?>">
											<i class="ki-outline ki-information-5 text-gray-500 fs-6"></i>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id="<?= $tour['uuid'] ?>" class="collapse fs-6">
						<div class="row py-5">
							<?php 
								$divisions = $tour['divisions'];
								if($divisions){ 
									foreach($divisions as $index => $div){
										$catIds = array_column($div['categories'], 'id');
										$resIds = array_filter($tour['categories'], function ($category) use ($catIds) {
											return in_array($category['id'], $catIds);
										});	
							?>
							<div class="card border rounded mb-2 bg-light-secondary border-secondary">
								<div class="card-header min-h-50px ps-5 pe-0 border-bottom border-secondary">
									<div class="card-title collapsible rotate" data-bs-toggle="collapse" href="#<?= $tour['uuid'] . $index ?>" role="button" aria-expanded="false" aria-controls="<?= $tour['uuid'] . $index ?>">
										<div class="me-3 rotate-90">
											<i class="ki-outline ki-right fs-3"></i>
										</div>
										<span class="fw-bold fs-5">
											<?= $div['name'] ?>
											<a href="#" class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-bs-toggle="tooltip" title="<?= $lang['view'] ?>">
												<i class="fa-solid fa-eye fs-3"></i>
											</a>
										</span>
									</div>
								</div>
								<div id="<?= $tour['uuid'] . $index ?>" class="card-body collapse">
									<div class="row d-flex">
										<?php foreach ($resIds as $category) { ?>
										<div class="col-3 d-flex align-items-center flex-center fs-4 border rounded border-dotted p-5">
											<span class="bullet me-3" style="background-color: <?= $category['color'] ?>;"></span></i><?= $category['cat'] ?>
											<span class="ms-3 badge badge-light-<?= ($cat->gender === 'm' || $cat->gender === null || $cat->gender === 'undefined') ? 'primary' : 'danger' ?>"><?= ($cat->gender === 'm' || $cat->gender === null || $cat->gender === 'undefined') ? $lang['male'] : $lang['female']; ?></span>
										</div>
										<?php } ?>
									</div>
								</div>
							</div>
							<?php
									} 
								}else{ ?>
								<div class="d-flex flex-center p-5 border rounded border-primary border-dotted bg-light-primary">
									<span class="fs-4 fw-bold text-primary"><?= $lang['nodivsub'] ?></span>
								</div>
							<?php	} ?>
						</div>
					</div>
				</div>
				<?php
				if (end($jdata) !== $tour) {
				?>
				<div class="separator separator-dashed"></div>
				<?php } 
				} ?>
			</div>
		</div>
	</div>
</div>
	
		
<?php require('inc/footer.php'); ?>
<script>
	var e = document.getElementById('kt_card_widget_6_chart');

	var t = parseInt(KTUtil.css(e, "height")),
	a = KTUtil.getCssVariableValue("--bs-gray-500"),
	l = KTUtil.getCssVariableValue("--bs-border-dashed-color"),
	r = KTUtil.getCssVariableValue("--bs-success"),
	o = KTUtil.getCssVariableValue("--bs-gray-300"),
	i = new ApexCharts(e, {
		series: [{ name: "Income", data: [30, 60, 53, 45, 60, 75, 53, 53, 45, 60, 75, 53] }],
		chart: { fontFamily: "inherit", type: "bar", height: t, toolbar: { show: !1 }, sparkline: { enabled: !0 } },
		plotOptions: { bar: { horizontal: !1, columnWidth: ["55%"], borderRadius: 6 } },
		legend: { show: !1 },
		dataLabels: { enabled: !1 },
		stroke: { show: !0, width: 9, colors: ["transparent"] },
		xaxis: {categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan'], axisBorder: { show: !1 }, axisTicks: { show: !1, tickPlacement: "between" }, labels: { show: !1, style: { colors: a, fontSize: "12px" } }, crosshairs: { show: !1 } },
		yaxis: { labels: { show: !1, style: { colors: a, fontSize: "12px" } } },
		fill: { type: "solid" },
		states: { normal: { filter: { type: "none", value: 0 } }, hover: { filter: { type: "none", value: 0 } }, active: { allowMultipleDataPointsSelection: !1, filter: { type: "none", value: 0 } } },
		tooltip: {
			style: { fontSize: "12px" },
			y: {
				formatter: function (e) {
					return "$" + e;
				},
			},
		},
		colors: [r, o],
		grid: { padding: { left: 10, right: 10 }, borderColor: l, strokeDashArray: 4, yaxis: { lines: { show: !0 } } },
	});
	i.render();
</script>