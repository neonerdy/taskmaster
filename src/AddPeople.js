
import React, {Component} from 'react';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { Setting } from './Setting';

import axios from 'axios';
import config from './Config';
import { ChangePhoto } from './ChangePhoto';

export class AddPeople extends Component
{
    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);

        this.state = {
            user: user,
            error: {},
            userName: '',
            password: '',
            fullName: '',
            role: '',
            address: '',
            phone: '',
            email: '',
            isSaving: false
        }
    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validate = () => {

        let isValid = true;
        let error = {};

        if (this.state.userName == '') {
            error.userName = 'is required';
            isValid = false;
        }
        if (this.state.password == '') {
            error.password = 'is required';
            isValid = false;
        } 
        if (this.state.fullName == '') {
            error.fullName = 'is required';
            isValid = false;
        }
        if (this.state.role == '') {
            error.role = 'is required';
            isValid = false;
        }
        if (this.state.address == '') {
            error.address = 'is required';
            isValid = false;
        }
        if (this.state.email == '') {
            error.email = 'is required';
            isValid = false;
        }
        if (this.state.phone == '') {
            error.phone = 'is required';
            isValid = false;
        }

  
        this.setState({
            error: error 
        })

        return isValid;

    }


    savePeople = () => {
        
        let isValid = this.validate();
        if (isValid) {
     
            let people = {
                userName: this.state.userName,
                password: this.state.password,
                fullName: this.state.fullName,
                role: this.state.role,
                address: this.state.address,
                email: this.state.email,
                phone: this.state.phone,
                photo: '',
                activeProjectId: '00000000-0000-0000-0000-000000000000',
                isHideClosedTask: false
            }

            this.setState({
                isSaving: true
            })

            axios.post(config.serverUrl + "/api/people/save",people).then(response=> {
                this.setState({
                    isSaving: false
                })                
                this.props.history.push("/people");
            
            })

        }
        
    }

    cancelAdd = () => {
        this.props.history.push("/people");
    }



    render() {

        const heightStyle = {
            minHeight: '959.8px'
        }

        let errStyle = {
            color: 'darkred'
        }

        return(
           <div class="wrapper">
                <Header 
                    history={this.props.history} 
                    user={this.state.user}
                />

                <NavBar/>
                <Setting/>
                <ChangePhoto/>

                <div class="content-wrapper" style={heightStyle}>
                    <section class="content-header">
                        <h1>Create Team Member</h1>
                    </section>
                 
                    <section class="content">

                    <div class="row">
                       <div class="col-md-12">

                         <div class="box box-default">
                            
                            <div class="box-header with-border">
                                 <h3 class="box-title"></h3>
                                <div class="box-tools pull-right">
                                    {this.state.isSaving ? 
                                    <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Saving ...</span>
                                    : null
                                    }
                                </div>

                                 
                            </div>

                      <form class="form-horizontal">
                      
                        <div id="name" class="form-group">
                            <label class="col-md-3 control-label">User Name</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="userName" onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.userName}</span>
                        </div>
                        
                        <div id="initial" class="form-group">
                            <label class="col-md-3 control-label">Password</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="password" onChange={this.onValueChange} />
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.password}</span>
                        </div>

                        <div id="initial" class="form-group">
                            <label class="col-md-3 control-label">Full Name</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="fullName" onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.fullName}</span>
                        </div>
                        
                        <div id="manager" class="form-group">
                            <label class="col-md-3 control-label">Role</label>
                            <div class="col-md-7 col-sm-12 required">
                                <select class="form-control" name="role" onChange={this.onValueChange} >
                                    <option value="">Select Role</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Tester">Tester</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.role}</span>
                        </div>

                        <div id="description" class="form-group">
                            <label class="col-md-3 control-label">Address</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="address" onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.address}</span>
                        </div>

                        <div id="description" class="form-group">
                            <label class="col-md-3 control-label">Phone</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="phone" onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.phone}</span>
                        </div>

                        <div id="description" class="form-group">
                            <label class="col-md-3 control-label">E-Mail</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="email" onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.email}</span>
                        </div>

                        </form>

                          <div class="box-footer text-right">
                            <a class="btn btn-link text-left" href="#" onClick={this.cancelAdd}>Cancel</a>
                            <button type="button" onClick={this.savePeople} class="btn btn-primary"><i class="fa fa-check icon-white"></i> Save</button>
                        </div>


                        </div>


                        </div>
                    </div>

                      
                    </section>
            
                </div>

                <Footer/>

            </div>
        )
    }
}