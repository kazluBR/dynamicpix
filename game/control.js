const $SVG_LIB = "http://www.w3.org/2000/svg";
const $LINE_COLOR = "#808080";
const $MARK_COLOR = "#808080";
const $CALCULATED_EMPTY_COLOR = "#808080";
const $RULE_COLOR = "#ff00ff";
const $VALIDATED_COLOR = "#adff2f";

var size = 20;
var fillPuzzle = '0';
var totalValidated = false;
var clicked = false;

var data;
var squareI;
var squareJ;
var colorSquare;
var colorSelected;
var markSelected;

//#region Main Functions
function setFillPuzzle() {
	fillPuzzle = document.getElementById("fillPuzzle").value;
}

function loadJson() {
	var files = document.getElementById('selectedFile').files;
	if (files.length <= 0) {
		alert("Select a valid JSON file");
		return false;
	}
	var fr = new FileReader();
	fr.onload = function (e) {
		var result = e.target.result;
		data = JSON.parse(result);
		initialize();
		window.location.hash = "#menu";
	}
	fr.readAsText(files.item(0));
}

function initialize() {
	if (data != null) {
		clean();
		totalValidated = false;
		colorSelected = data.colors[1];
		for (i = 1; i < data.colors.length; i++) {
			createSquareColor(i);
		}
		var pos_x = data.settings.horizontalNumbersLength * size;
		var pos_y = data.settings.verticalNumbersLength * size;
		for (i = 0; i < data.settings.width; i++) {
			for (j = 0; j < data.settings.height; j++) {
				createMark(pos_x, pos_y, i, j);
				createSquare(pos_x, pos_y, i, j);
				createMarkAux(pos_x, pos_y, i, j);
				createSquareAux(pos_x, pos_y, i, j);
			}
		}
		for (i = 0; i <= data.settings.width; i++) {
			if (i < data.settings.width) {
				createSignal(pos_x, pos_y, 0, i);
				for (j = 1; j <= data.verticalNumbers[i].length; j++) {
					createSquareNumber(pos_x, pos_y, 0, i, j);
					createNumber(pos_x, pos_y, 0, i, j);
				}
			}
			createLine(pos_x, pos_y, 0, i);
		}
		for (i = 0; i <= data.settings.height; i++) {
			if (i < data.settings.height) {
				createSignal(pos_x, pos_y, 1, i);
				for (j = 1; j <= data.horizontalNumbers[i].length; j++) {
					createSquareNumber(pos_x, pos_y, 1, i, j);
					createNumber(pos_x, pos_y, 1, i, j);
				}
			}
			createLine(pos_x, pos_y, 1, i);
		}
		createCalculated(pos_x, pos_y, 0);
		createCalculated(pos_x, pos_y, 1);
		autoFill();
		validate();
	}
}

function increaseAreaSize() {
	if (data != null) {
		if (size < 30)
			size += 1;
		changeAreaSize();
	}
}

function decreaseAreaSize() {
	if (data != null) {
		if (size > 10)
			size -= 1;
		changeAreaSize();
	}
}

function check() {
	var square, squareColor, squareOpacity, mark, markOpacity;
	var errors = 0;
	for (i = 0; i < data.settings.width; i++) {
		for (j = 0; j < data.settings.height; j++) {
			square = document.getElementById("square_" + i + "." + j);
			squareColor = square.getAttribute("fill");
			squareOpacity = square.getAttribute("opacity");
			if (squareColor != data.colors[data.points[j][i]] && squareOpacity == "1") {
				errors++;
			} else {
				mark = document.getElementById("mark_" + i + "." + j);
				markOpacity = mark.getAttribute("opacity");
				if (data.points[j][i] != 0 && markOpacity == "1") {
					errors++;
				}
			}
		}
	}
	alert(errors + " errors found");
}

function solve() {
	if (data != null) {
		var square;
		for (i = 0; i < data.settings.height; i++) {
			for (j = 0; j < data.settings.width; j++) {
				square = document.getElementById("square_" + j + "." + i);
				square.setAttribute("fill", data.colors[data.points[i][j]]);
				square.setAttribute("opacity", "1");
			}
		}
	}
}

function switchSquareColor() {
	var colors = document.getElementById("colors").children;
	var selected;
	for (i = 0; i < colors.length; i++) {
		if (colors[i].getAttribute("stroke-width") == 3) {
			if (i == colors.length - 1)
				selected = 0;
			else
				selected = i + 1;
			break;
		}
	}
	colorSelected = data.colors[selected + 1];
	colors[selected].setAttribute("stroke-width", "3");
	var squareColor;
	for (i = 1; i < data.colors.length; i++) {
		squareColor = document.getElementById("squareColor_" + i);
		if (i != selected + 1)
			squareColor.setAttribute("stroke-width", "1");
	}
}

function endColorsChange() {
	if (clicked && data != null) {
		var squareAux, id, square, squareColor, markAux, mark;
		for (i = 0; i < data.settings.width; i++) {
			for (j = 0; j < data.settings.height; j++) {
				squareAux = document.getElementById("square_aux_" + i + "." + j);
				if (squareAux.getAttribute("opacity") == "1") {
					id = squareAux.getAttribute("id");
					id = id.replace("square_aux_", "square_");
					square = document.getElementById(id);
					squareColor = squareAux.getAttribute("fill");
					square.setAttribute("fill", squareColor);
					if (squareColor == data.colors[0])
						square.setAttribute("opacity", "0");
					else
						square.setAttribute("opacity", "1");
					squareAux.setAttribute("fill", data.colors[0]);
					squareAux.setAttribute("opacity", "0");
				}
				markAux = document.getElementById("mark_aux_" + i + "." + j);
				if (markAux.getAttribute("opacity") == "1") {
					id = markAux.getAttribute("id");
					id = id.replace("mark_aux_", "mark_");
					mark = document.getElementById(id);
					mark.setAttribute("opacity", "1");
					markAux.setAttribute("opacity", "0");
				}
				else if (markAux.getAttribute("opacity") == "0.1") {
					id = markAux.getAttribute("id");
					id = id.replace("mark_aux_", "mark_");
					mark = document.getElementById(id);
					mark.setAttribute("opacity", "0");
					markAux.setAttribute("opacity", "0");
				}
			}
		}
		clicked = false;
		validate();
	}
}
//#endregion

//#region Auxiliar Functions
function clean() {
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
	for (i = 0; i < data.settings.width; i++) {
		validated = true;
		signal = document.getElementById("signal_0." + i);
		for (j = 0; j < data.settings.height; j++) {
			square = document.getElementById("square_" + i + "." + j);
			color = square.getAttribute("fill");
			if (color != data.colors[data.points[j][i]]) {
				validated = false;
				totalValidated = false;
				if (signal.getAttribute("fill") == $VALIDATED_COLOR)
					signal.setAttribute("fill", data.colors[0]);
				break;
			}
		}
		if (validated) {
			for (j = 0; j < data.verticalNumbers[i].length; j++) {
				squareNumber = document.getElementById("squareNumber_0." + i + "." + j);
				squareNumber.setAttribute("opacity", "0");
				number = document.getElementById("number_0." + i + "." + j);
				number.setAttribute("fill", squareNumber.getAttribute("fill"));
			}
			signal.setAttribute("fill", $VALIDATED_COLOR);
		}
	}
	for (i = 0; i < data.settings.height; i++) {
		validated = true;
		signal = document.getElementById("signal_1." + i);
		for (j = 0; j < data.settings.width; j++) {
			square = document.getElementById("square_" + j + "." + i);
			color = square.getAttribute("fill");
			if (color != data.colors[data.points[i][j]]) {
				validated = false;
				totalValidated = false;
				if (signal.getAttribute("fill") == $VALIDATED_COLOR)
					signal.setAttribute("fill", data.colors[0]);
				break;
			}
		}
		if (validated) {
			for (j = 0; j < data.horizontalNumbers[i].length; j++) {
				squareNumber = document.getElementById("squareNumber_1." + i + "." + j);
				squareNumber.setAttribute("opacity", "0");
				number = document.getElementById("number_1." + i + "." + j);
				number.setAttribute("fill", squareNumber.getAttribute("fill"));
			}
			signal.setAttribute("fill", $VALIDATED_COLOR);
		}
	}
	if (totalValidated) {
		var mark;
		for (i = 0; i < data.settings.height; i++) {
			for (j = 0; j < data.settings.width; j++) {
				mark = document.getElementById("mark_" + j + "." + i);
				mark.setAttribute("opacity", "0");
			}
		}
		var calculatedHorizontal = document.getElementById("calculated_0");
		calculatedHorizontal.textContent = "";
		var calculatedVertical = document.getElementById("calculated_1");
		calculatedVertical.textContent = "";
		alert("Puzzle Solved!");
	}
}

function autoFill() {
	totalRanks = data.settings.height + data.settings.width;
	var numberRanksToFill;
	switch (fillPuzzle) {
		case "1":
			numberRanksToFill = parseInt(totalRanks * 0.5, 10);
			break;
		case "2":
			numberRanksToFill = parseInt(totalRanks * 0.25, 10);
			break;
		case "3":
			numberRanksToFill = parseInt(totalRanks * 0.125, 10);
			break;
		default:
			numberRanksToFill = 0;
			break;
	}
	var count = 0;
	var square;
	var chosenColumns = [];
	var chosenLines = [];
	while (count < numberRanksToFill) {
		if (Math.random() > 0.5) {
			randColumn = Math.floor((Math.random() * data.settings.height));
			if (contains(chosenColumns, randColumn)) {
				count--;
			}
			else {
				chosenColumns.push(randColumn);
				for (i = 0; i < data.settings.width; i++) {
					if (data.points[randColumn][i] > 0) {
						square = document.getElementById("square_" + i + "." + randColumn);
						square.setAttribute("fill", data.colors[data.points[randColumn][i]]);
						square.setAttribute("opacity", "1");
					}
				}
			}
		}
		else {
			randLine = Math.floor((Math.random() * data.settings.width));
			if (contains(chosenLines, randLine)) {
				count--;
			}
			else {
				chosenLines.push(randLine);
				for (i = 0; i < data.settings.height; i++) {
					if (data.points[i][randLine] > 0) {
						square = document.getElementById("square_" + randLine + "." + i);
						square.setAttribute("fill", data.colors[data.points[i][randLine]]);
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

function changeAreaSize() {
	var pos_x = data.settings.horizontalNumbersLength * size;
	var pos_y = data.settings.verticalNumbersLength * size;
	for (i = 0; i < data.settings.width; i++) {
		for (j = 0; j < data.settings.height; j++) {
			changeMarkSize(pos_x, pos_y, i, j);
			changeMarkAuxSize(pos_x, pos_y, i, j);
			changeSquareSize(pos_x, pos_y, i, j);
			changeSquareAuxSize(pos_x, pos_y, i, j);
		}
	}
	for (i = 0; i <= data.settings.width; i++) {
		if (i < data.settings.width) {
			changeSignalSize(pos_x, pos_y, 0, i);
			for (j = 1; j <= data.verticalNumbers[i].length; j++) {
				changeSquareNumberSize(pos_x, pos_y, 0, i, j);
				changeNumberSize(pos_x, pos_y, 0, i, j);
			}
		}
		changeLineSize(pos_x, pos_y, 0, i);
	}
	for (i = 0; i <= data.settings.height; i++) {
		if (i < data.settings.height) {
			changeSignalSize(pos_x, pos_y, 1, i);
			for (j = 1; j <= data.horizontalNumbers[i].length; j++) {
				changeSquareNumberSize(pos_x, pos_y, 1, i, j);
				changeNumberSize(pos_x, pos_y, 1, i, j);
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

function changeMarkAuxSize(pos_x, pos_y, i, j) {
	var markAux = document.getElementById("mark_aux_" + i + "." + j);
	markAux.setAttribute("font-size", size);
	markAux.setAttribute("x", pos_x + (i + 0.5) * size);
	markAux.setAttribute("y", pos_y + (j + 0.85) * size);
}

function changeSquareSize(pos_x, pos_y, i, j) {
	var square = document.getElementById("square_" + i + "." + j);
	square.setAttribute("height", size);
	square.setAttribute("width", size);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
}

function changeSquareAuxSize(pos_x, pos_y, i, j) {
	var squareAux = document.getElementById("square_aux_" + i + "." + j);
	squareAux.setAttribute("height", size);
	squareAux.setAttribute("width", size);
	squareAux.setAttribute("x", pos_x + i * size);
	squareAux.setAttribute("y", pos_y + j * size);
}

function changeSignalSize(pos_x, pos_y, orientation, i) {
	var signal = document.getElementById("signal_" + orientation + "." + i);
	if (orientation == 0) {
		signal.setAttribute("height", size / 4);
		signal.setAttribute("width", size);
		signal.setAttribute("x", pos_x + i * size);
		signal.setAttribute("y", pos_y + data.settings.height * size);
	} else {
		signal.setAttribute("height", size);
		signal.setAttribute("width", size / 4);
		signal.setAttribute("x", pos_x + data.settings.width * size);
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
		line.setAttribute("y1", pos_y - data.settings.verticalNumbersLength * size);
		line.setAttribute("y2", pos_y + data.settings.height * size);
	} else {
		line.setAttribute("x1", pos_x - data.settings.horizontalNumbersLength * size);
		line.setAttribute("x2", pos_x + data.settings.width * size);
		line.setAttribute("y1", pos_y + i * size);
		line.setAttribute("y2", pos_y + i * size);
	}
}

function changeCalculatedSize(pos_x, pos_y, orientation) {
	var calculated = document.getElementById("calculated_" + orientation);
	calculated.setAttribute("font-size", size * 0.9);
	if (orientation == 0) {
		calculated.setAttribute("x", pos_x + data.settings.width * size + 0.5 * size);
	} else {
		calculated.setAttribute("y", pos_y + data.settings.height * size + 0.8 * size);
	}
}

function refreshCalculatedValues(i, j) {
	var squarePivot = document.getElementById("square_" + i + "." + j);
	if (clicked)
		squarePivot = document.getElementById("square_aux_" + i + "." + j);
	var colorSquare = squarePivot.getAttribute("fill");
	var square, squareAux;
	var calcHorizontal = 1;
	var countRight = i + 1;
	while (countRight <= data.settings.width - 1) {
		square = document.getElementById("square_" + countRight + "." + j);
		squareAux = document.getElementById("square_aux_" + countRight + "." + j);
		if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != data.colors[0])) {
			countRight++;
			calcHorizontal++;
		} else break;
	}
	var countLeft = i - 1;
	while (countLeft >= 0) {
		square = document.getElementById("square_" + countLeft + "." + j);
		squareAux = document.getElementById("square_aux_" + countLeft + "." + j);
		if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != data.colors[0])) {
			countLeft--;
			calcHorizontal++;
		} else break;
	}
	var calcVertical = 1;
	var countDown = j + 1;
	while (countDown <= data.settings.height - 1) {
		square = document.getElementById("square_" + i + "." + countDown);
		squareAux = document.getElementById("square_aux_" + i + "." + countDown);
		if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != data.colors[0])) {
			countDown++;
			calcVertical++;
		} else break;
	}
	var countUp = j - 1;
	while (countUp >= 0) {
		square = document.getElementById("square_" + i + "." + countUp);
		squareAux = document.getElementById("square_aux_" + i + "." + countUp);
		if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != data.colors[0])) {
			countUp--;
			calcVertical++;
		} else break;
	}
	var calculatedHorizontal = document.getElementById("calculated_0");
	var calculatedVertical = document.getElementById("calculated_1");
	if (colorSquare != data.colors[0]) {
		calculatedHorizontal.setAttribute("fill", colorSquare);
		calculatedVertical.setAttribute("fill", colorSquare);
	} else {
		calculatedHorizontal.setAttribute("fill", $CALCULATED_EMPTY_COLOR);
		calculatedVertical.setAttribute("fill", $CALCULATED_EMPTY_COLOR);
	}
	calculatedHorizontal.textContent = calcHorizontal;
	calculatedVertical.textContent = calcVertical;
	var pos_y = data.settings.verticalNumbersLength * size;
	calculatedHorizontal.setAttribute("y", pos_y + size * (j + 1));
	var pos_x = data.settings.horizontalNumbersLength * size;
	calculatedVertical.setAttribute("x", pos_x + size * (i + 0.5));
}

function cleanAllSquaresAndMarksAux() {
	var squareAux, markAux;
	for (i = 0; i < data.settings.width; i++) {
		for (j = 0; j < data.settings.height; j++) {
			squareAux = document.getElementById("square_aux_" + i + "." + j);
			if (squareAux.getAttribute("opacity") == "1") {
				if (i != squareI || j != squareJ) {
					squareAux.setAttribute("fill", data.colors[0]);
					squareAux.setAttribute("opacity", "0");
				}
			}
			markAux = document.getElementById("mark_aux_" + i + "." + j);
			if (markAux.getAttribute("opacity") == "1") {
				if (i != squareI || j != squareJ) {
					markAux.setAttribute("opacity", "0");
				}
			}
		}
	}
}

function refreshSquareAndMark(i, j) {
	squareAux = document.getElementById("square_aux_" + i + "." + j);
	square = document.getElementById("square_" + i + "." + j);
	markAux = document.getElementById("mark_aux_" + i + "." + j);
	mark = document.getElementById("mark_" + i + "." + j);
	var squareColor, markOpacity;
	if (markSelected) {
		squareColor = square.getAttribute("fill");
		if (squareColor == data.colors[0])
			markAux.setAttribute("opacity", "1");
	} else if (colorSquare == data.colors[0]) {
		squareAux.setAttribute("fill", colorSquare);
		squareAux.setAttribute("opacity", "1");
		markAux.setAttribute("opacity", "0.1");
	} else {
		squareColor = square.getAttribute("fill");
		markOpacity = mark.getAttribute("opacity");
		if (squareColor == data.colors[0] && markOpacity == "0") {
			squareAux.setAttribute("fill", colorSquare);
			squareAux.setAttribute("opacity", "1");
		}
	}
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
	squareColor.setAttribute("fill", data.colors[i]);
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
	mark.setAttribute("fill", $MARK_COLOR);
	mark.setAttribute("x", pos_x + (i + 0.5) * size);
	mark.setAttribute("y", pos_y + (j + 0.85) * size);
	mark.setAttribute("opacity", "0");
	mark.textContent = "X";
	document.getElementById("area").appendChild(mark);
}

function createMarkAux(pos_x, pos_y, i, j) {
	var markAux = document.createElementNS($SVG_LIB, "text");
	markAux.setAttribute("id", "mark_aux_" + i + "." + j);
	markAux.setAttribute("text-anchor", "middle");
	markAux.setAttribute("font-family", "serif");
	markAux.setAttribute("font-size", size);
	markAux.setAttribute("fill", $MARK_COLOR);
	markAux.setAttribute("x", pos_x + (i + 0.5) * size);
	markAux.setAttribute("y", pos_y + (j + 0.85) * size);
	markAux.setAttribute("opacity", "0");
	markAux.textContent = "X";
	document.getElementById("area").appendChild(markAux);
}

function createSquare(pos_x, pos_y, i, j) {
	var square = document.createElementNS($SVG_LIB, "rect");
	square.setAttribute("id", "square_" + i + "." + j);
	square.setAttribute("fill", data.colors[0]);
	square.setAttribute("opacity", "0");
	square.setAttribute("height", size);
	square.setAttribute("width", size);
	square.setAttribute("x", pos_x + i * size);
	square.setAttribute("y", pos_y + j * size);
	document.getElementById("area").appendChild(square);
}

function createSquareAux(pos_x, pos_y, i, j) {
	var squareAux = document.createElementNS($SVG_LIB, "rect");
	squareAux.setAttribute("id", "square_aux_" + i + "." + j);
	squareAux.setAttribute("fill", data.colors[0]);
	squareAux.setAttribute("opacity", "0");
	squareAux.setAttribute("height", size);
	squareAux.setAttribute("width", size);
	squareAux.setAttribute("x", pos_x + i * size);
	squareAux.setAttribute("y", pos_y + j * size);
	squareAux.onmouseover = highlightSquare;
	squareAux.onmouseout = fadeSquare;
	squareAux.onmousedown = initColorsChange;
	squareAux.onmousemove = changeColorSquares;
	document.getElementById("area").appendChild(squareAux);
}

function createSignal(pos_x, pos_y, orientation, i) {
	var signal = document.createElementNS($SVG_LIB, "rect");
	signal.setAttribute("id", "signal_" + orientation + "." + i);
	signal.setAttribute("fill", data.colors[0]);
	signal.setAttribute("stroke-width", "0");
	if (orientation == 0) {
		signal.setAttribute("height", size / 4);
		signal.setAttribute("width", size);
		signal.setAttribute("x", pos_x + i * size);
		signal.setAttribute("y", pos_y + data.settings.height * size);
	} else {
		signal.setAttribute("height", size);
		signal.setAttribute("width", size / 4);
		signal.setAttribute("x", pos_x + data.settings.width * size);
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
		squareNumber.setAttribute("fill", data.verticalNumbers[i][j - 1].color);
	} else {
		squareNumber.setAttribute("x", pos_x - j * size);
		squareNumber.setAttribute("y", pos_y + i * size);
		squareNumber.setAttribute("fill", data.horizontalNumbers[i][j - 1].color);
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
	number.setAttribute("fill", data.colors[0]);
	if (orientation == 0) {
		number.setAttribute("x", pos_x + i * size + 0.5 * size);
		number.setAttribute("y", pos_y - j * size + 0.8 * size);
		number.textContent = data.verticalNumbers[i][j - 1].number;
	} else {
		number.setAttribute("x", pos_x - j * size + 0.5 * size);
		number.setAttribute("y", pos_y + i * size + 0.8 * size);
		number.textContent = data.horizontalNumbers[i][j - 1].number;
	}
	number.onclick = markNumber;
	document.getElementById("area").appendChild(number);
}

function createLine(pos_x, pos_y, orientation, i) {
	var line = document.createElementNS($SVG_LIB, "line");
	line.setAttribute("id", "line_" + orientation + "." + i);
	line.setAttribute("stroke", $LINE_COLOR);
	if ((i % data.settings.multiple) == 0)
		line.setAttribute("stroke-width", "2");
	else
		line.setAttribute("stroke-width", "1");
	if (orientation == 0) {
		line.setAttribute("x1", pos_x + i * size);
		line.setAttribute("x2", pos_x + i * size);
		line.setAttribute("y1", pos_y - data.settings.verticalNumbersLength * size);
		line.setAttribute("y2", pos_y + data.settings.height * size);
	} else {
		line.setAttribute("x1", pos_x - data.settings.horizontalNumbersLength * size);
		line.setAttribute("x2", pos_x + data.settings.width * size);
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
	calculated.setAttribute("fill", $CALCULATED_EMPTY_COLOR);
	calculated.textContent = " ";
	if (orientation == 0)
		calculated.setAttribute("x", pos_x + data.settings.width * size + 0.5 * size);
	else
		calculated.setAttribute("y", pos_y + data.settings.height * size + 0.8 * size);
	document.getElementById("area").appendChild(calculated);
}
//#endregion

//#region Event Functions
function markSquareColor(evt) {
	var id = evt.target.getAttribute("id");
	id = id.replace("squareColor_", "");
	colorSelected = data.colors[id];
	evt.target.setAttribute("stroke-width", "3");
	var squareColor;
	for (i = 1; i < data.colors.length; i++) {
		squareColor = document.getElementById("squareColor_" + i);
		if (i != id)
			squareColor.setAttribute("stroke-width", "1");
	}
}

function highlightSquare(evt) {
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_aux_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", $RULE_COLOR);
		if ((i % data.settings.multiple) != 0)
			verticalLine.setAttribute("stroke-width", "2");
		var horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", $RULE_COLOR);
		if ((j % data.settings.multiple) != 0)
			horizontalLine.setAttribute("stroke-width", "2");
		i = i + 1;
		j = j + 1;
		verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", $RULE_COLOR);
		if ((i % data.settings.multiple) != 0)
			verticalLine.setAttribute("stroke-width", "2");
		horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", $RULE_COLOR);
		if ((j % data.settings.multiple) != 0)
			horizontalLine.setAttribute("stroke-width", "2");
	}
}

function fadeSquare(evt) {
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_aux_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", $LINE_COLOR);
		if ((i % data.settings.multiple) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		var horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", $LINE_COLOR);
		if ((j % data.settings.multiple) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
		i = i + 1;
		j = j + 1;
		verticalLine = document.getElementById("line_0." + i);
		verticalLine.setAttribute("stroke", $LINE_COLOR);
		if ((i % data.settings.multiple) != 0)
			verticalLine.setAttribute("stroke-width", "1");
		horizontalLine = document.getElementById("line_1." + j);
		horizontalLine.setAttribute("stroke", $LINE_COLOR);
		if ((j % data.settings.multiple) != 0)
			horizontalLine.setAttribute("stroke-width", "1");
		var calculatedHorizontal = document.getElementById("calculated_0");
		calculatedHorizontal.textContent = "";
		var calculatedVertical = document.getElementById("calculated_1");
		calculatedVertical.textContent = "";
	}
}

function initColorsChange(evt) {
	if (!totalValidated && evt.button != 1) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_aux_", "");
		var idSplited = id.split('.');
		squareI = parseInt(idSplited[0]);
		squareJ = parseInt(idSplited[1]);
		var square = document.getElementById("square_" + squareI + "." + squareJ);
		colorSquare = square.getAttribute("fill");
		var markAux = document.getElementById("mark_aux_" + squareI + "." + squareJ);
		var mark = document.getElementById("mark_" + squareI + "." + squareJ);
		var markOpacity = mark.getAttribute("opacity");
		markSelected = false;
		if (colorSquare == data.colors[0]) {
			if (markOpacity == "0") {
				if (evt.button == 0) {
					evt.target.setAttribute("fill", colorSelected);
					evt.target.setAttribute("opacity", "1");
					square.setAttribute("fill", colorSelected);
					square.setAttribute("opacity", "1");
					colorSquare = colorSelected;
				} else {
					markAux.setAttribute("opacity", "1");
					mark.setAttribute("opacity", "1");
					markSelected = true;
				}
			} else {
				if (evt.button == 0) {
					evt.target.setAttribute("fill", colorSelected);
					evt.target.setAttribute("opacity", "1");
					square.setAttribute("fill", colorSelected);
					square.setAttribute("opacity", "1");
					colorSquare = colorSelected;
				}
				markAux.setAttribute("opacity", "0.1");
				mark.setAttribute("opacity", "0");
			}
		} else {
			if (evt.button == 0) {
				if (colorSquare != colorSelected) {
					evt.target.setAttribute("fill", colorSelected);
					square.setAttribute("fill", colorSelected);
					colorSquare = colorSelected;
				} else {
					evt.target.setAttribute("fill", data.colors[0]);
					evt.target.setAttribute("opacity", "0");
					square.setAttribute("fill", data.colors[0]);
					square.setAttribute("opacity", "0");
					colorSquare = data.colors[0];
				}
			} else {
				evt.target.setAttribute("fill", data.colors[0]);
				evt.target.setAttribute("opacity", "0");
				square.setAttribute("fill", data.colors[0]);
				square.setAttribute("opacity", "0");
				markAux.setAttribute("opacity", "1");
				mark.setAttribute("opacity", "1");
				markSelected = true;
			}
		}
		clicked = true;
		refreshCalculatedValues(squareI, squareJ);
	}
}

function changeColorSquares(evt) {
	if (!totalValidated) {
		var id = evt.target.getAttribute("id");
		id = id.replace("square_aux_", "");
		var idSplited = id.split('.');
		var i = parseInt(idSplited[0]);
		var j = parseInt(idSplited[1]);
		var count;
		if (clicked) {
			cleanAllSquaresAndMarksAux();
			if ((i > squareI) && (j == squareJ)) {
				count = squareI;
				while (count <= i) {
					refreshSquareAndMark(count, squareJ);
					count++;
				}
			}
			else if ((i < squareI) && (j == squareJ)) {
				count = i;
				while (count <= squareI) {
					refreshSquareAndMark(count, squareJ);
					count++;
				}
			}
			else if ((i == squareI) && (j > squareJ)) {
				count = squareJ;
				while (count <= j) {
					refreshSquareAndMark(squareI, count);
					count++;
				}
			}
			else if ((i == squareI) && (j < squareJ)) {
				count = j;
				while (count <= squareJ) {
					refreshSquareAndMark(squareI, count);
					count++;
				}
			}
		}
		refreshCalculatedValues(i, j);
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
			number.setAttribute("fill", data.colors[0]);
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
		if (fill == data.colors[0]) {
			squareNumber.setAttribute("opacity", "0");
			evt.target.setAttribute("fill", squareNumber.getAttribute("fill"));
			evt.target.setAttribute("font-weight", "bold");
		}
		else {
			squareNumber.setAttribute("opacity", "1");
			evt.target.setAttribute("fill", data.colors[0]);
			evt.target.setAttribute("font-weight", "normal");
		}
	}
}
//#endregion