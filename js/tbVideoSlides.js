(function() {
	"use strict";

	angular .module('tb-video-player')
			.directive('tbVideoSlide', [tbVideoSlide]);

	function tbVideoSlide() {
		return {
			restrict: 'E',
			replace: true,
			require: '^tbVideoPlayer',
			templateUrl: 'views/videoSlides.html',
			link: function($scope, $element, $attrs, tbVideoPlayerCtrl) {
				var DOM = {}; 
				var transitionEndEvent = tbVideoPlayerCtrl.whichTransitionEvent();
				var browserTransform = tbVideoPlayerCtrl.browserTransform();
				var thumbExpanded = false;
				var numberOfSlides = $scope.slides.length; 
				var scaleVars;

				DOM.slideContainer = $element[0];
				DOM.master = $scope.master;
				DOM.video = $scope.video;
				DOM.slideImage = DOM.slideContainer.querySelector('img');
				DOM.slideClone = DOM.master.querySelector('.video-slide-clone');

				function calculateScaleVars() {
					scaleVars = {
						videoDimensions: { 
							bounds: DOM.video.getBoundingClientRect() 
						},
						slideDimensions: { 
							bounds: DOM.slideContainer.getBoundingClientRect(),
							offsetLeft: DOM.slideContainer.offsetLeft,
							offsetTop: DOM.slideContainer.offsetTop
						},
						fullSizeSlide: null,
						scale: null,
						pictureChanged: false,
						needsResize: false
					};
				}

				function slideResizeHandler(e) {
					scaleVars.needsResize = true;
					if (!thumbExpanded) { 
						calculateScaleVars(); 
					}
					removeExpandSlide(e);
				}

				function swapScalesImageWithFullSize() {
					if (thumbExpanded) {	
						if (scaleVars.fullSizeSlide === null) {
							scaleVars.fullSizeSlide = DOM.slideContainer.getBoundingClientRect()
						}

						DOM.slideClone.style.top = scaleVars.fullSizeSlide.top - DOM.master.offsetTop + 'px';
						DOM.slideClone.style.left = scaleVars.fullSizeSlide.left - DOM.master.offsetLeft + 'px'; 
						DOM.slideClone.style.width = scaleVars.fullSizeSlide.width + 'px'; 
						DOM.slideClone.style.height = scaleVars.fullSizeSlide.height + 'px'; 
						DOM.slideClone.classList.add('visible');
					} else if (scaleVars.needsResize === true) {
						calculateScaleVars();
					}
				}

				function calculateScale() {
					var scaleX = scaleVars.videoDimensions.bounds.width / scaleVars.slideDimensions.bounds.width;
					var scaleY = scaleVars.videoDimensions.bounds.height / scaleVars.slideDimensions.bounds.height;

					return Math.min(scaleX, scaleY);
				}

				function expandSlide(e) {
					if (scaleVars.scale === null) {
						scaleVars.scale = calculateScale();
					}

					var xTransform = -1*((scaleVars.slideDimensions.offsetLeft - (scaleVars.videoDimensions.bounds.width - scaleVars.slideDimensions.bounds.width*scaleVars.scale)/2)) + 'px';
					var yTransform = -1*scaleVars.slideDimensions.offsetTop + 'px';

					e.preventDefault();		

					DOM.slideContainer.style[browserTransform] = 'translate(' + xTransform + ', ' + yTransform + ') scale(' + scaleVars.scale + ')';

					thumbExpanded = true;
				}

				function removeExpandSlide(e) {
					e.preventDefault();

					DOM.slideContainer.style[browserTransform] = null;
					DOM.slideClone.classList.remove('visible');

					thumbExpanded = false;
				}

				function checkIfSlidesHaveGoodStructure() {
					var i;

					for (i in $scope.slides) {
						if (!$scope.slides[i].hasOwnProperty('timeIndex')) {
							console.error('Slides are missing property: "timeIndex"');
							$scope.STATES.hasSlides = false;
							return;
						} else if (!$scope.slides[i].hasOwnProperty('slideUrl')) {
							console.error('Slides are missing property: "slideUrl"');
							$scope.STATES.hasSlides = false;
							return;
						}
					} 
				}

				function slideShow() {
					var ct = Math.ceil(DOM.video.currentTime);
					var checkIndex = numberOfSlides-1;
					var fileLocation;

					// need to recheck sizes if picture changed
					if (scaleVars.pictureChanged === true && thumbExpanded === false) {
						calculateScaleVars();
					}

					while (checkIndex--){
						if (ct >= $scope.slides[checkIndex].timeIndex && ct < $scope.slides[checkIndex+1].timeIndex ) {
							// found our index

							fileLocation = $scope.slides[checkIndex].slideUrl;

							// only change slide if slide needs changing
							if ($scope.STATES.currentSlideImgSrc !== fileLocation){
								$scope.$apply(function() {
									$scope.STATES.currentSlideImgSrc = fileLocation;
									scaleVars.pictureChanged = true;
								});			
							}

							return;		
						}		
					}
				}

				function initSlide() {
					calculateScaleVars();
					checkIfSlidesHaveGoodStructure();

					DOM.video.addEventListener('timeupdate', slideShow, false);
					DOM.slideContainer.addEventListener('mousedown', expandSlide, false);
					DOM.slideContainer.addEventListener('touchstart', expandSlide, false);
					DOM.slideClone.addEventListener('mousedown', removeExpandSlide, false);
					DOM.slideClone.addEventListener('touchstart', removeExpandSlide, false);
					DOM.slideContainer.addEventListener(transitionEndEvent, swapScalesImageWithFullSize, false);
					window.addEventListener('resize', slideResizeHandler, false);
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
}());