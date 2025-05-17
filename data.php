<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    session_start();
    require_once('./inc/db.php');
    $jdata = array();
    $teams = array();
    $players = array();

    // GET ALL TOURNAMENTS
    $sql = 'SELECT * FROM tournaments ORDER BY id DESC';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $alltour = $stmt->get_result();

    // GET ALL Teams
    $sql2 = 'SELECT * FROM teams';
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();
    $allteams = $stmt2->get_result();

    // GET ALL Players
    $sql3 = 'SELECT * FROM players';
    $stmt3 = $conn->prepare($sql3);
    $stmt3->execute();
    $allplayers = $stmt3->get_result();

    if ($alltour->num_rows === 0) {
        echo json_encode(array('response' => 'error'));
        exit();
    }
    while ($row = $alltour->fetch_assoc()) {
        $j = $row['json'];
        $jdata[] = json_decode($j, true);
    }
    while ($row = $allteams->fetch_assoc()) {
        $json = $row['json'];
        $teams[] = json_decode($json, true);
    }
    while ($row = $allplayers->fetch_assoc()) {
        $pjson = $row['json'];
        $players[] = json_decode($pjson, true);
    }

    echo json_encode(array('response' => 'done', 'data' => $jdata, 'teams' => $teams, 'players' => $players));
?>
