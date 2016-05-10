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
				var slideVars;

				DOM.slideContainer = $element[0];
				DOM.master = $scope.master;
				DOM.video = $scope.video;

				function calculateSlideVars() {
					slideVars = {
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
					slideVars.needsResize = true;
					if (!thumbExpanded) { 
						calculateSlideVars(); 
					}
					removeExpandSlide(e);
				}

				function swapScalesImageWithFullSize() {
					if (thumbExpanded) {	
						slideVars.canBeReset = false;

						if (slideVars.fullSizeSlide === null) {
							slideVars.fullSizeSlide = DOM.slideContainer.getBoundingClientRect();
						}

						DOM.slideClone.style.top = slideVars.fullSizeSlide.top - DOM.master.offsetTop + 'px';
						DOM.slideClone.style.left = slideVars.fullSizeSlide.left - DOM.master.offsetLeft + 'px'; 
						DOM.slideClone.style.width = slideVars.fullSizeSlide.width + 'px'; 
						DOM.slideClone.style.height = slideVars.fullSizeSlide.height + 'px'; 
						DOM.master.classList.add('slide-clone-visible');
					} else if (!!slideVars.pictureChanged || !!slideVars.needsResize) {
						slideVars.canBeReset = true;
						calculateSlideVars();
					}
				}

				function calculateScale() {
					slideVars.slideDimensions.bounds = DOM.slideContainer.getBoundingClientRect();
					var scaleX = slideVars.videoDimensions.bounds.width / slideVars.slideDimensions.bounds.width;
					var scaleY = slideVars.videoDimensions.bounds.height / slideVars.slideDimensions.bounds.height;

					return Math.min(scaleX, scaleY);
				}

				function changeSlideUrl(fileLocation) {

					// only change slide if slide needs changing
					if ($scope.STATES.currentSlideImgSrc !== fileLocation){
						$scope.$apply(function () {
							$scope.STATES.currentSlideImgSrc = fileLocation;
							slideVars.pictureChanged = true;
							if (slideVars.canBeReset = false) {
								resizeAlreadyExpandedClone();
							}
						});			
					}					
				}

				function expandSlide(e) {
					slideVars.scale = calculateScale();
					var xTransform = -1*((slideVars.slideDimensions.offsetLeft - (slideVars.videoDimensions.bounds.width - slideVars.slideDimensions.bounds.width*slideVars.scale)/2)) + 'px';
					var yTransform = -1*slideVars.slideDimensions.offsetTop + 'px';

					e.preventDefault();		

					DOM.slideContainer.style[browserTransform] = 'translate(' + xTransform + ', ' + yTransform + ') scale(' + slideVars.scale + ')';

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
					var checkIndex = numberOfSlides;

					// need to recheck sizes if picture changed
					if (slideVars.pictureChanged === true && slideVars.canBeReset === true ) {
						calculateSlideVars();
					}

					while (checkIndex--){
						if (ct >= $scope.slides[checkIndex].timeIndex) {
							
							// found our index
							changeSlideUrl($scope.slides[checkIndex].slideUrl);
							return;		
						}		
					}
				}

				function resizeAlreadyExpandedClone() {
					slideVars.fullSizeSlide === null;
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