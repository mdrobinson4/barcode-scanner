import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = { 
      email: "",
      username: "",
      password: "",
      createAccount: true
     };
  }

  componentDidMount = () => {
  }

  handleEmailChange = (e) => {
    this.setState( { email: e.target.value } );
  }

  handlePasswordChange = (e) => {
    this.setState( { password: e.target.value } );
  }

  handleUsernameChange = (e) => {
    this.setState( { username: e.target.value } );
  }

  // attempt to create an account
  handleCreateAccount = (e) => {
    const { email, username, password } = this.state;
    const user = { "email": email, "username": username, "password": password };
    e.preventDefault();

    fetch("/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify( user )
    })
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        this.changeToLogin();
      }
    });
    e.preventDefault();
  }

  handleLogin = (e) => {
    const { email, username, password } = this.state;
    const user = { "email": email, "username": username, "password": password };
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify( user )
    })
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        this.props.handleLogin( res.user );
      }
    });
    e.preventDefault();
  }

  changeToLogin = () => {
    this.setState( { createAccount: false } );
  }

  changeToCreateAccount = () => {
    this.setState( { createAccount: true } );
  }

  render() {
    const { email, username, password, createAccount } = this.state;
    return (
      <div>
        <Form>
          {
            createAccount ? (
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={email} onChange={this.handleEmailChange}/>
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
            ) : null
          }


          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" placeholder="Enter username"  value={username} onChange={this.handleUsernameChange}/>
            <Form.Text className="text-muted">
              This will be your account name
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={this.handlePasswordChange}/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={(e) =>  createAccount? this.handleCreateAccount(e) : this.handleLogin(e) }>
            Submit
          </Button>
        </Form>
        <p>
        { createAccount ? ( "Already have an account?" ) : "Don't have an account?" }
        <Button variant="primary" type="submit" onClick={() =>  createAccount? this.changeToLogin() : this.changeToCreateAccount() }>
            { createAccount ? ( "Login" ): "Create Account" }
          </Button>
          </p>
      </div>
    );
  }
}

export default App;
