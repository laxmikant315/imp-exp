import { Flipper, Flipped } from 'react-flip-toolkit';
import React, { Component } from 'react';
import './style.scss';

const letters = 'reactfliptoolkit'.split('');


const entries = [
  [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15]],
  // catlike fort pilot
  [[3, 2, 4, 6, 7, 13, 1], [5, 10, 0, 9], [8, 14, 12, 11, 15]],
  // fickle lotto tapir
  [[5, 7, 3, 13, 6, 1], [12, 10, 4, 9, 11], [15, 2, 8, 14, 0]],
  [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15]]
];

const colors = ['#ff4f66', '#7971ea', '#5900d8'];
const getColor = (letter: any) => {
  if (letter < 5) return colors[0];
  else if (letter < 9) return colors[1];
  else return colors[2];
};

export class ContainerAnimate extends Component {
  index = 0;
  state = { expanded: false };

  render() {
    const data = entries[this.index % entries.length];
    this.index += 1;

    return (
      <Flipper flipKey={this.state.expanded} spring="wobbly">
        <main onClick={() => this.setState({ expanded: !this.state.expanded })}>
          <Expanded data={data} />
        </main>
      </Flipper>
    );
  }
}

const Word = (props: any) => {
  const { word } = props;
  return (
    <ul className="expandedList">
      {word.map((index: any) => {
        const letter = letters[index];
        const flipId = `letter-${index}`;
        return (
          <Flipped flipId={flipId}>
            <li
              style={{
                backgroundColor: getColor(index)
              }}
            >
              <Flipped inverseFlipId={flipId} scale transformOrigin="50% 50%">
                <span>{letter}</span>
              </Flipped>
            </li>
          </Flipped>
        );
      })}
    </ul>
  );
};

const Expanded = (props: any) => {
  const { data } = props;
  return (
    <div className="expandedContainer">
      {data.map((word: any) => (
        <Word word={word} />
      ))}
    </div>
  );
};
