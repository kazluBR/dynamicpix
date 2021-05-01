const $SVG_LIB = "http://www.w3.org/2000/svg";

var width = 10;
var height = 10;
var size = 20;
var currentColor = "#000000";
var presetColors = [currentColor];
var clicked = false;

var squareI;
var squareJ;
var colorSquare;

//#region Main Functions
function initialize() {
    for (i = 0; i <= width; i++) {
        createLine(0, i);
    }
    for (i = 0; i <= height; i++) {
        createLine(1, i);
    }
    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            createSquare(i, j);
        }
    }
}

function onColorChange() {
    currentColor = document.getElementById("color").value;
    if (!presetColors.includes(currentColor)) {
        var colorList = document.getElementById("presetColors");
        var newColor = document.createElement("option");
        newColor.value = currentColor;
        colorList.appendChild(newColor);
        presetColors.push(currentColor);
    }
}
//#endregion

//#region Create SVG Elements Functions
function createLine(orientation, i) {
    var line = document.createElementNS($SVG_LIB, "line");
    line.setAttribute("id", "line_" + orientation + "." + i);
    line.setAttribute("stroke", "#808080");
    if ((i % 5) == 0)
        line.setAttribute("stroke-width", "2");
    else
        line.setAttribute("stroke-width", "1");
    if (orientation == 0) {
        line.setAttribute("x1", i * size);
        line.setAttribute("x2", i * size);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", height * size);
    } else {
        line.setAttribute("x1", 0);
        line.setAttribute("x2", width * size);
        line.setAttribute("y1", i * size);
        line.setAttribute("y2", i * size);
    }
    document.getElementById("area").appendChild(line);
}

function createSquare(i, j) {
    var square = document.createElementNS($SVG_LIB, "rect");
    square.setAttribute("id", "square_" + i + "." + j);
    square.setAttribute("height", size * 0.95);
    square.setAttribute("width", size * 0.95);
    square.setAttribute("x", i * size);
    square.setAttribute("y", j * size);
    square.setAttribute("stroke", "#808080");
    square.setAttribute("fill", "#ffffff");
    square.setAttribute("opacity", "0");
    square.onmouseover = highlightSquare;
    square.onmouseout = fadeSquare;
    square.onmousedown = initColorsChange;
    square.onmousemove = changeColorSquares;
    square.onmouseup = endColorsChange;
    document.getElementById("area").appendChild(square);
}
//#endregion

//#region Event Functions
function highlightSquare(evt) {
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

function fadeSquare(evt) {
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
}

function initColorsChange(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_", "");
    var idSplited = id.split('.');
    squareI = parseInt(idSplited[0]);
    squareJ = parseInt(idSplited[1]);
    colorSquare = evt.target.getAttribute("fill");
    if (colorSquare == "#ffffff") {
        evt.target.setAttribute("fill", currentColor);
        evt.target.setAttribute("opacity", "1");
        colorSquare = currentColor;
    } else {
        if (colorSquare == currentColor) {
            evt.target.setAttribute("fill", "#ffffff");
            evt.target.setAttribute("opacity", "0");
            colorSquare = "#ffffff";
        } else {
            evt.target.setAttribute("fill", currentColor);
            colorSquare = currentColor;
        }
    }
    clicked = true;
}

function changeColorSquares(evt) {
    if (clicked) {
        var id = evt.target.getAttribute("id");
        id = id.replace("square_", "");
        var idSplited = id.split('.');
        var i = parseInt(idSplited[0]);
        var j = parseInt(idSplited[1]);
        if ((i >= squareI) && (j == squareJ)) {
            var count = squareI;
            while (count <= i) {
                var square = document.getElementById("square_" + count + "." + squareJ);
                square.setAttribute("fill", colorSquare);
                if (colorSquare == "#ffffff")
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
                count++;
            }
        }
        else if ((i <= squareI) && (j == squareJ)) {
            var count = i;
            while (count <= squareI) {
                var square = document.getElementById("square_" + count + "." + squareJ);
                square.setAttribute("fill", colorSquare);
                if (colorSquare == "#ffffff")
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
                count++;
            }
        }
        else if ((i == squareI) && (j >= squareJ)) {
            var count = squareJ;
            while (count <= j) {
                var square = document.getElementById("square_" + squareI + "." + count);
                square.setAttribute("fill", colorSquare);
                if (colorSquare == "#ffffff")
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
                count++;
            }
        }
        else if ((i == squareI) && (j <= squareJ)) {
            var count = j;
            while (count <= squareJ) {
                var square = document.getElementById("square_" + squareI + "." + count);
                square.setAttribute("fill", colorSquare);
                if (colorSquare == "#ffffff")
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
                count++;
            }
        }
    }
}

function endColorsChange(evt) {
    clicked = false;
}
//#endregion