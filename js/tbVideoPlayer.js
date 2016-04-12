(function(){
	"use strict";

	angular .module('tb-video-player', [])
			.controller('tbVideoPlayerCtrl', [tbVideoPlayerCtrl])
			.directive('tbVideoPlayer', [tbVideoPlayer])
			.filter("trustUrl", ['$sce', function ($sce) {
		        return function (recordingUrl) {
		            return $sce.trustAsResourceUrl(recordingUrl);
		        };
	    	}]);

	

	function tbVideoPlayerCtrl() {
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
		    }

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
				src: '@'
			},
			controller: 'tbVideoPlayerCtrl',
			templateUrl: 'views/videoPlayer.html',
			link: function($scope, $element, $attrs) {
				$scope.master = $element[0];
				$scope.video =  $scope.master.querySelector('video');

				$scope.STATES = {};
				$scope.STATES.hasControls = typeof $attrs.controls !== 'undefined';
				$scope.STATES.hasSlides = typeof $scope.slides !== 'undefined' && !!$scope.slides.length;

				function initVideo() {
					$scope.STATES.duration = Math.ceil($scope.video.duration);

					$scope.$apply(function() {
						$scope.STATES.isPlaying = !$scope.video.paused;
					});
				}

				$scope.video.addEventListener('canplay', initVideo, false);
			}
		};
	}			
})();