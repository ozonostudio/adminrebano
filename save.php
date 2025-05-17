<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    session_start();
    require_once('./inc/db.php');
    
    $object = json_decode($_POST['json']);
    $type = $_POST['type'];
    $uuid = $object->uuid;

    if($type == 'tournament'){
        $json = json_encode($object);
        $stmt = $conn->prepare("INSERT INTO tournaments (uuid, json) VALUES (?, ?)");
		$stmt->bind_param("ss", $uuid, $json);

        if($stmt->execute()){
            echo json_encode(array('response' => 'done'));
        }else{
            echo json_encode(array('response' => 'error'));
        };
    }elseif($type == 'remove'){
        $stmt = $conn->prepare("DELETE FROM tournaments WHERE uuid = ?");
        $stmt->bind_param("s", $uuid); // Bind the ID value to the parameter
        if ($stmt->execute()) {
            echo json_encode(array('response' => 'done'));
        }
    }elseif($type == 'update'){
        $divisionsData = $_POST['data'];
        $sql = 'UPDATE tournaments SET json = ? WHERE uuid = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $divisionsData, $uuid);
        
        if($stmt->execute()){
            echo json_encode(array('response' => 'done'));
        }else{
            echo json_encode(array('response' => 'error'));
        };
    }elseif ($type == 'addteam') {
        $name = $_POST['data'];
        $stmt = $conn->prepare("INSERT INTO teams (name) VALUES (?)");
        $stmt->bind_param("s", $name);
    
        if ($stmt->execute()) {
            $inserted_id = $stmt->insert_id;
            $stmt->close();
            $stmt = $conn->prepare("SELECT registered FROM teams WHERE id = ?");
            $stmt->bind_param("i", $inserted_id);
            $stmt->execute();
            $stmt->bind_result($registered);
            $stmt->fetch();
    
            echo json_encode(array('response' => 'done', 'id' => $inserted_id, 'registered' => $registered));
        } else {
            echo json_encode(array('response' => 'error'));
        };
    }elseif ($type == 'addplayer') {
        $name = $_POST['data'];
        $stmt = $conn->prepare("INSERT INTO players (name) VALUES (?)");
        $stmt->bind_param("s", $name);
    
        if ($stmt->execute()) {
            $inserted_id = $stmt->insert_id;
            $stmt->close();
            $stmt = $conn->prepare("SELECT registered FROM players WHERE id = ?");
            $stmt->bind_param("i", $inserted_id);
            $stmt->execute();
            $stmt->bind_result($registered);
            $stmt->fetch();
    
            echo json_encode(array('response' => 'done', 'id' => $inserted_id, 'registered' => $registered));
        } else {
            echo json_encode(array('response' => 'error'));
        };
    }elseif($type == 'updateTeam'){
        $divisionsData = $_POST['data'];
        $sql = 'UPDATE teams SET json = ? WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $divisionsData, $uuid);
        
        if($stmt->execute()){
            echo json_encode(array('response' => 'done'));
        }else{
            echo json_encode(array('response' => 'error'));
        };
    }elseif($type == 'updatePlayer'){
        $divisionsData = $_POST['data'];
        $sql = 'UPDATE players SET json = ? WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $divisionsData, $uuid);
        
        if($stmt->execute()){
            echo json_encode(array('response' => 'done'));
        }else{
            echo json_encode(array('response' => 'error'));
        };
    }elseif($type == 'delTeam'){
        $stmt = $conn->prepare("DELETE FROM teams WHERE id = ?");
        $stmt->bind_param("s", $uuid); // Bind the ID value to the parameter
        if ($stmt->execute()) {
            echo json_encode(array('response' => 'done'));
        }
    }

    $stmt->close();
	$conn->close();