(function(module) {
try {
  module = angular.module('tb-video-player.templates');
} catch (e) {
  module = angular.module('tb-video-player.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/directives/templates/videoControls.html',
    '<div class="video-controls"><div class="controls"><div class="tb-vid_btn back30"></div><div class="tb-vid_btn playPause" ng-class="{ \'play\': !!STATES.isPlaying, \'pause\': !STATES.isPlaying }"></div><div class="tb-vid_btn fw30"></div><div class="progressIndicator"><div class="timeIn">{{ STATES.timeIn }}</div><div class="slider"><div class="node"></div></div><div class="timeLeft">{{ STATES.timeLeft }}</div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('tb-video-player.templates');
} catch (e) {
  module = angular.module('tb-video-player.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/directives/templates/videoPlayer.html',
    '<div class="tb-video_container" ng-cloak=""><tb-video-slide ng-if="STATES.hasSlides"></tb-video-slide><tb-video-controls ng-if="STATES.hasControls"></tb-video-controls><video autoplay=""><source ng-src="{{ src | trustUrl }}" type="video/mp4"></video><img class="video-slide-clone" ng-src="{{ STATES.currentSlideImgSrc }}" ng-if="STATES.hasSlides"></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('tb-video-player.templates');
} catch (e) {
  module = angular.module('tb-video-player.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/directives/templates/videoSlides.html',
    '<div class="video-slide-thumb tb-slide-position"><img ng-src="{{ STATES.currentSlideImgSrc }}"></div>');
}]);
})();
