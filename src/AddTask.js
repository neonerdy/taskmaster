
import React, {Component} from 'react';
import './App.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Setting } from './Setting';

import axios from 'axios';
import config from './Config';
import CKEditor from 'ckeditor4-react';
import { ChangePhoto } from './ChangePhoto';

export class AddTask extends Component
{

    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);

        this.state = {
            user: user, 
            activeProjectId: '',
            error: {},
            projects: [],
            category: '',
            peoples: [],
            projectId: '',
            title: '',
            priority: '',
            reporterId: '',
            assigneeId: '',
            module: '',
            platform: '',
            version: '',
            testerId: '',
            description: '',
            isSaving: false
        }
    }

    componentDidMount() {
        this.getUserById(this.state.user.id);
        this.getAllProjects();
        this.getAllPeople();
    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    
    getUserById =(id)=> {
        axios.get(config.serverUrl + "/api/people/getbyid/" + id).then(response=> {
            this.setState({
                activeProjectId: response.data.activeProjectId
            })
        });
    }


    getAllProjects = () => {
        axios.get(config.serverUrl + "/api/project/getall").then(response=> {
            this.setState({
                projects: response.data
            })
        })
    }

    getAllPeople = () => {
        axios.get(config.serverUrl + "/api/people/getall").then(response=> {
           this.setState({
            peoples: response.data
           })                        
        })

      
        
       
    }
    

    saveTask = () => {
        
        let isValid = this.validate();
        if (isValid)
        {
            let task = {
                projectId: this.state.activeProjectId,
                category: this.state.category,
                title: this.state.title,
                priority: this.state.priority,
                reporterId: this.state.reporterId,
                assigneeId: this.state.assigneeId,
                module: this.state.module,
                platform: this.state.platform,
                version: this.state.version,
                testerId: this.state.testerId,
                description: this.state.description
            }

            this.setState({
                isSaving: true
            })

            axios.post(config.serverUrl + "/api/task/save", task).then(response=> {
                this.setState({
                    isSaving: false
                })
                this.props.history.push("/task");
            })
        }
    }


    validate = () => {

        let isValid = true;
        let error = {};

        if (this.state.activeProjectId == '') {
            error.projectId = 'is required';
            isValid = false;
        }

        if (this.state.category == '') {
            error.category = 'is required';
            isValid = false;
        }
        if (this.state.title == '') {
            error.title = 'is required';
            isValid = false;
        }
        if (this.state.priority == '') {
            error.priority = 'is required';
            isValid = false;
        }
        if (this.state.reporterId == '') {
            error.reporterId = 'is required';
            isValid = false;
        }
        if (this.state.assigneeId == '') {
            error.assigneeId = 'is required';
            isValid = false;
        }
        if (this.state.testerId == '') {
            error.testerId = 'is required';
            isValid = false;
        }
               
      
        this.setState({
            error: error 
        })

        return isValid;
        
    }


    cancelAdd = () => {
        this.props.history.push("/task");
    }

    addProject = () => {
        this.props.history.push("/add-project");
    }

    addPeople = () => {
        this.props.history.push("/add-people");
    }


    render() {

        const heightStyle = {
            minHeight: '959.8px'
        }

        const selectStyle = {
            width: '100%'
        }

        let errStyle = {
            color: 'darkred'
        }

        let dateStyle = {
            width: '250px'
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
                        <h1>
                            Create Task
                        </h1>
                    </section>
                    <br/>
                  
                
                     <section class="content">

                     
                         <div class="row">
                                  
                            <div class="col-md-12">
                                <div class="box box-default">
                                    <div class="box-header with-border">
                                    <div class="box-tools pull-right">
                                        {this.state.isSaving ? 
                                        <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Saving ...</span>
                                        : null
                                        }
                                    </div>

                                    <div class="nav-tabs-custom">
                                        <ul class="nav nav-tabs">
                                        <li class="active"><a href="#tab_1" data-toggle="tab" aria-expanded="true">Detail</a></li>
                                        <li class=""><a href="#tab_2" data-toggle="tab" aria-expanded="false">Description</a></li>
                                        </ul>
                                        <div class="tab-content">
                                        <div class="tab-pane active" id="tab_1">
                                                
                                        <div class="form-horizontal">
  
                                        <div class="form-group">
                                            <label class="col-md-3 control-label">Project</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                
                                                <select class="form-control" name="activeProjectId" onChange={this.onValueChange} value={this.state.activeProjectId} >
                                                    <option value="00000000-0000-0000-0000-000000000000">Select Project</option>
                                                    {this.state.projects.map(p=> 
                                                        <option key={p.id} value={p.id}>{p.projectName}</option>
                                                    )}
                                                </select>
                                        
                                            </div>
                                       
                                            <div class="col-md-2 col-sm-1">
                                            <span style={errStyle}>{this.state.error.projectId}</span>
                                                &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default" onClick={this.addProject}>New</a>
                                            </div>
                                        </div>

                                        
                                      <div class="form-group">
                                            <label class="col-md-3 control-label">Category</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="category" onChange={this.onValueChange}>
                                                    <option>Select Category</option>
                                                    <option value="Feature">Feature</option>
                                                    <option value="Bug">Bug</option>
                                                    <option value="Other">Other</option>
                                               </select>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.category}</span>
                                        </div>

                                                                            
                                      <div id="title" class="form-group">
                                            <label class="col-md-3 control-label">Title</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <input class="form-control" type="text" name="title" onChange={this.onValueChange}/>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.title}</span>
                                      </div>

                                      <div id="priority" class="form-group">
                                            <label class="col-md-3 control-label">Priority</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="priority" onChange={this.onValueChange}>
                                                    <option>Select Priority</option>
                                                    <option value="High">High</option>
                                                    <option value="Normal">Normal</option>
                                                    <option value="Low">Low</option>
                                               </select>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.priority}</span>
                                        </div>
                                      
                                      <div class="form-group">
                                            <label class="col-md-3 control-label">Reported By</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="reporterId" onChange={this.onValueChange}>
                                                    <option>Select Reporter</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    
                                                </select>
                                            </div>
                                            <div class="col-md-2 col-sm-1">
                                                <span style={errStyle}>{this.state.error.reporterId}</span>
                                                    &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default" onClick={this.addPeople}>New</a>
                                            </div>
                                      </div>

                                      <div id="assigned" class="form-group">
                                            <label class="col-md-3 control-label">Assigned To</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="assigneeId" onChange={this.onValueChange}>
                                                    <option>Select Assignee</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    

                                                </select>
                                            </div>
                                            <div class="col-md-2 col-sm-1">
                                                <span style={errStyle}>{this.state.error.assigneeId}</span>
                                                &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default" onClick={this.addPeople}>New</a>
                                            </div>
                                      </div>

                                      <div id="module" class="form-group">
                                            <label class="col-md-3 control-label">Module</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="module" onChange={this.onValueChange}/>
                                            </div>
                                      </div>

                                      <div id="platform" class="form-group">
                                            <label class="col-md-3 control-label">Platform</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="platform" onChange={this.onValueChange}/>
                                            </div>
                                      </div>

                                      <div id="version" class="form-group">
                                            <label class="col-md-3 control-label">Version</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="version" onChange={this.onValueChange}/>
                                            </div>
                                      </div>

                                       <div id="tester" class="form-group">
                                            <label class="col-md-3 control-label">Tested By</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="testerId" onChange={this.onValueChange}>
                                                    <option>Select Tester</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    
                                                </select>
                                             </div>
                                            <div class="col-md-2 col-sm-1">
                                            <span style={errStyle}>{this.state.error.testerId}</span>
                                                &nbsp;&nbsp;<a href="#" class="btn btn-sm btn-default" onClick={this.addPeople}>New</a>
                                            </div>
                                        </div>
                                      
                                      </div>

                                        </div>
                                        <div class="tab-pane" id="tab_2">
                                            
                                            <div class="form-horizontal">
                                                <div id="title" class="form-group">
                                                <label class="col-md-3 control-label">Describe Issue</label>
                                                <div class="col-md-7 col-sm-12">
                                                    
                                                <textarea id="editor1" class="form-control" name="description" rows="15"
                                                        onChange={this.onValueChange} value={this.state.description}></textarea>

                                                </div>
                                                </div>
                                            </div>         
                                        </div>
                                        
                                        </div>
                                    </div>

                                    <div class="text-right">
                                        <a class="btn btn-link text-left" href="#" onClick={this.cancelAdd}>Cancel</a>
                                        <button type="button" onClick={this.saveTask} class="btn btn-primary"><i class="fa fa-check icon-white"></i> Save</button>
                                    </div>


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