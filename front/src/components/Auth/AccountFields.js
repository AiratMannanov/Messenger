import './dashboardPage.css';

const React = require('react');

export default class AccountFields extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      email: '',
    }
  }

  cobmineState() {

  }

  render() {
    return (

      <div className="form">
        <h2 id="fullName">Account Details</h2>

        <div id="email">
          <input autoComplete='off' type="text" className="input-auth" id="login" ref={this.login} onChange={e => {
            this.setState({ login: e.target.value });
          }}
            placeholder="Enter username"
            defaultValue={this.props.fieldValues.login} />
        </div>
        <div id="login">
          <input autoComplete='off' type="email" className="input-auth" id="login" ref={this.email} placeholder="Enter email"
            defaultValue={this.props.fieldValues.email}
            onChange={e => {
              this.setState({ email: e.target.value })
            }}
          />
        </div>
        <div id="password">
          <input type="password" className="input-auth" id="password" ref={this.password}
            placeholder="Enter password"
            defaultValue={this.props.fieldValues.password}
            onChange={e => {
              this.setState({ password: e.target.value })
            }} />
        </div>
        <div id="conpass">
          <input type="password" className="input-auth" id="conpass" ref={this.conpass}
            placeholder="Confirm password"
            defaultValue={this.props.fieldValues.conpass} />
        </div>
        <div id='buttons'>
          <button className="firstButt"
            onClick={() =>
              this.props.nextStep(this.state)}>Save &amp; Continue
                    </button>
        </div>
      </div>
    )
  }


  nextStep() {
    this.props.changeInfo(this.state);
    this.props.nextStep();
  }
}

