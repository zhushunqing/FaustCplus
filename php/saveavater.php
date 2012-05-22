<?php
//session_start();

$rs = array();

switch($_GET['action']){

	//上传临时图片
	case 'uploadtmp':
		$file = 'uploadtmp.jpg';
		@move_uploaded_file($_FILES['Filedata']['tmp_name'], $file);
		$rs['status'] = 1;
		$rs['url'] = './php/' . $file;
	break;

	//上传切头像
	case 'uploadavatar':
		$input = file_get_contents('php://input');
		$data = explode('--------------------', $input);
		@file_put_contents('./avatar_1.jpg', $data[0]);
		@file_put_contents('./avatar_2.jpg', $data[1]);
		$rs['status'] = 1;
	break;

	default:
		$rs['status'] = -1;
}

print json_encode($rs);

?>
