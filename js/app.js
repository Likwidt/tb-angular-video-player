(function(){
	"use strict";
	
	function appConfig( $compileProvider, $stateProvider, $urlRouterProvider ){

		// Un comment if you need to include link to mail, skype, phone or other
		//$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|tel):/);

		// For any unmatched url, redirect to /home
  		$urlRouterProvider.otherwise("/");

  		$stateProvider
  			.state('home', { url: "/", templateUrl: "views/home.html" })
  			.state('done', { url: "/done", templateUrl: "views/done.html" });

	}

	angular.module('app', ['ui.router', 'tb-video-player'])
		.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', appConfig]);

})();