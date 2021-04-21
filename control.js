var $SVG_LIB = "http://www.w3.org/2000/svg";
var $INIT_SIZE = 20;
var $INIT_X = 10;
var $INIT_Y = 40;
var $LEVEL = '1';
var $DATA = '0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0;0,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0;0,1,0,1,0,1,1,1,0,0,1,1,1,1,0,0;0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0;0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0;1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0;1,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0;1,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0;1,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0;0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0;0,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0;0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0;0,1,1,1,1,0,1,1,1,1,1,1,0,1,0,0;0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0;0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0;0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0;0,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0;0,0,0,1,1,1,0,0,0,0,0,0,1,0,0,1;0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1;0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1;0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0;0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0;0,0,1,1,0,0,1,1,1,1,1,1,0,1,1,0;0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0;0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0;0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0;1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1;1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,'

var draw_points = [];
var vertical_numbers = [];
var horizontal_numbers = [];

var squareI;
var squareJ;
var colorSquare;
var opacitySquare;

var clicked = false;
var totalValidated = false;

var size;

var specialCount;
var isAnimating = false;
var animation;
var columnCount;
var lineCount;
var columnCountAux;
var lineCountAux;

function clean() {
	draw_points = [];
	vertical_numbers = [];
	horizontal_numbers = [];
	var area = document.getElementById("area");
	while (area.firstChild) {
		area.removeChild(area.firstChild);
	}
}

function initialize() {
	clean();
	data = $DATA;
	lines = data.split(";");
	points = lines[0].split(",");
	clean();
	for (k = 0; k < lines.length; k++)
		draw_points[k] = new Array(points.length - 1);
	for (i = 0; i < lines.length; i++) {
		line_aux = lines[i].split(",");
		for (j = 0; j < line_aux.length - 1; j++)
			draw_points[i][j] = line_aux[j];
	}
	getNumbers();
	totalValidated = false;
	specialCount = 4;
	label_special = document.getElementById("label_special");
	label_special.textContent = specialCount;
	size = $INIT_SIZE;
	var pos_x = $INIT_X + horizontal_numbers[0].length * size;
	var pos_y = $INIT_Y + vertical_numbers[0].length * size;
	for (i = 0; i <= vertical_numbers.length; i++) {
		if (i < vertical_numbers.length) {
			createRectangle(pos_x, pos_y, 0, i);
			createRectangleAux(pos_x, pos_y, 0, i);
		}
		if (i < vertical_numbers.length) {
			for (j = 1; j <= vertical_numbers[0].length; j++) {
				if (vertical_numbers[i][j - 1] != " ") {
					createSquareNumber(pos_x, pos_y, 0, i, j);
					createNumber(pos_x, pos_y, 0, i, j);
				}
			}
		}
		createLine(pos_x, pos_y, 0, i);
	}
	for (i = 0; i <= horizontal_numbers.length; i++) {
		if (i < horizontal_numbers.length) {
			createRectangle(pos_x, pos_y, 1, i);
			createRectangleAux(pos_x, pos_y, 1, i);
		}
		if (i < horizontal_numbers.length) {
			for (j = 1; j <= horizontal_numbers[0].length; j++) {
				if (horizontal_numbers[i][j - 1] != " ") {
					createSquareNumber(pos_x, pos_y, 1, i, j);
					createNumber(pos_x, pos_y, 1, i, j);
				}
			}
		}
		createLine(pos_x, pos_y, 1, i);
	}
	for (i = 0; i < vertical_numbers.length; i++) {
		for (j = 0; j < horizontal_numbers.length; j++) {
			createSquare(pos_x, pos_y, i, j);
		}
	}
	autoFill();
	validate();
}

function getNumbers() {
	var horizontalNumbers = getHorizontalNumbers();
	var verticalNumbers = getVerticalNumbers();
	for (k = 0; k < draw_points.length; k++)
		horizontal_numbers[k] = new Array(horizontalNumbers);
	for (k = 0; k < draw_points[0].length; k++)
		vertical_numbers[k] = new Array(verticalNumbers);
	var count, numbers;
	for (i = 0; i < draw_points.length; i++) {
		count = 0;
		numbers = 0;
		for (j = draw_points[0].length - 1; j >= 0; j--) {
			if (draw_points[i][j] == 1)
				count++;
			else if (count > 0) {
				horizontal_numbers[i][numbers] = count.toString();
				count = 0;
				numbers++;
			}
		}
		if (count > 0) {
			horizontal_numbers[i][numbers] = count.toString();
			numbers++;
		}
		while (numbers < horizontalNumbers) {
			horizontal_numbers[i][numbers] = " ";
			numbers++;
		}
	}
	for (i = 0; i < draw_points[0].length; i++) {
		count = 0;
		numbers = 0;
		for (j = draw_points.length - 1; j >= 0; j--) {
			if (draw_points[j][i] == 1)
				count++;
			else if (count > 0) {
				vertical_numbers[i][numbers] = count.toString();
				count = 0;
				numbers++;
			}
		}
		if (count > 0) {
			vertical_numbers[i][numbers] = count.toString();
			numbers++;
		}
		while (numbers < verticalNumbers) {
			vertical_numbers[i][numbers] = " ";
			numbers++;
		}
	}
}

function getHorizontalNumbers() {
	var bigger = 0;
	var count, numbers;
	for (i = 0; i < draw_points.length; i++) {
		count = 0;
		numbers = 0;
		for (j = draw_points[0].length - 1; j >= 0; j--) {
			if (draw_points[i][j] == 1)
				count++;
			else if (count > 0) {
				count = 0;
				numbers++;
			}
		}
		if (count > 0)
			numbers++;
		if (numbers > bigger)
			bigger = numbers;
	}
	return bigger;
}

function getVerticalNumbers() {
	var bigger = 0;
	var count, numbers;
	for (i = 0; i < draw_points[0].length; i++) {
		count = 0;
		numbers = 0;
		for (j = draw_points.length - 1; j >= 0; j--) {
			if (draw_points[j][i] == 1)
				count++;
			else if (count > 0) {
				count = 0;
				numbers++;
			}
		}
		if (count > 0)
			numbers++;
		if (numbers > bigger)
			bigger = numbers;
	}
	return bigger;
}

function createRectangle(pos_x, pos_y, orientation, i) {
	var rectangle = document.createElementNS($SVG_LIB, "rect");
	rectangle.setAttribute("id", "rectangle_" + orientation + "." + i);
	rectangle.setAttribute("fill", "white");
	rectangle.setAttribute("stroke-width", "0");
	if (orientation == 0) {
		rectangle.setAttribute("height", vertical_numbers[0].length * size);
		rectangle.setAttribute("width", size);
		rectangle.setAttribute("x", pos_x + i * size);
		rectangle.setAttribute("y", pos_y - vertical_numbers[0].length * size);
	} else {
		rectangle.setAttribute("height", size);
		rectangle.setAttribute("width", horizontal_numbers[0].length * size);
		rectangle.setAttribute("x", pos_x - horizontal_numbers[0].length * size);
		rectangle.setAttribute("y", pos_y + i * size);
	}
	document.getElementById("area").appendChild(rectangle);
}

function createRectangleAux(pos_x, pos_y, orientation, i) {
	var rectangleAux = document.createElementNS($SVG_LIB, "rect");
	rectangleAux.setAttribute("id", "rectangle_aux_" + orientation + "." + i);
	rectangleAux.setAttribute("fill", "yellow");
	rectangleAux.setAttribute("opacity", "0");
	if (orientation == 0) {
		rectangleAux.setAttribute("height", draw_points.length * size);
		rectangleAux.setAttribute("width", size);
		rectangleAux.setAttribute("x", pos_x + i * size);
		rectangleAux.setAttribute("y", pos_y);
	} else {
		rectangleAux.setAttribute("height", size);
		rectangleAux.setAttribute("width", draw_points[0].length * size);
		rectangleAux.setAttribute("x", pos_x);
		rectangleAux.setAttribute("y", pos_y + i * size);
	}
	document.getElementById("area").appendChild(rectangleAux);
}

function createLine(pos_x, pos_y, orientation, i) {
	var line = document.createElementNS($SVG_LIB, "line");
	line.setAttribute("id", "line_" + orientation + "." + i);
	line.setAttribute("stroke", "gray");
	if ((i % 5) == 0)
		line.setAttribute("stroke-width", "2");
	else
		line.setAttribute("stroke-width", "1");
	if (orientation == 0) {
		line.setAttribute("x1", pos_x + i * size);
		line.setAttribute("x2", pos_x + i * size);
		line.setAttribute("y1", pos_y - vertical_numbers[0].length * size);
		line.setAttribute("y2", pos_y + horizontal_numbers.length * size);
	} else {
		line.setAttribute("x1", pos_x - horizontal_numbers[0].length * size);
		line.setAttribute("x2", pos_x + vertical_numbers.length * size);
		line.setAttribute("y1", pos_y + i * size);
		line.setAttribute("y2", pos_y + i * size);
	}
	document.getElementById("area").appendChild(line);
}

function createSquareNumber(pos_x, pos_y, orientation, i, j) {
	var squareNumber = document.createElementNS($SVG_LIB, "rect");
	squareNumber.setAttribute("id", "squareNumber_" + orientation + "." + i + "." + (j - 1));
	squareNumber.setAttribute("fill", "black");
	squareNumber.setAttribute("opacity", "1");
	squareNumber.setAttribute("height", size);
	squareNumber.setAttribute("width", size);
	if (orientation == 0) {
		squareNumber.setAttribute("x", pos_x + i * size);
		squareNumber.setAttribute("y", pos_y - j * size);
	} else {
		squareNumber.setAttribute("x", pos_x - j * size);
		squareNumber.setAttribute("y", pos_y + i * size);
	}
	squareNumber.onclick = markSquareNumber;
	document.getElementById("area").appendChild(squareNumber);
}

function createNumber(pos_x, pos_y, orientation, i, j) {
	var number = document.createElementNS($SVG_LIB, "text");
	number.setAttribute("id", "number_" + orientation + "." + i + "." + (j - 1));
	number.setAttribute("text-anchor", "middle");
	number.setAttribute("font-family", "serif");
	number.setAttribute("font-size", size * 0.9);
	number.setAttribute("font-weight", "");
	number.setAttribute("fill", "white");
	if (orientation == 0) {
		number.setAttribute("x", pos_x + i * size + 0.5 * size);
		number.setAttribute("y", pos_y - j * size + 0.8 * size);
		number.textContent = vertical_numbers[i][j - 1];
	} else {
		number.setAttribute("x", pos_x - j * size + 0.5 * size);
		number.setAttribute("y", pos_y + i * size + 0.8 * size);
		number.textContent = horizontal_numbers[i][j - 1];
	}
	number.onclick = markNumber;
	document.getElementById("area").appendChild(number);
}

function createSquare(pos_x, pos_y, i, j) {
	var square = document.createElementNS($SVG_LIB, "rect");
	square.setAttribute("id", "square_" + i + "." + j);
	square.setAttribute("fill", "white");
	square.setAttribute("opacity", "0");
	square.setAttribute("height", size * 0.95);
	square.setAttribute("width", size * 0.95);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
	square.onmouseover = highlightSquare;
	square.onmouseout = fadeSquare;
	square.onmousedown = initColorsChange;
	square.onmousemove = changeColorSquares;
	square.onmouseup = endColorsChange;
	document.getElementById("area").appendChild(square);
}

function autoFill() {
	totalRanks = draw_points.length + draw_points[0].length;
	var numberRanksToFill;
	switch ($LEVEL) {
		case "0":
			numberRanksToFill = parseInt(totalRanks * 0.5, 10);
			break;
		case "1":
			numberRanksToFill = parseInt(totalRanks * 0.25, 10);
			break;
		case "2":
			numberRanksToFill = parseInt(totalRanks * 0.125, 10);
			break;
		case "3":
			numberRanksToFill = 0;
			break;
	}
	var count = 0;
	var square, rectangle = null;
	var chosenColumns = new Array(draw_points[0].length);
	var chosenLines = new Array(draw_points[0].length);
	while (count < numberRanksToFill) {
		if (Math.random() > 0.5) {
			randColumn = Math.floor((Math.random() * draw_points.length));
			if (contains(chosenColumns, randColumn)) {
				count--;
			}
			else {
				chosenColumns.push(randColumn);
				for (i = 0; i < draw_points[0].length; i++) {
					if (draw_points[randColumn][i] == 1) {
						square = document.getElementById("square_" + i + "." + randColumn);
						square.setAttribute("fill", "black");
						square.setAttribute("opacity", "1");
					}
				}
			}
		}
		else {
			randLine = Math.floor((Math.random() * draw_points[0].length));
			if (contains(chosenLines, randLine)) {
				count--;
			}
			else {
				chosenLines.push(randLine);
				for (i = 0; i < draw_points.length; i++) {
					if (draw_points[i][randLine] == 1) {
						square = document.getElementById("square_" + randLine + "." + i);
						square.setAttribute("fill", "black");
						square.setAttribute("opacity", "1");
					}
				}
			}
		}
		count++;
	}
}

function contains(array, obj) {
	for (i = 0; i < array.length; i++) {
		if (array[i] === obj) {
			return true;
		}
	}
	return false;
}

function highlightSquare(evt) {
	if (!totalValidated && !isAnimating) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "blue");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "2");
		var horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "blue");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "2");
		var verticalRectangle = document.getElementById("rectangle_0." + i);
		if (verticalRectangle.getAttribute("fill") != "green")
			verticalRectangle.setAttribute("fill", "blue");
		var horizontalRectangle = document.getElementById("rectangle_1." + j);
		if (horizontalRectangle.getAttribute("fill") != "green")
			horizontalRectangle.setAttribute("fill", "blue");
		i = i + 1;
		j = j + 1;
		verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "blue");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "2");
		horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "blue");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "2");
	}
}

function fadeSquare(evt) {
	if (!totalValidated && !isAnimating) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "gray");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		var horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "gray");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
		var verticalRectangle = document.getElementById("rectangle_0." + i);
		if (verticalRectangle.getAttribute("fill") != "green")
			verticalRectangle.setAttribute("fill", "white");
		var horizontalRectangle = document.getElementById("rectangle_1." + j);
		if (horizontalRectangle.getAttribute("fill") != "green")
			horizontalRectangle.setAttribute("fill", "white");
		i = i + 1;
		j = j + 1;
		verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "gray");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "gray");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
	}
}

function initColorsChange(evt) {
	if (!totalValidated && !isAnimating) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		squareI = parseInt(idSplited[0]);
		squareJ = parseInt(idSplited[1]);
		colorSquare = evt.target.getAttribute("fill");
		switch (colorSquare) {
			case "white":
				if (evt.button == 0) {
					evt.target.setAttribute("fill", "black");
					colorSquare = "black";
				} else {
					evt.target.setAttribute("fill", "gray");
					colorSquare = "gray";
				}
				evt.target.setAttribute("opacity", "1");
				opacitySquare = "1";
				break;
			case "black":
				if (evt.button == 0) {
					evt.target.setAttribute("fill", "white");
					colorSquare = "white";
					evt.target.setAttribute("opacity", "0");
					opacitySquare = "0";
				} else {
					evt.target.setAttribute("fill", "gray");
					colorSquare = "gray";
					evt.target.setAttribute("opacity", "1");
					opacitySquare = "1";
				}
				break;
			case "gray":
				if (evt.button == 0) {
					evt.target.setAttribute("fill", "black");
					colorSquare = "black";
					evt.target.setAttribute("opacity", "1");
					opacitySquare = "1";
				} else {
					evt.target.setAttribute("fill", "white");
					colorSquare = "white";
					evt.target.setAttribute("opacity", "0");
					opacitySquare = "0";
				}
				break;
		}
		clicked = true;
	}
}

function changeColorSquares(evt) {
	if (!totalValidated && !isAnimating) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		position = document.getElementById("position");
		position.textContent = (i + 1) + ", " + (j + 1);
		if (clicked == true) {
			if ((i >= squareI) && (j == squareJ)) {
				var count = squareI;
				while (count <= i) {
					var square = document.getElementById("square_" + count + "." + squareJ);
					square.setAttribute("fill", colorSquare);
					square.setAttribute("opacity", opacitySquare);
					count++;
				}
			}
			else if ((i <= squareI) && (j == squareJ)) {
				var count = i;
				while (count <= squareI) {
					var square = document.getElementById("square_" + count + "." + squareJ);
					square.setAttribute("fill", colorSquare);
					square.setAttribute("opacity", opacitySquare);
					count++;
				}
			}
			else if ((i == squareI) && (j >= squareJ)) {
				var count = squareJ;
				while (count <= j) {
					var square = document.getElementById("square_" + squareI + "." + count);
					square.setAttribute("fill", colorSquare);
					square.setAttribute("opacity", opacitySquare);
					count++;
				}
			}
			else if ((i == squareI) && (j <= squareJ)) {
				var count = j;
				while (count <= squareJ) {
					var square = document.getElementById("square_" + squareI + "." + count);
					square.setAttribute("fill", colorSquare);
					square.setAttribute("opacity", opacitySquare);
					count++;
				}
			}
		}
	}
}

function endColorsChange(evt) {
	if (!totalValidated && !isAnimating) {
		clicked = false;
		validate();
	}
}

function markSquareNumber(evt) {
	if (!totalValidated && !isAnimating) {
		var opacity = evt.target.getAttribute("opacity");
		var id = evt.target.getAttribute("id");
		id = id.replace("squareNumber_", "");
		var idSplited = id.split('.');
		var orientation = parseInt(idSplited[0]);
		var i = parseInt(idSplited[1]);
		var j = parseInt(idSplited[2]);
		var number = document.getElementById("number_" + orientation + "." + i + "." + j);
		if (opacity == "1") {
			evt.target.setAttribute("opacity", "0");
			number.setAttribute("fill", "black");
		}
		else {
			evt.target.setAttribute("opacity", "1");
			number.setAttribute("fill", "white");
		}
	}
}

function markNumber(evt) {
	if (!totalValidated && !isAnimating) {
		var fill = evt.target.getAttribute("fill");
		var id = evt.target.getAttribute("id");
		id = id.replace("number_", "");
		var idSplited = id.split('.');
		var orientation = parseInt(idSplited[0]);
		var i = parseInt(idSplited[1]);
		var j = parseInt(idSplited[2]);
		var squareNumber = document.getElementById("squareNumber_" + orientation + "." + i + "." + j);
		if (fill == "white") {
			evt.target.setAttribute("fill", "black");
			squareNumber.setAttribute("opacity", "0");
		}
		else {
			evt.target.setAttribute("fill", "white");
			squareNumber.setAttribute("opacity", "1");
		}
	}
}

function validate() {
	var count = 0;
	var validated, square, color, rectangle, squareNumber, number;
	totalValidated = true;
	for (i = 0; i < vertical_numbers.length; i++) {
		validated = true;
		rectangle = document.getElementById("rectangle_0." + i);
		for (j = 0; j < horizontal_numbers.length; j++) {
			square = document.getElementById("square_" + i + "." + j);
			color = square.getAttribute("fill");
			if ((((color == "black") && (draw_points[j][i] == 0)) || ((color != "black") && (draw_points[j][i] == 1)))) {
				validated = false;
				totalValidated = false;
				if (rectangle.getAttribute("fill") == "green")
					rectangle.setAttribute("fill", "white");
				break;
			}
		}
		if (validated) {
			for (j = 0; j < vertical_numbers.length - 1; j++) {
				squareNumber = document.getElementById("squareNumber_0." + i + "." + j);
				if (squareNumber != null) {
					squareNumber.setAttribute("opacity", "0");
					number = document.getElementById("number_0." + i + "." + j);
					number.setAttribute("fill", "black");
				}
			}
			rectangle.setAttribute("fill", "green");
		}
	}
	for (i = 0; i < horizontal_numbers.length; i++) {
		validated = true;
		rectangle = document.getElementById("rectangle_1." + i);
		for (j = 0; j < vertical_numbers.length; j++) {
			square = document.getElementById("square_" + j + "." + i);
			color = square.getAttribute("fill");
			if (((color == "black") && (draw_points[i][j] == 0)) || ((color != "black") && (draw_points[i][j] == 1))) {
				validated = false;
				totalValidated = false;
				if (rectangle.getAttribute("fill") == "green")
					rectangle.setAttribute("fill", "white");
				break;
			}
		}
		if (validated) {
			for (j = 0; j < horizontal_numbers.length - 1; j++) {
				squareNumber = document.getElementById("squareNumber_1." + i + "." + j);
				if (squareNumber != null) {
					squareNumber.setAttribute("opacity", "0");
					number = document.getElementById("number_1." + i + "." + j);
					number.setAttribute("fill", "black");
				}
			}
			rectangle.setAttribute("fill", "green");
		}
	}
	if (totalValidated) {
		alert("Puzzle Solved!");
		document.forms[0].submit();
	}
}

function increaseAreaSize() {
	if (size < 40)
		size += 5;
	changeAreaSize();
}

function decreaseAreaSize() {
	if (size > 5)
		size -= 5;
	changeAreaSize();
}

function changeAreaSize() {
	var pos_x = $INIT_X + horizontal_numbers[0].length * size;
	var pos_y = $INIT_Y + vertical_numbers[0].length * size;
	for (i = 0; i <= vertical_numbers.length; i++) {
		if (i < vertical_numbers.length) {
			changeRectangleSize(pos_x, pos_y, 0, i);
			changeRectangleAuxSize(pos_x, pos_y, 0, i);
		}
		if (i < vertical_numbers.length) {
			for (j = 1; j <= vertical_numbers[0].length; j++) {
				if (vertical_numbers[i][j - 1] != " ") {
					changeSquareNumberSize(pos_x, pos_y, 0, i, j);
					changeNumberSize(pos_x, pos_y, 0, i, j);
				}
			}
		}
		changeLineSize(pos_x, pos_y, 0, i);
	}
	for (i = 0; i <= horizontal_numbers.length; i++) {
		if (i < horizontal_numbers.length) {
			changeRectangleSize(pos_x, pos_y, 1, i);
			changeRectangleAuxSize(pos_x, pos_y, 1, i);
		}
		if (i < horizontal_numbers.length) {
			for (j = 1; j <= horizontal_numbers[0].length; j++) {
				if (horizontal_numbers[i][j - 1] != " ") {
					changeSquareNumberSize(pos_x, pos_y, 1, i, j);
					changeNumberSize(pos_x, pos_y, 1, i, j);
				}
			}
		}
		changeLineSize(pos_x, pos_y, 1, i);
	}
	for (i = 0; i < vertical_numbers.length; i++) {
		for (j = 0; j < horizontal_numbers.length; j++) {
			changeSquareSize(pos_x, pos_y, i, j);
		}
	}
}

function changeSquareSize(pos_x, pos_y, i, j) {
	var square = document.getElementById("square_" + i + "." + j);
	square.setAttribute("height", size * 0.95);
	square.setAttribute("width", size * 0.95);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
}

function changeRectangleSize(pos_x, pos_y, orientation, i) {
	var rectangle = document.getElementById("rectangle_" + orientation + "." + i);
	if (orientation == 0) {
		rectangle.setAttribute("height", vertical_numbers[0].length * size);
		rectangle.setAttribute("width", size);
		rectangle.setAttribute("x", pos_x + i * size);
		rectangle.setAttribute("y", pos_y - vertical_numbers[0].length * size);
	} else {
		rectangle.setAttribute("height", size);
		rectangle.setAttribute("width", horizontal_numbers[0].length * size);
		rectangle.setAttribute("x", pos_x - horizontal_numbers[0].length * size);
		rectangle.setAttribute("y", pos_y + i * size);
	}
}

function changeRectangleAuxSize(pos_x, pos_y, orientation, i) {
	var rectangleAux = document.getElementById("rectangle_aux_" + orientation + "." + i);
	if (orientation == 0) {
		rectangleAux.setAttribute("height", draw_points.length * size);
		rectangleAux.setAttribute("width", size);
		rectangleAux.setAttribute("x", pos_x + i * size);
		rectangleAux.setAttribute("y", pos_y);
	} else {
		rectangleAux.setAttribute("height", size);
		rectangleAux.setAttribute("width", draw_points[0].length * size);
		rectangleAux.setAttribute("x", pos_x);
		rectangleAux.setAttribute("y", pos_y + i * size);
	}
}

function changeLineSize(pos_x, pos_y, orientation, i) {
	var line = document.getElementById("line_" + orientation + "." + i);
	if (orientation == 0) {
		line.setAttribute("x1", pos_x + i * size);
		line.setAttribute("x2", pos_x + i * size);
		line.setAttribute("y1", pos_y - vertical_numbers[0].length * size);
		line.setAttribute("y2", pos_y + horizontal_numbers.length * size);
	} else {
		line.setAttribute("x1", pos_x - horizontal_numbers[0].length * size);
		line.setAttribute("x2", pos_x + vertical_numbers.length * size);
		line.setAttribute("y1", pos_y + i * size);
		line.setAttribute("y2", pos_y + i * size);
	}
}

function changeNumberSize(pos_x, pos_y, orientation, i, j) {
	var number = document.getElementById("number_" + orientation + "." + i + "." + (j - 1));
	number.setAttribute("font-size", 0.9 * size);
	if (orientation == 0) {
		number.setAttribute("x", pos_x + i * size + 0.5 * size);
		number.setAttribute("y", pos_y - j * size + 0.8 * size);
	} else {
		number.setAttribute("x", pos_x - j * size + 0.5 * size);
		number.setAttribute("y", pos_y + i * size + 0.8 * size);
	}
}

function changeSquareNumberSize(pos_x, pos_y, orientation, i, j) {
	var squareNumber = document.getElementById("squareNumber_" + orientation + "." + i + "." + (j - 1));
	squareNumber.setAttribute("height", size);
	squareNumber.setAttribute("width", size);
	if (orientation == 0) {
		squareNumber.setAttribute("x", pos_x + i * size);
		squareNumber.setAttribute("y", pos_y - j * size);
	} else {
		squareNumber.setAttribute("x", pos_x - j * size);
		squareNumber.setAttribute("y", pos_y + i * size);
	}
}

function executeSpecial() {
	if (specialCount > 0) {
		format_special_button = document.getElementById("format_special_button");
		if (!isAnimating) {
			format_special_button.setAttribute("opacity", "0.5");
			animation = setInterval('travelTable();', 50);
			columnCount = 0;
			lineCount = 0;
			columnCountAux = null;
			lineCountAux = null;
			isAnimating = true;
		}
		else {
			format_special_button.setAttribute("opacity", "1");
			specialCount--;
			label_special = document.getElementById("label_special");
			label_special.textContent = specialCount;
			var square;
			clearInterval(animation);
			if (lineCount != 0) {
				for (i = 0; i < vertical_numbers.length; i++) {
					square = document.getElementById("square_" + i + "." + (lineCount - 1));
					if (draw_points[lineCount - 1][i] == 1) {
						square.setAttribute("fill", "black");
						square.setAttribute("opacity", "1");
					}
					else {
						square.setAttribute("fill", "white");
						square.setAttribute("opacity", "0");
					}
				}
				rectangleAux = document.getElementById("rectangle_aux_1." + (lineCount - 1));
				rectangleAux.setAttribute("opacity", "0");
			}
			else {
				for (i = 0; i < horizontal_numbers.length; i++) {
					square = document.getElementById("square_" + (columnCount - 1) + "." + i);
					if (draw_points[i][columnCount - 1] == 1) {
						square.setAttribute("fill", "black");
						square.setAttribute("opacity", "1");
					}
					else {
						square.setAttribute("fill", "white");
						square.setAttribute("opacity", "0");
					}
				}
				rectangleAux = document.getElementById("rectangle_aux_0." + (columnCount - 1));
				rectangleAux.setAttribute("opacity", "0");
			}
			validate();
			isAnimating = false;
		}
	}
}

function travelTable() {
	var squareAux = null;
	if (columnCount < vertical_numbers.length) {
		if (columnCountAux != null) {
			rectangleAux = document.getElementById("rectangle_aux_0." + columnCountAux);
			rectangleAux.setAttribute("opacity", "0");
		}
		rectangleAux = document.getElementById("rectangle_aux_0." + columnCount);
		rectangleAux.setAttribute("opacity", "1");
		columnCountAux = columnCount;
		columnCount++;
	}
	else if (lineCount < horizontal_numbers.length) {
		if (columnCountAux != null) {
			rectangleAux = document.getElementById("rectangle_aux_0." + columnCountAux);
			rectangleAux.setAttribute("opacity", "0");
			columnCountAux = null;
		}
		if (lineCountAux != null) {
			rectangleAux = document.getElementById("rectangle_aux_1." + lineCountAux);
			rectangleAux.setAttribute("opacity", "0");
		}
		rectangleAux = document.getElementById("rectangle_aux_1." + lineCount);
		rectangleAux.setAttribute("opacity", "1");
		lineCountAux = lineCount;
		lineCount++;
	}
	else {
		rectangleAux = document.getElementById("rectangle_aux_1." + lineCountAux);
		rectangleAux.setAttribute("opacity", "0");
		lineCountAux = null;
		columnCount = 0;
		lineCount = 0;
	}
}

function solve() {
	for (i = 0; i < draw_points.length; i++) {
		for (j = 0; j < draw_points[0].length; j++) {
			var square = document.getElementById("square_" + j + "." + i);
			if (draw_points[i][j] == 1) {
				square.setAttribute("fill", "black");
			}
			else {
				square.setAttribute("fill", "white");
			}
			square.setAttribute("opacity", "1");
		}
	}
	validate();
}
