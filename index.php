<?php require('inc/header.php'); ?>

		<div class="d-flex flex-column flex-root" id="kt_app_root">
			<!--begin::Authentication - Sign-in -->
			<div class="d-flex flex-column flex-lg-row flex-column-fluid flex-center" style="background-image: url(assets/media/auth/bg7-dark.jpg)">
				<!--begin::Aside-->
				<div class="d-flex flex-column flex-column-fluid flex-center w-lg-40 p-20">
					<!--begin::Wrapper-->
					<div class="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-350px">
						<!--begin::Body-->
						<div class="py-20">
							<!--begin::Form-->
							<form class="form w-100" action="#" id="login_form">
								<!--begin::Body-->
								<div class="card-body">
									<!--begin::Heading-->
									<div class="text-center mb-10">
										<!--begin::Title-->
										<h1 class="text-white mb-3 fs-3x" data-kt-translate="sign-in-title">Bienvenido</h1>
										<!--end::Title-->
										<!--begin::Text-->
										<div class="text-gray-400 fw-semibold fs-6" data-kt-translate="general-desc">Utiliza tu usuario y contraseña para ingresar.</div>
										<!--end::Link-->
									</div>
									<!--begin::Heading-->
									<!--begin::Input group=-->
									<div class="fv-row mb-8">
										<!--begin::Email-->
										<input type="text" id="username" placeholder="Usuario" name="username" autocomplete="off" class="form-control form-control-solid" />
										<!--end::Email-->
									</div>
									<!--end::Input group=-->
									<div class="fv-row mb-7">
										<!--begin::Password-->
										<input type="password" id="password" placeholder="Contraseña" name="password" autocomplete="off" class="form-control form-control-solid" />
										<!--end::Password-->
									</div>
									<!--end::Input group=-->
									<!--begin::Actions-->
									<div class="d-grid text-center">
										<!--begin::Submit-->
										<button type="button" class="btn btn-primary flex-shrink-0" id="log_submit" onclick="login()">
											<!--begin::Indicator label-->
											<span class="indicator-label" data-kt-translate="sign-in-submit">Ingresar</span>
											<!--end::Indicator label-->
											<!--begin::Indicator progress-->
											<span class="indicator-progress">
												<span data-kt-translate="general-progress">Por favor espera...</span>
												<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
											</span>
											<!--end::Indicator progress-->
										</button>
										<!--end::Submit-->
									</div>
									<!--end::Actions-->
								</div>
								<!--begin::Body-->
							</form>
							<!--end::Form-->
						</div>
						<!--end::Body-->
					</div>
					<!--end::Wrapper-->
				</div>
				<!--end::Aside-->
			</div>
			<!--end::Authentication - Sign-in-->
		</div>

<?php require('inc/footer.php'); ?>