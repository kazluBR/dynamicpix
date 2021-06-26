# DynamicPix
A javascript library to generate nonograms through a pixel editor and an interface to play them

## Editor
Try online on [CodePen](https://codepen.io/kazluBR/full/WNpvEJz).

![alt text](/docs/editor_view.png)

### Documentation
To use the default config of editor you need a div with name "editor" and then load the script as following:

```html
    <div id="editor"></div>
    <script src="editor.js"></script>
    <script>
      const edt = new editor();
	  edt.init();
    </script>
```

You can configure this settings to customize your editor:

```javascript
    const config = {
      size : int,
      //defaults to 20
      width : int, 
      //defaults to 5
      height : int 
      //defaults to 5
      gridLength : int, 
      //defaults to 5
      currentColor: hex, 
      //defaults to #000000
      backgroundColor: hex, 
      //defaults to #ffffff
    }
    const edt = new editor(config);
```

| Method | Description |
| - | - |
| init() | Initialize editor with the settings |
| maximize(value) | Increases the editor area |
| minimize(value) | Decreases the editor area |
| undo() | Undo the last modification |
| redo() | Redo the next modification |
| setGridLength(value) | Sets the size of the editor grid |
| setCurrentColor(value) | Sets the color to paint and stores the list of used colors |
| setBackgroundColor(value) | Sets the background color of the drawing |
| exportJson() | Exports the drawing to json format compatible with the game view |

### Controls
| Mouse | Action |
| - | - |
| Left Click | Paint square with the selected color |
| Left Pressing | Paint the squares with the selected color while you hover over them |
| Left Release | Stop painting squares |

## Game
Try online on [CodePen](https://codepen.io/kazluBR/full/pJqrgY).

![alt text](/docs/game_view.png)

### Documentation
To use the default config of nonogram you need a div with name "nonogram" and a input file to get the generate json data as following:

```html
    <input type="file" onchange="loadJson(event)"/>
    <div id="nonogram"></div>
    <script src="nonogram.js"></script>
    <script>
      const nng = new nonogram();
      function loadJson(event) {
        let files = event.target.files;
        if (files.length <= 0) {
          return false;
        }
        let fr = new FileReader();
        fr.onload = function (e) {
          let data = JSON.parse(e.target.result);
          nng.init(data);
        }
        fr.readAsText(files.item(0));
      }
    </script>
```

You can configure this settings to customize your nonogram:

```javascript
    const config = {
      size : int,
      //defaults to 20
    }
    const nng = new nonogram(config);
```

| Method | Description |
| - | - |
| init(data) | Initialize the nonogram with the json data passed |
| maximize(value) | Increases the editor area |
| minimize(value) | Decreases the editor area |
| undo() | Undo the last modification |
| redo() | Redo the next modification |
| check() | Checks for current errors in the puzzle |
| solve() | Reveals the solution of the puzzle |

### Controls
| Mouse | Action |
| - | - |
| Left Click | Paint the square with the selected color |
| Left Pressing | Paint the squares with the selected color while you hover over them |
| Left Release | Stop painting squares |
| Right Click | Mark the square to indicate that it should not be painted  |
| Right Pressing | Mark the squares while you hover over them |
| Right Release | Stop marking squares |
| Middle Click | Switch color to paint (or you can select directly from the palette) |