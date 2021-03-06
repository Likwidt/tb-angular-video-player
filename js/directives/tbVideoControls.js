(function() {
	"use strict";

	angular .module('tb-video-player')
			.directive('tbVideoControls', [tbVideoControls]);

	function tbVideoControls() {
		return {
			restrict: 'E',
			replace: true,
			require: '^tbVideoPlayer',
			templateUrl: 'js/directives/templates/videoControls.html',
			link: function($scope, $element, $attrs, tbVideoPlayerCtrl) {	
				var DOM = {};
				var OPTIONS = {};
				var tempVideoTime;
				var sliderBounds;
				var nodeWidth;
				var duration;
				
				DOM.controls = $element[0];
				DOM.video = $scope.video;
				DOM.forwardButton = DOM.controls.querySelector('.fw30');
				DOM.backButton = DOM.controls.querySelector('.back30');
				DOM.slider = DOM.controls.querySelector('.slider');
				DOM.node = DOM.controls.querySelector('.node');
				DOM.playPause = DOM.controls.querySelector('.playPause');
				DOM.timeIn = DOM.controls.querySelector('.timeIn');
				DOM.timeLeft = DOM.controls.querySelector('.timeLeft');
				
				function resetElementMeasurements() {
					sliderBounds = DOM.slider.getBoundingClientRect();
					nodeWidth = DOM.node.offsetWidth;
				}
				
				OPTIONS.skipTime = 30;

				function initControls(e) {
					duration = DOM.video.duration;
					$scope.STATES.isPlaying = !DOM.video.paused;	
					resetElementMeasurements();
					updateTimeCounters();
				}

				function updateTimeCounters() {
					var currentTime = DOM.video.currentTime;
					var timeLeft = duration - currentTime;

					setTimeCounters(currentTime, timeLeft);	
				}

				function setTimeCounters(currentTime, timeLeft) {
					var sliderPosition = (currentTime * sliderBounds.width / duration) - nodeWidth/2;

					DOM.node.style.left = [sliderPosition, 'px'].join('');

					$scope.$apply(function() {
						$scope.STATES.timeIn = tbVideoPlayerCtrl.parseTime(currentTime, 'up');
						$scope.STATES.timeLeft = tbVideoPlayerCtrl.parseTime(timeLeft, 'down');			
					});
				}

				function bindSliderNode(e) {
					e.preventDefault();

					sliderBounds = DOM.slider.getBoundingClientRect();

					//stop updating time indices in the view
					DOM.video.removeEventListener('timeupdate', updateTimeCounters);

					// bind slider behaviour

					if (e.type === 'touchstart') {
						DOM.node.addEventListener('touchmove', sliderMove, false);
						DOM.node.addEventListener('touchend', unbindSliderNode, false);
					} 

					if (e.type === 'mousedown') {
						document.addEventListener('mousemove', sliderMove, false);
						document.addEventListener('mouseup', unbindSliderNode, false);					
					}
				}

				function unbindSliderNode(e) {
					e.stopPropagation();
					e.preventDefault();

					DOM.video.currentTime = tempVideoTime;

					//restart updating time indices in the view
					DOM.video.addEventListener('timeupdate', updateTimeCounters, false);

					// remove slider behaviour
					if (e.type === 'touchend') {
						DOM.node.removeEventListener('touchmove', sliderMove);
						DOM.node.removeEventListener('touchend', unbindSliderNode);
					} 

					if (e.type === 'mouseup') {
						document.removeEventListener('mousemove', sliderMove);
						document.removeEventListener('mouseup', unbindSliderNode);		
					}
				}



				function sliderMove (e) {
					var event = e.type === 'touchmove' ? e.touches[0] : e;
					var diff = event.pageX - sliderBounds.left;
					var timeLeft;

					e.preventDefault();

					if (diff <= 0) { //too left
						tempVideoTime = 0;
					} else if (diff >= sliderBounds.width) { // too right
						tempVideoTime = duration;
					} else { // ok
						tempVideoTime = (duration * diff) / sliderBounds.width;
					}

					timeLeft = duration - tempVideoTime;

					setTimeCounters(tempVideoTime, timeLeft);
				}

				function back30(e){
					var currentTime = DOM.video.currentTime;

					e.preventDefault();

					DOM.video.currentTime = currentTime >= OPTIONS.skipTime ? (currentTime - OPTIONS.skipTime) : 0;
				}

				function fw30(e){
					e.preventDefault();

					if (DOM.video.currentTime < (duration - OPTIONS.skipTime)){
						DOM.video.currentTime += OPTIONS.skipTime;
					} else {
						DOM.video.pause();
						DOM.video.currentTime = duration;
					}
				}

				function playButtonHandler (e){
					e.preventDefault();

					$scope.$apply(function() {
						if (!DOM.video.paused){
							DOM.video.pause();
						} else {
							DOM.video.play();
						}

						$scope.STATES.isPlaying = !DOM.video.paused;
					});
					
				}



				DOM.video.addEventListener('canplay', initControls, false);
				DOM.video.addEventListener('timeupdate', updateTimeCounters, false);

				DOM.forwardButton.addEventListener('mousedown', fw30, false);
				DOM.backButton.addEventListener('mousedown', back30, false);
				DOM.playPause.addEventListener('mousedown', playButtonHandler, false);
				DOM.node.addEventListener('mousedown', bindSliderNode, false);

				DOM.forwardButton.addEventListener('touchstart', fw30, false);
				DOM.backButton.addEventListener('touchstart', back30, false);
				DOM.playPause.addEventListener('touchstart', playButtonHandler, false);
				DOM.node.addEventListener('touchstart', bindSliderNode, false);

				window.addEventListener('resize', resetElementMeasurements, false)
			}
		};
	}
}());