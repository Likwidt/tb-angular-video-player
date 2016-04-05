(function(){
	"use strict";

	angular .module('tb-video-player', [])
			.directive('tbVideoPlayer', ['$state', tbVideoPlayer])
			.directive('tbVideoControls', [tbvideoControls])
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

	function parseTime( t ){
		var output,
			minutes = Math.floor(t/60),
			seconds = pad2(Math.ceil(t%60));

		output = [minutes, ':', seconds].join('');
		return output;
	}

	function tbVideoPlayer($state) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/videoPlayer.html',
			link: function($scope, $element) {
				$scope.elems = {};
				$scope.elems.container = $element[0];
				$scope.elems.video = $scope.elems.container.querySelector('video');
				//$scope.elems.videoTitle = $scope.elems.container.querySelector('.video-title');
				$scope.elems.vidHeight = 539.5;
				$scope.elems.videoName = $scope.elems.video.getAttribute('data-name');
				//$scope.elems.thumb = $scope.elems.container.querySelector('.video-slide-thumb');
				//$scope.elems.slideImage = $scope.elems.thumb.querySelector('img');
				//$scope.elems.slideImageSrc = null;
				//$scope.getAppropriateImage = getAppropriateImage;

				$scope.timeIn = '0:00';
				$scope.timeLeft = '0:00';
				//$scope.thumbExpanded = false;


				//$scope.elems.video.addEventListener('timeupdate', slideShow, false);
				$scope.elems.video.addEventListener('canplay', initThumb, false);
				//$scope.elems.video.addEventListener('ended', backToProgram, false);

				function getAppropriateImage() {
					var size = !!$scope.thumbExpanded ? 'lg/' : 'sm/';
					if ($scope.elems.slideImageSrc !== null) {
						return ['img/slides/', size, $scope.elems.slideImageSrc].join('');
					} else {
						return null;
					}
					
				}

				function initThumb(){

					$scope.$apply(function() {
						$scope.isPlaying = !$scope.elems.video.paused;
					});

					/*if (!!$scope.video.data.timeIndexes.length && $scope.elems.thumb.initStarted !== true){
						$scope.elems.thumb.addEventListener('touchstart', toggleClone, false);			
					}*/

					$scope.elems.video.removeAttribute("controls");

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
					var ct = Math.ceil($scope.elems.video.currentTime),
						duration = Math.ceil($scope.elems.video.duration),
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

	function tbvideoControls() {
		return {
			restrice: 'E',
			replace: true,
			templateUrl: 'views/videoControls.html',
			link: function($scope, $element) {	
				var tempVideoTime;

				$scope.elems.controls = $element[0];
				$scope.elems.slider = $scope.elems.controls.querySelector('.slider > img');
				$scope.elems.node = $scope.elems.controls.querySelector('.node');
				$scope.elems.playPause = $scope.elems.controls.querySelector('.playPause');
				$scope.elems.fw = $scope.elems.controls.querySelector('.fw30');
				$scope.elems.bk = $scope.elems.controls.querySelector('.back30');
				$scope.elems.timeIn = $scope.elems.controls.querySelector('.timeIn');
				$scope.elems.timeLeft = $scope.elems.controls.querySelector('.timeLeft');
				$scope.skipTime = 30;
				$scope.isPlaying;


				$scope.elems.fw.addEventListener('touchstart', fw30, false);
				$scope.elems.bk.addEventListener('touchstart', back30, false);
				$scope.elems.playPause.addEventListener('touchstart', playButtonHandler, false);

				$scope.elems.node.addEventListener('touchstart', bindSliderNode, false);


				function bindSliderNode(e) {
					e.stopPropagation();
					$scope.elems.node['isBeingMovedByUser'] = true;
					$scope.elems.node.addEventListener('touchmove', sliderMove, false);
					$scope.elems.node.addEventListener('touchend', unbindSliderNode, false);

				}

				function unbindSliderNode(e) {
					e.stopPropagation();
					$scope.elems.node['isBeingMovedByUser'] = false;

					$scope.elems.video.currentTime = tempVideoTime;

					$scope.elems.node.removeEventListener('touchmove', sliderMove, false);
					$scope.elems.node.removeEventListener('touchend', unbindSliderNode, false);
				}

				function sliderMove (e) {
					e.stopPropagation();
					var touch = e.touches[0];
					var duration = Math.ceil($scope.elems.video.duration);
					var sliderBounds = $scope.elems.slider.getBoundingClientRect();
					var movePosition = touch.pageX;
					var diff = movePosition - sliderBounds.left;



					if (diff <= 0) { //too left
						$scope.elems.node.style.left = [0, 'px'].join('');
						tempVideoTime = 0;
					} else if (diff >= sliderBounds.width) { // too right
						$scope.elems.node.style.left = [sliderBounds.width, 'px'].join('');
						tempVideoTime = duration;
					} else { // ok
						$scope.elems.node.style.left = [diff, 'px'].join('');
						tempVideoTime = (duration * diff) / sliderBounds.width;
					}

					$scope.$apply(function() {
						$scope.timeIn = parseTime(tempVideoTime);
						$scope.timeLeft = parseTime(duration - tempVideoTime);
					});

				}

				function back30(){
					var goBack = ($scope.elems.video.currentTime >= $scope.skipTime);

					$scope.elems.video.currentTime = goBack ? ($scope.elems.video.currentTime - $scope.skipTime) : 0;
				}

				function fw30(){
					var goFw = ($scope.elems.video.currentTime < ($scope.elems.video.duration - $scope.skipTime));

					if (goFw){
						$scope.elems.video.currentTime = ($scope.elems.video.currentTime + $scope.skipTime);
					} else {
						$scope.elems.video.pause();
						$scope.elems.video.currentTime = $scope.elems.video.duration;

					}
				}

				function playButtonHandler (){
					$scope.$apply(function() {
						if (!$scope.elems.video.paused){
							$scope.elems.video.pause();
						} else {
							$scope.elems.video.play();
						}

						$scope.isPlaying = !$scope.elems.video.paused;
					});
					
				}
			}
		};
	}		
})();