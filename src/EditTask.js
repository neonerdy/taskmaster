
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


export class EditTask extends Component
{

    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);

        this.state = {
            user: user,
            error: {},
            projects: [],
            peoples: [],
            projectId: '',
            category: '',
            tracker: '',
            title: '',
            priority: '',
            reporterId: '',
            assigneeId: '',
            module: '',
            platform: '',
            version: '',
            testerId: '',
            createdDate: null,
            modifiedDate: null,
            closedDate: null,
            status: '',
            description: '',
            totalTimeSpentInHour: '',
            estimation: '',
            estimationUnit: '',
            estimationInHour: '',
            isLoading: true,
            isUpdating: false,
            waitStatus: ''
        }
    }

    componentDidMount() {

        let id = this.props.match.params.id;

        this.getAllProjects();
        this.getAllPeople();
        this.getTaskById(id);

       

    }

    onEditorChange = (e) => {
		this.setState({
			description: e.editor.getData()
        });
        
    }
    
    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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

    getTaskById = (id) => {

        this.setState({
            waitStatus: 'Loading ...'
        })

        axios.get(config.serverUrl + "/api/task/getbyid/" + id).then(response=> {
            this.setState({
                id: response.data.id,
                projectId: response.data.projectId,
                category: response.data.category,
                tracker: response.data.tracker,
                title: response.data.title,
                priority: response.data.priority,
                reporterId: response.data.reporterId,
                assigneeId: response.data.assigneeId,
                module: response.data.module,
                platform: response.data.platform,
                version: response.data.version,
                testerId: response.data.testerId,
                createdDate: response.data.createdDate,
                modifiedDate: response.data.modifiedDate,
                closedDate: response.data.closedDate,
                description: response.data.description,
                status: response.data.status,
                totalTimeSpentInHour: response.data.totalTimeSpentInHour,
                estimation: response.data.estimation,
                estimationUnit: response.data.estimationUnit,
                estimationInHour: response.data.estimationInHour,
                isLoading: false
            })

        })
    }

    

    updateTask = () => {
        
        let isValid = this.validate();
        if (isValid)
        {
            let task = {
                id: this.state.id,
                projectId: this.state.projectId,
                category: this.state.category,
                tracker: this.state.tracker,
                title: this.state.title,
                priority: this.state.priority,
                reporterId: this.state.reporterId,
                assigneeId: this.state.assigneeId,
                module: this.state.module,
                platform: this.state.platform,
                version: this.state.version,
                testerId: this.state.testerId,
                createdDate: this.state.createdDate,
                modifiedDate: this.state.modifiedDate,
                closedDate: this.state.closedDate,
                status: this.state.status,
                description: this.state.description,
                totalTimeSpentInHour: this.state.totalTimeSpentInHour,
                estimation: this.state.estimation,
                estimationUnit: this.state.estimationUnit,
                estimationInHour: this.state.estimationInHour
            }

            this.setState({
                isUpdating: true,
                waitStatus: 'Updating ...'
            })

            axios.put(config.serverUrl + "/api/task/update", task).then(response=> {
                this.setState({
                    isUpdating: false
                })
                this.props.history.push("/task-detail/" + this.state.id);
            })
        }
    }


    validate = () => {

        let isValid = true;
        let error = {};

        if (this.state.projectId == '') {
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
        if (this.state.status == '') {
            error.status = 'is required';
            isValid = false;
        }
               
      
        this.setState({
            error: error 
        })

        return isValid;
        
    }


    cancelUpdate = () => {
        this.props.history.push("/task-detail/" + this.props.match.params.id);
    }


    render() {

        const heightStyle = {
            minHeight: '959.8px'
        }

        const preview = {
            whiteSpace: 'pre;'
        }

        const selectStyle = {
            width: '100%'
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
                        <h1>
                            Edit Task
                        </h1>
                    </section>
                    <br/>
                  
                
                     <section class="content">

                         <div class="row">
                                  
                            <div class="col-md-12">
                                <div class="box box-default">
                                    <div class="box-header with-border">
                                       
                                    <div class="nav-tabs-custom">
                                        <ul class="nav nav-tabs">
                                        
                                        <div class="pull-right">
                                            {this.state.isLoading || this.state.isUpdating ? 
                                                <span><i className="fa fa-spinner fa-spin"></i> {this.state.waitStatus}</span>
                                                : null
                                            }       
                                        </div>

                                        <li class="active"><a href="#tab_1" data-toggle="tab" aria-expanded="true">Detail</a></li>
                                        <li class=""><a href="#tab_2" data-toggle="tab" aria-expanded="false">Description</a></li>
                                        </ul>
                                        <div class="tab-content">
                                        <div class="tab-pane active" id="tab_1">
                                                
                                        <div class="form-horizontal">
                                      
                                        <div class="form-group">
                                            <label class="col-md-3 control-label">Project</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="projectId" onChange={this.onValueChange}  value={this.state.projectId}>
                                                    <option value="">Select Project</option>
                                                    {this.state.projects.map(p=> 
                                                        <option key={p.id} value={p.id}>{p.projectName}</option>
                                                    )}
                                                </select>
                                            </div>
                                       
                                            <div class="col-md-2 col-sm-1">
                                            <span style={errStyle}>{this.state.error.projectId}</span>
                                                &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default">New</a>
                                            </div>
                                        </div>

                                            
                                      <div class="form-group">
                                            <label class="col-md-3 control-label">Category</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="category" onChange={this.onValueChange} value={this.state.category}>
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
                                                <input class="form-control" type="text" name="title" 
                                                    onChange={this.onValueChange} value={this.state.title}/>
                                            </div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.title}</span>
                                      </div>

                                      <div id="priority" class="form-group">
                                            <label class="col-md-3 control-label">Priority</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="priority" 
                                                    onChange={this.onValueChange} value={this.state.priority}>
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
                                                <select class="form-control" name="reporterId" 
                                                    onChange={this.onValueChange} value={this.state.reporterId}>
                                                    <option>Select Reporter</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    
                                                </select>
                                            </div>
                                            <div class="col-md-2 col-sm-1">
                                                <span style={errStyle}>{this.state.error.reporterId}</span>
                                                    &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default">New</a>
                                            </div>
                                      </div>

                                      <div id="assigned" class="form-group">
                                            <label class="col-md-3 control-label">Assigned To</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="assigneeId" 
                                                    onChange={this.onValueChange} value={this.state.assigneeId}>
                                                    <option>Select Assignee</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    

                                                </select>
                                            </div>
                                            <div class="col-md-2 col-sm-1">
                                                <span style={errStyle}>{this.state.error.assigneeId}</span>
                                                &nbsp;&nbsp; <a href="#" class="btn btn-sm btn-default">New</a>
                                            </div>
                                      </div>

                                      <div id="module" class="form-group">
                                            <label class="col-md-3 control-label">Module</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="module" 
                                                    onChange={this.onValueChange} value={this.state.module}/>
                                            </div>
                                      </div>

                                      <div id="platform" class="form-group">
                                            <label class="col-md-3 control-label">Platform</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="platform" 
                                                    onChange={this.onValueChange} value={this.state.platform}/>
                                            </div>
                                      </div>

                                      <div id="version" class="form-group">
                                            <label class="col-md-3 control-label">Version</label>
                                            <div class="col-md-7 col-sm-12">
                                                <input class="form-control" type="text" name="version" 
                                                    onChange={this.onValueChange} value={this.state.version}/>
                                            </div>
                                      </div>

                                       <div id="tester" class="form-group">
                                            <label class="col-md-3 control-label">Tested By</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="testerId" 
                                                    onChange={this.onValueChange} value={this.state.testerId}>
                                                    <option>Select Tester</option>
                                                    {this.state.peoples.map(p=> 
                                                      <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    )}    
                                                </select>
                                             </div>
                                            <div class="col-md-2 col-sm-1">
                                            <span style={errStyle}>{this.state.error.testerId}</span>
                                                &nbsp;&nbsp;<a href="#" class="btn btn-sm btn-default">New</a>
                                            </div>
                                        </div>

                                        <div id="tester" class="form-group">
                                            <label class="col-md-3 control-label">Status</label>
                                            <div class="col-md-7 col-sm-12 required">
                                                <select class="form-control" name="status" 
                                                    onChange={this.onValueChange} value={this.state.status}>
                                                    <option>Select Status</option>
                                                    <option value="New">New</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Testing">Testing</option>
                                                    <option value="Rework">Rework</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                             </div>
                                            <div class="col-md-2 col-sm-1">
                                                <span style={errStyle}>{this.state.error.status}</span>
                                            </div>
                                        </div>

                                      
                                      </div>

                                        </div>
                                        <div class="tab-pane" id="tab_2">
                                            
                                            <div class="form-horizontal">
                                                <div id="title" class="form-group">
                                                <label class="col-md-3 control-label">Describe Issue</label>
                                                <div class="col-md-7 col-sm-12">

                                                    {/*}
                                                    <CKEditor name="description" value={this.state.description} onChange={this.onEditorChange} /> 
                                                    {*/}

                                                    <textarea id="editor1" class="form-control" name="description" rows="15"
                                                        onChange={this.onValueChange} value={this.state.description}></textarea>
                                               
                                                </div>
                                                </div>
                                            </div>         
                                        </div>
                                        
                                        </div>
                                    </div>

                                    <div class="text-right">
                                        <a class="btn btn-link text-left" href="#" onClick={this.cancelUpdate}>Cancel</a>
                                        <button type="button" onClick={this.updateTask} class="btn btn-primary"><i class="fa fa-check icon-white"></i> Update</button>
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