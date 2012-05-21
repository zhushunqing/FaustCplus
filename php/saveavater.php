<?php

session_start();

$rs = array();

switch($_GET['action']){

	//上传临时图片
	case 'uploadtmp':
		move_uploaded_file($_FILES['Filedata']['tmp_name'], './tmp.jpeg');
		$rs['status'] = 1;
		$rs['url'] = 'http://flashman.com.cn/test/headupload/tmp.jpeg';
	break;

	//上传切头像
	case 'uploadavatar':
		$input = file_get_contents('php://input');
		$data = explode('--------------------', $input);
		file_put_contents('./tmp1.jpeg', $data[0]);
		file_put_contents('./tmp2.jpeg', $data[1]);
		$rs['status'] = 1;
	break;

	default:
		$rs['status'] = -1;
}

print json_encode($rs);

?>
