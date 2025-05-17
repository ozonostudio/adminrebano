<?php
	session_start();
	require_once('inc/base.php');
	require_once ('inc/db.php');

	if($currentfile != "registro.php" && $currentfile != "tedit.php"){
		if($currentfile != "index.php"){
			if(!isset($_SESSION["loggedin"]) || !$_SESSION["loggedin"]) {
				header("location: ".$url."/");
				exit;
			}
		}else{
			if(isset($_SESSION["loggedin"]) || $_SESSION["loggedin"]) {
				header("location: ".$url."/dashboard");
				exit;
			}
		}
	}

	$locale = ($_COOKIE['lang'] === 'en') ? 'en_US' : 'es_ES';	
	setlocale(LC_ALL,$locale);
	
	if($currentfile == "manager.php"){ $addSet = true; };

	if ($_SESSION['admin'] == true) {
		$adminBadge = '<span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Admin</span>';
	} else {
		$adminBadge = '';
	}
	
	$secondheader = ($currentfile === 'edit.php' || $currentfile === 'calendar.php') ? true : false;
	$langText = ($_COOKIE['lang'] === 'en') ? 'English' : 'Español';
	$langFlag = ($_COOKIE['lang'] === 'en') ? 'united-states' : 'spain';

	$userMenu = '<div class="d-flex align-items-center me-5 me-lg-10">
    <div class="app-navbar-item me-4" id="kt_header_user_menu_toggle">
        <div class="cursor-pointer symbol symbol-40px" data-kt-menu-trigger="{default: \'click\', lg: \'hover\'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-start">
            <img src="' . $url . '/assets/media/avatars/blank.png" alt="user" />
        </div>
        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px" data-kt-menu="true">
            <div class="menu-item px-3">
                <div class="menu-content d-flex align-items-center px-3">
                    <div class="symbol symbol-50px me-5">
                        <img alt="Logo" src="' . $url . '/assets/media/avatars/blank.png" />
                    </div>
                    <div class="d-flex flex-column">
                        <div class="fw-bold d-flex align-items-center fs-5">' . $_SESSION["username"] . $adminBadge . '</div>
                    </div>
                </div>
            </div>
            <div class="separator my-2"></div>
            <div class="menu-item px-5" data-kt-menu-trigger="{default: \'click\', lg: \'hover\'}" data-kt-menu-placement="left-start" data-kt-menu-offset="-15px, 0">
                <a href="#" class="menu-link px-5">
                    <span class="menu-title position-relative">' . $lang['mode'] . '
                    <span class="ms-5 position-absolute translate-middle-y top-50 end-0">
                        <i class="ki-outline ki-sun theme-light-show fs-2"></i>
                        <i class="ki-outline ki-moon theme-dark-show fs-2"></i>
                    </span></span>
                </a>
                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                    <div class="menu-item px-3 my-0">
                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="light">
                            <span class="menu-icon" data-kt-element="icon">
							<i class="ki-outline ki-sun fs-2"></i>
                            </span>
                            <span class="menu-title">' . $lang['light'] . '</span>
                        </a>
                    </div>
                    <div class="menu-item px-3 my-0">
                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="dark">
                            <span class="menu-icon" data-kt-element="icon">
                            <i class="ki-outline ki-moon fs-2"></i>
                            </span>
                            <span class="menu-title">' . $lang['dark'] . '</span>
                        </a>
                    </div>
                    <div class="menu-item px-3 my-0">
                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-kt-value="system">
                            <span class="menu-icon" data-kt-element="icon">
							<i class="ki-outline ki-monitor-mobile fs-2"></i>
                            </span>
                            <span class="menu-title">' . $lang['system'] . '</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="menu-item px-5" data-kt-menu-trigger="{default: \'click\', lg: \'hover\'}" data-kt-menu-placement="left-start" data-kt-menu-offset="-15px, 0">
                <a href="#" class="menu-link px-5">
                    <span class="menu-title position-relative">' . $lang['lang'] . '
                    <span class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">' . $langText . '
                    <img class="w-15px h-15px rounded-1 ms-2" src="' . $url . '/assets/media/flags/' . $langFlag . '.svg" alt="" /></span></span>
                </a>
                <div class="menu-sub menu-sub-dropdown w-175px py-4">
                    <div class="menu-item px-3">
                        <a href="javascript:void(0);" onclick="setLanguage(\'en\')" class="menu-link d-flex px-5 ' . ($_COOKIE['lang'] === 'en' ? 'active' : '') . '">
                        <span class="symbol symbol-20px me-4">
                            <img class="rounded-1" src="' . $url . '/assets/media/flags/united-states.svg" alt="" />
                        </span>' . ($_COOKIE['lang'] === 'en' ? 'English' : 'Inglés') . '</a>
                    </div>
                    <div class="menu-item px-3">
                        <a href="javascript:void(0);" onclick="setLanguage(\'es\')" class="menu-link d-flex px-5 ' . ($_COOKIE['lang'] === 'es' ? 'active' : '') . '">
                        <span class="symbol symbol-20px me-4">
                            <img class="rounded-1" src="' . $url . '/assets/media/flags/spain.svg" alt="" />
                        </span>' . ($_COOKIE['lang'] === 'en' ? 'Spanish' : 'Español') . '</a>
                    </div>
                </div>
            </div>
            <div class="menu-item px-5">
            <a href="' . $url . '/logout" class="menu-link px-5">' . $lang["logout"] . '</a>
            </div>
        </div>
		</div>
		<div class="d-flex flex-column">
			<a href="#" class="app-navbar-user-name text-gray-900 text-hover-primary fs-5 fw-bold">' . $_SESSION['username'] . '</a>
		</div>
	</div>
	<div class="app-navbar-item">
		<a href="' . $url . '/logout" class="btn btn-icon btn-custom btn-dark w-40px h-40px app-navbar-user-btn">
			<i class="fa-solid fa-power-off"></i>
		</a>
	</div>';

?>
<!DOCTYPE html>
<html lang="en">
	<head><base href=""/>
		<title>Teams manager</title>
		<meta charset="utf-8" />
		<link rel="shortcut icon" href="<?= $url ?>/assets/media/logos/favicon.png" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700" />
		<script src="<?= $url ?>/assets/plugins/global/plugins.bundle.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js"></script>
		<link href="<?= $url ?>/assets/plugins/custom/coloris/coloris.bundle.css" rel="stylesheet" type="text/css" />
		<link href="<?= $url ?>/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />
		<link href="<?= $url ?>/assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
		<link href="<?= $url ?>/assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
		<link href="<?= $url ?>/assets/css/custom.css?<?php echo rand(); ?>" rel="stylesheet" type="text/css" />
		<link href="<?= $url ?>/assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css"/>
		<script>if (window.top != window.self) { window.top.location.replace(window.self.location.href); }</script>
	</head>
	<?php if($secondheader){ ?>
	<body id="kt_app_body" data-kt-app-header-fixed-mobile="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" data-kt-app-toolbar-enabled="true" data-kt-app-aside-enabled="true" data-kt-app-aside-fixed="true" data-kt-app-aside-push-header="true" data-kt-app-aside-push-toolbar="true" data-kt-app-aside-push-footer="true" class="app-default" data-kt-app-page-loading-enabled="true" data-kt-app-page-loading="on" data-site-base="<?= $url ?>">
	<?php }else{ ?>
	<body id="kt_app_body" data-kt-app-header-fixed-mobile="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" class="app-default" data-kt-app-page-loading-enabled="true" data-kt-app-page-loading="on" data-site-base="<?= $url ?>">
	<?php } ?>
		<script>var defaultThemeMode = "light"; var themeMode; if ( document.documentElement ) { if ( document.documentElement.hasAttribute("data-bs-theme-mode")) { themeMode = document.documentElement.getAttribute("data-bs-theme-mode"); } else { if ( localStorage.getItem("data-bs-theme") !== null ) { themeMode = localStorage.getItem("data-bs-theme"); } else { themeMode = defaultThemeMode; } } if (themeMode === "system") { themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } document.documentElement.setAttribute("data-bs-theme", themeMode); }</script>
		<div class="page-loader">
			<span class="spinner-border text-warning" role="status"></span>
		</div>
		<?php if($currentfile != "registro.php" && $currentfile != "tedit.php"){ if ($currentfile != "index.php") { ?>

			<div class="d-flex flex-column flex-root app-root" id="kt_app_root">
				<div class="app-page flex-column flex-column-fluid" id="kt_app_page">
					<div id="kt_app_header" class="app-header d-flex <?php if($secondheader){echo 'd-lg-none';} ?>" data-kt-sticky="true" data-kt-sticky-activate="{default: false, lg: true}" data-kt-sticky-name="app-header-sticky" data-kt-sticky-offset="{default: false, lg: '200px'}">
						
						<div class="app-container container-fluid d-flex align-items-stretch" id="kt_app_header_container">
						
							<?php if(!$secondheader){ ?>
							<div class="app-header-wrapper d-flex flex-stack w-100">
								<div class="d-flex d-lg-none align-items-center">
									<?php } ?>

									<div class="d-flex align-items-center ms-n2 me-2" title="Show sidebar menu">
										<div class="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_sidebar_mobile_toggle">
											<i class="fa-duotone fa-bars fs-1"></i>
										</div>
									</div>

									<?php if($secondheader){ ?>
									<div class="d-flex align-items-center ms-2 me-n3" title="Show header menu">
										<div class="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_aside_mobile_toggle">
											<i class="ki-outline ki-notification-status fs-1"></i>
										</div>
									</div>
									<?php } ?>

									<?php if(!$secondheader){ ?>
								</div>
								<div id="kt_app_header_page_title_wrapper">
									<div data-kt-swapper="true" data-kt-swapper-mode="{default: 'prepend', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_content_container', lg: '#kt_app_header_page_title_wrapper'}" class="page-title d-flex flex-column justify-content-center me-3 mb-6 mb-lg-0">
										<h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center me-3 my-0" id="page_name"></h1>
										<ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1" id="breadc">
											<li class="breadcrumb-item text-muted">
												<a href="<?= $url ?>/dashboard" class="text-muted text-hover-primary">Home</a>
											</li>
										</ul>
									</div>
								</div>
								<div class="app-navbar flex-stack flex-shrink-0" id="kt_app_aside_navbar">
									<?= $userMenu ?>
								</div>
							</div>
								<?php } ?>
						</div>
					</div>

					<div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
					
						<div id="kt_app_sidebar" class="app-sidebar flex-column" data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="100px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
							<div class="app-sidebar-menu d-flex flex-center overflow-hidden flex-column-fluid">
								<div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper d-flex hover-scroll-overlay-y scroll-ps mx-2 my-5" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer" data-kt-scroll-wrappers="#kt_app_sidebar_menu, #kt_app_sidebar" data-kt-scroll-offset="5px">
									<div class="menu menu-column menu-rounded menu-active-bg menu-title-gray-700 menu-arrow-gray-500 menu-icon-gray-500 menu-bullet-gray-500 menu-state-primary my-auto" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
										<div class="menu-item <?php if($currentfile === "dashboard.php"){?>here show<?php } ?> py-2">
											<a class="menu-link" href="<?= $url ?>/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="<?= $lang['dash'] ?>">
												<span class="menu-icon me-0">
													<i class="fa-duotone fa-house fs-2x"></i>
												</span>
											</a>
										</div>
										<div class="menu-item <?php if($currentfile === "tournaments.php" || $currentfile === "tournament.php"){?>here show<?php } ?> py-2">
											<a class="menu-link" href="<?= $url ?>/tournaments" data-bs-toggle="tooltip" data-bs-placement="right" title="<?= $lang['tour'] ?>">
												<span class="menu-icon me-0">
													<i class="fa-duotone fa-trophy-star fs-2x"></i>
												</span>
											</a>
										</div>
										<div class="menu-item <?php if($currentfile === "teams.php"){?>here show<?php } ?> py-2">
											<a class="menu-link" href="<?= $url ?>/teams" data-bs-toggle="tooltip" data-bs-placement="right" title="<?= $lang['teamsmanage'] ?>">
												<span class="menu-icon me-0">
													<i class="fa-duotone fa-people-group fs-2x"></i>
												</span>
											</a>
										</div>
									</div>
								</div>
							</div>
							<div class="app-sidebar-footer d-flex flex-center flex-column-auto pt-6 mb-7" id="kt_app_sidebar_footer">
								<div class="mb-0">
									<button type="button" class="btn btm-sm btn-custom btn-icon" data-kt-menu-trigger="click" data-kt-menu-overflow="true" data-kt-menu-placement="top-start" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" title="Quick actions">
										<i class="fa-solid fa-gear fs-1"></i>
									</button>
									<div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px" data-kt-menu="true">
										<div class="menu-item px-3">
											<div class="menu-content fs-6 text-dark fw-bold px-3 py-4">Quick Actions</div>
										</div>
										<div class="separator mb-3 opacity-75"></div>
										<div class="menu-item px-3">
											<a href="#" class="menu-link px-3">New Ticket</a>
										</div>
										<div class="menu-item px-3">
											<a href="#" class="menu-link px-3">New Customer</a>
										</div>
										<div class="menu-item px-3" data-kt-menu-trigger="hover" data-kt-menu-placement="right-start">
											<a href="#" class="menu-link px-3">
												<span class="menu-title">New Group</span>
												<span class="menu-arrow"></span>
											</a>
											<div class="menu-sub menu-sub-dropdown w-175px py-4">
												<div class="menu-item px-3">
													<a href="#" class="menu-link px-3">Admin Group</a>
												</div>
												<div class="menu-item px-3">
													<a href="#" class="menu-link px-3">Staff Group</a>
												</div>
												<div class="menu-item px-3">
													<a href="#" class="menu-link px-3">Member Group</a>
												</div>
											</div>
										</div>
										<div class="menu-item px-3">
											<a href="#" class="menu-link px-3">New Contact</a>
										</div>
										<div class="separator mt-3 opacity-75"></div>
										<div class="menu-item px-3">
											<div class="menu-content px-3 py-3">
												<a class="btn btn-primary btn-sm px-4" href="#">Generate Reports</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<?php if($secondheader){ ?>
						<div id="kt_app_aside" class="app-aside flex-column z-inde-1" data-kt-drawer="true" data-kt-drawer-name="app-aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="300px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_aside_mobile_toggle">
							<div class="app-navbar flex-stack flex-shrink-0 p-5 pt-lg-12 pb-lg-8 px-lg-8" id="kt_app_aside_navbar">
								<?= $userMenu ?>
							</div>
							<div class="w-100 p-8 pt-0" id="create_btn_placeholder"></div>
							<div id="groups_side" class="app-aside_content-wrapper hover-scroll-overlay-y mx-3 ps-5 px-lg-5 pe-3 pb-0" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_aside_navbar" data-kt-scroll-wrappers="#kt_app_aside_content" data-kt-scroll-offset="5px">
								
							</div>
						</div>
						<?php } ?>
						
						<div class="app-main flex-column flex-row-fluid" id="kt_app_main">
							<?php if($secondheader){ ?>
							<div id="kt_app_toolbar" class="app-toolbar" data-kt-sticky="true" data-kt-sticky-name="app-toolbar-sticky" data-kt-sticky-offset="{default: 'false', lg: '200px'}">
								<div id="kt_app_toolbar_container" class="app-container container-fluid d-flex align-items-stretch">
									<div class="app-toolbar-wrapper d-flex flex-stack w-100">
										<div class="page-title d-flex flex-column justify-content-center me-3 mb-0">
											<h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center me-3 my-0" id="page_name"></h1>
											<ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1" id="breadc">
												<li class="breadcrumb-item text-muted">
													<a href="<?= $url ?>/dashboard"  class="text-muted text-hover-primary">Home</a>
												</li>
											</ul>
										</div>
										<div class="d-flex align-items-center gap-2 gap-lg-3" id="menu_buttons">
										</div>
									</div>
								</div>
							</div>
							<?php } ?>
							<div id="kt_app_content_container" class="app-container container-fluid">
		<?php } } ?>