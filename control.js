const $SVG_LIB = "http://www.w3.org/2000/svg";

var size = 20;
var level = '0';
var draw_points = [];
var vertical_numbers = [];
var horizontal_numbers = [];

var squareI;
var squareJ;
var colorSquare;
var colorSelected;
var markSelected;
var clicked = false;
var totalValidated = false;

//#region Main Functions
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

function setLevel() {
	level = document.getElementById("level").value;
}

function solve() {
	var square = null;
	for (i = 0; i < draw_points.length; i++) {
		for (j = 0; j < draw_points[0].length; j++) {
			square = document.getElementById("square_" + j + "." + i);
			square.setAttribute("fill", $COLORS[draw_points[i][j]]);
			square.setAttribute("opacity", "1");
		}
	}
	validate();
}

function initialize() {
	clean();
	totalValidated = false;
	colorSelected = $COLORS[1];
	for (i = 1; i < $COLORS.length; i++) {
		createSquareColor(i);
	}
	lines = $DATA.split(";");
	points = lines[0].split(",");
	for (k = 0; k < lines.length; k++)
		draw_points[k] = new Array(points.length - 1);
	for (i = 0; i < lines.length; i++) {
		line_aux = lines[i].split(",");
		for (j = 0; j < line_aux.length - 1; j++)
			draw_points[i][j] = line_aux[j];
	}
	fillNumbers();
	var pos_x = horizontal_numbers[0].length * size;
	var pos_y = vertical_numbers[0].length * size;
	for (i = 0; i < vertical_numbers.length; i++) {
		for (j = 0; j < horizontal_numbers.length; j++) {
			createMark(pos_x, pos_y, i, j);
			createSquare(pos_x, pos_y, i, j);
		}
	}
	for (i = 0; i <= vertical_numbers.length; i++) {
		if (i < vertical_numbers.length) {
			createSignal(pos_x, pos_y, 0, i);
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
			createSignal(pos_x, pos_y, 1, i);
			for (j = 1; j <= horizontal_numbers[0].length; j++) {
				if (horizontal_numbers[i][j - 1] != " ") {
					createSquareNumber(pos_x, pos_y, 1, i, j);
					createNumber(pos_x, pos_y, 1, i, j);
				}
			}
		}
		createLine(pos_x, pos_y, 1, i);
	}
	createCalculated(pos_x, pos_y, 0);
	createCalculated(pos_x, pos_y, 1);
	autoFill();
	validate();
}
//#endregion

//#region Auxiliar Functions
function changeAreaSize() {
	var pos_x = horizontal_numbers[0].length * size;
	var pos_y = vertical_numbers[0].length * size;
	for (i = 0; i < vertical_numbers.length; i++) {
		for (j = 0; j < horizontal_numbers.length; j++) {
			changeMarkSize(pos_x, pos_y, i, j);
			changeSquareSize(pos_x, pos_y, i, j);
		}
	}
	for (i = 0; i <= vertical_numbers.length; i++) {
		if (i < vertical_numbers.length) {
			changeSignalSize(pos_x, pos_y, 0, i);
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
			changeSignalSize(pos_x, pos_y, 1, i);
			for (j = 1; j <= horizontal_numbers[0].length; j++) {
				if (horizontal_numbers[i][j - 1] != " ") {
					changeSquareNumberSize(pos_x, pos_y, 1, i, j);
					changeNumberSize(pos_x, pos_y, 1, i, j);
				}
			}
		}
		changeLineSize(pos_x, pos_y, 1, i);
	}
	changeCalculatedSize(pos_x, pos_y, 0);
	changeCalculatedSize(pos_x, pos_y, 1);
}

function changeMarkSize(pos_x, pos_y, i, j) {
	var mark = document.getElementById("mark_" + i + "." + j);
	mark.setAttribute("font-size", size);
	mark.setAttribute("x", pos_x + (i + 0.5) * size);
	mark.setAttribute("y", pos_y + (j + 0.85) * size);
}

function changeSquareSize(pos_x, pos_y, i, j) {
	var square = document.getElementById("square_" + i + "." + j);
	square.setAttribute("height", size);
	square.setAttribute("width", size);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
}

function changeSignalSize(pos_x, pos_y, orientation, i) {
	var signal = document.getElementById("signal_" + orientation + "." + i);
	if (orientation == 0) {
		signal.setAttribute("height", size / 4);
		signal.setAttribute("width", size);
		signal.setAttribute("x", pos_x + i * size);
		signal.setAttribute("y", pos_y + draw_points.length * size);
	} else {
		signal.setAttribute("height", size);
		signal.setAttribute("width", size / 4);
		signal.setAttribute("x", pos_x + draw_points[0].length * size);
		signal.setAttribute("y", pos_y + i * size);
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

function changeCalculatedSize(pos_x, pos_y, orientation) {
	var calculated = document.getElementById("calculated_" + orientation);
	calculated.setAttribute("font-size", size * 0.9);
	if (orientation == 0) {
		calculated.setAttribute("x", pos_x + draw_points[0].length * size + 0.5 * size);
	} else {
		calculated.setAttribute("y", pos_y + draw_points.length * size + 0.8 * size);
	}
}

function clean() {
	draw_points = [];
	vertical_numbers = [];
	horizontal_numbers = [];
	var colors = document.getElementById("colors");
	while (colors.firstChild) {
		colors.removeChild(colors.firstChild);
	}
	var area = document.getElementById("area");
	while (area.firstChild) {
		area.removeChild(area.firstChild);
	}
}

function validate() {
	var validated, square, color, signal, squareNumber, number;
	totalValidated = true;
	for (i = 0; i < vertical_numbers.length; i++) {
		validated = true;
		signal = document.getElementById("signal_0." + i);
		for (j = 0; j < horizontal_numbers.length; j++) {
			square = document.getElementById("square_" + i + "." + j);
			color = square.getAttribute("fill");
			if (color != $COLORS[draw_points[j][i]]) {
				validated = false;
				totalValidated = false;
				if (signal.getAttribute("fill") == "#adff2f")
					signal.setAttribute("fill", "#ffffff");
				break;
			}
		}
		if (validated) {
			for (j = 0; j < vertical_numbers.length - 1; j++) {
				squareNumber = document.getElementById("squareNumber_0." + i + "." + j);
				if (squareNumber != null) {
					squareNumber.setAttribute("opacity", "0");
					number = document.getElementById("number_0." + i + "." + j);
					number.setAttribute("fill", squareNumber.getAttribute("fill"));
				}
			}
			signal.setAttribute("fill", "#adff2f");
		}
	}
	for (i = 0; i < horizontal_numbers.length; i++) {
		validated = true;
		signal = document.getElementById("signal_1." + i);
		for (j = 0; j < vertical_numbers.length; j++) {
			square = document.getElementById("square_" + j + "." + i);
			color = square.getAttribute("fill");
			if (color != $COLORS[draw_points[i][j]]) {
				validated = false;
				totalValidated = false;
				if (signal.getAttribute("fill") == "#adff2f")
					signal.setAttribute("fill", "#ffffff");
				break;
			}
		}
		if (validated) {
			for (j = 0; j < horizontal_numbers.length - 1; j++) {
				squareNumber = document.getElementById("squareNumber_1." + i + "." + j);
				if (squareNumber != null) {
					squareNumber.setAttribute("opacity", "0");
					number = document.getElementById("number_1." + i + "." + j);
					number.setAttribute("fill", squareNumber.getAttribute("fill"));
				}
			}
			signal.setAttribute("fill", "#adff2f");
		}
	}
	if (totalValidated) {
		var mark = null;
		for (i = 0; i < draw_points.length; i++) {
			for (j = 0; j < draw_points[0].length; j++) {
				mark = document.getElementById("mark_" + j + "." + i);
				mark.setAttribute("opacity", "0");
			}
		}
		alert("Puzzle Solved!");
	}
}

function fillNumbers() {
	var horizontalNumbers = getHorizontalNumbers();
	var verticalNumbers = getVerticalNumbers();
	for (k = 0; k < draw_points.length; k++)
		horizontal_numbers[k] = new Array(horizontalNumbers);
	for (k = 0; k < draw_points[0].length; k++)
		vertical_numbers[k] = new Array(verticalNumbers);
	var count, numbers, aux, counting;
	for (i = 0; i < draw_points.length; i++) {
		count = 0;
		numbers = 0;
		aux = -1;
		counting = false;
		for (j = draw_points[0].length - 1; j >= 0; j--) {
			if (counting) {
				count++;
				if (draw_points[i][j] == 0 || draw_points[i][j] != aux) {
					if (draw_points[i][j] == 0)
						counting = false;
					horizontal_numbers[i][numbers] = { number: count.toString(), color: $COLORS[aux] };
					count = 0;
					numbers++;
				}
			} else if (draw_points[i][j] > 0 && draw_points[i][j] != aux)
				counting = true;
			aux = draw_points[i][j];
		}
		if (counting) {
			count++;
			horizontal_numbers[i][numbers] = { number: count.toString(), color: $COLORS[aux] };
			numbers++;
		}
		while (numbers < horizontalNumbers) {
			horizontal_numbers[i][numbers] = { number: " ", color: $COLORS[0] };
			numbers++;
		}
	}
	for (i = 0; i < draw_points[0].length; i++) {
		count = 0;
		numbers = 0;
		aux = -1;
		counting = false;
		for (j = draw_points.length - 1; j >= 0; j--) {
			if (counting) {
				count++;
				if (draw_points[j][i] == 0 || draw_points[j][i] != aux) {
					if (draw_points[j][i] == 0)
						counting = false;
					vertical_numbers[i][numbers] = { number: count.toString(), color: $COLORS[aux] };
					count = 0;
					numbers++;
				}
			} else if (draw_points[j][i] > 0 && draw_points[j][i] != aux)
				counting = true;
			aux = draw_points[j][i];
		}
		if (counting) {
			count++;
			vertical_numbers[i][numbers] = { number: count.toString(), color: $COLORS[aux] };
			numbers++;
		}
		while (numbers < verticalNumbers) {
			vertical_numbers[i][numbers] = { number: " ", color: $COLORS[0] };
			numbers++;
		}
	}
}

function getHorizontalNumbers() {
	var bigger = 0;
	var numbers, aux, counting;
	for (i = 0; i < draw_points.length; i++) {
		numbers = 0;
		aux = -1;
		counting = false;
		for (j = draw_points[0].length - 1; j >= 0; j--) {
			if (counting) {
				if (draw_points[i][j] == 0 || draw_points[i][j] != aux) {
					if (draw_points[i][j] == 0)
						counting = false;
					numbers++;
				}
			} else if (draw_points[i][j] > 0 && draw_points[i][j] != aux)
				counting = true;
			aux = draw_points[i][j];
		}
		if (counting)
			numbers++;
		if (numbers > bigger)
			bigger = numbers;
	}
	return bigger;
}

function getVerticalNumbers() {
	var bigger = 0;
	var numbers, aux, counting;
	for (i = 0; i < draw_points[0].length; i++) {
		numbers = 0;
		aux = -1;
		counting = false;
		for (j = draw_points.length - 1; j >= 0; j--) {
			if (counting) {
				if (draw_points[j][i] == 0 || draw_points[j][i] != aux) {
					if (draw_points[j][i] == 0)
						counting = false;
					numbers++;
				}
			} else if (draw_points[j][i] > 0 && draw_points[j][i] != aux)
				counting = true;
			aux = draw_points[j][i];
		}
		if (counting)
			numbers++;
		if (numbers > bigger)
			bigger = numbers;
	}
	return bigger;
}

function autoFill() {
	totalRanks = draw_points.length + draw_points[0].length;
	var numberRanksToFill;
	switch (level) {
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
	var square = null;
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
					if (draw_points[randColumn][i] > 0) {
						square = document.getElementById("square_" + i + "." + randColumn);
						square.setAttribute("fill", $COLORS[draw_points[randColumn][i]]);
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
					if (draw_points[i][randLine] > 0) {
						square = document.getElementById("square_" + randLine + "." + i);
						square.setAttribute("fill", $COLORS[draw_points[i][randLine]]);
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

function refreshCalculatedValues(i, j) {
	var square = document.getElementById("square_" + i + "." + j);
	var colorSquare = square.getAttribute("fill");
	var squareAux = null;
	var calcHorizontal = 1;
	var countRight = i + 1;
	while (countRight <= draw_points[0].length - 1) {
		squareAux = document.getElementById("square_" + countRight + "." + j);
		if (squareAux.getAttribute("fill") == colorSquare) {
			countRight++;
			calcHorizontal++;
		} else break;
	}
	var countLeft = i - 1;
	while (countLeft >= 0) {
		squareAux = document.getElementById("square_" + countLeft + "." + j);
		if (squareAux.getAttribute("fill") == colorSquare) {
			countLeft--;
			calcHorizontal++;
		} else break;
	}
	var calcVertical = 1;
	var countDown = j + 1;
	while (countDown <= draw_points.length - 1) {
		squareAux = document.getElementById("square_" + i + "." + countDown);
		if (squareAux.getAttribute("fill") == colorSquare) {
			countDown++;
			calcVertical++;
		} else break;
	}
	var countUp = j - 1;
	while (countUp >= 0) {
		squareAux = document.getElementById("square_" + i + "." + countUp);
		if (squareAux.getAttribute("fill") == colorSquare) {
			countUp--;
			calcVertical++;
		} else break;
	}
	var calculatedHorizontal = document.getElementById("calculated_0");
	var calculatedVertical = document.getElementById("calculated_1");
	if (colorSquare != "#ffffff") {
		calculatedHorizontal.setAttribute("fill", colorSquare);
		calculatedVertical.setAttribute("fill", colorSquare);
	} else {
		calculatedHorizontal.setAttribute("fill", "#808080");
		calculatedVertical.setAttribute("fill", "#808080");
	}
	calculatedHorizontal.textContent = calcHorizontal;
	calculatedVertical.textContent = calcVertical;
	var pos_y = vertical_numbers[0].length * size;
	calculatedHorizontal.setAttribute("y", pos_y + size * (j + 1));
	var pos_x = horizontal_numbers[0].length * size;
	calculatedVertical.setAttribute("x", pos_x + size * (i + 0.5));
}
//#endregion

//#region Create SVG Element Functions
function createSquareColor(i) {
	var squareColor = document.createElementNS($SVG_LIB, "rect");
	squareColor.setAttribute("id", "squareColor_" + i);
	if (i == 1)
		squareColor.setAttribute("stroke-width", "3");
	else
		squareColor.setAttribute("stroke-width", "1");
	squareColor.setAttribute("stroke", "black");
	squareColor.setAttribute("height", 40);
	squareColor.setAttribute("width", 40);
	squareColor.setAttribute("fill", $COLORS[i]);
	squareColor.setAttribute("x", ((i - 1) * 40) + 5);
	squareColor.setAttribute("y", 5);
	squareColor.onclick = markSquareColor;
	document.getElementById("colors").appendChild(squareColor);
}

function createMark(pos_x, pos_y, i, j) {
	var mark = document.createElementNS($SVG_LIB, "text");
	mark.setAttribute("id", "mark_" + i + "." + j);
	mark.setAttribute("text-anchor", "middle");
	mark.setAttribute("font-family", "serif");
	mark.setAttribute("font-size", size);
	mark.setAttribute("fill", "#808080");
	mark.setAttribute("x", pos_x + (i + 0.5) * size);
	mark.setAttribute("y", pos_y + (j + 0.85) * size);
	mark.setAttribute("opacity", "0");
	mark.textContent = "X";
	document.getElementById("area").appendChild(mark);
}

function createSquare(pos_x, pos_y, i, j) {
	var square = document.createElementNS($SVG_LIB, "rect");
	square.setAttribute("id", "square_" + i + "." + j);
	square.setAttribute("fill", "#ffffff");
	square.setAttribute("opacity", "0");
	square.setAttribute("height", size);
	square.setAttribute("width", size);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
	square.onmouseover = highlightSquare;
	square.onmouseout = fadeSquare;
	square.onmousedown = initColorsChange;
	square.onmousemove = changeColorSquares;
	square.onmouseup = endColorsChange;
	document.getElementById("area").appendChild(square);
}

function createSignal(pos_x, pos_y, orientation, i) {
	var signal = document.createElementNS($SVG_LIB, "rect");
	signal.setAttribute("id", "signal_" + orientation + "." + i);
	signal.setAttribute("fill", "#ffffff");
	signal.setAttribute("stroke-width", "0");
	if (orientation == 0) {
		signal.setAttribute("height", size / 4);
		signal.setAttribute("width", size);
		signal.setAttribute("x", pos_x + i * size);
		signal.setAttribute("y", pos_y + draw_points.length * size);
	} else {
		signal.setAttribute("height", size);
		signal.setAttribute("width", size / 4);
		signal.setAttribute("x", pos_x + draw_points[0].length * size);
		signal.setAttribute("y", pos_y + i * size);
	}
	document.getElementById("area").appendChild(signal);
}

function createSquareNumber(pos_x, pos_y, orientation, i, j) {
	var squareNumber = document.createElementNS($SVG_LIB, "rect");
	squareNumber.setAttribute("id", "squareNumber_" + orientation + "." + i + "." + (j - 1));
	squareNumber.setAttribute("opacity", "1");
	squareNumber.setAttribute("height", size);
	squareNumber.setAttribute("width", size);
	if (orientation == 0) {
		squareNumber.setAttribute("x", pos_x + i * size);
		squareNumber.setAttribute("y", pos_y - j * size);
		squareNumber.setAttribute("fill", vertical_numbers[i][j - 1].color);
	} else {
		squareNumber.setAttribute("x", pos_x - j * size);
		squareNumber.setAttribute("y", pos_y + i * size);
		squareNumber.setAttribute("fill", horizontal_numbers[i][j - 1].color);
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
	number.setAttribute("font-weight", "normal");
	number.setAttribute("fill", "#ffffff");
	if (orientation == 0) {
		number.setAttribute("x", pos_x + i * size + 0.5 * size);
		number.setAttribute("y", pos_y - j * size + 0.8 * size);
		number.textContent = vertical_numbers[i][j - 1].number;
	} else {
		number.setAttribute("x", pos_x - j * size + 0.5 * size);
		number.setAttribute("y", pos_y + i * size + 0.8 * size);
		number.textContent = horizontal_numbers[i][j - 1].number;
	}
	number.onclick = markNumber;
	document.getElementById("area").appendChild(number);
}

function createLine(pos_x, pos_y, orientation, i) {
	var line = document.createElementNS($SVG_LIB, "line");
	line.setAttribute("id", "line_" + orientation + "." + i);
	line.setAttribute("stroke", "#808080");
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

function createCalculated(pos_x, pos_y, orientation) {
	var calculated = document.createElementNS($SVG_LIB, "text");
	calculated.setAttribute("id", "calculated_" + orientation);
	calculated.setAttribute("text-anchor", "middle");
	calculated.setAttribute("font-family", "serif");
	calculated.setAttribute("font-size", size * 0.9);
	calculated.setAttribute("font-weight", "bold");
	calculated.setAttribute("fill", "#808080");
	calculated.textContent = " ";
	if (orientation == 0) 
		calculated.setAttribute("x", pos_x + draw_points[0].length * size + 0.5 * size);
	else
		calculated.setAttribute("y", pos_y + draw_points.length * size + 0.8 * size);
	document.getElementById("area").appendChild(calculated);
}
//#endregion

//#region Event Functions
function markSquareColor(evt) {
	var id = evt.target.getAttribute("id");
	id = id.replace("squareColor_", "");
	colorSelected = $COLORS[id];
	evt.target.setAttribute("stroke-width", "3");
	for (i = 1; i < $COLORS.length; i++) {
		squareColor = document.getElementById("squareColor_" + i);
		if (i != id)
			squareColor.setAttribute("stroke-width", "1");
	}
}

function highlightSquare(evt) {
	if (!totalValidated) {
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
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "#808080");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		var horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "#808080");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
		i = i + 1;
		j = j + 1;
		verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", "#808080");
		if ((i % 5) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", "#808080");
		if ((j % 5) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
		var calculatedHorizontal = document.getElementById("calculated_0");
		if (calculatedHorizontal != null) {
			calculatedHorizontal.textContent = "";
		}
		var calculatedVertical = document.getElementById("calculated_1");
		if (calculatedVertical != null) {
			calculatedVertical.textContent = "";
		}
	}
}

function initColorsChange(evt) {
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		squareI = parseInt(idSplited[0]);
		squareJ = parseInt(idSplited[1]);
		colorSquare = evt.target.getAttribute("fill");
		var mark = document.getElementById("mark_" + squareI + "." + squareJ);
		var markOpacity = mark.getAttribute("opacity");
		markSelected = false;
		if (colorSquare == "#ffffff") {
			if (markOpacity == "0") {
				if (evt.button == 0) {
					evt.target.setAttribute("fill", colorSelected);
					evt.target.setAttribute("opacity", "1");
					colorSquare = colorSelected;
				} else {
					mark.setAttribute("opacity", "1");
					markSelected = true;
				}
			} else {
				if (evt.button == 0) {
					evt.target.setAttribute("fill", colorSelected);
					evt.target.setAttribute("opacity", "1");
					colorSquare = colorSelected;
				}
				mark.setAttribute("opacity", "0");
			}
		} else {
			if (evt.button == 0) {
				if (colorSquare != colorSelected) {
					evt.target.setAttribute("fill", colorSelected);
					colorSquare = colorSelected;
				} else {
					evt.target.setAttribute("fill", "#ffffff");
					evt.target.setAttribute("opacity", "0");
					colorSquare = "#ffffff";
				}
			} else {
				evt.target.setAttribute("fill", "#ffffff");
				evt.target.setAttribute("opacity", "0");
				mark.setAttribute("opacity", "1");
				markSelected = true;
			}
		}
		clicked = true;
	}
}

function changeColorSquares(evt) {
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		if (clicked == true) {
			if ((i >= squareI) && (j == squareJ)) {
				var count = squareI;
				while (count <= i) {
					var square = document.getElementById("square_" + count + "." + squareJ);
					var mark = document.getElementById("mark_" + count + "." + squareJ);
					if (markSelected) {
						square.setAttribute("fill", "#ffffff");
						square.setAttribute("opacity", "0");
						mark.setAttribute("opacity", "1");
					} else {
						square.setAttribute("fill", colorSquare);
						mark.setAttribute("opacity", "0");
						if (colorSquare == "#ffffff")
							square.setAttribute("opacity", "0");
						else
							square.setAttribute("opacity", "1");
					}
					count++;
				}
			}
			else if ((i <= squareI) && (j == squareJ)) {
				var count = i;
				while (count <= squareI) {
					var square = document.getElementById("square_" + count + "." + squareJ);
					var mark = document.getElementById("mark_" + count + "." + squareJ);
					if (markSelected) {
						square.setAttribute("fill", "#ffffff");
						square.setAttribute("opacity", "0");
						mark.setAttribute("opacity", "1");
					} else {
						square.setAttribute("fill", colorSquare);
						mark.setAttribute("opacity", "0");
						if (colorSquare == "#ffffff")
							square.setAttribute("opacity", "0");
						else
							square.setAttribute("opacity", "1");
					}
					count++;
				}
			}
			else if ((i == squareI) && (j >= squareJ)) {
				var count = squareJ;
				while (count <= j) {
					var square = document.getElementById("square_" + squareI + "." + count);
					var mark = document.getElementById("mark_" + squareI + "." + count);
					if (markSelected) {
						square.setAttribute("fill", "#ffffff");
						square.setAttribute("opacity", "0");
						mark.setAttribute("opacity", "1");
					} else {
						square.setAttribute("fill", colorSquare);
						mark.setAttribute("opacity", "0");
						if (colorSquare == "#ffffff")
							square.setAttribute("opacity", "0");
						else
							square.setAttribute("opacity", "1");
					}
					count++;
				}
			}
			else if ((i == squareI) && (j <= squareJ)) {
				var count = j;
				while (count <= squareJ) {
					var square = document.getElementById("square_" + squareI + "." + count);
					var mark = document.getElementById("mark_" + squareI + "." + count);
					if (markSelected) {
						square.setAttribute("fill", "#ffffff");
						square.setAttribute("opacity", "0");
						mark.setAttribute("opacity", "1");
					} else {
						square.setAttribute("fill", colorSquare);
						mark.setAttribute("opacity", "0");
						if (colorSquare == "#ffffff")
							square.setAttribute("opacity", "0");
						else
							square.setAttribute("opacity", "1");
					}
					count++;
				}
			}
		}
		refreshCalculatedValues(i, j);
	}
}

function endColorsChange(evt) {
	if (!totalValidated) {
		clicked = false;
		validate();
	}
}

function markSquareNumber(evt) {
	if (!totalValidated) {
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
			number.setAttribute("fill", evt.target.getAttribute("fill"));
			number.setAttribute("font-weight", "bold");
		}
		else {
			evt.target.setAttribute("opacity", "1");
			number.setAttribute("fill", "#ffffff");
			number.setAttribute("font-weight", "normal");
		}
	}
}

function markNumber(evt) {
	if (!totalValidated) {
		var fill = evt.target.getAttribute("fill");
		var id = evt.target.getAttribute("id");
		id = id.replace("number_", "");
		var idSplited = id.split('.');
		var orientation = parseInt(idSplited[0]);
		var i = parseInt(idSplited[1]);
		var j = parseInt(idSplited[2]);
		var squareNumber = document.getElementById("squareNumber_" + orientation + "." + i + "." + j);
		if (fill == "#ffffff") {
			squareNumber.setAttribute("opacity", "0");
			evt.target.setAttribute("fill", squareNumber.getAttribute("fill"));
			evt.target.setAttribute("font-weight", "bold");
		}
		else {
			squareNumber.setAttribute("opacity", "1");
			evt.target.setAttribute("fill", "#ffffff");
			evt.target.setAttribute("font-weight", "normal");
		}
	}
}
//#endregion
