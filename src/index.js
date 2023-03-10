import React,{forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import { cloneDeep, trimEnd, trimStart } from 'lodash';
import './global.css';


export const FillColorKeyIdPrefix = 'fillColor';
export const InputColumnIdPrefix = 'flipInput-column';
export const TRANSPARENT = 'transparent';
export const ERASE_EMOJI = 'eraseEmoji';
export const InputColorColumnPrefix = 'flipColor-column';
export const EmojiKeyIdPreFix = 'fillEmoji';


export const TextAlign = {
    LEFT: 'L',
    RIGHT: 'R',
    CENTER: 'C',
    AUTO:'A',
};

export const convertStringtoArrForBoard = (str, col = 40, row = 6) => {
    const renderArr = [];
    let rowIndex = 0;
    let stringIndex = 0 ;
    for (let h = 0; h < str?.length; h++) {
        if (renderArr[rowIndex] && renderArr[rowIndex].length  === col && str.charCodeAt(h) !== 10 ) {
            rowIndex++;
        }
        if (str.charCodeAt(h) === 10) {
            rowIndex ++;
        } else {
            const arrStringValue = renderArr[rowIndex] || '';
            renderArr[rowIndex] =  arrStringValue  + str.charAt(stringIndex);
        }
        stringIndex++;
    }

    if (renderArr.length && renderArr.length > row) {
        return  renderArr.slice(0, row);
    }

    return renderArr;
};


function SplitFlapBoard ({
                             isReadOnlyInputs =  false,
                             boardOverLay,
                             config: selectedObj,
                             selectedColor,
                             row,
                             col,
                             selectedEmoji,
                             availableCharacters,
                             onBlurFlap = null,
                             blockColumns = [],handleCallBack = null},  forwardedRef,) {
    const validFunctionKey = [
        'Tab',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'Backspace',
        'Enter',
    ];

    const [value, setValue] = useState(selectedObj?.defaultString);
    const [textAreaDisable, setTextAreaDisable] = useState(selectedObj?.isInlineEditMode);
    const [alignArr, setAlignArr] = useState(selectedObj?.alignRowValue);
    const [focusInputPostion, setFocusInputPostion] = useState(null);
    const [isMouseDown, setMouseDown] = useState(false);
    const [isTextMode, setTextMode] = useState(true);
    const [isColorMode, setColorMode] = useState(false);
    const [boardColorPath, setBoardColorPath] = useState([]);
    const [integration, setIntegration] = useState(selectedObj?.integrations);
    const [isEmojiMode, setEmojiMode] = useState(false);
    const [isInit, setInit] = useState(false);
    const refs = useRef([]);


    const getCursorLoc = () => {
        // Get the location of the box that should be in focus based on cursor position
        // @ts-ignore
        let text = document.getElementById('mainTextArea').value;

        let cursorIndices = [
            // @ts-ignore
            document.getElementById('mainTextArea').selectionStart,
            // @ts-ignore
            document.getElementById('mainTextArea').selectionEnd,
        ];

        let indices = [];
        for (let cursorIndex of cursorIndices) {
            let preText = text.slice(0, cursorIndex);
            let preLines = preText.split('\n');
            let lineIndex = preLines.length - 1;
            let innerIndex = preLines[lineIndex].length;
            indices.push(lineIndex);
            indices.push(innerIndex);
        }

        return indices;
    };
    const isElementExist = (id) => {
        return !!document.getElementById(id);
    };
    const isValidChar = (char) => {
        const valid = availableCharacters;
        const notValid = [];
        let isValid = true;
        valid.map((ele) => {
            notValid.push(String(ele).charCodeAt(0));
            notValid.push(String(ele).toLowerCase().charCodeAt(0));
        });



        if (char.length === 1) {
            if (!notValid.includes(char.charCodeAt(0))) {
                isValid = false;
            }
        } else {
            isValid = validFunctionKey.includes(char);
        }
        return isValid;
    };
    const setTextInputValue = ({ rowI, colI, val = '', isAnimation =  false }) => {
        // @ts-ignore
        const input =  refs.current[rowI][colI];
        // )  as HTMLInputElement;
        if (val !== '' && isAnimation) {
            const interVal =  setInterval( () => {
                const string  = 'ASDFGHJKL:LKJHGFDFGHJKLOPI&^%$#$%^&*()_)(*&^%$ERFGHJKLKJHGFDFGHJKLOIUYTRTYUI';
                const rendomChar = Math.floor(Math.random() * string.length);
                input.value =  string.charAt(rendomChar);
            }, 100);
            setTimeout(() => {
                clearInterval(interVal);
                input.value =  val;
            }, 1000);



        } else {
            input.value =  val;
        }



    };
    // const setTextInputValueForAnimation = ({ rowI, colI, val = '' }) => {
    //     // @ts-ignore
    //     // let x = document.getElementById('flapAudio');
    //     // x.playbackRate = 0.5;
    //     const input =  refs.current[rowI][colI];
    //
    //
    //     const interVal =  setInterval( () => {
    //         const string  =  availableCharacters && availableCharacters.length > 10 ?  availableCharacters.join('') :  'ASDFGHJKL:LKJHGFDFGHJKLOPI&^%$#$%^&*()_)(*&^%$ERFGHJKLKJHGFDFGHJKLOIUYTRTYUI';
    //         const randomChar = Math.floor(Math.random() * string.length);
    //         input.value =  string.charAt(randomChar);
    //         // x.play();
    //     }, 100);
    //
    //
    //     setTimeout(() => {
    //         clearInterval(interVal);
    //         input.value =  val;
    //         const { animationSetting: { animationStyle } } = selectedObj;
    //         if (animationStyle === AnimationStyle.LEFT_TO_RIGHT) {
    //             if (colI === (col - 1)) {
    //                 setAnimationRunnig(false);
    //             }
    //
    //         }
    //         if (animationStyle ===  AnimationStyle.RIGHT_TO_LEFT) {
    //             if (colI === 0) {
    //                 setAnimationRunnig(false);
    //             }
    //
    //         }
    //     }, 3000);
    //
    //
    //
    // };
    const setTextInputValueSelect = ({ rowI, colI }) => {
        if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
            // @ts-ignore
            const input =  refs.current[rowI][colI];
            input.select();
        }
    };
    const setTextInputFocus = ({ rowI, colI }) => {
        if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
            // @ts-ignore
            const input =  refs.current[rowI][colI];
            input?.focus();
        }
    };
    const getTextInputValue = ({ rowI, colI, val = '' }) => {
        // @ts-ignore
        const input = refs.current[rowI][colI];
        return input?.value || val;
    };
    const getBoardString = () => {
        let arrIndex = 0;
        const strArr = [];
        for (let rowI = 0; rowI < row; rowI++) {
            let str;
            for (let colI = 0; colI < col; colI++) {
                if (str) {
                    str = str + getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                } else {
                    str = getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                }
            }
            strArr[arrIndex] = str;
            arrIndex++;
        }
        return strArr.join('');
    };
    // print board
    const printBoardLeftAlign = ({ strArr, rowIndex, index }) => {
        for (let colI = 0; colI < col; colI++) {
            if (
                isElementExist(`${InputColumnIdPrefix}-row-${rowIndex}-col-${colI}`)
            ) {
                if (strArr[index]) {
                    setTextInputValue({
                        rowI: rowIndex,
                        colI: colI,
                        val: strArr[index].charAt(colI),
                    });
                }
            }
        }
    };
    const printBoardRightAlign = ({ strArr, rowIndex, index }) => {
        if (strArr[index]?.length) {
            let startPoint = col - (strArr[index].length - 1) - 1;
            let stringIncrementCounter = 0;
            for (let colI = startPoint; colI < col; colI++) {
                if (
                    isElementExist(`${InputColumnIdPrefix}-row-${rowIndex}-col-${colI}`)
                ) {
                    setTextInputValue({
                        rowI: rowIndex,
                        colI: colI,
                        val: strArr[index].charAt(stringIncrementCounter),
                    });
                    stringIncrementCounter++;
                }
            }
        }
    };
    const printBoardCentertAlign = ({ strArr, rowIndex, index }) => {
        if (strArr[index]) {
            let startPoint = Math.floor(col / 2 - Math.floor(strArr[index]?.length / 2));
            let stringInc = 0;
            for (let colI = 0; colI < col; colI++) {
                if (
                    isElementExist(
                        `${InputColumnIdPrefix}-row-${rowIndex}-col-${startPoint}`,
                    )
                ) {
                    if (strArr[index]) {
                        setTextInputValue({
                            rowI: rowIndex,
                            colI: startPoint,
                            val: strArr[index].charAt(stringInc),
                        });
                        startPoint++;
                        stringInc++;
                    }
                }
            }
        }
    };

    const printBoard = (str, stringArr = null, alignmentArr) => {
        let strArr = stringArr ?  stringArr : convertStringtoArrForBoard(str, col, row);
        let stringPosIndex = 0;
        for (
            let rowIndex =
                Math.round(alignmentArr.length / 2) - Math.round(strArr.length / 2);
            rowIndex < alignmentArr.length;
            rowIndex++
        ) {
            if (alignmentArr[rowIndex] === TextAlign.LEFT) {
                printBoardLeftAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }
            if (alignmentArr[rowIndex] === TextAlign.RIGHT) {
                printBoardRightAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }

            if (alignmentArr[rowIndex] === TextAlign.CENTER) {
                printBoardCentertAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }
            stringPosIndex++;
        }
        // alignArr.forEach((alignValue, alignArrIndex: number) => {
        //   if (alignValue === TextAlign.LEFT) {
        //     printBoardLeftAlign({ strArr, index:alignArrIndex });
        //   }
        //   if (alignValue === TextAlign.RIGHT) {
        //     printBoardRightAlign({ strArr, index:alignArrIndex });
        //   }
        //
        //   if (alignValue === TextAlign.CENTER) {
        //     printBoardCentertAlign({ strArr, index:alignArrIndex });
        //   }
        // });
    };
    const createArrayBoarValue = ({ colorPath =  selectedObj.colorPath }) => {
        const screenSet = [];
        alignArr.map((val, rowIndex) => {
            const rowData = [];
            for (let column = 0; column < col; column++) {
                const columnValue = getTextInputValue({
                    rowI: rowIndex,
                    colI: column,
                    val: null,
                });
                const colorPathValue = colorPath.find(
                    ({ key }) =>
                        key === `${FillColorKeyIdPrefix}-row-${rowIndex}-col-${column}`,
                );
                // const findEmoji = selectedObj.emojiPath.find(
                //     ({ key }) => key === `${EmojiKeyIdPreFix}-row-${rowIndex}-col-${column}`,
                // );
                const blockColumn =  blockColumns.includes(column);
                if (blockColumn) {
                    const columnObj = {
                        type: 0,
                    };
                    rowData.push(columnObj);
                } else if (colorPathValue) {
                    const columnObj = {
                        type: 2,
                        hex_code: colorPathValue?.color,
                    };
                    rowData.push(columnObj);
                }
                    // else if (findEmoji) {
                    //     const columnObj = {
                    //         type: 3,
                    //         filename: findEmoji?.name,
                    //     };
                    //     rowData.push(columnObj);
                    //
                // }
                else if (columnValue?.trim()) {
                    const columnObj = {
                        type: 1,
                        char: columnValue.toUpperCase(),
                    };
                    rowData.push(columnObj);
                } else {
                    const columnObj = {
                        type: 0,
                    };
                    rowData.push(columnObj);
                }
            }
            screenSet.push(rowData);
        });

        return screenSet;
    };
    const resetInput = () => {
        for (let rowI = 0; rowI < row; rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
                    setTextInputValue({ rowI: rowI, colI: colI, val: '' });
                }
                // document.getElementById(`${FillColorKeyIdPrefix}-row-${rowI}-col-${colI}`);
            }
        }
    };
    const setBoardValue = (str) => {
        //reset all inout
        resetInput();
        printBoard(str, null, selectedObj?.alignRowValue);
        setTimeout(() => {
            if (handleCallBack && !isInit) {
                handleCallBack({
                    string: str,
                    align: alignArr,
                    isInlineEditMode: textAreaDisable,
                    stringArray: createArrayBoarValue({}),
                });
            }
        }, 20);
    };
    const handleRestrictedChar = (event) => {
        if (!isValidChar(event.key)) {
            event.preventDefault();
        }
    };
    // textarea event
    const onChnageForTextArea = (e) => {
        setValue(e.target.value);
        setFocusInputPostion(null);
    };
    const onMouseUpForTextArea = () => {};
    const onKeyChangeForTextArea = (event) => {
        const getPos = getCursorLoc();
        handleRestrictedChar(event);
        if (event.key === 'Enter' && getPos[0] === row - 1) {
            event.preventDefault();
        }
        if (event.target.value.length === row * col) {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            let stopNewLine = false;
            for (let i = 0; i < col; i++) {
                if (getTextInputValue({ rowI: row - 1, colI: i }) &&
                    getTextInputValue({ rowI: 0, colI: i })) {
                    stopNewLine = true;
                }
            }
            if (stopNewLine) {
                event.preventDefault();
            }
        }
    };
    const getBoardValue = (isTrimString =  false,rowIndex) => {
        const strArr = [];
        let arrIndex = 0;

        for (let rowI = 0; rowI < row; rowI++) {
            let str;
            for (let colI = 0; colI < col; colI++) {
                if (str) {
                    str = str + getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                } else {
                    str = getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                }
            }
            if (rowIndex !== null) {
                if (str.trim() !== '' && isTrimString && rowI === rowIndex) {
                    str = trimStart(str);
                    str = trimEnd(str);

                }

            }  else {
                if (str.trim() !== '' && isTrimString) {
                    str = trimStart(str);
                    str = trimEnd(str);

                }
            }

            strArr[arrIndex] = str;
            arrIndex++;
        }
        return strArr;
    };
    const onChangeAlignmentBoard = (arr,rowIndex = null) => {
        const beforeStrArr = getBoardValue(true,rowIndex);
        resetInput();
        setTimeout(() => {
            printBoard('', beforeStrArr, arr);
        }, 10);
        setTimeout(() => {
            const afterStrArr = getBoardValue();
            if (handleCallBack && !isInit) {
                handleCallBack({
                    string: afterStrArr.join(''),
                    align: arr,
                    isInlineEditMode: textAreaDisable,
                    stringArray: createArrayBoarValue({}),
                });
            }
        }, 100);



    };
    // Input Events
    const handleInputChange = ({ rowIndex, colIndex, value:myVal }) => {
        const str = getBoardString();
        setTextInputValue({ rowI: rowIndex, colI: colIndex, val: myVal });
        if (handleCallBack && !isInit) {
            handleCallBack({
                string: str,
                align: alignArr,
                isInlineEditMode: textAreaDisable,
                stringArray: createArrayBoarValue({}),
            });
        }
    };
    const handleInputKeyUp = ({ event, rowIndex, colIndex }) => {
        const ctrl = event.ctrlKey ? event.ctrlKey : ((event.keyCode === 17) ? true : false);
        if (event.keyCode == 86 && ctrl) {
            event.preventDefault();
            // notificaiton.warn('You can’t paste content inside the board');
            return;
        }
        if (event.keyCode === 17) {
            event.preventDefault();
            return;
        }
        if (isValidChar(event.key)) {
            if (event.keyCode === 40) {
                rowIndex++;
                colIndex--;
                if (rowIndex < row) {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            }

            if (event.keyCode === 38) {
                rowIndex--;
                colIndex--;
            }

            if (event.keyCode === 8 || event.keyCode === 37) {
                if (event.keyCode !== 37) {
                    handleInputChange({ rowIndex, colIndex, value:  '' });
                }
                colIndex--;
                if (blockColumns.includes(colIndex)) {
                    colIndex--;
                }
                if (colIndex < 0) {
                    rowIndex--;
                    setTextInputFocus({ rowI: rowIndex, colI: col - 1 });
                    setTextInputValueSelect({ rowI: rowIndex, colI: col - 1 });
                } else {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            } else if (event.keyCode === 13) {
                // for enter
                rowIndex++;
                colIndex = 0;
                if (blockColumns.includes(colIndex)) {
                    colIndex++;
                }
                if (rowIndex < row) {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            } else {
                // tab key is allow but not inc colIndex tab default functionality
                if (event.key !== 'Tab') {
                    // arrow key code not found then print txt
                    if (event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== 38) {
                        handleInputChange({ rowIndex, colIndex, value: event.key });
                    }
                    colIndex++;
                    if (blockColumns.includes(colIndex)) {
                        colIndex++;
                    }
                }
                if (colIndex === col) {
                    rowIndex++;
                    colIndex = 0;
                    if (blockColumns.includes(colIndex)) {
                        colIndex++;
                    }
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                } else {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            }
        }
    };

    // board events
    const setAlignBoardValue = (textAlignValue,rowIndex = null) => {
        let alignArrClone = cloneDeep(alignArr);
        if (rowIndex !== null) {
            alignArrClone[rowIndex] = textAlignValue;
            setAlignArr([...alignArrClone]);
            setFocusInputPostion({
                rowIndex:rowIndex,
                colIndex:0
            })
            onChangeAlignmentBoard(alignArrClone,rowIndex);
        } else {
            for (let rowI = 0; rowI < row; rowI++) {
                alignArrClone[rowI] = textAlignValue;
            }
            setAlignArr([...alignArrClone]);
            onChangeAlignmentBoard(alignArrClone);

        }
    };
    const resetColorPath = () => {
        for (let rowI = 0; rowI < row; rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if (
                    isElementExist(`${InputColorColumnPrefix}-row-${rowI}-col-${colI}`)
                ) {
                    // @ts-ignore
                    document.getElementById(
                        `${InputColorColumnPrefix}-row-${rowI}-col-${colI}`,
                    ).style.backgroundColor = TRANSPARENT;
                }
            }
        }
    };

    const renderColorPath = () => {
        const str = getBoardString();
        resetColorPath();

        if (boardColorPath.length) {
            boardColorPath.map(({ row, col, color }) => {
                // @ts-ignore
                document.getElementById(
                    `${InputColorColumnPrefix}-row-${row}-col-${col}`,
                ).style.backgroundColor = color;
            });
        }

        if (handleCallBack && !isInit) {
            handleCallBack({
                string: str,
                align: selectedObj?.alignRowValue,
                isInlineEditMode: textAreaDisable,
                colorPath: boardColorPath,
                stringArray: createArrayBoarValue({ colorPath:  boardColorPath }),
            });
        }
    };
    const setColorPath = ({ row, col }) => {
        const str = getBoardString();
        // const emojiPathArr = selectedObj?.emojiPath;
        const findIndexForColorPathIndex = boardColorPath.findIndex(
            ({ key }) => key === `${FillColorKeyIdPrefix}-row-${row}-col-${col}`,
        );

        if (findIndexForColorPathIndex >= 0) {
            const boardColorPathClone = cloneDeep(boardColorPath);
            if (selectedColor === TRANSPARENT) {
                boardColorPathClone.splice(findIndexForColorPathIndex, 1);
                setBoardColorPath([...boardColorPathClone]);

            } else {
                if (boardColorPathClone[findIndexForColorPathIndex].color !== selectedColor) {
                    boardColorPathClone[findIndexForColorPathIndex].color = selectedColor;
                    setBoardColorPath([...boardColorPathClone]);
                }

            }
        } else {
            if (selectedColor !== TRANSPARENT) {
                const boardColorPathClone = cloneDeep(boardColorPath);
                const colorPathObj = {
                    key: `${FillColorKeyIdPrefix}-row-${row}-col-${col}`,
                    row,
                    col,
                    color: selectedColor,
                };
                boardColorPathClone.push(colorPathObj);
                setBoardColorPath([...boardColorPathClone]);
            }
        }
        if (handleCallBack && !isInit) {
            handleCallBack({
                string: str,
                align: alignArr,
                isInlineEditMode: textAreaDisable,
                // emojiPath: emojiPathArr,
                stringArray: createArrayBoarValue({}),
            });
        }
    };
    const setTextBoard = () => {

        setTextMode(true);
        setColorMode(false);
        setEmojiMode(false);
    };
    const setColorBoard = () => {

        setTextMode(false);
        setColorMode(true);
        setEmojiMode(false);
    };
    const setEmojiBoard = () => {
        setTextMode(false);
        setColorMode(false);
        setEmojiMode(true);
    };
    const onPaste = (event) => {

        // const valid = availableCharacters;
        // const notValid = [];
        // valid.map((ele) => {
        //   notValid.push(String(ele).charCodeAt(0));
        //   notValid.push(String(ele).toLowerCase().charCodeAt(0));
        // });
        // const pasteText = event.clipboardData.getData('text/plain');

        // for (let i = 0; i < pasteText.length; i++) {
        //   if (!notValid.includes(pasteText.charCodeAt(i))) {
        //     event.preventDefault();
        //   }
        // }
    };
    const parseStringForTextArea  = () => {
        const stringArr = convertStringtoArrForBoard(selectedObj?.defaultString, col, row);
        let  str = '';
        if (stringArr && stringArr.length) {
            stringArr.map((val) => {
                let string = val;
                string = trimStart(string);
                string = trimEnd(string);
                if (string === '') {
                    str  = str + string;

                } else {
                    str  = str + string + '\n';

                }
            });

        }

        return str;
    };
    const resetBoard = () => {

        resetInput();
        resetColorPath();
        setValue('');
        setTextMode(true);
        setColorMode(false);
        setEmojiMode(false);
        setTextAreaDisable(false);
        setBoardColorPath([]);
        // @ts-ignore
        const alignArray = [...Array(row).keys()].map(() => TextAlign.CENTER);
        setAlignArr(alignArray);
        if (handleCallBack) {
            handleCallBack({
                string: '',
                align: alignArray,
                isInlineEditMode: false,
                colorPath: [],
                stringArray: createArrayBoarValue({}),
                // emojiPath:[],
            });
        }
    };
    const renderEmoji = ({ row, col }) => {
        // const findEmoji = selectedObj.emojiPath.find(
        //     (slide) => row === slide.row && col === slide.col,
        // );
        // const colorPath = selectedObj.colorPath.find(
        //     (slide) => row === slide.row && col === slide.col,
        // );
        // if (findEmoji && !colorPath) {
        //     return <img src={`${findEmoji.src}`} className={'emoji'}/>;
        // }
        return <></>;
    };

    const addEmojiInInput = ({ row, col }) => {
        // const str = getBoardString();
        // // const emojiPathArr = selectedObj?.emojiPath;
        // // const isEmojiPathAlreadyExist = emojiPathArr.findIndex(
        // //     (emojiItem) => emojiItem.row === row && emojiItem.col === col,
        // // );
        // if (selectedEmoji === ERASE_EMOJI) {
        //     // if (isEmojiPathAlreadyExist >= 0) {
        //     //     // emojiPathArr.splice(isEmojiPathAlreadyExist, 1);
        //     // }
        // } else {
        //     // if (isEmojiPathAlreadyExist < 0) {
        //     //     // emojiPathArr.push({
        //     //     //     key: `${EmojiKeyIdPreFix}-row-${row}-col-${col}`,
        //     //     //     row: row,
        //     //     //     col: col,
        //     //     //     src: selectedEmoji.image,
        //     //     //     name: selectedEmoji.name,
        //     //     // });
        //     // }
        // }
        // if (isEmojiMode) {
        //     if (handleCallBack && !isInit) {
        //         handleCallBack({
        //             string: str,
        //             align: alignArr,
        //             isInlineEditMode: textAreaDisable,
        //             // emojiPath: emojiPathArr,
        //             stringArray: createArrayBoarValue({}),
        //         });
        //     }
        // }
    }


    const handleInputClick = ({ rowIndex, colIndex }) => {
        if (isTextMode) {
            setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
            setTextAreaDisable(true);
        }
        if (isColorMode) {
            setColorPath({
                row: rowIndex,
                col: colIndex,
            });
        }
    };

    useImperativeHandle(forwardedRef, () => ({
        setAlignBoardValue,
        setTextBoard,
        setColorBoard,
        resetBoard,
    }));

    useEffect(() => {
        setBoardValue(value);

    }, [value]);

    useEffect(() => {
        resetInput();
        if (!selectedObj?.isInlineEditMode) {
            setValue(parseStringForTextArea());
            setTimeout(() => {
                // onChangeAlignmentBoard(selectedObj?.alignRowValue);
            }, 20);
        } else {
            setValue(selectedObj?.defaultString);
        }
        setBoardValue(selectedObj?.defaultString);

        setAlignArr([...selectedObj?.alignRowValue]);
        setBoardColorPath([...selectedObj?.colorPath]);
        setColorMode(false);
        setTextAreaDisable(selectedObj?.isInlineEditMode);
        setTextMode(true);
        setEmojiMode(false);
        setFocusInputPostion(null);
    }, [selectedObj]);

    useEffect(() => {
        renderColorPath();
    }, [boardColorPath]);

    useEffect(() => {
        setAlignArr([...selectedObj?.alignRowValue]);
        if (!selectedObj?.isInlineEditMode) {
            setValue(parseStringForTextArea());
            setBoardValue(parseStringForTextArea());
        } else {
            setValue(selectedObj?.defaultString);
            setBoardValue(selectedObj?.defaultString);
        }

        setBoardColorPath(selectedObj.colorPath);
        setColorMode(false);
        setTextMode(true);
        setTextAreaDisable(selectedObj?.isInlineEditMode);
        document.body.addEventListener('mousedown', () => {
            setMouseDown(true);
        });
        document.body.addEventListener('mouseup', () => {
            setMouseDown(false);
        });
        document.getElementById('flipBoardMain').addEventListener('click', () => {
            setInit(false);
        });
    }, []);




    return (
        <>

            <div
                className={`flipBoardMain flipBoardMainScss`}
                id={'flipBoardMain'}
            >


                <div className={`flipBoard custom-scroll custom-scroll-x flipboard`}>
                    {boardOverLay}
                    <div className="board-padding custom-scroll">
                        <div className={'inputMainColumnWrapper'}>

                            {[...Array.from(Array(row).keys())].map((rowIndex) => {
                                return (
                                    <>
                                        <div className={'flipInput-line'}>
                                            {[...Array.from(Array(col).keys())].map((colIndex) => {
                                                return (
                                                    <div className={`inputColumnWrapper

                                                        ${blockColumns.includes(colIndex - 1) ? 'blockColumnleft' : ''}
                              ${blockColumns.includes(colIndex) ? 'blockColumns' : ''}
                          `}
                                                         onMouseMove={() => {
                                                             if (isMouseDown && isColorMode) {
                                                                 setColorPath({
                                                                     row: rowIndex,
                                                                     col: colIndex,
                                                                 });
                                                             }
                                                         }}
                                                         onClick={() =>
                                                             handleInputClick({ rowIndex, colIndex })
                                                         }
                                                    >

                                                        <input
                                                            ref={(el) => {
                                                                refs.current[rowIndex] = refs.current[rowIndex] || [];
                                                                refs.current[rowIndex][colIndex] = el;
                                                            }}
                                                            className={`flipInputColInput textaligncenter ${
                                                                isTextMode || isEmojiMode || isColorMode
                                                                    ? 'visibleShow'
                                                                    : 'visibleHide'
                                                            }
                              ${isColorMode ? 'colorMode' : ''}
                              ${blockColumns.includes(colIndex) ? 'blockColumns' : ''}
                              ${
                                                                isReadOnlyInputs ?  'readOnly' : ''
                                                            }
                           
                              `}
                                                            id={`${InputColumnIdPrefix}-row-${rowIndex}-col-${colIndex}`}
                                                            onPaste={onPaste}
                                                            // onChange={(e) => handleInputChange({ rowIndex, colIndex, value: e.target.value })}
                                                            onKeyPress={(event) =>{
                                                                handleRestrictedChar(event);
                                                            }}
                                                            onKeyUp={(event) => {
                                                                if (!isReadOnlyInputs) {
                                                                    if (!isEmojiMode) {
                                                                        handleInputKeyUp({
                                                                            event,
                                                                            rowIndex,
                                                                            colIndex,
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                            onClick={() =>
                                                                handleInputClick({ rowIndex, colIndex })
                                                            }
                                                            onBlur={() =>{
                                                                if(onBlurFlap) {
                                                                    onBlurFlap({ rowIndex, colIndex })
                                                                }
                                                            }}
                                                            // contentEditable={true}
                                                            readOnly={isReadOnlyInputs ? isReadOnlyInputs :  (!isTextMode || isEmojiMode || isColorMode)}
                                                            maxLength={1}
                                                            autoComplete={'off'}
                                                        />
                                                        <div
                                                            className={'flipInputColMain'}

                                                            onMouseMove={() => {
                                                                if (isMouseDown && isColorMode) {
                                                                    setColorPath({
                                                                        row: rowIndex,
                                                                        col: colIndex,
                                                                    });
                                                                }
                                                            }}
                                                            onClick={() =>
                                                                handleInputClick({ rowIndex, colIndex })
                                                            }
                                                        >

                                                            <div
                                                                className={'flipInputCol'}
                                                                onClick={(e) => {
                                                                    if (isEmojiMode) {
                                                                        addEmojiInInput({
                                                                            row: rowIndex,
                                                                            col: colIndex,
                                                                        });
                                                                    }
                                                                }}
                                                                style={{ background: TRANSPARENT }}
                                                                id={`${InputColorColumnPrefix}-row-${rowIndex}-col-${colIndex}`}
                                                            >
                                                                <>
                                                                    {renderEmoji({
                                                                        row: rowIndex,
                                                                        col: colIndex,
                                                                    })}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                );
                            })}


                        </div>
                    </div>
                </div>


            </div>



        </>)
}
export default  forwardRef(SplitFlapBoard);

