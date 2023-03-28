import "./login.css"
import React from "react";
import axios from 'axios'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: '', password: '', }

        // this.handle_user = this.handle_user.bind(this);
        this.handle_submit = this.handle_submit.bind(this);
    }

    // handle_user(event) {
    //     console.log(event.target)
    //     this.setState({ username: event.target.value });
    // }
    // handle_pass(event) {
    //     this.setState({ password: event.target.value });
    // }

    handle_submit(event) {
        console.log('Form submitted: ' + this.state.username + ' / ' + this.state.password);
        const id = this.state.username
        const request = {
            method: 'get',
            url: '/api/user/'+id,
        }
        axios(request)
        .then((response) => {
            console.log(response.data.usertype)
            return response
        })
        .catch((error) => {
            console.log('error retrieving usertype')
            return error
        })
        event.preventDefault();
    }

    render() {
        return (
            <main>
                <h1>Login</h1>
                <form onSubmit={this.handle_submit}>
                    <label>
                        Username:
                        <input 
                            type="text" 
                            value={this.state.username} 
                            onChange={(event) => this.setState({username: event.target.value})} 
                        />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input 
                            type="password" 
                            value={this.state.password} 
                            onChange={(event) => this.setState({password: event.target.value})} 
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Login" onSubmit={this.handle_submit} />
                </form>
            </main>
        )
    }
}

const handle_login = (form_contents) => {
    console.log(form_contents)
}

const Login = () => {
    return (
        <>
            <main>
                <h1>Login</h1>
                <form action={() => handle_login()}>
                    <input type="text"></input>
                    <input type="submit">Login</input>
                </form>
            </main>
        </>
    );
};

export default LoginForm;