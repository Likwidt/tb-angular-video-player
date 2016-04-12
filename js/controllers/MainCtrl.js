(function(){
	"use strict";

	function MainCtrl($state){
		var MainCtrl = this;
		var temp = [];
		var i;
		var slideInd;



		MainCtrl.videoObject = [
			{keyword: 'welcome-and-intoductions', videoFileName: 'https://sta.thierryblais.com/Hypertension/Intro.mp4', position: {x: 85.5, y: 171, w: 348}, entry: null, timeIndexes: [0, 13.5, 35.5, 85.5, 105, 118.5, 126.5, 145.5, 186.5, 99999], firstSlide: 1}
		];

		// terrible example because I'm lazy and don't feel like typing stuff
		for (i in MainCtrl.videoObject[0].timeIndexes) {
			slideInd = parseInt(i)+1;
			temp.push({ timeIndex: MainCtrl.videoObject[0].timeIndexes[i], slideUrl: 'img/slides/lg/Slide00' + slideInd + '.jpg' });
		}

		MainCtrl.getOut = function() {
			$state.go('done');

		};

		MainCtrl.slides = temp;
	}

	angular	.module('app')
			.controller('MainCtrl', ['$state', MainCtrl]);



})();