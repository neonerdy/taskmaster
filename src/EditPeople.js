
import React, {Component} from 'react';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { Setting } from './Setting';
import axios from 'axios';
import config from './Config';
import { ChangePhoto } from './ChangePhoto';

export class EditPeople extends Component
{
    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);
      
        this.state = {
            user: user,
            error: {},
            id: '',
            userName: '',
            password: '',
            fullName: '',
            role: '',
            address: '',
            phone: '',
            email: '',
            photo: '',
            activeProjectId : '00000000-0000-0000-0000-000000000000',
            isHideClosedTask : false,
            isShowAssignedToMe : false,
            isLoading: true,
            isUpdating: false,
            waitStatus: ''
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.getPeopleById(id);
    }

    getPeopleById = (id) => {
        
        this.setState({
            waitStatus: 'Loading ...'
        })

        axios.get(config.serverUrl + "/api/people/getbyid/" +  id).then(response=> {
            this.setState({
                id: response.data.id,
                userName: response.data.userName,
                password: response.data.password,
                fullName: response.data.fullName,
                role: response.data.role,
                address: response.data.address,
                phone: response.data.phone,
                email: response.data.email,
                photo: response.data.photo,
                activeProjectId : response.data.activeProjectId,
                isHideClosedTask : response.data.isHideClosedTask,
                isShowAssignedToMe : response.data.isShowAssignedToMe,
                isLoading: false,
            })
        })
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


    updatePeople = () => {
        
        let isValid = this.validate();
        if (isValid) {
     
            let people = {
                id: this.state.id,
                userName: this.state.userName,
                password: this.state.password,
                fullName: this.state.fullName,
                role: this.state.role,
                address: this.state.address,
                email: this.state.email,
                phone: this.state.phone,
                photo: this.state.photo,
                activeProjectId : this.state.activeProjectId,
                isHideClosedTask : this.state.isHideClosedTask,
                isShowAssignedToMe : this.state.isShowAssignedToMe

            }
            this.setState({
                isUpdating: true,
                waitStatus: 'Updating ...'
            })
            axios.put(config.serverUrl + "/api/people/update",people).then(response=> {
                
                this.setState({
                    isUpdating: false
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
                        <h1>Edit Team Member</h1>
                    </section>
                 
                    <section class="content">

                        <div class="box box-default">
                            <div class="box-header with-border">
                                <h3 class="box-title"></h3>
                                <div class="box-tools pull-right">
                                    {this.state.isLoading || this.state.isUpdating ? 
                                    <span><i className="fa fa-spinner fa-spin"></i>&nbsp;{this.state.waitStatus}</span>
                                    : null
                                    }
                                </div>
                            </div>

                      <form class="form-horizontal">
                      
                        <div id="name" class="form-group">
                            <label class="col-md-3 control-label">User Name</label>
                            <input type="hidden" value={this.state.id}/>

                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="userName" 
                                    value={this.state.userName} onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.userName}</span>
                        </div>
                        
                        <div id="initial" class="form-group">
                            <label class="col-md-3 control-label">Password</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="password" 
                                    value={this.state.password} onChange={this.onValueChange} />
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.password}</span>
                        </div>

                        <div id="initial" class="form-group">
                            <label class="col-md-3 control-label">Full Name</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="fullName" 
                                    value={this.state.fullName} onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.fullName}</span>
                        </div>
                        
                        <div id="manager" class="form-group">
                            <label class="col-md-3 control-label">Role</label>
                            <div class="col-md-7 col-sm-12 required">
                                <select class="form-control" name="role" onChange={this.onValueChange} value={this.state.role} >
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
                                <input class="form-control" type="text" name="address" 
                                    value={this.state.address} onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.address}</span>
                        </div>

                        <div id="description" class="form-group">
                            <label class="col-md-3 control-label">Phone</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="phone" 
                                    value={this.state.phone} onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.phone}</span>
                        </div>

                        <div id="description" class="form-group">
                            <label class="col-md-3 control-label">E-Mail</label>
                            <div class="col-md-7 col-sm-12 required">
                                <input class="form-control" type="text" name="email" 
                                    value={this.state.email} onChange={this.onValueChange}/>
                            </div>
                            &nbsp;&nbsp;<span style={errStyle}>{this.state.error.email}</span>
                        </div>

                        </form>

                          <div class="box-footer text-right">
                            <a class="btn btn-link text-left" href="#" onClick={this.cancelAdd}>Cancel</a>
                            <button type="button" onClick={this.updatePeople} class="btn btn-primary"><i class="fa fa-check icon-white"></i> Update</button>
                        </div>


                    </div>

                      
                    </section>
            
                </div>

                <Footer/>

            </div>
        )
    }
}