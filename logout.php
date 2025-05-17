<?php
require_once('./inc/base.php');
session_start();
unset($_SESSION["loggedin"]);
unset($_SESSION["username"]);
unset($_SESSION["admin"]);
session_destroy();
header("location: ".$url."/");
?>