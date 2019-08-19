
import React, {Component} from 'react';
import axios from 'axios';
import config from './Config';

export class Login extends Component
{


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            isLoading: '',
            password: '',
            errStyle: '',
            loginError: ''
        }
    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    validateLogin =()=> {

        let isValid = true;

        let loginError = '';

        if (this.state.username == '' && this.state.password == '') {
            isValid = false;
            loginError = "User name and password is required"
        } else if (this.state.username == '') {
            isValid = false;
            loginError = "User name is required"
        } else if (this.state.password == '') {
            isValid = false;
            loginError = "Password is required";
        }

        this.setState({
            loginError: loginError
        })

        return isValid;
    }


    login =() => {

       
         let isValid = this.validateLogin();

         if (isValid)
         {
            var login = {
                UserName: this.state.username,
                Password: this.state.password
            }

            this.setState({
                isLoading: true
            })

        
            axios.post(config.serverUrl + "/api/people/login",login).then(response=>{
                var result = response.data;

                if (result != "") {
                    this.setState({
                        isLoading : false         
                    })
               
                    localStorage.setItem("user", JSON.stringify(result));
                    this.props.history.push("/dashboard");
               
                } else {
                    this.setState({
                        loginError: 'Authentication failed, please check to admin',
                        isLoading: false
                    })
                }

            })
        }

    }


    render() {

        let errStyle = {
            color: 'darkred'
        }

        return(
          
            <div>

                <div class="login-box">
                    <div class="login-logo">
                    
                    </div>
                    <div class="login-box-body">
                       
                        <p class="login-box-msg">

                            <h1>TASK MASTER</h1>
                            <p>Task Manager Version 1.0</p>

                        </p>
                        <br/>
                        <div class="form-group has-feedback">
                            <input type="text" name="username" onChange={this.onValueChange} class="form-control" placeholder="User Name"/>
                            <span class="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div class="form-group has-feedback">
                            <input type="password" name="password" onChange={this.onValueChange} class="form-control" placeholder="Password"/>
                            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <span style={errStyle}>{this.state.loginError}</span>
                        {this.state.isLoading? 
                            <span><i className="fa fa-spinner fa-spin"></i> Authenticating ...</span>
                         : null
                        }
                        <br/><br/>
                        <div clas="row">
                    
                            <button type="button" onClick={this.login} class="btn btn-primary btn-block btn-flat">Sign In</button>
                        </div>
        
        
                    </div>
                </div>
         </div>
          
        )
    }



}