# tb-angular-video-player
angular HTML5 video player directive with custom controls and features

Current features include:
- Video controls
- Slideshow capable of zooming to a maximum of the video's height or width
- Optional callback fior the end of video

### From the /dist directory you must include:
- tbVideoPlayer.min.js
- tbVideoPlayer.min.css

Then include the 'tb-video-player' module as a dependency to your angular application:

> angular.module('yourApp', [tb-video-player]);

You can now use the `<tb-video-player></tb-video-player>` tag to insert the player into your page.

### To use controls:

Add the 'controls' atribute to the directive.

> <tb-video-player controls></tb-video-player>

### To use the Slideshow:

Use an object as a value for the slides attribute.

> <tb-video-player slides="mySlideObj"></tb-video-player>

In order to be valid your slide object must be an array of objects containing the following properties:

- timeIndex: indicates the current time in seconds from the video when the slide must appear
- slideUrl: indicates the URL of the slide

```	// example
  mySlideObj = [
			{ timeIndex: 5.3, slideUrl: '< imageUrl >' },
			{ timeIndex: 15, slideUrl: '< imageUrl >' },
			{ timeIndex: 30.4, slideUrl: '< imageUrl >' },
			{ timeIndex: 9999, slideUrl: '' }
		];```

### To use optional Video End callback:

Add the 'video-end' atribute to the directive.

> <tb-video-player video-end="myCallback()"></tb-video-player>

### Example

A live example of this directive can be found here: [http://www.thierryblais.com/#/videoplayer](http://www.thierryblais.com/#/videoplayer).

