

(function(){
	"use strict";

	function MainCtrl(){
		var MainCtrl = this;

		MainCtrl.test = 'Hello';
	}

	angular	.module('app')
			.controller('MainCtrl', [MainCtrl]);



})();