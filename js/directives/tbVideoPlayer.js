(function(){
	"use strict";

	angular .module('tb-video-player', ['tb-video-player.templates'])
			.controller('TbVideoPlayerCtrl', [TbVideoPlayerCtrl])
			.directive('tbVideoPlayer', [tbVideoPlayer])
			.filter("trustUrl", ['$sce', function ($sce) {
		        return function (recordingUrl) {
		            return $sce.trustAsResourceUrl(recordingUrl);
		        };
	    	}]);

	function TbVideoPlayerCtrl() {
		var ctrl = this;

		function pad3(num){
			var n = (num < 10) ? ['00', num].join('') : (num < 100) ? ['0', num].join('') : num;
			return n;
		}

		function pad2(num){
			var n = (num < 10) ? ['0', num].join('') : num;
			return n;
		}

		function parseTime(t, round){
			var minutes = Math.floor(t/60),
				seconds = round != 'up' ? pad2(Math.floor(t%60)) : pad2(Math.ceil(t%60));

			return [minutes, ':', seconds].join('');
		}

		function browserTransform() {
			var el = document.createElement('fakeelement');
			var browserPrefixes = ['OTransform', 'MozTransform', 'WebkitTransform'];
			var i;

			for (i in browserPrefixes) {
				if (typeof el.style[browserPrefixes[i]] !== 'undefined') {
					return browserPrefixes[i];
				}
			}

			return 'transform';
		}

		/* From Modernizr */
		function whichTransitionEvent(){
		    var t;
		    var el = document.createElement('fakeelement');
		    var transitions = {
		      'transition':'transitionend',
		      'OTransition':'oTransitionEnd',
		      'MozTransition':'transitionend',
		      'WebkitTransition':'webkitTransitionEnd'
		    };

		    for(t in transitions){
		        if( el.style[t] !== undefined ){
		            return transitions[t];
		        }
		    }
		}

		ctrl.pad3 = pad3;
		ctrl.pad2 = pad2;
		ctrl.parseTime = parseTime;
		ctrl.whichTransitionEvent = whichTransitionEvent;
		ctrl.browserTransform = browserTransform;
	}

	function tbVideoPlayer() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				data: '=',
				slides: '=',
				src: '=',
				videoEnd: '&'
			},
			controller: 'TbVideoPlayerCtrl',
			templateUrl: 'js/directives/templates/videoPlayer.html',
			link: function($scope, $element, $attrs) {
				$scope.master = $element[0];
				$scope.video =  $scope.master.querySelector('video');

				$scope.STATES = {};
				$scope.STATES.hasControls = typeof $attrs.controls !== 'undefined';
				$scope.STATES.hasSlides = typeof $scope.slides !== 'undefined' && !!$scope.slides.length && checkIfSlidesHaveGoodStructure();

				function initVideo() {
					if (typeof $scope.videoEnd === 'function') {
						$scope.video.addEventListener('ended', $scope.videoEnd, false);
					}
				}

				function checkIfSlidesHaveGoodStructure() {
					var slideIndex = $scope.slides.length - 1;

					while (slideIndex--) {
						if (!$scope.slides[slideIndex].hasOwnProperty('timeIndex')) {
							$scope.STATES.hasSlides = false;
							console.error('Object used in "slides" attribute is missing property: "timeIndex"');
							return false;
						}

						if (!$scope.slides[slideIndex].hasOwnProperty('slideUrl')) {
							$scope.STATES.hasSlides = false;
							console.error('Object used in "slides" attribute is missing property: "slideUrl"');
							return false;
						}
					} 

					return true;
				}

				$scope.video.addEventListener('canplay', initVideo, false);
			}
		};
	}			
})();