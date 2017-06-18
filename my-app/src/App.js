import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Square extends React.Component {
  render() {
    return (
        <button className={this.props.winner ? "square-winner" : "square"} onClick={() => this.props.onClick()}>
          { this.props.value }
        </button>
      );
  }
}

class Board extends React.Component {
  renderSquare(i)
  {
    return (<Square 
            key = {i}
            value = {this.props.squares[i]} 
            winner = {this.props.highlights.indexOf(i) >= 0}
            onClick = {() => this.props.onClick(i)} 
           />);
  }
  render()
  {
    var rows = [];
    for (let i = 0; i < 3; i++)
    {
      var cols = [];
      for (let j = 0; j < 3; j++)
      {
        cols.push(this.renderSquare(i * 3 + j));
      }
      let element = <div key={i.toString()} className="board-row"> {cols} </div>
      rows.push(element);
    }
    return (<div> {rows} </div>)
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history : [{
        squares : Array(9).fill(null),
        moves : [0, 0],
      }],
      stepNumber : 0,
      xIsNext : true, 
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares : squares,
        moves : [Math.floor(i / 3) + 1, i % 3 + 1],  
      }]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2) ? false : true,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((content, moveIdx) => {
      const desc = moveIdx ? "Move #" + moveIdx + ", [" + content.moves + "]" : "Game start";
      return (
        <li key={moveIdx}> 
          <a href="#" onClick={() => this.jumpTo(moveIdx)}>{desc}</a>
        </li>
      );
    });
    let status;
    let highlights = [];
    if (winner) {
      status = "Winner: " + winner.winner;
      highlights = winner.highlights;
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
        <div className="game">       
          <div className="game-board">
            <Board squares = {current.squares} highlights = {highlights} onClick = {(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <div> {moves} </div>
          </div>
        </div>
      );
  } 
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="App-content"> <Game /> </div>
      </div>
    );
  }
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
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return {winner: squares[a], highlights:[a, b, c]};
    }
  }
  return null;
}




export default App;