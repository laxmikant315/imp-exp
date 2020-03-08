import React, { Props } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layout/Layout';
import { Button, Icon } from 'antd';
import Title from 'antd/lib/typography/Title';
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
      <MainLayout>
        {/* <NotesApp /> */}
        <div className="flex flex-col justify-center items-center h-full">
          <Title type="warning">This is Sample Notes Page</Title>
          <Link to="/">
            <Button type="danger" size="large" shape="round">
              <Icon type="home" />
              Home
            </Button>
          </Link>
        </div>
      </MainLayout>
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
