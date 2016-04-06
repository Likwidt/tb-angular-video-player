(function() {
	"use strict";

	angular .module('tb-video-player')
			.directive('tbVideoControls', [tbVideoControls])

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

	function tbVideoControls() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/videoControls.html',
			link: function($scope, $element) {	
				var DOM = {};
				var OPTIONS = {};
				var tempVideoTime;
				var sliderBounds;
				
				DOM.controls = $element[0];
				DOM.video = $scope.video;
				DOM.forwardButton = DOM.controls.querySelector('.fw30');
				DOM.backButton = DOM.controls.querySelector('.back30');
				DOM.slider = DOM.controls.querySelector('.slider > img');
				DOM.node = DOM.controls.querySelector('.node');
				DOM.playPause = DOM.controls.querySelector('.playPause');
				DOM.timeIn = DOM.controls.querySelector('.timeIn');
				DOM.timeLeft = DOM.controls.querySelector('.timeLeft');
				
				
				OPTIONS.skipTime = 30;

				$scope.STATES.isPlaying = false;
				$scope.STATES.timeIn;
				$scope.STATES.timeLeft;

				function initControls(e) {
					sliderBounds = DOM.slider.getBoundingClientRect();

					updateTimeCounters(e);
				}

				function updateTimeCounters() {
					var currentTime = DOM.video.currentTime;
					var timeLeft = $scope.STATES.duration - currentTime;

					setTimeCounters(currentTime, timeLeft);	
				}

				function setTimeCounters(currentTime, timeLeft) {
					var sliderPosition = currentTime * sliderBounds.width / $scope.STATES.duration;

					DOM.node.style.left = [sliderPosition, 'px'].join('');

					$scope.$apply(function() {
						$scope.STATES.timeIn = parseTime(currentTime, 'up');
						$scope.STATES.timeLeft = parseTime(timeLeft, 'down');			
					});
				}

				function bindSliderNode(e) {
					e.stopPropagation();

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
					var diff = event.pageX - sliderBounds.left
					var timeLeft;

					e.stopPropagation();

					if (diff <= 0) { //too left
						tempVideoTime = 0;
					} else if (diff >= sliderBounds.width) { // too right
						tempVideoTime = $scope.STATES.duration;
					} else { // ok
						tempVideoTime = ($scope.STATES.duration * diff) / sliderBounds.width;
					}

					timeLeft = $scope.STATES.duration - tempVideoTime;

					setTimeCounters(tempVideoTime, timeLeft);
				}

				function back30(){
					var currentTime = DOM.video.currentTime;

					DOM.video.currentTime = currentTime >= OPTIONS.skipTime ? (currentTime - OPTIONS.skipTime) : 0;
				}

				function fw30(){
					if (DOM.video.currentTime < ($scope.STATES.duration - OPTIONS.skipTime)){
						DOM.video.currentTime += OPTIONS.skipTime;
					} else {
						DOM.video.pause();
						DOM.video.currentTime = $scope.STATES.duration;

					}
				}

				function playButtonHandler (){
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
				DOM.video.addEventListener('timeupdate', updateTimeCounters, false)

				DOM.forwardButton.addEventListener('mousedown', fw30, false);
				DOM.backButton.addEventListener('mousedown', back30, false);
				DOM.playPause.addEventListener('mousedown', playButtonHandler, false);
				DOM.node.addEventListener('mousedown', bindSliderNode, false);

				DOM.forwardButton.addEventListener('touchstart', fw30, false);
				DOM.backButton.addEventListener('touchstart', back30, false);
				DOM.playPause.addEventListener('touchstart', playButtonHandler, false);
				DOM.node.addEventListener('touchstart', bindSliderNode, false);
			}
		};
	}
}());