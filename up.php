<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    session_start();
    require_once('./inc/db.php');

    if ($_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        // Get the temporary location of the uploaded file
        $tmpFilePath = $_FILES['avatar']['tmp_name'];
      
        // Process the file as needed (e.g., move to a permanent location)
        $uploadDir = 'uploads/'; // Replace with your desired upload directory
        $fileName = $_FILES['avatar']['name'];
        $fileType = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueFileName = uniqid() . '.' . $fileType;

        $destination = $uploadDir . $uniqueFileName;
      
        if (move_uploaded_file($tmpFilePath, $destination)) {
          // File uploaded successfully
          $response = array(
            "success" => true,
            "url" => $destination // You can return the URL of the uploaded file here
          );
        } else {
          // Error while moving the uploaded file
          $response = array(
            "success" => false,
            "error" => "File upload failed."
          );
        }
      } else {
        // File upload failed
        $response = array(
          "success" => false,
          "error" => "File upload failed."
        );
      }
      
      // Return the response as JSON
      header('Content-Type: application/json');
      echo json_encode($response);