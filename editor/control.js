const $SVG_LIB = "http://www.w3.org/2000/svg";

var size = 20;
var width = 5;
var height = 5;
var maxDimension = 50;
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
    for (i = 0; i < maxDimension; i++) {
        for (j = 0; j < maxDimension; j++) {
            createSquare(i, j);
        }
    }
}

function setWidthPuzzle() {
    width = parseInt(document.getElementById("widthInput").value);
    refresh();
}

function setHeigthPuzzle() {
    height = parseInt(document.getElementById("heigthInput").value);
    refresh();
}

function onColorChange() {
    currentColor = document.getElementById("colorInput").value;
    if (!presetColors.includes(currentColor)) {
        var colorList = document.getElementById("presetColors");
        var newColor = document.createElement("option");
        newColor.value = currentColor;
        colorList.appendChild(newColor);
        presetColors.push(currentColor);
    }
}

function increaseAreaSize() {
    if (size < 30)
        size += 1;
    changeAreaSize();
}

function decreaseAreaSize() {
    if (size > 10)
        size -= 1;
    changeAreaSize();
}

function exportJson() {
    var data = { colors: ["#ffffff"], points: [] };
    for (i = 0; i < height; i++) {
        data.points[i] = [];
        for (j = 0; j < width; j++) {
            var square = document.getElementById("square_" + j + "." + i);
            var color = square.getAttribute("fill");
            if (!data.colors.includes(color)) {
                data.colors.push(color);
            }
            data.points[i].push(data.colors.findIndex(x => x == color));
        }
    }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.download = 'puzzle.json';
    a.href = window.URL.createObjectURL(blob);
    a.click();
}
//#endregion

//#region Auxiliar Functions
function refresh() {
    var area = document.getElementById("area");
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
    for (i = 0; i <= width; i++) {
        createLine(0, i);
    }
    for (i = 0; i <= height; i++) {
        createLine(1, i);
    }
    for (i = 0; i < maxDimension; i++) {
        for (j = 0; j < maxDimension; j++) {
            var square = document.getElementById("square_" + j + "." + i);
            var color = square.getAttribute("fill");
            if (color != "#ffffff") {
                if (i >= height || j >= width)
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
            }
        }
    }
}

function changeAreaSize() {
    for (i = 0; i <= width; i++) {
        changeLineSize(0, i);
    }
    for (i = 0; i <= height; i++) {
        changeLineSize(1, i);
    }
    for (i = 0; i < maxDimension; i++) {
        for (j = 0; j < maxDimension; j++) {
            changeSquareSize(i, j);
        }
    }
}

function changeLineSize(orientation, i) {
    var line = document.getElementById("line_" + orientation + "." + i);
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
}

function changeSquareSize(i, j) {
    var square = document.getElementById("square_" + i + "." + j);
    square.setAttribute("height", size * 0.95);
    square.setAttribute("width", size * 0.95);
    square.setAttribute("x", i * size);
    square.setAttribute("y", j * size);
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
    document.getElementById("squares").appendChild(square);
}
//#endregion

//#region Event Functions
function highlightSquare(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_", "");
    var idSplited = id.split('.');
    var i = parseInt(idSplited[0]);
    var j = parseInt(idSplited[1]);
    if (i < width && j < height) {
        var verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", "#ff00ff");
        if ((i % 5) != 0)
            verticalLine.setAttribute("stroke-width", "2");
        i = i + 1;
        verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", "#ff00ff");
        if ((i % 5) != 0)
            verticalLine.setAttribute("stroke-width", "2");
        var horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", "#ff00ff");
        if ((j % 5) != 0)
            horizontalLine.setAttribute("stroke-width", "2");
        j = j + 1;
        horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", "#ff00ff");
        if ((j % 5) != 0)
            horizontalLine.setAttribute("stroke-width", "2");
    }
}

function fadeSquare(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_", "");
    var idSplited = id.split('.');
    var i = parseInt(idSplited[0]);
    var j = parseInt(idSplited[1]);
    if (i < width && j < height) {
        var verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", "#808080");
        if ((i % 5) != 0)
            verticalLine.setAttribute("stroke-width", "1");
        i = i + 1;
        verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", "#808080");
        if ((i % 5) != 0)
            verticalLine.setAttribute("stroke-width", "1");
        var horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", "#808080");
        if ((j % 5) != 0)
            horizontalLine.setAttribute("stroke-width", "1");
        j = j + 1;
        horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", "#808080");
        if ((j % 5) != 0)
            horizontalLine.setAttribute("stroke-width", "1");
    }
}

function initColorsChange(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_", "");
    var idSplited = id.split('.');
    squareI = parseInt(idSplited[0]);
    squareJ = parseInt(idSplited[1]);
    if (squareI < width && squareJ < height) {
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
                if (count < width) {
                    var square = document.getElementById("square_" + count + "." + squareJ);
                    square.setAttribute("fill", colorSquare);
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
                if (count < height) {
                    var square = document.getElementById("square_" + squareI + "." + count);
                    square.setAttribute("fill", colorSquare);
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