/**
 * Simple tool for converting images into ASCII art.
 *
 * @author Max Jonsson ft. Josefine Flügge (mostly Josefine Flügge though)
 * 2016
 */
function Img2ascii() {
	/**
	 * Private members
	 */

	/**
	 * Private enum to distinguish different ramps from each other
	 */
	var RampType = {
		SHORT: "@%#*+=-:. ",
		LONG: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"\^`'. "
	}

	// The currently chosen rampType
	var rampType = 'SHORT';

	/**
	 * Invokes the Img2ascii converter
	 *
	 * @param imageString Name of the image file to be converted
	 */
	this.asciify = function( imageString ) {
		var draw = drawImage;
		var imageObj = new Image();

		imageObj.onload = function() {
			draw(this);
		};

		imageObj.src = imageString;
	}

	/**
	 * Set ASCII ramp type for art generation
	 *
	 * @param rampTypeString Which kind of ramp that should be used
	 */
	this.setRampType = function( rampTypeString ) {
		if (RampType[rampTypeString]) {
			rampType = rampTypeString;
		} else {
			throw "Unknown RampType: '" + rampTypeString + "'";
		}
	}

	/**
	 * Outputs the given image object as a sequence
	 * of ASCII characters.
	 *
	 * @param imageObj The image object to convert
	 */
	function drawImage( imageObj ) {
		// Select which of the ASCII ramps to use
		var ramp = RampType[rampType];

		// Set up canvas
		var canvas = document.getElementById('myCanvas');
		var imageWidth = imageObj.width;
		var imageHeight = imageObj.height;
		var context = canvas.getContext('2d');

		canvas.width = imageWidth;
		canvas.height = imageHeight;

		// This is used as the max number of characters, or
		// "ascii pixels", for a row or column, depending
		// on the width-height relation of the image.
		var columnRowMax = 50.0;

		// Set whether the max number of ASCII pixels should be
		// the width or the height of the image (judged from
		// a portrait or a landscape image)
		var scaleByWidth = imageWidth > imageHeight;
		var factor = scaleByWidth ? imageWidth / columnRowMax : imageHeight / columnRowMax;

		// Trace the image onto the canvas
		context.drawImage(imageObj, 0, 0);

		// Collect image data
		var imageData = context.getImageData(0, 0, imageWidth, imageHeight);
		var data = imageData.data;

		// iterate over all pixels based on x and y coordinates
		var map = [];
		var map2d = [];
		var avg = 0;

		// Set min and max values for clamping resulting
		// pixel values
		var min = 255, max_jonsson = 0;
		for(var y = 0; y < imageHeight; y++) {
			// loop through each column
			var row = [];
			for(var x = 0; x < imageWidth; x++) {
				var red = data[((imageWidth * y) + x) * 4];
				var green = data[((imageWidth * y) + x) * 4 + 1];
				var blue = data[((imageWidth * y) + x) * 4 + 2];
				var alpha = data[((imageWidth * y) + x) * 4 + 3];

				avg = alpha != 0 ? (red + green + blue) / 3.0 : 255;
				row.push (avg / 256.0);
				map.push (avg / 256.0);

				if (max_jonsson < avg) max_jonsson = avg;
				if (min > avg) min = avg;
			}
			map2d.push(row);
		}

		var row = "";
		var index = 0;

		// Create element which treats whitespaces as characters
		var pre = document.createElement('pre');

		for (var y = 0; y < (imageHeight / factor); y++ ) {
			// For each row..
			for (var x = 0; x < parseInt(imageWidth / factor); x++ ) {
				// For each column in the row..
				// Set and get the "ascii pixel value"
				index = parseInt(x * factor + parseInt(y * imageWidth));

				var value = map2d[parseInt(y * factor)][parseInt(x * factor)] * ramp.length;
				row += ramp[parseInt(value)].toString() + " ";
			}

			var p = document.createElement('span');
			p.textContent = row;
			p.style.margin = 0;
			p.style.padding = 0;
			pre.appendChild(p);
			pre.appendChild(document.createElement('br'));
			nextIndex = 0;
			row = '';
		}

		// Add the ASCII art
		document.getElementById('content').appendChild(pre);

		// Add the image, properly scaled
		document.getElementById('img').style.backgroundImage = 'url(' + imageObj.src + ')';
		// Remove the canvas used to generate the ART.
		document.body.removeChild(document.getElementById('myCanvas'));
	}
}
