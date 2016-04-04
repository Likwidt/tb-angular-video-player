(function(){
	"use strict";
	
	function appConfig( $compileProvider, $stateProvider, $urlRouterProvider ){

		// Un comment if you need to include link to mail, skype, phone or other
		//$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|tel):/);

		// For any unmatched url, redirect to /home
  		$urlRouterProvider.otherwise("/home");

  		$stateProvider
  			.state('home', { url: "/home", templateUrl: "views/home.html" });

	}

	angular.module('app', ['ui.router', 'tb-video-player'])
		.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', appConfig]);

})();