import { useState, useEffect } from 'react';
import { triggerWinnerConfetti } from "../components/confetti";


function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? (value === 'X' ? 'winning-x' : 'winning-o') : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, xWins, oWins, onResetGame, onResetScores }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  
  // Trigger confetti when there's a winner
  useEffect(() => {
    if (winnerInfo) {
      triggerWinnerConfetti(winnerInfo.winner);
    }
  }, [winnerInfo]);

  let status;
  if (winnerInfo) {
    status = 'Winner: ' + winnerInfo.winner + ' ';
  } else if (squares.every(square => square)) {
    status = 'Draw! 🤝';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  // Function to determine if a square is part of the winning line
  function isWinningSquare(i) {
    return winnerInfo && winnerInfo.line.includes(i);
  }

  return (
    <>
      <div className="game-info">
        <div className='score-track'>
          <span className='score-x'>X Wins: {xWins}</span>
          <span className='score-o'>O Wins: {oWins}</span>
        </div>
      </div>
      <div className='status-container'>
        <div className={`status ${winnerInfo ? 'winner' : ''} ${winnerInfo ? (winnerInfo.winner === 'X' ? 'winner-x' : 'winner-o') : ''}`}>{status}</div>
      </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinning={isWinningSquare(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinning={isWinningSquare(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinning={isWinningSquare(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinning={isWinningSquare(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinning={isWinningSquare(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinning={isWinningSquare(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinning={isWinningSquare(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinning={isWinningSquare(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinning={isWinningSquare(8)} />
      </div>
      <div className="button-container">
        <button className="restart-button" onClick={onResetGame}>New Game</button>
        <button className="restart-button reset-scores" onClick={onResetScores}>Reset Scores</button>
      </div>
      
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [startingPlayer, setStartingPlayer] = useState(true); // true = X starts, false = O starts
  const xIsNext = currentMove % 2 === 0 ? startingPlayer : !startingPlayer;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    // Check if there's a winner and update win count
    const winnerInfo = calculateWinner(nextSquares);
    if (winnerInfo) {
      if (winnerInfo.winner === 'X') {
        setXWins(prevXWins => prevXWins + 1);
        setStartingPlayer(true); // X will start next game since X won
      } else if (winnerInfo.winner === 'O') {
        setOWins(prevOWins => prevOWins + 1);
        setStartingPlayer(false); // O will start next game since O won
      }
    }
    // Do nothing for draws - no score increment and starting player remains unchanged
  }

 

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function resetScores() {
    setXWins(0);
    setOWins(0);
    // Randomize starting player for fresh games
    setStartingPlayer(Math.random() >= 0.5);
  }


  return (
    <div className="game" id="gamearea">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay}
          xWins={xWins}
          oWins={oWins}
          onResetGame={resetGame}
          onResetScores={resetScores}
        />
      </div>
      
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }
  return null;
}
