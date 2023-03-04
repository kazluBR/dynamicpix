const SVG_LIB = 'http://www.w3.org/2000/svg'
const SQUARE_COLOR_SIZE = 40
const TRANSLATE_X = 10
const TRANSLATE_Y = 0
const LINE_COLOR = '#808080'
const MARK_COLOR = '#808080'
const CALCULATED_EMPTY_COLOR = '#808080'
const RULE_COLOR = '#ff00ff'
const SIGNAL_CORRECT_COLOR = '#adff2f'
const SIGNAL_ERROR_COLOR = '#b22222'
const NUMBER_DEFAULT_COLOR = '#ffffff'

class nonogram {
  #size
  #showErrorsOnCheck
  #showErrorsImmediately
  #finishCallback
  #data
  #totalValidated
  #clicked
  #states
  #currentKey
  #squareI
  #squareJ
  #colorSquare
  #colorSelected
  #markSelected
  #freeze

  constructor(config = {}) {
    this.#size = config.size || 20
    this.#showErrorsOnCheck = config.showErrorsOnCheck || false
    this.#showErrorsImmediately = config.showErrorsImmediately || false
    this.#finishCallback = config.finishCallback || (() => alert('Puzzle Finished!'))
    this.#data = {}
    this.#totalValidated = false
    this.#clicked = false
    this.#states = []
    this.#currentKey = 0
    this.#squareI = null
    this.#squareJ = null
    this.#colorSquare = null
    this.#colorSelected = null
    this.#markSelected = null
    this.#freeze = false
    document.body.onmousedown = (e) => {
      if (e.button == 1) {
        this.#switchSquareColor()
        return false
      }
    }
    document.body.onmouseup = () => this.#endColorsChange()
    this.#createSvgDocument()
  }

  //#region Main Functions
  init(data, saveState = null) {
    this.#data = data
    this.#clean()
    this.#changeSvgDocumentSize()
    this.#totalValidated = false
    this.#colorSelected = data.colors[1]
    this.#loadPalette()

    let pos_x = this.#data.settings.horizontalNumbersLength * this.#size
    let pos_y = this.#data.settings.verticalNumbersLength * this.#size
    this.#createBackground(pos_x, pos_y)
    for (let i = 0; i < this.#data.settings.width; i++) {
      for (let j = 0; j < this.#data.settings.height; j++) {
        this.#createMark(pos_x, pos_y, i, j)
        this.#createSquare(pos_x, pos_y, i, j)
        if (this.#showErrorsImmediately) {
          this.#createErrorMark(pos_x, pos_y, i, j)
        }
        this.#createMarkAux(pos_x, pos_y, i, j)
        this.#createSquareAux(pos_x, pos_y, i, j)
      }
    }
    for (let i = 0; i <= this.#data.settings.width; i++) {
      if (i < this.#data.settings.width) {
        this.#createSignal(pos_x, pos_y, 0, i)
        for (let j = 1; j <= this.#data.verticalNumbers[i].length; j++) {
          this.#createSquareNumber(pos_x, pos_y, 0, i, j)
          this.#createNumber(pos_x, pos_y, 0, i, j)
        }
      }
      this.#createLine(pos_x, pos_y, 0, i)
    }
    for (let i = 0; i <= this.#data.settings.height; i++) {
      if (i < this.#data.settings.height) {
        this.#createSignal(pos_x, pos_y, 1, i)
        for (let j = 1; j <= this.#data.horizontalNumbers[i].length; j++) {
          this.#createSquareNumber(pos_x, pos_y, 1, i, j)
          this.#createNumber(pos_x, pos_y, 1, i, j)
        }
      }
      this.#createLine(pos_x, pos_y, 1, i)
    }
    this.#createCalculated(pos_x, pos_y, 0)
    this.#createCalculated(pos_x, pos_y, 1)
    this.loadState(saveState)
    this.#addState()
    this.#refreshCursor()
  }

  maximize(value) {
    if (this.#data) {
      this.#size += value || 1
      this.#changeAreaSize()
    }
  }

  minimize(value) {
    if (this.#data) {
      this.#size -= value || 1
      if (this.#size < 1) this.#size += value || 1
      else this.#changeAreaSize()
    }
  }

  undo() {
    if (this.#data) {
      if (this.#currentKey > 0) {
        this.#currentKey -= 1
        this.#recoverState()
      }
    }
  }

  redo() {
    if (this.#data) {
      if (this.#currentKey < this.#states.length - 1) {
        this.#currentKey += 1
        this.#recoverState()
      }
    }
  }

  check() {
    if (this.#data) {
      let square, squareColor, squareOpacity, mark, markOpacity, signalHorizontal, signalVertical
      let errors = 0
      for (let i = 0; i < this.#data.settings.width; i++) {
        signalHorizontal = document.getElementById('signal_0.' + i)
        for (let j = 0; j < this.#data.settings.height; j++) {
          square = document.getElementById('square_' + i + '.' + j)
          squareColor = square.getAttribute('fill')
          squareOpacity = square.getAttribute('opacity')
          signalVertical = document.getElementById('signal_1.' + j)
          if (squareColor != this.#data.colors[this.#data.points[j][i]] && squareOpacity == '1') {
            if (this.#showErrorsOnCheck) {
              signalHorizontal.setAttribute('opacity', '1')
              signalHorizontal.setAttribute('fill', SIGNAL_ERROR_COLOR)
              signalVertical.setAttribute('opacity', '1')
              signalVertical.setAttribute('fill', SIGNAL_ERROR_COLOR)
            }
            errors++
          } else {
            mark = document.getElementById('mark_' + i + '.' + j)
            markOpacity = mark.getAttribute('opacity')
            if (this.#data.points[j][i] != 0 && markOpacity == '1') {
              if (this.#showErrorsOnCheck) {
                signalHorizontal.setAttribute('opacity', '1')
                signalHorizontal.setAttribute('fill', SIGNAL_ERROR_COLOR)
                signalVertical.setAttribute('opacity', '1')
                signalVertical.setAttribute('fill', SIGNAL_ERROR_COLOR)
              }
              errors++
            }
          }
        }
      }
      return errors
    }
  }

  solve() {
    if (this.#data) {
      for (let i = 0; i < this.#data.settings.height; i++) {
        for (let j = 0; j < this.#data.settings.width; j++) {
          let square = document.getElementById('square_' + j + '.' + i)
          square.setAttribute('fill', this.#data.colors[this.#data.points[i][j]])
          square.setAttribute('opacity', '1')
        }
      }
      this.#validate()
    }
  }

  getState() {
    let state = ''
    if (this.#data) {
      for (let i = 0; i < this.#data.settings.height; i++) {
        for (let j = 0; j < this.#data.settings.width; j++) {
          let square = document.getElementById('square_' + j + '.' + i)
          state += this.#data.colors.indexOf(square.getAttribute('fill')) + ','
        }
        state += ';'
      }
    }
    return state
  }

  loadState(state) {
    if (this.#data) {
      if (state) {
        let columns = state.split(';')
        for (let i = 0; i < this.#data.settings.height; i++) {
          let lines = columns[i].split(',')
          for (let j = 0; j < this.#data.settings.width; j++) {
            let square = document.getElementById('square_' + j + '.' + i)
            square.setAttribute('fill', this.#data.colors[lines[j]])
            if (lines[j] > 0) {
              square.setAttribute('opacity', '1')
            } else {
              square.setAttribute('opacity', '0')
            }
          }
        }
      }
      this.#validate()
    }
  }

  makeMove(move) {
    if (move.action == 'PAINT') {
      for (let k = 0; k < move.squares.length; k++) {
        let square = document.getElementById(
          'square_' + move.squares[k].i + '.' + move.squares[k].j,
        )
        square.setAttribute('fill', move.color)
        if (move.color == this.#data.colors[0]) square.setAttribute('opacity', '0')
        else square.setAttribute('opacity', '1')
      }
    } else {
      for (let k = 0; k < move.squares.length; k++) {
        let mark = document.getElementById('mark_' + move.squares[k].i + '.' + move.squares[k].j)
        if (move.action == 'MARK') {
          mark.setAttribute('opacity', '1')
        } else if (move.action == 'UNMARK') {
          mark.setAttribute('opacity', '0')
        }
      }
    }
    this.#addState()
  }

  undoMove(move) {
    if (move.action == 'PAINT') {
      for (let k = 0; k < move.squares.length; k++) {
        let square = document.getElementById(
          'square_' + move.squares[k].i + '.' + move.squares[k].j,
        )
        square.setAttribute('fill', move.squares[k].previousColor)
        if (move.squares[k].previousColor == this.#data.colors[0]) {
          square.setAttribute('opacity', '0')
        } else {
          square.setAttribute('opacity', '1')
        }
      }
    } else {
      for (let k = 0; k < move.squares.length; k++) {
        let mark = document.getElementById('mark_' + move.squares[k].i + '.' + move.squares[k].j)
        if (move.action == 'MARK') {
          mark.setAttribute('opacity', '0')
        } else if (move.action == 'UNMARK') {
          mark.setAttribute('opacity', '1')
        }
      }
    }
    this.#addState()
  }

  freeze() {
    this.#freeze = true
  }

  unfreeze() {
    this.#freeze = false
  }
  //#endregion

  //#region Auxiliar Functions
  #createSvgDocument() {
    let nonogramElement = document.getElementById('nonogram')
    nonogramElement.oncontextmenu = function () {
      return false
    }
    let svg = document.createElementNS(SVG_LIB, 'svg')
    let palette = document.createElementNS(SVG_LIB, 'g')
    palette.setAttribute('id', 'palette')
    svg.appendChild(palette)
    let main = document.createElementNS(SVG_LIB, 'g')
    main.setAttribute('id', 'main')
    svg.appendChild(main)
    let components = document.createElementNS(SVG_LIB, 'g')
    components.setAttribute('id', 'components')
    svg.appendChild(components)
    let aux = document.createElementNS(SVG_LIB, 'g')
    aux.setAttribute('id', 'aux')
    svg.appendChild(aux)
    nonogramElement.appendChild(svg)
  }

  #loadPalette() {
    let transform = 'translate(' + TRANSLATE_X + ',' + TRANSLATE_Y + ')'
    document.getElementById('palette').setAttribute('transform', transform)
    if (this.#data.colors.length > 2) {
      let calculatedY = TRANSLATE_Y + SQUARE_COLOR_SIZE * 1.5
      transform = 'translate(' + TRANSLATE_X + ',' + calculatedY + ')'
      for (let i = 1; i < this.#data.colors.length; i++) {
        this.#createSquareColor(i)
      }
    }
    document.getElementById('main').setAttribute('transform', transform)
    document.getElementById('components').setAttribute('transform', transform)
    document.getElementById('aux').setAttribute('transform', transform)
  }

  #createSquareColor(i) {
    let squareColor = document.createElementNS(SVG_LIB, 'rect')
    squareColor.setAttribute('id', 'squareColor_' + i)
    if (i == 1) squareColor.setAttribute('stroke-width', '3')
    else squareColor.setAttribute('stroke-width', '1')
    squareColor.setAttribute('stroke', 'black')
    squareColor.setAttribute('height', SQUARE_COLOR_SIZE)
    squareColor.setAttribute('width', SQUARE_COLOR_SIZE)
    squareColor.setAttribute('fill', this.#data.colors[i])
    squareColor.setAttribute('x', (i - 1) * SQUARE_COLOR_SIZE + SQUARE_COLOR_SIZE / 8)
    squareColor.setAttribute('y', SQUARE_COLOR_SIZE / 8)
    squareColor.onclick = (evt) => this.#markSquareColor(evt)
    document.getElementById('palette').appendChild(squareColor)
  }

  #createBackground(pos_x, pos_y) {
    let background = document.createElementNS(SVG_LIB, 'rect')
    background.setAttribute('id', 'background')
    background.setAttribute('fill', this.#data.colors[0])
    background.setAttribute('height', this.#size * this.#data.settings.height)
    background.setAttribute('width', this.#size * this.#data.settings.width)
    background.setAttribute('x', pos_x)
    background.setAttribute('y', pos_y)
    document.getElementById('main').appendChild(background)
  }

  #createMark(pos_x, pos_y, i, j) {
    let mark = document.createElementNS(SVG_LIB, 'text')
    mark.setAttribute('id', 'mark_' + i + '.' + j)
    mark.setAttribute('text-anchor', 'middle')
    mark.setAttribute('font-family', 'serif')
    mark.setAttribute('font-size', this.#size)
    mark.setAttribute('fill', MARK_COLOR)
    mark.setAttribute('x', pos_x + (i + 0.5) * this.#size)
    mark.setAttribute('y', pos_y + (j + 0.85) * this.#size)
    mark.setAttribute('opacity', '0')
    mark.textContent = '\u2022'
    mark.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    document.getElementById('main').appendChild(mark)
  }

  #createMarkAux(pos_x, pos_y, i, j) {
    let markAux = document.createElementNS(SVG_LIB, 'text')
    markAux.setAttribute('id', 'mark_aux_' + i + '.' + j)
    markAux.setAttribute('text-anchor', 'middle')
    markAux.setAttribute('font-family', 'serif')
    markAux.setAttribute('font-size', this.#size)
    markAux.setAttribute('fill', MARK_COLOR)
    markAux.setAttribute('x', pos_x + (i + 0.5) * this.#size)
    markAux.setAttribute('y', pos_y + (j + 0.85) * this.#size)
    markAux.setAttribute('opacity', '0')
    markAux.textContent = '\u2022'
    markAux.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    document.getElementById('aux').appendChild(markAux)
  }

  #createErrorMark(pos_x, pos_y, i, j) {
    let errorMark = document.createElementNS(SVG_LIB, 'text')
    errorMark.setAttribute('id', 'error_mark_' + i + '.' + j)
    errorMark.setAttribute('text-anchor', 'middle')
    errorMark.setAttribute('font-family', 'serif')
    errorMark.setAttribute('font-size', this.#size)
    errorMark.setAttribute('x', pos_x + (i + 0.5) * this.#size)
    errorMark.setAttribute('y', pos_y + (j + 0.85) * this.#size)
    errorMark.setAttribute('opacity', '0')
    errorMark.textContent = '\u2715'
    errorMark.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    document.getElementById('main').appendChild(errorMark)
  }

  #createSquare(pos_x, pos_y, i, j) {
    let square = document.createElementNS(SVG_LIB, 'rect')
    square.setAttribute('id', 'square_' + i + '.' + j)
    square.setAttribute('fill', this.#data.colors[0])
    square.setAttribute('opacity', '0')
    square.setAttribute('height', this.#size * 0.9)
    square.setAttribute('width', this.#size * 0.9)
    square.setAttribute('x', pos_x + i * this.#size + this.#size * 0.05)
    square.setAttribute('y', pos_y + j * this.#size + this.#size * 0.05)
    document.getElementById('main').appendChild(square)
  }

  #createSquareAux(pos_x, pos_y, i, j) {
    let squareAux = document.createElementNS(SVG_LIB, 'rect')
    squareAux.setAttribute('id', 'square_aux_' + i + '.' + j)
    squareAux.setAttribute('fill', this.#data.colors[0])
    squareAux.setAttribute('opacity', '0')
    squareAux.setAttribute('height', this.#size * 0.9)
    squareAux.setAttribute('width', this.#size * 0.9)
    squareAux.setAttribute('x', pos_x + i * this.#size + this.#size * 0.05)
    squareAux.setAttribute('y', pos_y + j * this.#size + this.#size * 0.05)
    squareAux.onmouseover = (evt) => this.#highlightSquare(evt)
    squareAux.onmouseout = (evt) => this.#fadeSquare(evt)
    squareAux.onmousedown = (evt) => this.#initColorsChange(evt)
    squareAux.onmousemove = (evt) => this.#changeColorSquares(evt)
    document.getElementById('aux').appendChild(squareAux)
  }

  #createSignal(pos_x, pos_y, orientation, i) {
    let signal = document.createElementNS(SVG_LIB, 'text')
    signal.setAttribute('id', 'signal_' + orientation + '.' + i)
    signal.setAttribute('font-size', this.#size)
    signal.setAttribute('opacity', '0')
    if (orientation == 0) {
      signal.setAttribute('text-anchor', 'start')
      signal.setAttribute('x', pos_x + i * this.#size)
      signal.setAttribute('y', pos_y + (this.#data.settings.height + 1) * this.#size)
      signal.textContent = '\u23F6'
    } else {
      signal.setAttribute('text-anchor', 'end')
      signal.setAttribute('x', pos_x + (this.#data.settings.width + 1) * this.#size)
      signal.setAttribute('y', pos_y + (i + 0.9) * this.#size)
      signal.textContent = '\u23F4'
    }
    signal.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    document.getElementById('components').appendChild(signal)
  }

  #createSquareNumber(pos_x, pos_y, orientation, i, j) {
    let squareNumber = document.createElementNS(SVG_LIB, 'rect')
    squareNumber.setAttribute('id', 'squareNumber_' + orientation + '.' + i + '.' + (j - 1))
    squareNumber.setAttribute('opacity', '1')
    squareNumber.setAttribute('height', this.#size)
    squareNumber.setAttribute('width', this.#size)
    if (orientation == 0) {
      squareNumber.setAttribute('x', pos_x + i * this.#size)
      squareNumber.setAttribute('y', pos_y - j * this.#size)
      let colorIndex = this.#data.verticalNumbers[i][j - 1].color
      squareNumber.setAttribute('fill', this.#data.colors[colorIndex])
    } else {
      squareNumber.setAttribute('x', pos_x - j * this.#size)
      squareNumber.setAttribute('y', pos_y + i * this.#size)
      let colorIndex = this.#data.horizontalNumbers[i][j - 1].color
      squareNumber.setAttribute('fill', this.#data.colors[colorIndex])
    }
    squareNumber.onclick = (evt) => this.#markSquareNumber(evt)
    document.getElementById('components').appendChild(squareNumber)
  }

  #createNumber(pos_x, pos_y, orientation, i, j) {
    let number = document.createElementNS(SVG_LIB, 'text')
    number.setAttribute('id', 'number_' + orientation + '.' + i + '.' + (j - 1))
    number.setAttribute('text-anchor', 'middle')
    number.setAttribute('font-family', 'serif')
    number.setAttribute('font-size', this.#size * 0.9)
    number.setAttribute('font-weight', 'normal')
    number.setAttribute('fill', NUMBER_DEFAULT_COLOR)
    if (orientation == 0) {
      number.setAttribute('x', pos_x + i * this.#size + 0.5 * this.#size)
      number.setAttribute('y', pos_y - j * this.#size + 0.8 * this.#size)
      number.textContent = this.#data.verticalNumbers[i][j - 1].number
    } else {
      number.setAttribute('x', pos_x - j * this.#size + 0.5 * this.#size)
      number.setAttribute('y', pos_y + i * this.#size + 0.8 * this.#size)
      number.textContent = this.#data.horizontalNumbers[i][j - 1].number
    }
    number.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    number.onclick = (evt) => this.#markNumber(evt)
    document.getElementById('components').appendChild(number)
  }

  #createLine(pos_x, pos_y, orientation, i) {
    let line = document.createElementNS(SVG_LIB, 'line')
    line.setAttribute('id', 'line_' + orientation + '.' + i)
    line.setAttribute('stroke', LINE_COLOR)
    if (i % this.#data.settings.gridLength == 0) line.setAttribute('stroke-width', '2')
    else line.setAttribute('stroke-width', '1')
    if (orientation == 0) {
      line.setAttribute('x1', pos_x + i * this.#size)
      line.setAttribute('x2', pos_x + i * this.#size)
      line.setAttribute('y1', pos_y - this.#data.settings.verticalNumbersLength * this.#size)
      line.setAttribute('y2', pos_y + this.#data.settings.height * this.#size)
    } else {
      line.setAttribute('x1', pos_x - this.#data.settings.horizontalNumbersLength * this.#size)
      line.setAttribute('x2', pos_x + this.#data.settings.width * this.#size)
      line.setAttribute('y1', pos_y + i * this.#size)
      line.setAttribute('y2', pos_y + i * this.#size)
    }
    document.getElementById('components').appendChild(line)
  }

  #createCalculated(pos_x, pos_y, orientation) {
    let calculated = document.createElementNS(SVG_LIB, 'text')
    calculated.setAttribute('id', 'calculated_' + orientation)
    calculated.setAttribute('font-family', 'serif')
    calculated.setAttribute('font-size', this.#size)
    calculated.setAttribute('font-weight', 'bold')
    calculated.setAttribute('fill', CALCULATED_EMPTY_COLOR)
    if (orientation == 0) {
      calculated.setAttribute('text-anchor', 'start')
      calculated.setAttribute(
        'x',
        pos_x + (this.#data.settings.width + 1) * this.#size + this.#size / 4,
      )
    } else {
      calculated.setAttribute('text-anchor', 'middle')
      calculated.setAttribute(
        'y',
        pos_y + (this.#data.settings.height + 1) * this.#size + this.#size,
      )
    }
    calculated.setAttribute(
      'style',
      '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;',
    )
    document.getElementById('components').appendChild(calculated)
  }

  #refreshCursor() {
    let nonogramElement = document.getElementById('nonogram')
    nonogramElement.style =
      "cursor: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' " +
      "width='32' height='32' viewBox='0 0 24 24'%3e%3cpath fill='%23" +
      this.#colorSelected.replace('#', '') +
      "' " +
      "stroke='black' d='M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 " +
      '11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z\'/%3e%3c/svg%3e") ' +
      '0 32, pointer;'
  }

  #clean() {
    let palette = document.getElementById('palette')
    while (palette.firstChild) {
      palette.removeChild(palette.firstChild)
    }
    let components = document.getElementById('components')
    while (components.firstChild) {
      components.removeChild(components.firstChild)
    }
    let main = document.getElementById('main')
    while (main.firstChild) {
      main.removeChild(main.firstChild)
    }
    let aux = document.getElementById('aux')
    while (aux.firstChild) {
      aux.removeChild(aux.firstChild)
    }
    this.#states = []
  }

  #changeSvgDocumentSize() {
    let svg = document.getElementsByTagName('svg')[0]
    svg.setAttribute(
      'height',
      this.#size * this.#data.settings.verticalNumbersLength +
        this.#size * (this.#data.settings.height + 3) +
        TRANSLATE_Y +
        SQUARE_COLOR_SIZE * 1.5,
    )
    svg.setAttribute(
      'width',
      this.#size * this.#data.settings.horizontalNumbersLength +
        this.#size * (this.#data.settings.width + 3) +
        TRANSLATE_X,
    )
  }

  #validate() {
    let validated, square, color, signal, squareNumber, number
    this.#totalValidated = true
    for (let i = 0; i < this.#data.settings.width; i++) {
      validated = true
      signal = document.getElementById('signal_0.' + i)
      for (let j = 0; j < this.#data.settings.height; j++) {
        square = document.getElementById('square_' + i + '.' + j)
        color = square.getAttribute('fill')
        if (color != this.#data.colors[this.#data.points[j][i]]) {
          validated = false
          this.#totalValidated = false
          if (signal.getAttribute('opacity') == '1') signal.setAttribute('opacity', '0')
          break
        }
      }
      if (validated) {
        for (let j = 0; j < this.#data.verticalNumbers[i].length; j++) {
          squareNumber = document.getElementById('squareNumber_0.' + i + '.' + j)
          squareNumber.setAttribute('opacity', '0')
          number = document.getElementById('number_0.' + i + '.' + j)
          number.setAttribute('fill', squareNumber.getAttribute('fill'))
          number.setAttribute('font-weight', 'bold')
        }
        if (
          signal.getAttribute('opacity') == '0' ||
          signal.getAttribute('fill') == SIGNAL_ERROR_COLOR
        ) {
          signal.setAttribute('fill', SIGNAL_CORRECT_COLOR)
          signal.setAttribute('opacity', '1')
        }
      }
    }
    for (let i = 0; i < this.#data.settings.height; i++) {
      validated = true
      signal = document.getElementById('signal_1.' + i)
      for (let j = 0; j < this.#data.settings.width; j++) {
        square = document.getElementById('square_' + j + '.' + i)
        color = square.getAttribute('fill')
        if (color != this.#data.colors[this.#data.points[i][j]]) {
          validated = false
          this.#totalValidated = false
          if (signal.getAttribute('opacity') == '1') signal.setAttribute('opacity', '0')
          break
        }
      }
      if (validated) {
        for (let j = 0; j < this.#data.horizontalNumbers[i].length; j++) {
          squareNumber = document.getElementById('squareNumber_1.' + i + '.' + j)
          squareNumber.setAttribute('opacity', '0')
          number = document.getElementById('number_1.' + i + '.' + j)
          number.setAttribute('fill', squareNumber.getAttribute('fill'))
          number.setAttribute('font-weight', 'bold')
        }
        if (
          signal.getAttribute('opacity') == '0' ||
          signal.getAttribute('fill') == SIGNAL_ERROR_COLOR
        ) {
          signal.setAttribute('fill', SIGNAL_CORRECT_COLOR)
          signal.setAttribute('opacity', '1')
        }
      }
    }
    if (this.#totalValidated) {
      let mark
      for (let i = 0; i < this.#data.settings.height; i++) {
        for (let j = 0; j < this.#data.settings.width; j++) {
          mark = document.getElementById('mark_' + j + '.' + i)
          mark.setAttribute('opacity', '0')
        }
      }
      let calculatedHorizontal = document.getElementById('calculated_0')
      calculatedHorizontal.textContent = ''
      let calculatedVertical = document.getElementById('calculated_1')
      calculatedVertical.textContent = ''
      this.#finishCallback()
    }
  }

  #changeAreaSize() {
    this.#changeSvgDocumentSize()
    let pos_x = this.#data.settings.horizontalNumbersLength * this.#size
    let pos_y = this.#data.settings.verticalNumbersLength * this.#size
    this.#changeBackgroundSize(pos_x, pos_y)
    for (let i = 0; i < this.#data.settings.width; i++) {
      for (let j = 0; j < this.#data.settings.height; j++) {
        this.#changeMarkSize(pos_x, pos_y, i, j)
        this.#changeMarkAuxSize(pos_x, pos_y, i, j)
        this.#changeSquareSize(pos_x, pos_y, i, j)
        this.#changeSquareAuxSize(pos_x, pos_y, i, j)
      }
    }
    for (let i = 0; i <= this.#data.settings.width; i++) {
      if (i < this.#data.settings.width) {
        this.#changeSignalSize(pos_x, pos_y, 0, i)
        for (let j = 1; j <= this.#data.verticalNumbers[i].length; j++) {
          this.#changeSquareNumberSize(pos_x, pos_y, 0, i, j)
          this.#changeNumberSize(pos_x, pos_y, 0, i, j)
        }
      }
      this.#changeLineSize(pos_x, pos_y, 0, i)
    }
    for (let i = 0; i <= this.#data.settings.height; i++) {
      if (i < this.#data.settings.height) {
        this.#changeSignalSize(pos_x, pos_y, 1, i)
        for (let j = 1; j <= this.#data.horizontalNumbers[i].length; j++) {
          this.#changeSquareNumberSize(pos_x, pos_y, 1, i, j)
          this.#changeNumberSize(pos_x, pos_y, 1, i, j)
        }
      }
      this.#changeLineSize(pos_x, pos_y, 1, i)
    }
    this.#changeCalculatedSize(pos_x, pos_y, 0)
    this.#changeCalculatedSize(pos_x, pos_y, 1)
  }

  #changeBackgroundSize(pos_x, pos_y) {
    let background = document.getElementById('background')
    background.setAttribute('height', this.#size * this.#data.settings.height)
    background.setAttribute('width', this.#size * this.#data.settings.width)
    background.setAttribute('x', pos_x)
    background.setAttribute('y', pos_y)
  }

  #changeMarkSize(pos_x, pos_y, i, j) {
    let mark = document.getElementById('mark_' + i + '.' + j)
    mark.setAttribute('font-size', this.#size)
    mark.setAttribute('x', pos_x + (i + 0.5) * this.#size)
    mark.setAttribute('y', pos_y + (j + 0.85) * this.#size)
  }

  #changeMarkAuxSize(pos_x, pos_y, i, j) {
    let markAux = document.getElementById('mark_aux_' + i + '.' + j)
    markAux.setAttribute('font-size', this.#size)
    markAux.setAttribute('x', pos_x + (i + 0.5) * this.#size)
    markAux.setAttribute('y', pos_y + (j + 0.85) * this.#size)
  }

  #changeSquareSize(pos_x, pos_y, i, j) {
    let square = document.getElementById('square_' + i + '.' + j)
    square.setAttribute('height', this.#size * 0.9)
    square.setAttribute('width', this.#size * 0.9)
    square.setAttribute('x', pos_x + i * this.#size + this.#size * 0.05)
    square.setAttribute('y', pos_y + j * this.#size + this.#size * 0.05)
  }

  #changeSquareAuxSize(pos_x, pos_y, i, j) {
    let squareAux = document.getElementById('square_aux_' + i + '.' + j)
    squareAux.setAttribute('height', this.#size * 0.9)
    squareAux.setAttribute('width', this.#size * 0.9)
    squareAux.setAttribute('x', pos_x + i * this.#size + this.#size * 0.05)
    squareAux.setAttribute('y', pos_y + j * this.#size + this.#size * 0.05)
  }

  #changeSignalSize(pos_x, pos_y, orientation, i) {
    let signal = document.getElementById('signal_' + orientation + '.' + i)
    signal.setAttribute('font-size', this.#size)
    if (orientation == 0) {
      signal.setAttribute('x', pos_x + i * this.#size)
      signal.setAttribute('y', pos_y + (this.#data.settings.height + 1) * this.#size)
    } else {
      signal.setAttribute('x', pos_x + (this.#data.settings.width + 1) * this.#size)
      signal.setAttribute('y', pos_y + (i + 0.9) * this.#size)
    }
  }

  #changeNumberSize(pos_x, pos_y, orientation, i, j) {
    let number = document.getElementById('number_' + orientation + '.' + i + '.' + (j - 1))
    number.setAttribute('font-size', 0.9 * this.#size)
    if (orientation == 0) {
      number.setAttribute('x', pos_x + i * this.#size + 0.5 * this.#size)
      number.setAttribute('y', pos_y - j * this.#size + 0.8 * this.#size)
    } else {
      number.setAttribute('x', pos_x - j * this.#size + 0.5 * this.#size)
      number.setAttribute('y', pos_y + i * this.#size + 0.8 * this.#size)
    }
  }

  #changeSquareNumberSize(pos_x, pos_y, orientation, i, j) {
    let squareNumber = document.getElementById(
      'squareNumber_' + orientation + '.' + i + '.' + (j - 1),
    )
    squareNumber.setAttribute('height', this.#size)
    squareNumber.setAttribute('width', this.#size)
    if (orientation == 0) {
      squareNumber.setAttribute('x', pos_x + i * this.#size)
      squareNumber.setAttribute('y', pos_y - j * this.#size)
    } else {
      squareNumber.setAttribute('x', pos_x - j * this.#size)
      squareNumber.setAttribute('y', pos_y + i * this.#size)
    }
  }

  #changeLineSize(pos_x, pos_y, orientation, i) {
    let line = document.getElementById('line_' + orientation + '.' + i)
    if (orientation == 0) {
      line.setAttribute('x1', pos_x + i * this.#size)
      line.setAttribute('x2', pos_x + i * this.#size)
      line.setAttribute('y1', pos_y - this.#data.settings.verticalNumbersLength * this.#size)
      line.setAttribute('y2', pos_y + this.#data.settings.height * this.#size)
    } else {
      line.setAttribute('x1', pos_x - this.#data.settings.horizontalNumbersLength * this.#size)
      line.setAttribute('x2', pos_x + this.#data.settings.width * this.#size)
      line.setAttribute('y1', pos_y + i * this.#size)
      line.setAttribute('y2', pos_y + i * this.#size)
    }
  }

  #changeCalculatedSize(pos_x, pos_y, orientation) {
    let calculated = document.getElementById('calculated_' + orientation)
    calculated.setAttribute('font-size', this.#size)
    if (orientation == 0) {
      calculated.setAttribute(
        'x',
        pos_x + (this.#data.settings.width + 1) * this.#size + this.#size / 4,
      )
    } else {
      calculated.setAttribute(
        'y',
        pos_y + (this.#data.settings.height + 1) * this.#size + this.#size,
      )
    }
  }

  #addState() {
    while (this.#currentKey < this.#states.length - 1) {
      this.#states.pop()
    }
    this.#states.push(new XMLSerializer().serializeToString(document.getElementById('main')))
    if (this.#states.length > 1) {
      this.#currentKey += 1
    }
  }

  #recoverState() {
    let squares = document.getElementById('main')
    while (squares.firstChild) {
      squares.removeChild(squares.firstChild)
    }
    let squaresRecover = new DOMParser().parseFromString(
      this.#states[this.#currentKey],
      'image/svg+xml',
    ).documentElement
    while (squaresRecover.firstChild) {
      squares.appendChild(squaresRecover.firstChild)
    }
    this.#validate()
    this.#changeAreaSize()
  }

  #refreshCalculatedValues(i, j) {
    let squarePivot = document.getElementById('square_' + i + '.' + j)
    if (this.#clicked) squarePivot = document.getElementById('square_aux_' + i + '.' + j)
    let colorSquare = squarePivot.getAttribute('fill')
    let square, squareAux
    let calcHorizontal = 1
    let countRight = i + 1
    while (countRight <= this.#data.settings.width - 1) {
      square = document.getElementById('square_' + countRight + '.' + j)
      squareAux = document.getElementById('square_aux_' + countRight + '.' + j)
      if (
        square.getAttribute('fill') == colorSquare ||
        (squareAux.getAttribute('fill') == colorSquare && colorSquare != this.#data.colors[0])
      ) {
        countRight++
        calcHorizontal++
      } else break
    }
    let countLeft = i - 1
    while (countLeft >= 0) {
      square = document.getElementById('square_' + countLeft + '.' + j)
      squareAux = document.getElementById('square_aux_' + countLeft + '.' + j)
      if (
        square.getAttribute('fill') == colorSquare ||
        (squareAux.getAttribute('fill') == colorSquare && colorSquare != this.#data.colors[0])
      ) {
        countLeft--
        calcHorizontal++
      } else break
    }
    let calcVertical = 1
    let countDown = j + 1
    while (countDown <= this.#data.settings.height - 1) {
      square = document.getElementById('square_' + i + '.' + countDown)
      squareAux = document.getElementById('square_aux_' + i + '.' + countDown)
      if (
        square.getAttribute('fill') == colorSquare ||
        (squareAux.getAttribute('fill') == colorSquare && colorSquare != this.#data.colors[0])
      ) {
        countDown++
        calcVertical++
      } else break
    }
    let countUp = j - 1
    while (countUp >= 0) {
      square = document.getElementById('square_' + i + '.' + countUp)
      squareAux = document.getElementById('square_aux_' + i + '.' + countUp)
      if (
        square.getAttribute('fill') == colorSquare ||
        (squareAux.getAttribute('fill') == colorSquare && colorSquare != this.#data.colors[0])
      ) {
        countUp--
        calcVertical++
      } else break
    }
    let calculatedHorizontal = document.getElementById('calculated_0')
    let calculatedVertical = document.getElementById('calculated_1')
    if (colorSquare != this.#data.colors[0]) {
      calculatedHorizontal.setAttribute('fill', colorSquare)
      calculatedVertical.setAttribute('fill', colorSquare)
    } else {
      calculatedHorizontal.setAttribute('fill', CALCULATED_EMPTY_COLOR)
      calculatedVertical.setAttribute('fill', CALCULATED_EMPTY_COLOR)
    }
    calculatedHorizontal.textContent = calcHorizontal
    calculatedVertical.textContent = calcVertical
    let pos_y = this.#data.settings.verticalNumbersLength * this.#size
    calculatedHorizontal.setAttribute('y', pos_y + this.#size * (j + 0.9))
    let pos_x = this.#data.settings.horizontalNumbersLength * this.#size
    calculatedVertical.setAttribute('x', pos_x + this.#size * (i + 0.5))
  }

  #cleanAllSquaresAndMarksAux() {
    for (let i = 0; i < this.#data.settings.width; i++) {
      for (let j = 0; j < this.#data.settings.height; j++) {
        let squareAux = document.getElementById('square_aux_' + i + '.' + j)
        if (squareAux.getAttribute('opacity') == '1') {
          if (i != this.#squareI || j != this.#squareJ) {
            squareAux.setAttribute('fill', this.#data.colors[0])
            squareAux.setAttribute('opacity', '0')
          }
        }
        let markAux = document.getElementById('mark_aux_' + i + '.' + j)
        if (markAux.getAttribute('opacity') == '1') {
          if (i != this.#squareI || j != this.#squareJ) {
            markAux.setAttribute('opacity', '0')
          }
        }
      }
    }
  }

  #refreshSquareAndMark(i, j) {
    let squareAux = document.getElementById('square_aux_' + i + '.' + j)
    let square = document.getElementById('square_' + i + '.' + j)
    let markAux = document.getElementById('mark_aux_' + i + '.' + j)
    let mark = document.getElementById('mark_' + i + '.' + j)
    if (this.#markSelected) {
      let squareColor = square.getAttribute('fill')
      if (squareColor == this.#data.colors[0]) markAux.setAttribute('opacity', '1')
    } else if (this.#colorSquare == this.#data.colors[0]) {
      squareAux.setAttribute('fill', this.#colorSquare)
      squareAux.setAttribute('opacity', '1')
      markAux.setAttribute('opacity', '0.1')
    } else {
      let squareColor = square.getAttribute('fill')
      let markOpacity = mark.getAttribute('opacity')
      if (squareColor == this.#data.colors[0] && markOpacity == '0') {
        squareAux.setAttribute('fill', this.#colorSquare)
        squareAux.setAttribute('opacity', '1')
      }
    }
  }

  #invertColor(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1)
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
    return '#' + this.#padZero(r) + this.#padZero(g) + this.#padZero(b)
  }

  #padZero(str, len) {
    len = len || 2
    let zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
  }
  //#endregion

  //#region Event Functions
  #markSquareColor(evt) {
    let id = evt.target.getAttribute('id')
    id = id.replace('squareColor_', '')
    this.#colorSelected = this.#data.colors[id]
    evt.target.setAttribute('stroke-width', '3')
    for (let i = 1; i < this.#data.colors.length; i++) {
      let squareColor = document.getElementById('squareColor_' + i)
      if (i != id) squareColor.setAttribute('stroke-width', '1')
    }
    this.#refreshCursor()
  }

  #highlightSquare(evt) {
    if (!this.#totalValidated && !this.#freeze) {
      let id = evt.target.getAttribute('id')
      id = id.replace('square_aux_', '')
      let idSplited = id.split('.')
      let i = parseInt(idSplited[0])
      let j = parseInt(idSplited[1])
      let verticalLine = document.getElementById('line_0.' + i)
      verticalLine.setAttribute('stroke', RULE_COLOR)
      if (i % this.#data.settings.gridLength != 0) verticalLine.setAttribute('stroke-width', '2')
      let horizontalLine = document.getElementById('line_1.' + j)
      horizontalLine.setAttribute('stroke', RULE_COLOR)
      if (j % this.#data.settings.gridLength != 0) horizontalLine.setAttribute('stroke-width', '2')
      i = i + 1
      j = j + 1
      verticalLine = document.getElementById('line_0.' + i)
      verticalLine.setAttribute('stroke', RULE_COLOR)
      if (i % this.#data.settings.gridLength != 0) verticalLine.setAttribute('stroke-width', '2')
      horizontalLine = document.getElementById('line_1.' + j)
      horizontalLine.setAttribute('stroke', RULE_COLOR)
      if (j % this.#data.settings.gridLength != 0) horizontalLine.setAttribute('stroke-width', '2')
    }
  }

  #fadeSquare(evt) {
    if (!this.#totalValidated && !this.#freeze) {
      let id = evt.target.getAttribute('id')
      id = id.replace('square_aux_', '')
      let idSplited = id.split('.')
      let i = parseInt(idSplited[0])
      let j = parseInt(idSplited[1])
      let verticalLine = document.getElementById('line_0.' + i)
      verticalLine.setAttribute('stroke', LINE_COLOR)
      if (i % this.#data.settings.gridLength != 0) verticalLine.setAttribute('stroke-width', '1')
      let horizontalLine = document.getElementById('line_1.' + j)
      horizontalLine.setAttribute('stroke', LINE_COLOR)
      if (j % this.#data.settings.gridLength != 0) horizontalLine.setAttribute('stroke-width', '1')
      i = i + 1
      j = j + 1
      verticalLine = document.getElementById('line_0.' + i)
      verticalLine.setAttribute('stroke', LINE_COLOR)
      if (i % this.#data.settings.gridLength != 0) verticalLine.setAttribute('stroke-width', '1')
      horizontalLine = document.getElementById('line_1.' + j)
      horizontalLine.setAttribute('stroke', LINE_COLOR)
      if (j % this.#data.settings.gridLength != 0) horizontalLine.setAttribute('stroke-width', '1')
      let calculatedHorizontal = document.getElementById('calculated_0')
      calculatedHorizontal.textContent = ''
      let calculatedVertical = document.getElementById('calculated_1')
      calculatedVertical.textContent = ''
    }
  }

  #initColorsChange(evt) {
    if (!this.#totalValidated && evt.button != 1 && !this.#freeze) {
      let id = evt.target.getAttribute('id')
      id = id.replace('square_aux_', '')
      let idSplited = id.split('.')
      this.#squareI = parseInt(idSplited[0])
      this.#squareJ = parseInt(idSplited[1])
      let square = document.getElementById('square_' + this.#squareI + '.' + this.#squareJ)
      this.#colorSquare = square.getAttribute('fill')
      let markAux = document.getElementById('mark_aux_' + this.#squareI + '.' + this.#squareJ)
      let mark = document.getElementById('mark_' + this.#squareI + '.' + this.#squareJ)
      let markOpacity = mark.getAttribute('opacity')
      this.#markSelected = false
      if (this.#colorSquare == this.#data.colors[0]) {
        if (markOpacity == '0') {
          if (evt.button == 0) {
            evt.target.setAttribute('fill', this.#colorSelected)
            evt.target.setAttribute('opacity', '1')
            square.setAttribute('fill', this.#colorSelected)
            square.setAttribute('opacity', '1')
            this.#colorSquare = this.#colorSelected
          } else {
            markAux.setAttribute('opacity', '1')
            mark.setAttribute('opacity', '1')
            this.#markSelected = true
          }
        } else {
          if (evt.button == 0) {
            evt.target.setAttribute('fill', this.#colorSelected)
            evt.target.setAttribute('opacity', '1')
            square.setAttribute('fill', this.#colorSelected)
            square.setAttribute('opacity', '1')
            this.#colorSquare = this.#colorSelected
          }
          markAux.setAttribute('opacity', '0.1')
          mark.setAttribute('opacity', '0')
        }
      } else {
        if (evt.button == 0) {
          if (this.#colorSquare != this.#colorSelected) {
            evt.target.setAttribute('fill', this.#colorSelected)
            square.setAttribute('fill', this.#colorSelected)
            this.#colorSquare = this.#colorSelected
          } else {
            evt.target.setAttribute('fill', this.#data.colors[0])
            evt.target.setAttribute('opacity', '0')
            square.setAttribute('fill', this.#data.colors[0])
            square.setAttribute('opacity', '0')
            this.#colorSquare = this.#data.colors[0]
          }
        } else {
          evt.target.setAttribute('fill', this.#data.colors[0])
          evt.target.setAttribute('opacity', '0')
          square.setAttribute('fill', this.#data.colors[0])
          square.setAttribute('opacity', '0')
          markAux.setAttribute('opacity', '1')
          mark.setAttribute('opacity', '1')
          this.#markSelected = true
        }
      }
      this.#clicked = true
      this.#refreshCalculatedValues(this.#squareI, this.#squareJ)
    }
  }

  #changeColorSquares(evt) {
    if (!this.#totalValidated && !this.#freeze) {
      let id = evt.target.getAttribute('id')
      id = id.replace('square_aux_', '')
      let idSplited = id.split('.')
      let i = parseInt(idSplited[0])
      let j = parseInt(idSplited[1])
      let count = 0
      if (this.#clicked) {
        this.#cleanAllSquaresAndMarksAux()
        if (i > this.#squareI && j == this.#squareJ) {
          count = this.#squareI
          while (count <= i) {
            this.#refreshSquareAndMark(count, this.#squareJ)
            count++
          }
        } else if (i < this.#squareI && j == this.#squareJ) {
          count = i
          while (count <= this.#squareI) {
            this.#refreshSquareAndMark(count, this.#squareJ)
            count++
          }
        } else if (i == this.#squareI && j > this.#squareJ) {
          count = this.#squareJ
          while (count <= j) {
            this.#refreshSquareAndMark(this.#squareI, count)
            count++
          }
        } else if (i == this.#squareI && j < this.#squareJ) {
          count = j
          while (count <= this.#squareJ) {
            this.#refreshSquareAndMark(this.#squareI, count)
            count++
          }
        }
      }
      this.#refreshCalculatedValues(i, j)
    }
  }

  #markSquareNumber(evt) {
    if (!this.#totalValidated && !this.#freeze) {
      let opacity = evt.target.getAttribute('opacity')
      let id = evt.target.getAttribute('id')
      id = id.replace('squareNumber_', '')
      let idSplited = id.split('.')
      let orientation = parseInt(idSplited[0])
      let i = parseInt(idSplited[1])
      let j = parseInt(idSplited[2])
      let number = document.getElementById('number_' + orientation + '.' + i + '.' + j)
      if (opacity == '1') {
        evt.target.setAttribute('opacity', '0')
        number.setAttribute('fill', evt.target.getAttribute('fill'))
        number.setAttribute('font-weight', 'bold')
      } else {
        evt.target.setAttribute('opacity', '1')
        number.setAttribute('fill', NUMBER_DEFAULT_COLOR)
        number.setAttribute('font-weight', 'normal')
      }
    }
  }

  #markNumber(evt) {
    if (!this.#totalValidated && !this.#freeze) {
      let fill = evt.target.getAttribute('fill')
      let id = evt.target.getAttribute('id')
      id = id.replace('number_', '')
      let idSplited = id.split('.')
      let orientation = parseInt(idSplited[0])
      let i = parseInt(idSplited[1])
      let j = parseInt(idSplited[2])
      let squareNumber = document.getElementById('squareNumber_' + orientation + '.' + i + '.' + j)
      if (fill == this.#data.colors[0]) {
        squareNumber.setAttribute('opacity', '0')
        evt.target.setAttribute('fill', squareNumber.getAttribute('fill'))
        evt.target.setAttribute('font-weight', 'bold')
      } else {
        squareNumber.setAttribute('opacity', '1')
        evt.target.setAttribute('fill', NUMBER_DEFAULT_COLOR)
        evt.target.setAttribute('font-weight', 'normal')
      }
    }
  }

  #switchSquareColor() {
    let palette = document.getElementById('palette').children
    if (palette.length > 0) {
      let selected = 0
      for (let i = 0; i < palette.length; i++) {
        if (palette[i].getAttribute('stroke-width') == 3) {
          if (i == palette.length - 1) selected = 0
          else selected = i + 1
          break
        }
      }
      this.#colorSelected = this.#data.colors[selected + 1]
      palette[selected].setAttribute('stroke-width', '3')
      for (let i = 1; i < this.#data.colors.length; i++) {
        let squareColor = document.getElementById('squareColor_' + i)
        if (i != selected + 1) squareColor.setAttribute('stroke-width', '1')
      }
      this.#refreshCursor()
    }
  }

  #endColorsChange() {
    if (this.#clicked && this.#data) {
      let move = {
        action: this.#markSelected ? 'MARK' : 'PAINT',
        color: this.#colorSelected,
        squares: [],
      }
      for (let i = 0; i < this.#data.settings.width; i++) {
        for (let j = 0; j < this.#data.settings.height; j++) {
          let squareAux = document.getElementById('square_aux_' + i + '.' + j)
          if (squareAux.getAttribute('opacity') == '1') {
            let id = squareAux.getAttribute('id')
            id = id.replace('square_aux_', 'square_')
            let square = document.getElementById(id)
            let squareColor = squareAux.getAttribute('fill')
            let previousColor = square.getAttribute('fill')
            square.setAttribute('fill', squareColor)
            if (squareColor == this.#data.colors[0]) square.setAttribute('opacity', '0')
            else square.setAttribute('opacity', '1')
            squareAux.setAttribute('fill', this.#data.colors[0])
            squareAux.setAttribute('opacity', '0')
            move.squares.push({ i, j, previousColor })
            if (this.#showErrorsImmediately) {
              let errorMark = document.getElementById('error_mark_' + i + '.' + j)
              if (
                squareColor == this.#data.colors[this.#data.points[j][i]] ||
                squareColor == this.#data.colors[0]
              ) {
                errorMark.setAttribute('opacity', '0')
              } else {
                errorMark.setAttribute('fill', this.#invertColor(squareColor))
                errorMark.setAttribute('opacity', '1')
              }
            }
          }
          let markAux = document.getElementById('mark_aux_' + i + '.' + j)
          if (markAux.getAttribute('opacity') == '1') {
            let id = markAux.getAttribute('id')
            id = id.replace('mark_aux_', 'mark_')
            let mark = document.getElementById(id)
            mark.setAttribute('opacity', '1')
            markAux.setAttribute('opacity', '0')
            move.squares.push({ i, j })
            if (this.#showErrorsImmediately) {
              let errorMark = document.getElementById('error_mark_' + i + '.' + j)
              errorMark.setAttribute('opacity', '0')
            }
          } else if (markAux.getAttribute('opacity') == '0.1') {
            let id = markAux.getAttribute('id')
            id = id.replace('mark_aux_', 'mark_')
            let mark = document.getElementById(id)
            mark.setAttribute('opacity', '0')
            markAux.setAttribute('opacity', '0')
            move.squares.push({ i, j })
            move.action = 'UNMARK'
          }
        }
      }
      this.#clicked = false
      this.#validate()
      this.#addState()
      let receiveMoveEvent = new CustomEvent('receiveMove', { detail: move })
      document.dispatchEvent(receiveMoveEvent)
    }
  }
  //#endregion
}
