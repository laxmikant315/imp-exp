import React, { Props } from 'react';
import { Link } from 'react-router-dom';
class Comp1 extends React.Component<{
  title: string;
  data: any;
  clearData: any;
}> {
  state = {
    name: '1sd'
  };
  constructor(props: any) {
    super(props);
    this.callAlert = this.callAlert.bind(this);
  }
  callAlert(selected: any) {
    console.log(selected);
    this.setState({ name: this.state.name + '/' + selected.codeDescription });
    this.props.clearData();
  }
  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.title}
        <div>
          <h1>{this.state.name}</h1>
          {this.props.data.map((x: any) => {
            return (
              <h1
                key={x.code}
                onClick={() => {
                  this.callAlert(x);
                }}
              >
                {x.codeDescription}
              </h1>
            );
          })}
        </div>
      </div>
    );
  }
}

const Comp2: React.FC<{ name?: string }> = props => {
  return <h1>Hello Comp2 {props.name}</h1>;
};

Comp2.defaultProps = {
  name: 'HHHH'
};

class One extends React.Component {
  state = {
    title: '1sd',
    data: [
      { code: '1', codeDescription: 'One' },
      { code: '2', codeDescription: 'Two' },
      { code: '3', codeDescription: 'Theree' }
    ]
  };

  clearData = () => {
    this.setState({
      data: []
    });
  };
  render() {
    return (
      <div>
        <Comp1 title="123" data={this.state.data} clearData={this.clearData} />
        <Comp2 name="LAxkkk" />
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export { One as default };
