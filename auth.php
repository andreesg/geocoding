<?php
session_start();

if(isset($_GET['do'])) {

    if($_GET['do'] == 'login') {
        login();
    } else if($_GET['do'] == 'logout'){
        logout();
    }
} 

function login() {
    $pw = "g30c0d1ng";

    if(isset($_POST['password'])) {
        if($_POST['password'] == $pw) {
            $_SESSION['loggedIn'] = true;
            header('Location:index.php');
        } else {
            header('Location:auth.php');
        } 
    } 
}

function logout() {
    $_SESSION['loggedIn'] = false;
    session_destroy();
    header('Location:auth.php');
}

?>

<html lang="en"><head>
    <meta charset="utf-8">
    <title>Sign in · Geocoding INESC</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
      }

      .form-signin {
        max-width: 300px;
        padding: 19px 29px 29px;
        margin: 0 auto 20px;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        -webkit-border-radius: 5px;
           -moz-border-radius: 5px;
                border-radius: 5px;
        -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
           -moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
                box-shadow: 0 1px 2px rgba(0,0,0,.05);
      }
      .form-signin .form-signin-heading,
      .form-signin .checkbox {
        margin-bottom: 10px;
      }
      .form-signin input[type="text"],
      .form-signin input[type="password"] {
        font-size: 14px;
        height: auto;
        margin-bottom: 15px;
        padding: 3px 3px;
      }

    </style>

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->

  </head>

  <body>

    <div class="container">

      <form class="form-signin" method="POST" action="auth.php?do=login">
        <h3 class="form-signin-heading">Please sign in</h2>
        <input type="password" name="password" class="input-block-level" placeholder="Password">

        <button class="btn btn-mini btn-primary" type="submit">Sign in</button>
      </form>

    </div> <!-- /container -->
</body>
</html>