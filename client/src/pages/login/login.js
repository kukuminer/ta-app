import "./login.css"
import React from "react";
import axios from 'axios'
import { Navigate } from "react-router-dom"

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            username: '', 
            password: '', 
            userId: '',
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Form submitted: ' + this.state.username + ' / ' + this.state.password);
        const id = this.state.username
        const request = {
            method: 'get',
            url: '/api/user/' + id,
        }
        axios(request)
            .then((response) => {
                console.log(response.data.userType)
                if(response.data.userType) {
                    localStorage.setItem('userId', this.state.username)
                    this.setState({userId: this.state.username})
                    this.forceUpdate()
                }
            })
            .catch((error) => {
                console.log('error retrieving usertype: ', error)
                return error
            })
    }

    render() {
        return (
            <main>
                {this.state.userId && (<Navigate to="/dashboard" replace={true} state={this.state.userId}/>)}
                <h1>Login</h1>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={(event) => this.setState({ username: event.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={(event) => this.setState({ password: event.target.value })}
                        />
                    </label>
                    <br />
                    <input type="submit" value="Login" onSubmit={this.handleSubmit} />
                </form>
            </main>
        )
    }
}

export default LoginForm;