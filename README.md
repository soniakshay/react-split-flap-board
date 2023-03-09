
## Install Package

```sh
npm i react-split-flap-board
```

## Example

```jsx static
import React from "react";
import SplitFlapBoard from './Board/index'
import {useRef} from "react";


function App() {
    const ref =  useRef(null)
    const row =  6;
    const col = 40
    const selectedColor =  'black'
    const setTextBoard = ()=> {
        if(ref.current) {
            ref.current.setTextBoard()
        }
    }
    const setColorBoard = ()=> {
        if(ref.current) {
            ref.current.setColorBoard()
        }
    }


    const resetBoard = () => {
        if(ref.current) {
            ref.current.resetBoard()
        }
    }


    const setAlignValue = (alignValue) => {
        if(ref.current) {
            ref.current.setAlignBoardValue(alignValue)
        }

    }

    // here 0 row align left
    // selected row is 0
    const setAlignValueSelectedRow = (alignValue) => {
        if(ref.current) {
            ref.current.setAlignBoardValue(alignValue,0)
        }

    }


    return (
    <div className="App">
        <button onClick={setTextBoard}>
                Text Mode
        </button>
        <button onClick={setColorBoard}>
            Color Mode
        </button>

        <button onClick={resetBoard}>
            Reset
        </button>
        <button onClick={() => {
            setAlignValue('L')
        }}>
            Align Left
        </button>
        <button onClick={() => {
            setAlignValue('C')
        }}>
            Align Center
        </button>
        <button onClick={() => {
            setAlignValue('R')
        }}>
            Align Right
        </button>

        <button onClick={() => {
            setAlignValueSelectedRow('L')
        }}>
            First Line Left
        </button>

        <SplitFlapBoard ref={ref}
                        handleCall
                        row={row}
                        handleCallBack={(data) => {
                            console.log('Call Back Data',data)
                        }}
                        onBlurFlap={(position) => {
                               console.log('position',position)
                        }}
                        col={col}
                        // assign color value for color mode
                        selectedColor={selectedColor} 
                        
                        // only enter this char in flap
                        availableCharacters={[
                                        " ",
                                        "!",
                                        "#",
                                        "%",
                                        "'",
                                        "+",
                                        ",",
                                        "-",
                                        ".",
                                        "0",
                                        "1",
                                        "2",
                                        "3",
                                        "4",
                                        "5",
                                        "6",
                                        "7",
                                        "8",
                                        "9",
                                        ":",
                                        "?",
                                        "@",
                                        "A",
                                        "B",
                                        "C",
                                        "D",
                                        "E",
                                        "F",
                                        "G",
                                        "H",
                                        "I",
                                        "J",
                                        "K",
                                        "L",
                                        "M",
                                        "N",
                                        "O",
                                        "P",
                                        "Q",
                                        "R",
                                        "S",
                                        "T",
                                        "U",
                                        "V",
                                        "W",
                                        "X",
                                        "Y",
                                        "Z",
                                        "°"
                                    ]}
                                isReadOnlyInputs={false} // when read only value is true then not enter text in textmode
                                config={{
                                        alignRowValue:['C','C','C','C','C','C'], // In this case 6 row then asign rowvalue for each row  (rowAlign Value : (C || R || L))
                                        defaultString:'Split Flap Board', // this default text
                                        colorPath:[]

                                  }}/>

    </div>
  );
}

export default App;
```

