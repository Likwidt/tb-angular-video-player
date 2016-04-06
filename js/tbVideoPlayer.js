(function(){
	"use strict";

	angular .module('tb-video-player', [])
			.directive('tbVideoPlayer', ['$state', tbVideoPlayer])
			.directive('tbVideoControls', [tbVideoControls])
			.directive('tbVideoSlide', [tbVideoSlide])
			.filter("trustUrl", ['$sce', function ($sce) {
		        return function (recordingUrl) {
		            return $sce.trustAsResourceUrl(recordingUrl);
		        };
	    	}]);

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

	function tbVideoPlayer($state) {
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

	function tbVideoSlide() {
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="video-slide-thumb" ng-class="{\'expanded\' : STATES.thumbExpanded}"><img src="img/slides/sm/Slide001.jpg" /></div>',
			link: function($scope, $element) {
				var DOM = {}; 

				DOM.slideContainer = $element[0];
				DOM.video = $scope.video;
				DOM.slideImage = DOM.slideContainer.querySelector('img');

				$scope.STATES.slideImageSrc = null;
				$scope.STATES.thumbExpanded = false;


				function toggleClone(){
					$scope.$apply(function() {
						$scope.STATES.thumbExpanded = !$scope.STATES.thumbExpanded;
					});
				}

				function initSlide() {
					DOM.slideContainer.addEventListener('mousedown', toggleClone, false);
					DOM.slideContainer.addEventListener('touchstart', toggleClone, false);
				}

				$scope.video.addEventListener('canplay', initSlide, false);



				//DOM.videoTitle = $scope.elems.container.querySelector('.video-title');
					//$scope.elems.vidHeight = 539.5;
					//DOM.videoName = DOM.video.getAttribute('data-name');
					//$scope.elems.thumb = $scope.elems.container.querySelector('.video-slide-thumb');
					//$scope.elems.slideImage = $scope.elems.thumb.querySelector('img');
					//$scope.elems.slideImageSrc = null;
					//$scope.getAppropriateImage = getAppropriateImage;
					//$scope.thumbExpanded = false;


					//DOM.video.addEventListener('timeupdate', slideShow, false);
					//DOM.video.addEventListener('ended', backToProgram, false);

					/*function getAppropriateImage() {
						var size = !!$scope.thumbExpanded ? 'lg/' : 'sm/';
						if ($scope.elems.slideImageSrc !== null) {
							return ['img/slides/', size, $scope.elems.slideImageSrc].join('');
						} else {
							return null;
						}
						
					}*/

					/*function initThumb(){

						$scope.$apply(function() {
							$scope.isPlaying = !DOM.video.paused;
						});

						/*if (!!$scope.video.data.timeIndexes.length && $scope.elems.thumb.initStarted !== true){
							$scope.elems.thumb.addEventListener('touchstart', toggleClone, false);			
						}*/

						/*DOM.video.removeAttribute("controls");

						//$scope.elems.thumb['initStarted'] = true;
					}

					/*function expandImage(){
						$scope.elems.container.classList.add('expanded');
						$scope.thumbExpanded = true;
					}


					function shrinkImage(){
						$scope.elems.container.classList.remove('expanded');
						$scope.thumbExpanded = false;		
					}

					function toggleClone( e ){
						if (!$scope.thumbExpanded){
							expandImage();
						} else {
							shrinkImage();
						}
					}*/

					/*function slideShow( e ){		
						var ct = Math.ceil(DOM.video.currentTime),
							duration = Math.ceil(DOM.video.duration),
							ti = parseTime(ct),
							tl = parseTime(duration - ct),
							found = !$scope.video.data.timeIndexes.length,
							offset = (!found) ? $scope.video.data.firstSlide : null,
							nodePos = (ct * $scope.elems.slider.offsetWidth)/duration,
							i = 0,
							h = 0;

						if ($scope.elems.node.isBeingMovedByUser !== true) {
							$scope.$apply(function() {
								$scope.timeIn = ti;
								$scope.timeLeft = tl;
								$scope.elems.node.style.left = [nodePos, 'px'].join('');
							});
						}


						while ( !found && ($scope.video.data.timeIndexes) && i < $scope.video.data.timeIndexes.length ){
							


							if (ct >= $scope.video.data.timeIndexes[i] && ct < $scope.video.data.timeIndexes[i+1]) {
								// found our index
								var absoluteSlide = i + offset,
									fileLocation = ['Slide', pad3(absoluteSlide), '.jpg'].join('');

								

								// only change slide if slide needs changing
								if ($scope.elems.slideImageSrc !== fileLocation){
									$scope.$apply(function() {
										$scope.elems.slideImageSrc = fileLocation;
									});				
								}

								found = true;


							} else {
								// try again
								i++;
							}		
						}
					}*/

					/*function backToProgram(){
						$scope.$apply(function() {
							$state.go('program');
						});
						
					}*/

			}
		};
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
})();