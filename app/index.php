<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" ng-app="myApp" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" ng-app="myApp" class="no-js"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Swarm.fm</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-capable" content="yes" />

  <meta property="og:title" content="Swarm.fm" />
  <meta property="og:site_name" content="Swarm.fm" />
  <meta property="og:url" content="http://app.swarm.fm/" />
  <meta property="og:image" content="http://app.swarm.fm/img/heroimage.png" />
  <meta property="og:description" content="New releases and concerts from artists you love" />
  <meta property="fb:app_id" content="251436354980669" />

  <link rel="icon" type="image/png" href="img/icon.png">
  <link rel="apple-touch-icon" href="/img/icon.png" />
  <link rel="stylesheet" href="bower_components/html5-boilerplate/css/normalize.css">
  <link rel="stylesheet" href="bower_components/html5-boilerplate/css/main.css">
  <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/1.5.2/css/ionicons.min.css"/>
  <link rel="stylesheet" href="css/app.css"/>
  <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic' rel='stylesheet' type='text/css'>
  <script src="bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js"></script>
  <script> var code = '<?=$_GET[code]?>'; </script>
</head>
<body ng-controller="mainCtrl" ng-class="{playing:$root.playersrc, desktop:$root.desktop, ready:$root.loggedIn}" analytics pagetitle>
  <div class="menu" id="mainmenu">
    <div id="logo" href="#/releases">Swarm.fm <span class="pagetitle">{{$root.pagetitle}}</span></div>
    <a id="settings" href="#/settings" class="ion-ios7-gear"></a>
    <a id="searchbutton" href="#/search" class="ion-ios7-search-strong"></a>
    <div id="nav">
      <a href="#/{{tab.path}}" 
        ng-repeat="tab in tabs" 
        ng-class="{active:isActive(tab.path)}" 
        class="{{tab.path}}-link">
          <span class="{{tab.icon}}"></span>
          {{tab.label}}
      </a>
    </div>
    <div style='clear: both;'></div>
  </div>

  <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->

  <div ng-view></div>

  <div id="player" ng-class="{open:$root.playeropen}" ng-show="$root.loggedIn">
    <div id="playertoolbar" ng-click="$root.playeropen=!$root.playeropen">
      <span class="ion-arrow-down-b collapse"></span>
      <span class="ion-arrow-up-b expand"></span>
      <div class="message" ng-hide="$root.playersrc">No music selected</div>
    </div>
    <iframe ng-src="{{$root.playersrc}}" frameborder="0" allowtransparency="true" width="250" height="330"></iframe>
  </div>

  <!-- In production use:
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/x.x.x/angular.min.js"></script>
  -->
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-route/angular-route.js"></script>
  <script src="bower_components/angular-ui-utils/ui-utils.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.js"></script>
  <script src="js/app.js"></script>
  <script src="js/services.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/directives.js"></script>
  <script src="js/controllers/main.js"></script>
  <script src="js/controllers/artist.js"></script>
  <script src="js/controllers/artists.js"></script>
  <script src="js/controllers/concerts.js"></script>
  <script src="js/controllers/dna.js"></script>
  <script src="js/controllers/genres.js"></script>
  <script src="js/controllers/logout.js"></script>
  <script src="js/controllers/releases.js"></script>
  <script src="js/controllers/search.js"></script>
  <script src="js/controllers/settings.js"></script>
  <script src="js/controllers/welcome.js"></script>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-2778392-21', 'auto');
    ga('require', 'displayfeatures');

  </script>
  <!--Shuffler-lhr7xqpimf-->
</body>
</html>
