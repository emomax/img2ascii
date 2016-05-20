function Img2ascii() {
	/**
	 * Invokes the Img2ascii converter
	 *
	 * @param imageString Name of the image file to be converted
	 */
	this.invoke = function( imageString ) {
		var draw = drawImage;
		var imageObj = new Image();

		imageObj.onload = function() {
			draw(this);
		};

		imageObj.src = imageString;
	}

	/**
	 * Outputs the given image object as a sequence
	 * of ASCII characters.
	 *
	 * @param imageObj The image object to convert
	 */
	function drawImage( imageObj ) {
		// Select which of the ASCII ramps to use
		var ramp = useShortRamp ? shortRamp : longRamp;

		// Set up canvas
		var canvas = document.getElementById('myCanvas');
		var imageWidth = imageObj.width;
		var imageHeight = imageObj.height;
		var context = canvas.getContext('2d');

		canvas.width = imageWidth;
		canvas.height = imageHeight;

		// Positioning
		var imageX = 0;
		var imageY = 0;

		// This is used is the max number of characters, or 
		// "ascii pixels", depending on the width-height relation 
		// of the image.
		var columnRowMax = 60.0;

		// Set whether the max number of ASCII pixels should be 
		// the width or the height of them image (judged from
		// a portrait or a landscape image)
		var scaleByWidth = imageWidth > imageHeight;
		var factor = scaleByWidth ? imageWidth / columnRowMax : imageHeight / columnRowMax;

		// Trace the image onto the canvas
		context.drawImage(imageObj, imageX, imageY);

		// Collect image data
		var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
		var data = imageData.data;

		// iterate over all pixels based on x and y coordinates
		var map = [];
		var map2d = [];
		var avg = 0;

		var min = 255, max = 0;
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

				if (max < avg) max = avg;
				if (min > avg) min = avg;
			}
			map2d.push(row);
		}

		var row = "";
		var index = 0;

		var pre = document.createElement('pre');

		for (var y = 0; y < (imageHeight / factor); y++ ) {

			for (var x = 0; x < parseInt(imageWidth / factor); x++ ) {
				index = parseInt(x * factor + parseInt(y * imageWidth));

				var value = map2d[parseInt(y * factor)][parseInt(x * factor)] * ramp.length;
				row += ramp[parseInt(value)].toString();
			}

			var p = document.createElement('p');
			p.textContent = row;
			p.style.margin = 0;
			p.style.padding = 0;
			pre.appendChild(p);
			nextIndex = 0;
			row = '';
		}

		document.getElementById('content').appendChild(pre);
	}

	/**
	 *
	 * @param setUsage Optional param to set the use of shortramp
	 */
	this.setShortRamp = function( setUsage ) {
		if (typeof setUsage === 'undefined') {
			useShortRamp = true;
			return;
		}

		if (typeof setUsage !== 'boolean') {
			throw "Param in function setShortRamp not of type boolean.";
		}

		useShortRamp = setUsage;
	}

	/**
	 * Private members
	 */
	var shortRamp = "@%#*+=-:. ";
	var longRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"\^`'. ";

	var useShortRamp = true;
}
