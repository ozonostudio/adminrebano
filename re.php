<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once ('inc/db.php');
// require_once ('inc/base.php');
$error_message = '';

function validateData($data)
{
	$resultData = htmlspecialchars(stripslashes(trim($data)));
	return $resultData;
}

if (isset($_POST['action']) && $_POST['action'] == 'registration') {
	$first_name = validateData($_POST['firstName']);
	$last_name = validateData($_POST['lastName']);
	$username = validateData($_POST['emailId']);
	$contact_number = validateData($_POST['contactNumber']);
	$password = validateData($_POST['password']);
	$confirm_password = validateData($_POST['confirmPassword']);
	
	$error_message = '';
	$checkEmailQuery = $conn->prepare("select * from tbl_registration where username = ?");
	$checkEmailQuery->bind_param("s", $username);
	$checkEmailQuery->execute();
	
	$result = $checkEmailQuery->get_result();
	if ($result->num_rows > 0) {
		
		$error_message = "Email ID already exists !";
		echo $error_message;
	} else {
		$insertQuery = $conn->prepare("insert into tbl_registration(first_name,last_name,username,contact_number,password) values(?,?,?,?,?)");
		$password = md5($password);
		$insertQuery->bind_param("sssss", $first_name, $last_name, $username, $contact_number, $password);
		
		if ($insertQuery->execute()) {
			echo "Thankyou for registering with us. You can login now.";
			exit();
		} else {
			$error_message = "error";
		}
		$insertQuery->close();
		$conn->close();
		
		echo $error_message;
	}
}
if (isset($_POST['action']) && $_POST['action'] == 'login') {
	
	$username = validateData($_POST['username']);
	$password = validateData($_POST['password']);
	$password = md5($password);
	
	$selectQuery = $conn->prepare("select * from users where username = ? and password = ?");
	$selectQuery->bind_param("ss", $username, $password);

	if ($selectQuery->execute()) {
		$result = $selectQuery->get_result();
	
		if ($result->num_rows > 0) {
			while ($row = $result->fetch_assoc()) {
				$_SESSION['username'] = $row['first_name'] . " " . $row['last_name'];
				$_SESSION["loggedin"]=true;
				if($row['admin'] == 1){
					$_SESSION["admin"]=true;
				}else{
					$_SESSION["admin"]=false;
				}
				exit();
			} // endwhile
		} // endif
		else {
			$error_message = "error";
		} // endElse
		
	}else{
		die("Query execution failed: " . $selectQuery->error . " (" . $selectQuery->errno . ")");
		$error_message = "error";
	}
	
	$conn->close();
	echo $error_message;
	
}elseif (isset($_POST['action']) && $_POST['action'] == 'createtour') {
	
	$d = new DateTime();
	$uuid = md5($d->format("YmdHisv"));
	$v5_uuid = v5_UUID($uuid, $_POST['tourName']);
	
	$insertQuery = $conn->prepare("insert into torneos (uuid,nombre,start,end) values(?,?,?,?)");
	$insertQuery->bind_param("ssss", $v5_uuid, $_POST['tourName'], $_POST['start'], $_POST['end']);
	
	if ($insertQuery->execute()) {
		$catid = v5_UUID($uuid, 'category');
		$insertcat = $conn->prepare("insert into categorias(uuid,catid) values(?,?)");
		$insertcat->bind_param("ss", $v5_uuid, $catid);
		if ($insertcat->execute()) {
			echo $v5_uuid . '/' . $catid;
			exit();
		}
	} else {
		$error_message = "error";
	}
	$insertQuery->close();
	$insertcat->close();
	$conn->close();
}
?>
