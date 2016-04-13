(function() {
	"use strict";

	angular .module('tb-video-player')
			.directive('tbVideoSlide', [tbVideoSlide]);

	function tbVideoSlide() {
		return {
			restrict: 'E',
			replace: true,
			require: '^tbVideoPlayer',
			templateUrl: 'js/directives/templates/videoSlides.html',
			link: function($scope, $element, $attrs, TbVideoPlayerCtrl) {
				var DOM = {}; 
				var transitionEndEvent = TbVideoPlayerCtrl.whichTransitionEvent();
				var browserTransform = TbVideoPlayerCtrl.browserTransform();
				var thumbExpanded = false;
				var numberOfSlides = $scope.slides.length; 
				var scaleVars;

				DOM.slideContainer = $element[0];
				DOM.master = $scope.master;
				DOM.video = $scope.video;

				function calculateSlideVars() {
					console.log('resetting slidevars');
					scaleVars = {
						videoDimensions: { 
							bounds: DOM.video.getBoundingClientRect() 
						},
						slideDimensions: { 
							bounds: null,
							offsetLeft: DOM.slideContainer.offsetLeft,
							offsetTop: DOM.slideContainer.offsetTop
						},
						fullSizeSlide: null,
						pictureChanged: false,
						needsResize: false,
						canBeReset: true
					};
				}

				function slideResizeHandler(e) {
					scaleVars.needsResize = true;
					if (!thumbExpanded) { 
						calculateSlideVars(); 
					}
					removeExpandSlide(e);
				}

				function swapScalesImageWithFullSize() {
					if (thumbExpanded) {	
						scaleVars.canBeReset = false;

						if (scaleVars.fullSizeSlide === null) {
							scaleVars.fullSizeSlide = DOM.slideContainer.getBoundingClientRect();
						}

						DOM.slideClone.style.top = scaleVars.fullSizeSlide.top - DOM.master.offsetTop + 'px';
						DOM.slideClone.style.left = scaleVars.fullSizeSlide.left - DOM.master.offsetLeft + 'px'; 
						DOM.slideClone.style.width = scaleVars.fullSizeSlide.width + 'px'; 
						DOM.slideClone.style.height = scaleVars.fullSizeSlide.height + 'px'; 
						DOM.master.classList.add('slide-clone-visible');
					} else if (!!scaleVars.pictureChanged || !!scaleVars.needsResize) {
						scaleVars.canBeReset = true;
						calculateSlideVars();
					}
				}

				function calculateScale() {
					scaleVars.slideDimensions.bounds = DOM.slideContainer.getBoundingClientRect();
					var scaleX = scaleVars.videoDimensions.bounds.width / scaleVars.slideDimensions.bounds.width;
					var scaleY = scaleVars.videoDimensions.bounds.height / scaleVars.slideDimensions.bounds.height;

					return Math.min(scaleX, scaleY);
				}

				function expandSlide(e) {
					scaleVars.scale = calculateScale();
					var xTransform = -1*((scaleVars.slideDimensions.offsetLeft - (scaleVars.videoDimensions.bounds.width - scaleVars.slideDimensions.bounds.width*scaleVars.scale)/2)) + 'px';
					var yTransform = -1*scaleVars.slideDimensions.offsetTop + 'px';

					e.preventDefault();		

					DOM.slideContainer.style[browserTransform] = 'translate(' + xTransform + ', ' + yTransform + ') scale(' + scaleVars.scale + ')';

					thumbExpanded = true;
				}

				function removeExpandSlide(e) {
					e.preventDefault();

					
					DOM.slideContainer.style[browserTransform] = null;
					DOM.master.classList.remove('slide-clone-visible');

					thumbExpanded = false;
				}

				function slideShow() {
					var ct = Math.ceil(DOM.video.currentTime);
					var checkIndex = numberOfSlides-1;
					var fileLocation;

					function changeSlideUrl() {
						$scope.STATES.currentSlideImgSrc = fileLocation;
						scaleVars.pictureChanged = true;
						if (scaleVars.canBeReset = false) {
							resizeAlreadyExpandedClone();
						}
						
					}

					// need to recheck sizes if picture changed
					if (scaleVars.pictureChanged === true && scaleVars.canBeReset === true ) {
						calculateSlideVars();
					}

					while (checkIndex--){
						if (ct >= $scope.slides[checkIndex].timeIndex && ct < $scope.slides[checkIndex+1].timeIndex ) {
							// found our index

							fileLocation = $scope.slides[checkIndex].slideUrl;

							// only change slide if slide needs changing
							if ($scope.STATES.currentSlideImgSrc !== fileLocation){
								$scope.$apply(changeSlideUrl);			
							}

							return;		
						}		
					}
				}

				function resizeAlreadyExpandedClone() {
					scaleVars.fullSizeSlide === null;
					swapScalesImageWithFullSize();
				}
				
				function initSlide() {
					calculateSlideVars();
					DOM.slideImage = DOM.slideContainer.querySelector('img');
					DOM.slideClone = DOM.master.querySelector('.video-slide-clone');

					DOM.video.addEventListener('timeupdate', slideShow, false);
					DOM.slideContainer.addEventListener('mousedown', expandSlide, false);
					DOM.slideContainer.addEventListener('touchstart', expandSlide, false);
					DOM.slideClone.addEventListener('mousedown', removeExpandSlide, false);
					DOM.slideClone.addEventListener('touchstart', removeExpandSlide, false);
					DOM.slideContainer.addEventListener(transitionEndEvent, swapScalesImageWithFullSize, false);
					window.addEventListener('resize', slideResizeHandler, false);
				}

				DOM.video.addEventListener('canplay', initSlide, false);
			}
		};
	}
}());