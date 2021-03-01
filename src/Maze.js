import React from "react";
import "./maze.css";
import marioIcon from "./assets/mario.png";
import mushroomIcon from "./assets/mushroom.png";

const Square = (props) => {
  return (
    <span className="square">
      {props.mushroom == true && <img src={mushroomIcon} />}
      {props.mario == true && <img src={marioIcon} />}
    </span>
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

class Maze extends React.Component {
  constructor(props) {
    super(props);
    let cols = parseInt(prompt("Please enter board width")),
    rows = parseInt(prompt("Please enter board height")),
      player = Math.floor((cols * rows) / 2);
    let mushrooms = [];
    Array(cols)
      .fill(null)
      .map(() => {
        let pos = getRandomInt(1, cols * rows + 1);
        while (mushrooms.indexOf(pos) > -1 || pos == player) {
          pos = getRandomInt(1, cols * rows + 1);
        }
        mushrooms.push(pos);
      });
    this.state = {
      cols: Array(cols).fill(null),
      rows: Array(rows).fill(null),
      player: player,
      mushrooms: mushrooms,
      steps: 0
    };
    window.addEventListener("keyup", this.onKeyPressed.bind(this));
  }
  onKeyPressed(e) {
    let { steps, mushrooms } = this.state;
    if (mushrooms.length > 0) {
      const { player, rows, cols } = this.state;
      let newPlayerLocation = player;
      if (e.keyCode === 37 && player > 1) {
        newPlayerLocation = player - 1;
      } else if (e.keyCode === 39 && player < rows.length * cols.length) {
        newPlayerLocation = player + 1;
      } else if (e.keyCode === 38 && player - cols.length > -1) {
        newPlayerLocation = player - cols.length;
      } else if (
        e.keyCode === 40 &&
        player < (rows.length - 1) * cols.length + 1
      ) {
        newPlayerLocation = player + cols.length;
      }
      player !== newPlayerLocation &&
        mushrooms.indexOf(newPlayerLocation) > -1 &&
        mushrooms.splice(mushrooms.indexOf(newPlayerLocation), 1);
      player !== newPlayerLocation && steps++;
      this.setState({
        mushrooms,
        steps,
        player: newPlayerLocation,
      });
    }
  }
  componentDidUpdate() {
    if(this.state.mushrooms.length==0){
      setTimeout(() => window.confirm("Game over. Total moves to save the princess: " + this.state.steps))
    }
  }
  render() {
    const { rows, cols, player, mushrooms, steps } = this.state;
    let count = 0;
    return (
      <div className="maze">
        {rows.map((row, r) => {
          return (
            <div className="row">
              {cols.map((col, c) => {
                count++;
                return (
                  <Square
                    id={count}
                    mario={count == player}
                    mushroom={mushrooms.indexOf(count) > -1}
                  />
                );
              })}
            </div>
          );
        })}
        <div style={{ textAlign: "left" }}>Steps: {steps}</div>
        {mushrooms.length == 0 && (
          <div style={{ textAlign: "left" }}>
            You saved the princess! <a href="/">Restart?</a>
          </div>
        )}
      </div>
    );
  }
}

export default Maze;
