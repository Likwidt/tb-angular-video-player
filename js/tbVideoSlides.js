(function() {
	"use strict";

	angular .module('tb-video-player')
			.directive('tbVideoSlide', [tbVideoSlide]);

	function tbVideoSlide() {
		return {
			restrict: 'E',
			replace: true,
			require: '^tbVideoPlayer',
			template: '<div class="video-slide-thumb tb-slide-position" ng-class="{\'expanded\' : STATES.thumbExpanded}"><img src="img/slides/sm/Slide004.jpg" /></div>',
			link: function($scope, $element, $attrs, tbVideoPlayerCtrl) {
				var DOM = {}; 
				//var transitionEnd = tbVideoPlayerCtrl.whichTransitionEvent();

				DOM.slideContainer = $element[0];
				DOM.video = $scope.video;
				DOM.slideImage = DOM.slideContainer.querySelector('img');

				$scope.STATES.slideImageSrc = null;
				$scope.STATES.thumbExpanded = false;

				function calculateTransforms() {
					var videoBounds = DOM.video.getBoundingClientRect();
					var slideBounds = DOM.slideContainer.getBoundingClientRect();
					var widthRatio = videoBounds.width/slideBounds.width;
					var heightRatio = videoBounds.height/slideBounds.height;
					var scaleRatio = Math.min(widthRatio, heightRatio);
					var transformPercentage = scaleRatio/2 * 100;

					return ['translate(-', transformPercentage, '%, -', transformPercentage, '%) scale(', scaleRatio, ')'].join('');
				}

				function swapScalesImageWithFullSize() {
					
				}


				function toggleClone(e){
					e.preventDefault();
					var transform = !$scope.STATES.thumbExpanded ? calculateTransforms() : null;

					$scope.$apply(function() {
						$scope.STATES.thumbExpanded = !$scope.STATES.thumbExpanded;

						DOM.slideContainer.style.transform = transform;
						DOM.slideContainer.style.msTransform  = transform;
						DOM.slideContainer.style.WebkitTransform  = transform;
					});
				}

				function initSlide() {
					DOM.slideContainer.addEventListener('mousedown', toggleClone, false);
					DOM.slideContainer.addEventListener('touchstart', toggleClone, false);
				}


				//console.log(transitionEnd);
				$scope.video.addEventListener('canplay', initSlide, false);
				//DOM.slideContainer.addEventListener(transitionEnd, swapScalesImageWithFullSize, false);



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
}());