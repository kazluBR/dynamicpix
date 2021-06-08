# DynamicPix
A nonogram puzzle dynamically assembled. You can draw pictures and play them!

## Editor
Here you can create a drawing by choosing its width and height. You can use different colors. When finished, you can save the json file. Try online on [CodePen](https://codepen.io/kazluBR/full/WNpvEJz).

![alt text](/docs/editor_view.png)

### Menu
![alt text](/docs/editor_menu.png)
- Maximize: Increases the editor area
- Minimize: Decreases the editor area
- Undo: Undo the last modification
- Redo: Redo the next modification
- Export to Json: Exports the drawing to json format compatible with the game view
- Grid Length: Specifies the size of the editor grid
- Input Color: Selects the color to paint and stores the list of used colors


### Controls
| Mouse | Action |
| - | - |
| Left Click | Paint square with the selected color |
| Left Pressing | Paint the squares with the selected color while you hover over them |
| Left Release | Stop painting squares |

## Game
Here you choose the json file created from the drawing and the nonogram will be generated ready to play. You can also load the ready samples that are in the samples folder. Try online on [CodePen](https://codepen.io/kazluBR/full/pJqrgY).

![alt text](/docs/game_view.png)

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

### Menu
![alt text](/docs/game_menu.png)
- Select a Json File: Select editor generated json to load the puzzle
- Maximize: Increases the editor area
- Minimize: Decreases the editor area
- Undo: Undo the last modification
- Redo: Redo the next modification
- Check Puzzle: Checks for current errors in the puzzle
- Restart Puzzle: Reset the puzzle to the beginning
- Show Solution: Reveals the solution of the puzzle
