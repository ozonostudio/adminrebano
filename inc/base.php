<?php
if(!isset($_COOKIE['lang'])) {
    setcookie('lang', 'es', time() + 365 * 24 * 60 * 60, '/');
}

require_once('./inc/lang/variables.php');



function v5_UUID($name_space, $string) {

  $n_hex = str_replace(array('-','{','}'), '', $name_space); // Getting hexadecimal components of namespace
  $binray_str = ''; // Binary value string
  //Namespace UUID to bits conversion
  for($i = 0; $i < strlen($n_hex); $i+=2) {
	$binray_str .= chr(hexdec($n_hex[$i].$n_hex[$i+1]));
  }
  //hash value
  $hashing = sha1($binray_str . $string);

  return sprintf('%08s-%04s-%04x-%04x-%12s',
	// 32 bits for the time_low
	substr($hashing, 0, 8),
	// 16 bits for the time_mid
	substr($hashing, 8, 4),
	// 16 bits for the time_hi,
	(hexdec(substr($hashing, 12, 4)) & 0x0fff) | 0x5000,
	// 8 bits and 16 bits for the clk_seq_hi_res,
	// 8 bits for the clk_seq_low,
	(hexdec(substr($hashing, 16, 4)) & 0x3fff) | 0x8000,
	// 48 bits for the node
	substr($hashing, 20, 12)
  );
}
function luminance($hexcolor, $percent){
  if ( strlen( $hexcolor ) < 6 ) {
  $hexcolor = $hexcolor[0] . $hexcolor[0] . $hexcolor[1] . $hexcolor[1] . $hexcolor[2] . $hexcolor[2];
  }
  $hexcolor = array_map('hexdec', str_split( str_pad( str_replace('#', '', $hexcolor), 6, '0' ), 2 ) );

  foreach ($hexcolor as $i => $color) {
  $from = $percent < 0 ? 0 : $color;
  $to = $percent < 0 ? $color : 255;
  $pvalue = ceil( ($to - $from) * $percent );
  $hexcolor[$i] = str_pad( dechex($color + $pvalue), 2, '0', STR_PAD_LEFT);
  }

  return '#' . implode($hexcolor);
}

function textColor($color) {
  $c = str_replace('#','',$color);
  $rgb[0] = hexdec(substr($c,0,2));
  $rgb[1] = hexdec(substr($c,2,2));
  $rgb[2] = hexdec(substr($c,4,2));
  if ($rgb[0]+$rgb[1]+$rgb[2]<382) {
	return '#fff';
  } else {
	return '#000'; 
  }
}

$url = ($_SERVER['HTTPS'] ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
$currentfile = substr($_SERVER['SCRIPT_NAME'], 1);