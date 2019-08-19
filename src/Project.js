
import React, {Component} from 'react';
import ReactExport from 'react-export-excel'
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { Setting } from './Setting';
import moment from 'moment';
import axios from 'axios';
import config from './Config';
import { ChangePhoto } from './ChangePhoto';


export class Project extends Component
{
    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson)

        this.state = {
            user: user,
            projects: [],
            initialProjects: [],
            isLoading: true,
            projectId: '',
            projectName: '',
        }
    }

    componentDidMount() {
        this.getAllProjects();
    }


    mapProject = (response) => {
        
        let projects = [];

        for(let i=0;i<response.data.length;i++) {

            let project = {};
            
            project.id = response.data[i].id;
            project.projectName = response.data[i].projectName;
            project.initial = response.data[i].initial;
            project.projectManager = response.data[i].projectManager;
            project.createdDate = moment(response.data[i].createdDate).format('MM/DD/YYYY');
            project.description = response.data[i].description;
            project.status = response.data[i].status;
            
            projects.push(project);
        }

        return projects;
        
    }


    getAllProjects =() => {


        axios.get(config.serverUrl + "/api/project/getall").then(response=> {
        
            let projects = this.mapProject(response);

            this.setState({
                projects: projects,
                initialProjects: projects,
                isLoading: false
            })
        });
    }


    addProject =()=> {
        this.props.history.push("/add-project");
    }

    editProject = (id) => {
        this.props.history.push("/edit-project/" + id);
    }


    deleteProject = (id) => {
        axios.delete(config.serverUrl + "/api/project/delete/" + id).then(response=> {
            this.getAllProjects();
        })
    }

    getProjectId = (id, projectName) => {
        this.setState({
            projectId: id,
            projectName: projectName
        })
    }


    onSearchChange = (e) => {

        let filteredProjects = this.state.initialProjects.filter(p => p.projectName.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
            p.initial.toLowerCase().includes(e.target.value.toLowerCase()) ||
            p.projectManager.toLowerCase().includes(e.target.value.toLowerCase()) ||
            p.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
            p.status.toLowerCase().includes(e.target.value.toLowerCase())
        );
        
        if (e.target.value == '')
        {
            this.setState( {
                projects: this.state.initialProjects
            })
        }
        else {
            this.setState( {
                projects: filteredProjects
            })
    
        }
        
    }


    refreshProject = () => {
        this.getAllProjects();
    }


    dynamicSort = (property) => {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }


    sortTask = (columnName) => {
        this.state.initialProjects.sort(this.dynamicSort(columnName));
    }


    render() {

        const ExcelFile = ReactExport.ExcelFile;
        const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
        const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

        const heightStyle = {
            minHeight: '959.8px'
        }
        const buttonStyle = {
            height: '34px'
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
                    Projects ({this.state.projects.length})
                </h1>
                <ol class="breadcrumb">
                    <button class="btn btn-primary" onClick={this.addProject}>Create New Project</button>
                </ol>
                </section>
                <br></br>
            
            
                <div id="deleteProject" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Delete</h4>
                            </div>
                            <div class="modal-body">
                                Are you sure want to delete {this.state.projectName} ?
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default pull-left"  data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-danger" onClick={()=>this.deleteProject(this.state.projectId)} data-dismiss="modal">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>


                <section class="content">
                    <div class="row">
                    
                        <div class="col-md-12">
                            <div class="box box-default">
                            
                                
                                <div class="box-body">
                                    {this.state.isLoading ? 
                                        <span><i className="fa fa-spinner fa-spin"></i> Loading ...</span>
                                        : null
                                    }
                                    <div class="pull-right">
                                        <button class="btn btn-default" type="button" name="refresh" aria-label="refresh" title="Refresh" onClick={this.refreshProject}>
                                            <i class="fa fa-refresh"></i>
                                        </button>
                                        
                                        <div class="btn-group">
                                            <button class="btn btn-default" type="button">
                                                <i class="fa  fa-sort-alpha-asc"></i>&nbsp;Sort 
                                            </button>
                                            <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                            <span class="caret"></span>
                                            
                                            </button>
                                            <ul class="dropdown-menu" role="menu">
                                                <li><a href="#" onClick={()=>this.sortTask("projectName")}>Project Name</a></li>
                                                <li><a href="#" onClick={()=>this.sortTask("initial")}>Initial</a></li>
                                                <li><a href="#" onClick={()=>this.sortTask("projectManager")}>Project Manager</a></li>
                                                <li><a href="#" onClick={()=>this.sortTask("createdDate")}>Created Date</a></li>
                                                <li><a href="#" onClick={()=>this.sortTask("description")}>Description</a></li>
                                                <li><a href="#" onClick={()=>this.sortTask("status")}>Status</a></li>
                                            </ul>
                                        </div>

                                        
                                        <div class="export btn-group">
                                            
                                        <ExcelFile element={ <button class="btn btn-default" data-toggle="dropdown" type="button">
                                                <i class="fa fa-download"></i> 
                                            </button>}>

                                            <ExcelSheet data={this.state.projects} name="Projects">
                                                <ExcelColumn label="Project Name" value="projectName"/>
                                                <ExcelColumn label="Initial" value="initial"/>
                                                <ExcelColumn label="Project Manager" value="projectManager"/>
                                                <ExcelColumn label="Created Date" value="createdDate"/>
                                                <ExcelColumn label="Description" value="description"/>
                                                <ExcelColumn label="Status" value="status"/>
                                            </ExcelSheet>
                                        </ExcelFile>

                                            
                                        </div>
                                    </div>
                                    <div class="pull-right search">
                                        <input class="form-control" type="text" placeholder="Search" onChange={this.onSearchChange}/>
                                    </div>

                                    <br/><br/><br/>
                                
                                    <table class="table table-hover">
                                    <tbody>
                                        <tr>
                                            <th><u>PROJECT NAME</u></th>
                                            <th><u>INITIAL</u></th>
                                            <th><u>PROJECT MANAGER</u></th>
                                            <th><u>CREATED DATE</u></th>
                                            <th><u>DESCRIPTION</u></th>
                                            <th><u>STATUS</u></th>
                                            <th>ACTION</th>
                                        </tr>
                                       {this.state.projects.map(p=> 
                                        <tr key={p.id}>
                                            <td>{p.projectName}</td>
                                            <td>{p.initial}</td>
                                            <td>{p.projectManager}</td>
                                            <td>{p.createdDate}</td>
                                            <td>{p.description}</td>
                                            <td>{p.status}</td>
                                            <td>
                                                <a href="#" onClick={()=>this.editProject(p.id)}>Edit</a> &nbsp;|&nbsp; 
                                                <a href="#" data-toggle="modal" data-target="#deleteProject" onClick={()=>this.getProjectId(p.id, p.projectName)}>Delete</a>
                                            </td>
                                        </tr>
                                        )}
                                        </tbody>
                                    </table>
    
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