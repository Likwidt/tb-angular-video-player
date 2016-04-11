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
				var transitionEnd = tbVideoPlayerCtrl.whichTransitionEvent();

				DOM.slideContainer = $element[0];
				DOM.master = $scope.master;
				DOM.video = $scope.video;
				DOM.slideImage = DOM.slideContainer.querySelector('img');
				DOM.slideClone = DOM.master.querySelector('.video-slide-clone');


				$scope.STATES.thumbExpanded = false;
				$scope.STATES.currentSlideImgSrc = "img/slides/lg/Slide004.jpg";

				function swapScalesImageWithFullSize(e) {
					var rect = e.target.getBoundingClientRect();


					if ($scope.STATES.thumbExpanded) {
					
						DOM.slideClone.style.top = rect.top - DOM.master.offsetTop + 'px';
						DOM.slideClone.style.left = rect.left - DOM.master.offsetLeft + 'px'; 
						DOM.slideClone.style.width = rect.width + 'px'; 
						DOM.slideClone.style.height = rect.height + 'px'; 
						DOM.slideClone.classList.add('visible');
					}
				}

				function calculateScale() {
					var videoRect = DOM.video.getBoundingClientRect();
					var slideRect = DOM.slideImage.getBoundingClientRect();
					var scaleX = videoRect.width / slideRect.width;
					var scaleY = videoRect.height / slideRect.height;
					var axis = scaleX <= scaleY ? 'x' : 'y';

					return { magnitude: Math.min(scaleX, scaleY), axis: axis };
				}

				function expandSlide(e) {
					var scale = calculateScale();
					var xTransform = -1*((DOM.slideContainer.offsetLeft - (DOM.video.getBoundingClientRect().width - DOM.slideContainer.getBoundingClientRect().width*scale.magnitude)/2)) + 'px';
					var yTransform = -1*DOM.slideContainer.offsetTop + 'px';

					e.preventDefault();		

					DOM.slideContainer.style.transform = 'translate(' + xTransform + ', ' + yTransform + ') scale(' + scale.magnitude + ')';

					$scope.STATES.thumbExpanded = true;
				}

				function removeExpandSlide(e) {
					e.preventDefault();

					DOM.slideContainer.style.transform = null;

					DOM.slideClone.classList.remove('visible');

					$scope.STATES.thumbExpanded = false;
				}

				function toggleSlide(e){
					e.preventDefault();

					if (!$scope.STATES.thumbExpanded) {
						expandSlide();
					} else {
						removeExpandSlide();
					}
					
					
				}

				function initSlide() {
					DOM.slideContainer.addEventListener('mousedown', expandSlide, false);
					DOM.slideContainer.addEventListener('touchstart', expandSlide, false);
					DOM.slideClone.addEventListener('mousedown', removeExpandSlide, false);
					DOM.slideClone.addEventListener('touchstart', removeExpandSlide, false);
					DOM.slideContainer.addEventListener(transitionEnd, swapScalesImageWithFullSize, false);
					window.addEventListener('resize', removeExpandSlide, false);
				}


				//console.log(transitionEnd);
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