<?php
// Define the target directory where uploaded files will be stored
$targetDir = "docs/";

// If the directory doesn't exist, create it
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Specify the allowed file types
$allowedTypes = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip');

// Get the file name and extension
$fileName = basename($_FILES["file"]["name"]);
$fileType = pathinfo($fileName, PATHINFO_EXTENSION);

// Check if the file type is allowed
if (in_array(strtolower($fileType), $allowedTypes)) {
    // Generate a unique filename to prevent overwriting
    $uniqueFileName = uniqid() . '.' . $fileType;
    
    // Specify the target file path
    $targetFilePath = $targetDir . $uniqueFileName;
    
    // Move the uploaded file to the specified location
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        // File uploaded successfully
        $uploadedUrl = $targetFilePath; // Assuming the URL is the same as the file path
        
        // Return the URL as JSON
        echo json_encode(array('url' => $uploadedUrl));
    } else {
        // Error uploading file
        echo json_encode(array('error' => 'Sorry, there was an error uploading your file.'));
    }
} else {
    // Invalid file type
    echo json_encode(array('error' => 'Sorry, only JPG, JPEG, PNG, and GIF files are allowed.'));
}
?>
