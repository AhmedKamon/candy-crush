import { useEffect, useState } from 'react';
import blueCandy from './images/blue.jpg'
import greenCandy from './images/green.jpg'
import orangeCandy from './images/orange.jpg'
import purpleCandy from './images/purple.jpg'
import redCandy from './images/red.jpg'
import yellowCandy from './images/yellow.jpg'
import blank from './images/heart.png'
import ScoreBoard from './components/ScoreBoard';

const width = 8;
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [currentColorArrangment, setCurrentColorArrangment] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColoumOfFour = () =>{
    for(let i =0; i <= 39; i++){
      const columOfFour = [i, i+ width, i+ width*2, i+ width * 3]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank

      if(columOfFour.every(square => currentColorArrangment[square] === decidedColor && !isBlank)){
        setScoreDisplay((score) => score + 4)
        columOfFour.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const checkForColoumOfThree = () =>{
    for(let i =0; i <= 47; i++){
      const columOfThree = [i, i+ width, i+ width*2]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank

      if(columOfThree.every(square => currentColorArrangment[square] === decidedColor && !isBlank)){
        setScoreDisplay((score) => score + 3)
        columOfThree.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }
  const checkForRowOfFour = () =>{
    for(let i =0; i<64; i++){
      const rowOfFour = [i, i+ 1, i+ 2, i +3]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64 ]
      if(notValid.includes(i)) continue

      if(rowOfFour.every(square => currentColorArrangment[square] === decidedColor  && !isBlank)){
        setScoreDisplay((score) => score + 4)
        rowOfFour.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfThree = () =>{
    for(let i =0; i<64; i++){
      const rowOfThree = [i, i+ 1, i+ 2]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64 ]
      if(notValid.includes(i)) continue

      if(rowOfThree.every(square => currentColorArrangment[square] === decidedColor  && !isBlank)){
        setScoreDisplay((score) => score + 3)
        rowOfThree.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }
  //move into empty area
  const moveIntoSquareBelow =() =>{
    for(let i =0; i<= 55; i++){

      const firstRow = [0,1,2,3,4,5,6,7]
     const isFirstRow= firstRow.includes(i)
     if(isFirstRow && currentColorArrangment[i] === blank){
      let randomNumber = Math.floor(Math.random()* candyColors.length) 
      currentColorArrangment[i] = candyColors[randomNumber]
     }

      if((currentColorArrangment[i + width]) === blank){
        currentColorArrangment[i+width] = currentColorArrangment[i]
        currentColorArrangment[i] = blank
      }
    }
  }
  //drag and drop

  const dragStart = (e) =>{
    console.log(e.target,'drag start');
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) =>{
    console.log(e.target,'drag drop');
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = (e) =>{
    console.log('drag end');
    const squreBeingDraggedId =  parseInt(squareBeingDragged.getAttribute('data-id'))
    const squreBeingReplacedId =  parseInt(squareBeingReplaced.getAttribute('data-id'))
    currentColorArrangment[squreBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArrangment[squreBeingDraggedId] = squareBeingReplaced.getAttribute('src')
    console.log(squreBeingDraggedId,'squreBeingDraggedId',squreBeingReplacedId,'squreBeingReplacedId');

    const validMoves = [
      squreBeingDraggedId - 1,
      squreBeingDraggedId - width,
      squreBeingDraggedId + 1,
      squreBeingDraggedId + width,
    ]
    const validMove = validMoves.includes(squreBeingReplacedId)
     const isAColoumOfFour = checkForColoumOfFour()
     const isARowOfFour = checkForRowOfFour()
     const isAColoumOfThree = checkForColoumOfThree()
     const isARowOfThree = checkForRowOfThree()

     if(squreBeingReplacedId && validMove && (isARowOfThree||isAColoumOfThree||isARowOfFour||isAColoumOfFour) ){
       setSquareBeingDragged(null)
       setSquareBeingReplaced(null)
     }else{
       currentColorArrangment[squreBeingReplacedId] =  squareBeingReplaced.getAttribute('src')
       currentColorArrangment[squreBeingDraggedId] =  squareBeingDragged.getAttribute('src')
       setCurrentColorArrangment([...currentColorArrangment])
     }
  }
  
  const createBoard = () => {
    const rendomColorArrangment = [];
    for (let i = 0; i < width * width; i++) {
      const rendomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      rendomColorArrangment.push(rendomColor);
    }
    setCurrentColorArrangment(rendomColorArrangment);
  };
  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() =>{
      checkForColoumOfFour() 
      checkForRowOfFour()
      checkForColoumOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
        setCurrentColorArrangment([...currentColorArrangment])
      },100)

    return () => clearInterval(timer)  

  }, [checkForColoumOfFour,checkForRowOfFour,checkForColoumOfThree,checkForRowOfThree,moveIntoSquareBelow,currentColorArrangment,]);

  return (
    <div className="app">
    <div className="game">
      {
        currentColorArrangment.map((candyColor,index) =>(
          <img 
          
          key={index}
          src={candyColor}
          alt={candyColor} 
          data-id={index}
          draggable={true}
          onDragStart={dragStart}
          onDragOver={(e)=> e.preventDefault()}
          onDragEnter={(e)=> e.preventDefault()}
          onDragLeave={(e)=> e.preventDefault()}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
          />
        ))
      }
    </div>
    <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
