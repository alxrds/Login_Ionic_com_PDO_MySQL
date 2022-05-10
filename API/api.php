<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

define('HOST', '172.17.0.2');
define('USER', 'root');
define('PASS', '');
define('BASE', 'loginIonic');

try{
    $conn = new pdo('mysql:host=' .HOST. ';dbname=' .BASE, USER, PASS);
}catch(PDOException $erro){
    echo 'Erro: Falha ao Conectar' .$erro->getMessage();
}

$dataHora = date('Y-m-d H:i:s');
$postjson = json_decode(file_get_contents('php://input'), true);

$nome = $postjson['nome'];
$email = $postjson['email'];
$senha = $postjson['senha'];
$acao = $postjson['acao'];
$status = 'y';

if($acao == 'register'){
  $stmt = $conn->prepare('SELECT * FROM tbl_user WHERE email = :email');
  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  if($stmt->rowCount() > 0){
  	$result = json_encode(array('success'=>false, 'msg' => 'O e-mail já esta '.$email.' cadastrado!'));
    echo $result;
  }else{
    $stmt = $conn->prepare('INSERT INTO tbl_user (nome, email, password, status, created_at) VALUES(:nome, :email, :password, :status, :created_at)');
    $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':password', PASSWORD_HASH($senha, PASSWORD_BCRYPT), PDO::PARAM_STR);
    $stmt->bindParam(':status', $email, PDO::PARAM_STR);
    $stmt->bindParam(':created_at', $dataHora, PDO::PARAM_STR);
    if($stmt->execute()){
      $result = json_encode(array('success'=>true, 'msg' => 'Usuário '.$email.' cadastrado com sucesso!'));
      echo $result;
    }
  }
}

if($acao == 'login'){
  $stmt = $conn->prepare('SELECT * FROM tbl_user WHERE email = :email');
  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  if($stmt->rowCount() > 0){
    $row = $stmt->fetch();
    if(password_verify($senha, $row['password'])){
      $result = json_encode(array('success'=>true, 'result'=>$row));
    }elseif($row['status'] == 'n'){
      $result = json_encode(array('success'=>false, 'msg'=>'Conta Inativa'));
    }else{
      $result = json_encode(array('success'=>false, 'msg' => 'A senha está incorreta!'));
    }
  }else{
  	$result = json_encode(array('success'=>false, 'msg' => 'O e-mail '.$email.' não existe!'));
  }
  echo $result;
}
