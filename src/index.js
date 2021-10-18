import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
    let ClassName= 'square ' + (props.lineWin ? 'highlight' : '');
    return (
      <button className={ClassName} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

const boardSize = 10;
const conditionToWin = 5; // if change it, need change line 46 and condition at 47 
function calculateWinner(squares) {
  const lines = [];
  for (let row = 0; row < boardSize; row++){
    for (let column = 0; column < boardSize; column++) {
      let selectLineRow = [];
      let selectLineColumn = [];
      let selectLineCrossRow = [];
      let select = row * boardSize + column;
      for (let i = 0; i < conditionToWin; i++) {
        if (select + i <= boardSize*boardSize) {
          selectLineRow.push(select + i);
        }
        if (select + i*boardSize <= boardSize*boardSize) {
          selectLineColumn.push(select + i*boardSize);
        }
        if (select + i + i*boardSize <= boardSize*boardSize) {
          selectLineCrossRow.push(select + i + i*boardSize);
        }
      }
      if (selectLineRow.length === conditionToWin) {
        lines.push(selectLineRow);
      }
      if (selectLineColumn.length === conditionToWin) {
        lines.push(selectLineColumn);
      }
      if (selectLineCrossRow.length === conditionToWin) {
        lines.push(selectLineCrossRow);
      }
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i]; // conditionToWin = 5
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]  && squares[a] === squares[d]  && squares[a] === squares[e]) {
      return { 
        winner: squares[a],
        line: lines[i]
      };
    }
  }
  let statusGame = 'draw';
  for (let i = 0; i< squares.length; i++) {
    if (squares[i] === null) {
      statusGame = 'continue';
      break;
    }
  }
  return { 
    winner: null,
    line: null,
    statusGame: statusGame
  };
}
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(boardSize*boardSize).fill(null),
            xIsNext: true,
        };
    }


    renderSquare(i) {
      const lineWin = this.props.lineWin;
      return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        lineWin = {lineWin && lineWin.includes(i)}
      />
    }
  
    render() {
      let squares = [];
      for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
          row.push(this.renderSquare(i * boardSize + j));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
      }
      return (
        <div>{squares}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(boardSize*boardSize).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        isDescending: true
      };
    }
    handleToggleSort() {
      this.setState({
        isDescending: !this.state.isDescending
      })
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
            squares: squares,
            latestMove: i
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const infoGame = calculateWinner(current.squares);
      const winner = infoGame.winner;
      const statusGame = infoGame.statusGame;
      
      const moves = history.map((step, move) => {
        const latestMove = step.latestMove;
        const col = 1 + latestMove % boardSize;
        const row = 1 + Math.floor(latestMove / boardSize);
        const desc = move ?
          'Go to move #' + move + '(' + col + ',' + row + ')':
          'Go to game start';
        return (
          <li key={move} className={move === this.state.stepNumber ? 'select' : ''}>
            <button className={move === this.state.stepNumber ? 'selectButton' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else if (statusGame === 'draw') {
        status = 'Draw Game'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      const isDescending = this.state.isDescending;
      if (!isDescending) {
        moves.reverse();
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              lineWin = {infoGame.line}
            />
          </div>
          <div className="game-info">
            <div className={(statusGame === 'draw' ? 'highlight' : '')}>{status}</div>
            <button onClick={() => this.handleToggleSort()}>
              {isDescending ? 'Sort Ascending' : 'Sort Descending'}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  