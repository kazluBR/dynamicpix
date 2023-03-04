# DynamicPix

Javascript library to generate nonograms through a pixel editor and an interface to play them

## Files

On /dist you can find the files you need

| File                                                                                                  | Description         |
| ----------------------------------------------------------------------------------------------------- | ------------------- |
| [editor.js](/dist/editor.js)                                                                          | javascript es6 file |
| [editor-min.js](https://cdn.jsdelivr.net/gh/kazluBR/dynamicpix/dist/editor/1.0.0/editor-min.js)       | javascript minified |
| [nonogram.js](/dist/nonogram.js)                                                                      | javascript es6 file |
| [nonogram-min.js](https://cdn.jsdelivr.net/gh/kazluBR/dynamicpix/dist/nonogram/1.0.0/nonogram-min.js) | javascript minified |

## Editor

Try online on [CodePen](https://codepen.io/kazluBR/full/WNpvEJz).

![alt text](/docs/editor_view.png)

### Documentation

To use the default config of editor you need a div with name "editor" and then load the script as following:

```html
<div id="editor"></div>
<script src="editor.js"></script>
<script>
  const edt = new editor()
  edt.init()
</script>
```

You can configure this settings to customize your editor:

```javascript
const config = {
  size: int, // defaults to 20
  width: int, // defaults to 5
  height: int, // defaults to 5
  gridLength: int, // defaults to 5
  palette: list, // defaults to fixed palette with black and white colors
}
const edt = new editor(config)
```

| Method               | Description                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| init(data)           | Initialize editor with the settings and optionally load the drawing when passing the data parameter |
| maximize(value)      | Increases the editor area                                                                           |
| minimize(value)      | Decreases the editor area                                                                           |
| undo()               | Undo the last modification                                                                          |
| redo()               | Redo the next modification                                                                          |
| setGridLength(value) | Sets the size of the editor grid                                                                    |
| setPalette(list)     | Sets the palette passing a list of colors in hexadecimal                                            |
| generateJson()       | Exports the drawing to json string format compatible with the game view                             |

### Controls

| Mouse         | Action                                                              |
| ------------- | ------------------------------------------------------------------- |
| Left Click    | Paint square with the selected color                                |
| Left Pressing | Paint the squares with the selected color while you hover over them |
| Left Release  | Stop painting squares                                               |
| Middle Click  | Switch color to paint (or you can select directly from the palette) |

## Nonogram

Try online on [CodePen](https://codepen.io/kazluBR/full/pJqrgY).

![alt text](/docs/nonogram_view.png)

### Documentation

To use the default config of nonogram you need a div with name "nonogram" and a input file to get the generate json data as following:

```html
<input type="file" onchange="loadJson(event)" />
<div id="nonogram"></div>
<script src="nonogram.js"></script>
<script>
  const nng = new nonogram()
  function loadJson(event) {
    let files = event.target.files
    if (files.length <= 0) {
      return false
    }
    let fr = new FileReader()
    fr.onload = function (e) {
      let data = JSON.parse(e.target.result)
      nng.init(data)
    }
    fr.readAsText(files.item(0))
  }
</script>
```

You can configure this settings to customize your nonogram:

```javascript
const config = {
  size: int, // defaults to 20
  showErrorsOnCheck: bool, // defaults to false
  showErrorsImmediately: bool, // defaults to false
  finishCallback: () => {}, // defaults to alert('Puzzle Finished!')
}
const nng = new nonogram(config)
```

| Method                | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| init(data, saveState) | Initialize the nonogram with the json data passed and optionally load the saved state |
| maximize(value)       | Increases the editor area                                                             |
| minimize(value)       | Decreases the editor area                                                             |
| undo()                | Undo the last modification                                                            |
| redo()                | Redo the next modification                                                            |
| check()               | Checks for current errors in the puzzle                                               |
| solve()               | Reveals the solution of the puzzle                                                    |
| getState()            | Exports the current state to a string                                                 |
| loadState(state)      | Load the nonogram state through string                                                |
| makeMove(move)        | Makes move through Move Object                                                        |
| undoMove(move)        | Undo move through Move Object                                                         |
| freeze()              | Prevents play moves                                                                   |
| unfreeze()            | Releases play moves                                                                   |

### Controls

| Mouse          | Action                                                              |
| -------------- | ------------------------------------------------------------------- |
| Left Click     | Paint the square with the selected color                            |
| Left Pressing  | Paint the squares with the selected color while you hover over them |
| Left Release   | Stop painting squares                                               |
| Right Click    | Mark the square to indicate that it should not be painted           |
| Right Pressing | Mark the squares while you hover over them                          |
| Right Release  | Stop marking squares                                                |
| Middle Click   | Switch color to paint (or you can select directly from the palette) |

### Events

You can configure an event listener to show the moves made:

```javascript
document.addEventListener('receiveMove', (e) => {
  console.log(e.detail) // Move Object
})
```

Move Object:

```json
{
  "action": "str", // PAINT | MARK | UNMARK
  "color": "str", // Hex color
  "squares": [
    {
      "i": 0,
      "j": 0,
      "previousColor": "str" // Hex color
    }
  ]
}
```
