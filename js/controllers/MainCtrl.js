(function(){
	"use strict";

	function MainCtrl($state){
		var MainCtrl = this;
		var temp = [];
		var i;
		var slideInd;



		MainCtrl.videoObject = [
			{keyword: 'welcome-and-intoductions', videoFileName: 'vids/Intro.mp4', position: {x: 85.5, y: 171, w: 348}, entry: null, timeIndexes: [0, 13.5, 35.5, 85.5, 105, 118.5, 126.5, 145.5, 186.5, 99999], firstSlide: 1},
			{keyword: 'current-management', videoFileName: 'vids/Daskalopoulou.mp4', position: {x: 86.5, y: 311, w: 357}, entry: null, timeIndexes: [0, 88.5, 104.5, 111.5, 128.5, 160.1, 177.6, 212.6, 229.5, 249.5, 280, 312.5, 324.5, 373.5, 396, 448.8, 479, 497.2, 546.3, 577, 616.5, 681, 725, 795, 838.5, 859.6, 99999], firstSlide: 10},
			{keyword: 'single-pill-therapy', videoFileName: 'vids/Feldman.mp4', position: {x: 86, y: 439, w: 387}, entry: null, timeIndexes: [0, 293, 304.5, 353, 404.5, 502, 546, 574.5, 608.5, 759.5, 827.5, 848, 877.5, 914, 928, 959.8, 977.5, 985.3, 1002.7, 1025.3, 1040.3, 1070.2, 1085.4, 1107.3, 1126.4, 1155.2, 1188.2, 1295, 99999], firstSlide: 36},
			{keyword: 'novel-single-pill', videoFileName: 'vids/Trudeau.mp4', position: {x: 546.5, y: 171, w: 295}, entry: null, timeIndexes: [0, 107.7, 121.5, 180, 232.7, 273.9, 338.4, 351.3, 418.7, 435.4, 460, 476.4, 511.2, 528.4, 577.2, 590.1, 608, 627.3, 681.2, 704.8, 729.6, 765, 780.8, 793.6, 799.5, 825.3, 839.7, 896.2, 99999], firstSlide: 64},
			{keyword: 'how-should-guidelines-evolve', videoFileName: 'vids/Dresser-2.mp4', position: {x: 546.5, y: 316, w: 338.5}, entry: null, timeIndexes: [0, 104.5, 116.6, 157, 233, 275.7, 295.5, 351, 368.6, 406.5, 424, 453, 476, 504.6, 521.1, 536.3, 560, 590.6, 616.7, 627.7, 651.2, 714.5, 727.5, 739.7, 836.5, 894, 1033, 1076.8, 1112.5, 99999], firstSlide: 92},
			{keyword: 'concluding-remarks', videoFileName: 'vids/Questions.mp4', position: {x: 546.5, y: 476.5, w: 353.5}, entry: null, timeIndexes: [], firstSlide: 1}
		];

		// terrible example because I'm lazy and don't feel like typing stuff
		for (i in MainCtrl.videoObject[0].timeIndexes) {
			slideInd = parseInt(i)+1;
			temp.push({ timeIndex: MainCtrl.videoObject[0].timeIndexes[i], slideUrl: 'img/slides/lg/Slide00' + slideInd + '.jpg' });
		}

		MainCtrl.getOut = function() {
			console.log('ok');
			$state.go('done');

		};

		MainCtrl.slides = temp;
	}

	angular	.module('app')
			.controller('MainCtrl', ['$state', MainCtrl]);



})();