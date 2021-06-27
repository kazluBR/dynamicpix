const SVG_LIB = "http://www.w3.org/2000/svg";
const SQUARE_COLOR_SIZE = 40;
const MIN_DIMENSION = 3;
const MAX_WIDTH_DIMENSION = 125;
const MAX_HEIGTH_DIMENSION = 50;
const TRANSLATE_X = 10;
const TRANSLATE_Y = 10;
const LINE_COLOR = "#808080";
const RULE_COLOR = "#ff00ff";
const ARROW_COLOR = "#ff00ff";
const CALCULATED_EMPTY_COLOR = "#808080";

class editor {

    #size;
    #width;
    #height;
    #gridLength;
    #palette;
    #backgroundColor;
    #currentColor;
    #clicked;
    #states;
    #currentKey;
    #squareI;
    #squareJ;
    #colorSquare;

    constructor(config = {}) {
        this.#size = config.size || 20;
        this.#width = config.width || 5;
        this.#height = config.height || 5;
        this.#gridLength = config.gridLength || 5;
        this.#palette = config.palette || ["#ffffff", "#8e3179", "#ca3435", "#ff91a4", "#fcd667", "#93dfb8", "#b5b35c", "#02a4d3", "#00468c"];
        this.#backgroundColor = this.#palette[0];
        this.#currentColor = this.#palette[1];
        this.#clicked = false;
        this.#states = [];
        this.#currentKey = 0;
        this.#squareI = null;
        this.#squareJ = null;
        this.#colorSquare = null;
        document.body.onmousedown = (e) => {
            if (e.button == 1) {
                this.#switchSquareColor();
                return false;
            }
        }
        document.body.onmouseup = () => this.#endColorsChange();
    }

    //#region Main Functions
    init() {
        this.#createSvgDocument();
        for (let i = 1; i < this.#palette.length; i++) {
            this.#createSquareColor(i);
        }
        this.#createBackground();
        for (let i = 0; i < MAX_WIDTH_DIMENSION; i++) {
            for (let j = 0; j < MAX_HEIGTH_DIMENSION; j++) {
                this.#createSquare(i, j);
                this.#createSquareAux(i, j);
            }
        }
        for (let i = 0; i <= this.#width; i++) {
            this.#createLine(0, i);
        }
        for (let i = 0; i <= this.#height; i++) {
            this.#createLine(1, i);
        }
        this.#createCalculated(0);
        this.#createCalculated(1);
        this.#createDecreaseArrow(0);
        this.#createIncreaseArrow(0);
        this.#createDecreaseArrow(1);
        this.#createIncreaseArrow(1);
        this.#createDecreaseArrow(2);
        this.#createIncreaseArrow(2);
        this.#saveState();
    }

    maximize(value) {
        this.#size += value || 1;
        this.#changeAreaSize();
    }

    minimize(value) {
        this.#size -= value || 1;
        if (this.#size < 1)
            this.#size += value || 1;
        else
            this.#changeAreaSize();
    }

    undo() {
        if (this.#currentKey > 0) {
            this.#currentKey -= 1;
            this.#recoverState();
        }
    }

    redo() {
        if (this.#currentKey < this.#states.length - 1) {
            this.#currentKey += 1;
            this.#recoverState();
        }
    }

    setGridLength(value) {
        if (value > 1) {
            this.#gridLength = value;
            this.#width = value;
            this.#height = value;
            this.#refreshArea();
        }
    }

    setPalette(list) {
        this.#palette = list;
        this.#refreshSquareColors();
        let backgroundColorOld = this.#backgroundColor;
        this.#backgroundColor = list[0];
        this.#refreshBackground(backgroundColorOld);
        this.#currentColor = list[1];

    }

    exportJson() {
        let data = {
            colors: [this.#backgroundColor],
            settings: {
                width: this.#width,
                height: this.#height,
                gridLength: this.#gridLength
            },
            points: [],
            horizontalNumbers: [],
            verticalNumbers: []
        };
        let square, color;
        for (let i = 0; i < this.#height; i++) {
            data.points[i] = [];
            for (let j = 0; j < this.#width; j++) {
                square = document.getElementById("square_" + j + "." + i);
                color = square.getAttribute("fill");
                if (!data.colors.includes(color)) {
                    data.colors.push(color);
                }
                data.points[i].push(data.colors.findIndex(x => x == color));
            }
        }
        data.horizontalNumbers = this.#getHorizontalNumbers(data);
        data.verticalNumbers = this.#getVerticalNumbers(data);
        data.settings.horizontalNumbersLength = this.#getMaxNumbers(data.horizontalNumbers);
        data.settings.verticalNumbersLength = this.#getMaxNumbers(data.verticalNumbers);
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.download = 'puzzle.json';
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }
    //#endregion

    //#region Auxiliar Functions
    #createSvgDocument() {
        let editorElem = document.getElementById("editor");
        editorElem.oncontextmenu = function () {
            return false;
        }
        let svg = document.createElementNS(SVG_LIB, "svg");
        svg.setAttribute("id", "svg");
        let transform = "translate(" + TRANSLATE_X + "," + TRANSLATE_Y + ")";
        let palette = document.createElementNS(SVG_LIB, "g");
        palette.setAttribute("transform", transform);
        palette.setAttribute("id", "palette");
        svg.appendChild(palette);
        let calculatedY = TRANSLATE_Y + SQUARE_COLOR_SIZE + SQUARE_COLOR_SIZE / 2;
        transform = "translate(" + TRANSLATE_X + "," + calculatedY + ")";
        svg.setAttribute("height", this.#size * (this.#height + 3) + TRANSLATE_Y + SQUARE_COLOR_SIZE * 1.5);
        if (this.#size * (this.#width + 3) > SQUARE_COLOR_SIZE * this.#palette.length) {
            svg.setAttribute("width", this.#size * (this.#width + 3) + TRANSLATE_X);
        } else {
            svg.setAttribute("width", SQUARE_COLOR_SIZE * this.#palette.length + TRANSLATE_X);
        }
        let components = document.createElementNS(SVG_LIB, "g");
        components.setAttribute("id", "components");
        components.setAttribute("transform", transform);
        svg.appendChild(components);
        let main = document.createElementNS(SVG_LIB, "g");
        main.setAttribute("id", "main");
        main.setAttribute("transform", transform);
        svg.appendChild(main);
        let aux = document.createElementNS(SVG_LIB, "g");
        aux.setAttribute("id", "aux");
        aux.setAttribute("transform", transform);
        svg.appendChild(aux);
        let arrows = document.createElementNS(SVG_LIB, "g");
        arrows.setAttribute("id", "arrows");
        arrows.setAttribute("transform", transform);
        svg.appendChild(arrows);
        editorElem.appendChild(svg);
    }

    #createSquareColor(i) {
        let squareColor = document.createElementNS(SVG_LIB, "rect");
        squareColor.setAttribute("id", "squareColor_" + i);
        if (i == 1)
            squareColor.setAttribute("stroke-width", "3");
        else
            squareColor.setAttribute("stroke-width", "1");
        squareColor.setAttribute("stroke", "black");
        squareColor.setAttribute("height", SQUARE_COLOR_SIZE);
        squareColor.setAttribute("width", SQUARE_COLOR_SIZE);
        squareColor.setAttribute("fill", this.#palette[i]);
        squareColor.setAttribute("x", ((i - 1) * SQUARE_COLOR_SIZE) + SQUARE_COLOR_SIZE / 8);
        squareColor.setAttribute("y", SQUARE_COLOR_SIZE / 8);
        squareColor.onclick = (evt) => this.#markSquareColor(evt);
        document.getElementById("palette").appendChild(squareColor);
    }

    #createBackground() {
        let background = document.createElementNS(SVG_LIB, "rect");
        background.setAttribute("id", "background");
        background.setAttribute("fill", this.#backgroundColor);
        background.setAttribute("height", this.#size * this.#height);
        background.setAttribute("width", this.#size * this.#width);
        document.getElementById("components").appendChild(background);
    }

    #createSquare(i, j) {
        let square = document.createElementNS(SVG_LIB, "rect");
        square.setAttribute("id", "square_" + i + "." + j);
        square.setAttribute("height", this.#size * 0.9);
        square.setAttribute("width", this.#size * 0.9);
        square.setAttribute("x", i * this.#size + this.#size * 0.05);
        square.setAttribute("y", j * this.#size + this.#size * 0.05);
        square.setAttribute("fill", this.#backgroundColor);
        square.setAttribute("opacity", "0");
        document.getElementById("main").appendChild(square);
    }

    #createSquareAux(i, j) {
        let squareAux = document.createElementNS(SVG_LIB, "rect");
        squareAux.setAttribute("id", "square_aux_" + i + "." + j);
        squareAux.setAttribute("height", this.#size * 0.9);
        squareAux.setAttribute("width", this.#size * 0.9);
        squareAux.setAttribute("x", i * this.#size + this.#size * 0.05);
        squareAux.setAttribute("y", j * this.#size + this.#size * 0.05);
        squareAux.setAttribute("fill", this.#backgroundColor);
        squareAux.setAttribute("opacity", "0");
        squareAux.onmouseover = (evt) => this.#highlightSquare(evt);
        squareAux.onmouseout = (evt) => this.#fadeSquare(evt);
        squareAux.onmousedown = (evt) => this.#initColorsChange(evt);
        squareAux.onmousemove = (evt) => this.#changeColorSquares(evt);
        document.getElementById("aux").appendChild(squareAux);
    }

    #createLine(orientation, i) {
        let line = document.createElementNS(SVG_LIB, "line");
        line.setAttribute("id", "line_" + orientation + "." + i);
        line.setAttribute("stroke", LINE_COLOR);
        if ((i % this.#gridLength) == 0)
            line.setAttribute("stroke-width", "2");
        else
            line.setAttribute("stroke-width", "1");
        if (orientation == 0) {
            line.setAttribute("x1", i * this.#size);
            line.setAttribute("x2", i * this.#size);
            line.setAttribute("y1", 0);
            line.setAttribute("y2", this.#height * this.#size);
        } else {
            line.setAttribute("x1", 0);
            line.setAttribute("x2", this.#width * this.#size);
            line.setAttribute("y1", i * this.#size);
            line.setAttribute("y2", i * this.#size);
        }
        document.getElementById("components").appendChild(line);
    }

    #createCalculated(orientation) {
        let calculated = document.createElementNS(SVG_LIB, "text");
        calculated.setAttribute("id", "calculated_" + orientation);
        calculated.setAttribute("font-family", "serif");
        calculated.setAttribute("font-size", this.#size);
        calculated.setAttribute("font-weight", "bold");
        calculated.setAttribute("fill", CALCULATED_EMPTY_COLOR);
        if (orientation == 0) {
            calculated.setAttribute("text-anchor", "start");
            calculated.setAttribute("x", (this.#width + 0.5) * this.#size);
        } else {
            calculated.setAttribute("text-anchor", "middle");
            calculated.setAttribute("y", (this.#height + 1) * this.#size);
        }
        document.getElementById("components").appendChild(calculated);
    }

    #createDecreaseArrow(orientation) {
        let decreaseArrow = document.createElementNS(SVG_LIB, "text");
        decreaseArrow.setAttribute("id", "decrease_arrow_" + orientation);
        decreaseArrow.setAttribute("font-size", this.#size);
        decreaseArrow.setAttribute("fill", ARROW_COLOR);
        decreaseArrow.setAttribute("opacity", "0.5");
        if (orientation == 0) {
            decreaseArrow.setAttribute("text-anchor", "end");
            decreaseArrow.setAttribute("x", (this.#width * this.#size) / 2 + this.#size / 2);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) + this.#size);
            decreaseArrow.textContent = "\uD83E\uDC81"; // ↑
        } else if (orientation == 1) {
            decreaseArrow.setAttribute("text-anchor", "middle");
            decreaseArrow.setAttribute("x", (this.#width * this.#size) + this.#size);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) / 2 + this.#size / 4);
            decreaseArrow.textContent = "\uD83E\uDC80"; // ←
        } else {
            decreaseArrow.setAttribute("text-anchor", "middle");
            decreaseArrow.setAttribute("x", (this.#width * this.#size) + this.#size);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) + this.#size);
            decreaseArrow.textContent = "\uD83E\uDC84"; // ↖
        }
        decreaseArrow.onmouseover = (evt) => this.#highlightDecreaseArrow(evt);
        decreaseArrow.onmouseout = (evt) => this.#fadeDecreaseArrow(evt);
        decreaseArrow.onclick = (evt) => this.#decreaseSize(evt);
        document.getElementById("arrows").appendChild(decreaseArrow);
    }

    #createIncreaseArrow(orientation) {
        let increaseArrow = document.createElementNS(SVG_LIB, "text");
        increaseArrow.setAttribute("id", "increase_arrow_" + orientation);
        increaseArrow.setAttribute("font-size", this.#size);
        increaseArrow.setAttribute("fill", ARROW_COLOR);
        increaseArrow.setAttribute("opacity", "0.5");
        if (orientation == 0) {
            increaseArrow.setAttribute("text-anchor", "end");
            increaseArrow.setAttribute("x", (this.#width * this.#size) / 2 + this.#size / 2);
            increaseArrow.setAttribute("y", (this.#height * this.#size) + 2 * this.#size + this.#size / 4);
            increaseArrow.textContent = "\uD83E\uDC83"; // ↓
        } else if (orientation == 1) {
            increaseArrow.setAttribute("text-anchor", "middle");
            increaseArrow.setAttribute("x", (this.#width * this.#size) + 2 * this.#size);
            increaseArrow.setAttribute("y", (this.#height * this.#size) / 2 + this.#size / 4);
            increaseArrow.textContent = "\uD83E\uDC82"; // →
        } else {
            increaseArrow.setAttribute("text-anchor", "middle");
            increaseArrow.setAttribute("x", (this.#width * this.#size) + 2 * this.#size - this.#size / 4);
            increaseArrow.setAttribute("y", (this.#height * this.#size) + 2 * this.#size - this.#size / 4);
            increaseArrow.textContent = "\uD83E\uDC86"; // ↘
        }
        increaseArrow.onmouseover = (evt) => this.#highlightIncreaseArrow(evt);
        increaseArrow.onmouseout = (evt) => this.#fadeIncreaseArrow(evt);
        increaseArrow.onclick = (evt) => this.#increaseSize(evt);
        document.getElementById("arrows").appendChild(increaseArrow);
    }

    #saveState() {
        while (this.#currentKey < this.#states.length - 1) {
            this.#states.pop();
        }
        this.#states.push((new XMLSerializer).serializeToString(document.getElementById("main")));
        if (this.#states.length > 1) {
            this.#currentKey += 1;
        }
    }

    #recoverState() {
        let squares = document.getElementById("main");
        while (squares.firstChild) {
            squares.removeChild(squares.firstChild);
        }
        let squaresRecover = (new DOMParser()).parseFromString(this.#states[this.#currentKey], "image/svg+xml").documentElement;
        while (squaresRecover.firstChild) {
            squares.appendChild(squaresRecover.firstChild);
        }
        this.#changeAreaSize();
        this.#refreshArea();
    }

    #changeAreaSize() {
        this.#changeSvgDocumentSize();
        this.#changeBackgroundSize();
        for (let i = 0; i <= this.#width; i++) {
            this.#changeLineSize(0, i);
        }
        for (let i = 0; i <= this.#height; i++) {
            this.#changeLineSize(1, i);
        }
        for (let i = 0; i < MAX_WIDTH_DIMENSION; i++) {
            for (let j = 0; j < MAX_HEIGTH_DIMENSION; j++) {
                this.#changeSquareSize(i, j);
                this.#changeSquareAuxSize(i, j);
            }
        }
        this.#changeCalculatedSize(0);
        this.#changeCalculatedSize(1);
        this.#changeDecreaseArrowSize(0);
        this.#changeIncreaseArrowSize(0);
        this.#changeDecreaseArrowSize(1);
        this.#changeIncreaseArrowSize(1);
        this.#changeDecreaseArrowSize(2);
        this.#changeIncreaseArrowSize(2);
    }

    #changeSvgDocumentSize() {
        let svg = document.getElementById("svg");
        svg.setAttribute("height", this.#size * (this.#height + 3) + TRANSLATE_Y + SQUARE_COLOR_SIZE * 1.5);
        if (this.#size * (this.#width + 3) > SQUARE_COLOR_SIZE * this.#palette.length) {
            svg.setAttribute("width", this.#size * (this.#width + 3) + TRANSLATE_X);
        } else {
            svg.setAttribute("width", SQUARE_COLOR_SIZE * this.#palette.length + TRANSLATE_X);
        }
    }

    #changeBackgroundSize() {
        let background = document.getElementById("background");
        background.setAttribute("height", this.#size * this.#height);
        background.setAttribute("width", this.#size * this.#width);
    }

    #changeLineSize(orientation, i) {
        let line = document.getElementById("line_" + orientation + "." + i);
        if (orientation == 0) {
            line.setAttribute("x1", i * this.#size);
            line.setAttribute("x2", i * this.#size);
            line.setAttribute("y1", 0);
            line.setAttribute("y2", this.#height * this.#size);
        } else {
            line.setAttribute("x1", 0);
            line.setAttribute("x2", this.#width * this.#size);
            line.setAttribute("y1", i * this.#size);
            line.setAttribute("y2", i * this.#size);
        }
    }

    #changeSquareSize(i, j) {
        let square = document.getElementById("square_" + i + "." + j);
        square.setAttribute("height", this.#size * 0.9);
        square.setAttribute("width", this.#size * 0.9);
        square.setAttribute("x", i * this.#size + this.#size * 0.05);
        square.setAttribute("y", j * this.#size + this.#size * 0.05);
    }

    #changeSquareAuxSize(i, j) {
        let squareAux = document.getElementById("square_aux_" + i + "." + j);
        squareAux.setAttribute("height", this.#size * 0.9);
        squareAux.setAttribute("width", this.#size * 0.9);
        squareAux.setAttribute("x", i * this.#size + this.#size * 0.05);
        squareAux.setAttribute("y", j * this.#size + this.#size * 0.05);
    }

    #changeCalculatedSize(orientation) {
        let calculated = document.getElementById("calculated_" + orientation);
        calculated.setAttribute("font-size", this.#size);
        if (orientation == 0)
            calculated.setAttribute("x", (this.#width + 0.5) * this.#size);
        else
            calculated.setAttribute("y", (this.#height + 1) * this.#size);
    }

    #changeDecreaseArrowSize(orientation) {
        let decreaseArrow = document.getElementById("decrease_arrow_" + orientation);
        decreaseArrow.setAttribute("font-size", this.#size);
        if (orientation == 0) {
            decreaseArrow.setAttribute("x", (this.#width * this.#size) / 2 + this.#size / 2);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) + this.#size);
        } else if (orientation == 1) {
            decreaseArrow.setAttribute("x", (this.#width * this.#size) + this.#size);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) / 2 + this.#size / 4);
        } else {
            decreaseArrow.setAttribute("x", (this.#width * this.#size) + this.#size);
            decreaseArrow.setAttribute("y", (this.#height * this.#size) + this.#size);
        }
    }

    #changeIncreaseArrowSize(orientation) {
        let increaseArrow = document.getElementById("increase_arrow_" + orientation);
        increaseArrow.setAttribute("font-size", this.#size);
        if (orientation == 0) {
            increaseArrow.setAttribute("x", (this.#width * this.#size) / 2 + this.#size / 2);
            increaseArrow.setAttribute("y", (this.#height * this.#size) + 2 * this.#size + this.#size / 4);
        } else if (orientation == 1) {
            increaseArrow.setAttribute("x", (this.#width * this.#size) + 2 * this.#size);
            increaseArrow.setAttribute("y", (this.#height * this.#size) / 2 + this.#size / 4);
        } else {
            increaseArrow.setAttribute("x", (this.#width * this.#size) + 2 * this.#size - this.#size / 4);
            increaseArrow.setAttribute("y", (this.#height * this.#size) + 2 * this.#size - this.#size / 4);
        }
    }

    #refreshArea() {
        this.#changeSvgDocumentSize();
        let components = document.getElementById("components");
        while (components.firstChild) {
            components.removeChild(components.firstChild);
        }
        this.#createBackground();
        for (let i = 0; i <= this.#width; i++) {
            this.#createLine(0, i);
        }
        for (let i = 0; i <= this.#height; i++) {
            this.#createLine(1, i);
        }
        let arrows = document.getElementById("arrows");
        while (arrows.firstChild) {
            arrows.removeChild(arrows.firstChild);
        }
        this.#createCalculated(0);
        this.#createCalculated(1);
        this.#createDecreaseArrow(0);
        this.#createIncreaseArrow(0);
        this.#createDecreaseArrow(1);
        this.#createIncreaseArrow(1);
        this.#createDecreaseArrow(2);
        this.#createIncreaseArrow(2);
        for (let i = 0; i < MAX_WIDTH_DIMENSION; i++) {
            for (let j = 0; j < MAX_HEIGTH_DIMENSION; j++) {
                let square = document.getElementById("square_" + i + "." + j);
                let color = square.getAttribute("fill");
                if (color != this.#backgroundColor) {
                    if (i >= this.#width || j >= this.#height)
                        square.setAttribute("opacity", "0");
                    else
                        square.setAttribute("opacity", "1");
                }
            }
        }
    }

    #refreshCalculatedValues(i, j) {
        if (i < this.#width && j < this.#height) {
            let squarePivot = document.getElementById("square_" + i + "." + j);
            if (this.#clicked)
                squarePivot = document.getElementById("square_aux_" + i + "." + j);
            let colorSquare = squarePivot.getAttribute("fill");
            let square, squareAux;
            let calcHorizontal = 1;
            let countRight = i + 1;
            while (countRight <= this.#width - 1) {
                square = document.getElementById("square_" + countRight + "." + j);
                squareAux = document.getElementById("square_aux_" + countRight + "." + j);
                if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != this.#backgroundColor)) {
                    countRight++;
                    calcHorizontal++;
                } else break;
            }
            let countLeft = i - 1;
            while (countLeft >= 0) {
                square = document.getElementById("square_" + countLeft + "." + j);
                squareAux = document.getElementById("square_aux_" + countLeft + "." + j);
                if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != this.#backgroundColor)) {
                    countLeft--;
                    calcHorizontal++;
                } else break;
            }
            let calcVertical = 1;
            let countDown = j + 1;
            while (countDown <= this.#height - 1) {
                square = document.getElementById("square_" + i + "." + countDown);
                squareAux = document.getElementById("square_aux_" + i + "." + countDown);
                if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != this.#backgroundColor)) {
                    countDown++;
                    calcVertical++;
                } else break;
            }
            let countUp = j - 1;
            while (countUp >= 0) {
                square = document.getElementById("square_" + i + "." + countUp);
                squareAux = document.getElementById("square_aux_" + i + "." + countUp);
                if (square.getAttribute("fill") == colorSquare || (squareAux.getAttribute("fill") == colorSquare && colorSquare != this.#backgroundColor)) {
                    countUp--;
                    calcVertical++;
                } else break;
            }
            let calculatedHorizontal = document.getElementById("calculated_0");
            let calculatedVertical = document.getElementById("calculated_1");
            if (colorSquare != this.#backgroundColor) {
                calculatedHorizontal.setAttribute("fill", colorSquare);
                calculatedVertical.setAttribute("fill", colorSquare);
            } else {
                calculatedHorizontal.setAttribute("fill", CALCULATED_EMPTY_COLOR);
                calculatedVertical.setAttribute("fill", CALCULATED_EMPTY_COLOR);
            }
            calculatedHorizontal.textContent = calcHorizontal;
            calculatedVertical.textContent = calcVertical;
            calculatedHorizontal.setAttribute("y", this.#size * (j + 1));
            calculatedVertical.setAttribute("x", this.#size * (i + 0.5));
        }
    }

    #cleanAllSquaresAux() {
        var squareAux;
        for (let i = 0; i < this.#width; i++) {
            for (let j = 0; j < this.#height; j++) {
                squareAux = document.getElementById("square_aux_" + i + "." + j);
                if (squareAux.getAttribute("opacity") == "1") {
                    squareAux.setAttribute("fill", this.#backgroundColor);
                    squareAux.setAttribute("opacity", "0");
                }
            }
        }
    }

    #refreshSquareAux(i, j) {
        let squareAux = document.getElementById("square_aux_" + i + "." + j);
        let square = document.getElementById("square_" + i + "." + j);
        if (this.#colorSquare == this.#backgroundColor) {
            squareAux.setAttribute("fill", this.#colorSquare);
            squareAux.setAttribute("opacity", "1");
        } else {
            let squareColor = square.getAttribute("fill");
            if (squareColor == this.#backgroundColor) {
                squareAux.setAttribute("fill", this.#colorSquare);
                squareAux.setAttribute("opacity", "1");
            }
        }
    }

    #refreshSquareColors() {
        let palette = document.getElementById("palette");
        while (palette.firstChild) {
            palette.removeChild(palette.firstChild);
        }
        for (let i = 1; i < this.#palette.length; i++) {
            this.#createSquareColor(i);
        }
    }

    #refreshBackground(backgroundColorOld) {
        let background = document.getElementById("background");
        background.setAttribute("fill", this.#backgroundColor);
        let square, squareAux;
        for (let i = 0; i < MAX_WIDTH_DIMENSION; i++) {
            for (let j = 0; j < MAX_HEIGTH_DIMENSION; j++) {
                squareAux = document.getElementById("square_aux_" + i + "." + j);
                squareAux.setAttribute("fill", this.#backgroundColor);
                square = document.getElementById("square_" + i + "." + j);
                if (square.getAttribute("fill") == backgroundColorOld)
                    square.setAttribute("fill", this.#backgroundColor);
            }
        }
    }

    #getHorizontalNumbers(data) {
        var horizontalNumbers = [];
        for (let k = 0; k < data.points.length; k++)
            horizontalNumbers[k] = [];
        var count, aux, counting;
        for (let i = 0; i < data.points.length; i++) {
            count = 0;
            aux = -1;
            counting = false;
            for (let j = data.points[0].length - 1; j >= 0; j--) {
                if (counting) {
                    count++;
                    if (data.points[i][j] == 0 || data.points[i][j] != aux) {
                        if (data.points[i][j] == 0)
                            counting = false;
                        horizontalNumbers[i].push({ number: count, color: aux });
                        count = 0;
                    }
                } else if (data.points[i][j] > 0 && data.points[i][j] != aux)
                    counting = true;
                aux = data.points[i][j];
            }
            if (counting) {
                count++;
                horizontalNumbers[i].push({ number: count, color: aux });
            }
        }
        return horizontalNumbers;
    }

    #getVerticalNumbers(data) {
        var verticalNumbers = [];
        for (let k = 0; k < data.points[0].length; k++)
            verticalNumbers[k] = [];
        var count, aux, counting;
        for (let i = 0; i < data.points[0].length; i++) {
            count = 0;
            aux = -1;
            counting = false;
            for (let j = data.points.length - 1; j >= 0; j--) {
                if (counting) {
                    count++;
                    if (data.points[j][i] == 0 || data.points[j][i] != aux) {
                        if (data.points[j][i] == 0)
                            counting = false;
                        verticalNumbers[i].push({ number: count, color: aux });
                        count = 0;
                    }
                } else if (data.points[j][i] > 0 && data.points[j][i] != aux)
                    counting = true;
                aux = data.points[j][i];
            }
            if (counting) {
                count++;
                verticalNumbers[i].push({ number: count, color: aux });
            }
        }
        return verticalNumbers;
    }

    #getMaxNumbers(numbers) {
        var bigger = 0;
        var aux = 0;
        for (let i = 0; i < numbers.length; i++) {
            aux = numbers[i].length;
            if (aux > bigger)
                bigger = aux;
        }
        return bigger;
    }
    //#endregion

    //#region Event Functions
    #markSquareColor(evt) {
        let id = evt.target.getAttribute("id");
        id = id.replace("squareColor_", "");
        this.#currentColor = this.#palette[id];
        evt.target.setAttribute("stroke-width", "3");
        let squareColor;
        for (let i = 1; i < this.#palette.length; i++) {
            squareColor = document.getElementById("squareColor_" + i);
            if (i != id)
                squareColor.setAttribute("stroke-width", "1");
        }
    }

    #highlightSquare(evt) {
        let id = evt.target.getAttribute("id");
        id = id.replace("square_aux_", "");
        let idSplited = id.split('.');
        let i = parseInt(idSplited[0]);
        let j = parseInt(idSplited[1]);
        if (i < this.#width && j < this.#height) {
            let verticalLine = document.getElementById("line_0." + i);
            verticalLine.setAttribute("stroke", RULE_COLOR);
            if ((i % this.#gridLength) != 0)
                verticalLine.setAttribute("stroke-width", "2");
            i = i + 1;
            verticalLine = document.getElementById("line_0." + i);
            verticalLine.setAttribute("stroke", RULE_COLOR);
            if ((i % this.#gridLength) != 0)
                verticalLine.setAttribute("stroke-width", "2");
            let horizontalLine = document.getElementById("line_1." + j);
            horizontalLine.setAttribute("stroke", RULE_COLOR);
            if ((j % this.#gridLength) != 0)
                horizontalLine.setAttribute("stroke-width", "2");
            j = j + 1;
            horizontalLine = document.getElementById("line_1." + j);
            horizontalLine.setAttribute("stroke", RULE_COLOR);
            if ((j % this.#gridLength) != 0)
                horizontalLine.setAttribute("stroke-width", "2");
            let decreaseArrowVertical = document.getElementById("decrease_arrow_0");
            decreaseArrowVertical.setAttribute("opacity", "0");
            let increaseArrowVertical = document.getElementById("increase_arrow_0");
            increaseArrowVertical.setAttribute("opacity", "0");
            let decreaseArrowHorizontal = document.getElementById("decrease_arrow_1");
            decreaseArrowHorizontal.setAttribute("opacity", "0");
            let increaseArrowHorizontal = document.getElementById("increase_arrow_1");
            increaseArrowHorizontal.setAttribute("opacity", "0");
            let decreaseArrowDiagonal = document.getElementById("decrease_arrow_2");
            decreaseArrowDiagonal.setAttribute("opacity", "0");
            let increaseArrowDiagonal = document.getElementById("increase_arrow_2");
            increaseArrowDiagonal.setAttribute("opacity", "0");
        }
    }

    #fadeSquare(evt) {
        let id = evt.target.getAttribute("id");
        id = id.replace("square_aux_", "");
        let idSplited = id.split('.');
        let i = parseInt(idSplited[0]);
        let j = parseInt(idSplited[1]);
        if (i < this.#width && j < this.#height) {
            let verticalLine = document.getElementById("line_0." + i);
            verticalLine.setAttribute("stroke", LINE_COLOR);
            if ((i % this.#gridLength) != 0)
                verticalLine.setAttribute("stroke-width", "1");
            i = i + 1;
            verticalLine = document.getElementById("line_0." + i);
            verticalLine.setAttribute("stroke", LINE_COLOR);
            if ((i % this.#gridLength) != 0)
                verticalLine.setAttribute("stroke-width", "1");
            let horizontalLine = document.getElementById("line_1." + j);
            horizontalLine.setAttribute("stroke", LINE_COLOR);
            if ((j % this.#gridLength) != 0)
                horizontalLine.setAttribute("stroke-width", "1");
            j = j + 1;
            horizontalLine = document.getElementById("line_1." + j);
            horizontalLine.setAttribute("stroke", LINE_COLOR);
            if ((j % this.#gridLength) != 0)
                horizontalLine.setAttribute("stroke-width", "1");
            let calculatedHorizontal = document.getElementById("calculated_0");
            calculatedHorizontal.textContent = "";
            let calculatedVertical = document.getElementById("calculated_1");
            calculatedVertical.textContent = "";
            let decreaseArrowVertical = document.getElementById("decrease_arrow_0");
            decreaseArrowVertical.setAttribute("opacity", "0.5");
            let increaseArrowVertical = document.getElementById("increase_arrow_0");
            increaseArrowVertical.setAttribute("opacity", "0.5");
            let decreaseArrowHorizontal = document.getElementById("decrease_arrow_1");
            decreaseArrowHorizontal.setAttribute("opacity", "0.5");
            let increaseArrowHorizontal = document.getElementById("increase_arrow_1");
            increaseArrowHorizontal.setAttribute("opacity", "0.5");
            let decreaseArrowDiagonal = document.getElementById("decrease_arrow_2");
            decreaseArrowDiagonal.setAttribute("opacity", "0.5");
            let increaseArrowDiagonal = document.getElementById("increase_arrow_2");
            increaseArrowDiagonal.setAttribute("opacity", "0.5");
        }
    }

    #initColorsChange(evt) {
        if (evt.button == 0) {
            let id = evt.target.getAttribute("id");
            id = id.replace("square_aux_", "");
            let idSplited = id.split('.');
            this.#squareI = parseInt(idSplited[0]);
            this.#squareJ = parseInt(idSplited[1]);
            let square = document.getElementById("square_" + this.#squareI + "." + this.#squareJ);
            if (this.#squareI < this.#width && this.#squareJ < this.#height) {
                this.#colorSquare = square.getAttribute("fill");
                if (this.#colorSquare == this.#backgroundColor) {
                    evt.target.setAttribute("fill", this.#currentColor);
                    evt.target.setAttribute("opacity", "1");
                    square.setAttribute("fill", this.#currentColor);
                    square.setAttribute("opacity", "1");
                    this.#colorSquare = this.#currentColor;
                } else {
                    if (this.#colorSquare == this.#currentColor) {
                        evt.target.setAttribute("fill", this.#backgroundColor);
                        evt.target.setAttribute("opacity", "0");
                        square.setAttribute("fill", this.#backgroundColor);
                        square.setAttribute("opacity", "0");
                        this.#colorSquare = this.#backgroundColor;
                    } else {
                        evt.target.setAttribute("fill", this.#currentColor);
                        square.setAttribute("fill", this.#currentColor);
                        this.#colorSquare = this.#currentColor;
                    }
                }
                this.#clicked = true;
                this.#refreshCalculatedValues(this.#squareI, this.#squareJ);
            }
        }
    }

    #changeColorSquares(evt) {
        let id = evt.target.getAttribute("id");
        id = id.replace("square_aux_", "");
        let idSplited = id.split('.');
        let i = parseInt(idSplited[0]);
        let j = parseInt(idSplited[1]);
        if (this.#clicked) {
            let count;
            this.#cleanAllSquaresAux();
            if ((i > this.#squareI) && (j == this.#squareJ)) {
                count = this.#squareI;
                while (count <= i) {
                    if (count < this.#width) {
                        this.#refreshSquareAux(count, this.#squareJ);
                    }
                    count++;
                }
            }
            else if ((i < this.#squareI) && (j == this.#squareJ)) {
                count = i;
                while (count <= this.#squareI) {
                    this.#refreshSquareAux(count, this.#squareJ);
                    count++;
                }
            }
            else if ((i == this.#squareI) && (j > this.#squareJ)) {
                count = this.#squareJ;
                while (count <= j) {
                    if (count < this.#height) {
                        this.#refreshSquareAux(this.#squareI, count);
                    }
                    count++;
                }
            }
            else if ((i == this.#squareI) && (j < this.#squareJ)) {
                count = j;
                while (count <= this.#squareJ) {
                    this.#refreshSquareAux(this.#squareI, count);
                    count++;
                }
            }
        }
        this.#refreshCalculatedValues(i, j);
    }

    #highlightDecreaseArrow(evt) {
        evt.target.setAttribute("opacity", "1");
    }

    #fadeDecreaseArrow(evt) {
        evt.target.setAttribute("opacity", "0.5");
    }

    #decreaseSize(evt) {
        let id = evt.target.getAttribute("id");
        let orientation = id.replace("decrease_arrow_", "");
        if (orientation == 0) {
            this.#height -= this.#gridLength;
            if (this.#height < MIN_DIMENSION)
                this.#height += this.#gridLength;
        } else if (orientation == 1) {
            this.#width -= this.#gridLength;
            if (this.#width < MIN_DIMENSION)
                this.#width += this.#gridLength;
        } else {
            this.#height -= this.#gridLength;
            if (this.#height < MIN_DIMENSION)
                this.#height += this.#gridLength;
            this.#width -= this.#gridLength;
            if (this.#width < MIN_DIMENSION)
                this.#width += this.#gridLength;
        }
        this.#refreshArea();
    }

    #highlightIncreaseArrow(evt) {
        evt.target.setAttribute("opacity", "1");
    }

    #fadeIncreaseArrow(evt) {
        evt.target.setAttribute("opacity", "0.5");
    }

    #increaseSize(evt) {
        let id = evt.target.getAttribute("id");
        let orientation = id.replace("increase_arrow_", "");
        if (orientation == 0) {
            this.#height += this.#gridLength;
            if (this.#height > MAX_HEIGTH_DIMENSION)
                this.#height -= this.#gridLength;
        } else if (orientation == 1) {
            this.#width += this.#gridLength;
            if (this.#width > MAX_WIDTH_DIMENSION)
                this.#width -= this.#gridLength;
        } else {
            this.#height += this.#gridLength;
            if (this.#height > MAX_HEIGTH_DIMENSION)
                this.#height -= this.#gridLength;
            this.#width += this.#gridLength;
            if (this.#width > MAX_WIDTH_DIMENSION)
                this.#width -= this.#gridLength;
        }
        this.#refreshArea();
    }

    #switchSquareColor() {
        let palette = document.getElementById("palette").children;
        let selected;
        for (let i = 0; i < palette.length; i++) {
            if (palette[i].getAttribute("stroke-width") == 3) {
                if (i == palette.length - 1)
                    selected = 0;
                else
                    selected = i + 1;
                break;
            }
        }
        this.#currentColor = this.#palette[selected + 1];
        palette[selected].setAttribute("stroke-width", "3");
        let squareColor;
        for (let i = 1; i < this.#palette.length; i++) {
            squareColor = document.getElementById("squareColor_" + i);
            if (i != selected + 1)
                squareColor.setAttribute("stroke-width", "1");
        }
    }

    #endColorsChange() {
        if (this.#clicked) {
            let squareAux, id, square, squareColor;
            for (let i = 0; i < this.#width; i++) {
                for (let j = 0; j < this.#height; j++) {
                    squareAux = document.getElementById("square_aux_" + i + "." + j);
                    if (squareAux.getAttribute("opacity") == "1") {
                        id = squareAux.getAttribute("id");
                        id = id.replace("square_aux_", "square_");
                        square = document.getElementById(id);
                        squareColor = squareAux.getAttribute("fill");
                        square.setAttribute("fill", squareColor);
                        if (squareColor == this.#backgroundColor)
                            square.setAttribute("opacity", "0");
                        else
                            square.setAttribute("opacity", "1");
                        squareAux.setAttribute("fill", this.#backgroundColor);
                        squareAux.setAttribute("opacity", "0");
                    }
                }
            }
            this.#clicked = false;
            this.#saveState();
        }
    }
    //#endregion
}