(function(){
	"use strict";

	angular .module('tb-video-player', [])
			.directive('tbVideoPlayer', [tbVideoPlayer])
			.filter("trustUrl", ['$sce', function ($sce) {
		        return function (recordingUrl) {
		            return $sce.trustAsResourceUrl(recordingUrl);
		        };
	    	}]);

	function tbVideoPlayer() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				data: '=',
				slides: '=',
				src: '@'
			},
			templateUrl: 'views/videoPlayer.html',
			link: function($scope, $element, $attrs) {
				$scope.video =  $element[0].querySelector('video');

				$scope.STATES = {};
				$scope.STATES.hasControls = typeof $attrs.controls !== 'undefined';
				$scope.STATES.hasSlides = typeof $attrs.slides !== 'undefined' && !!$scope.slides.length;

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