import React, {Component} from 'react';
import ReactExport from 'react-export-excel'
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Setting } from './Setting';
import moment from 'moment';
import axios from 'axios';
import config from './Config';
import { ChangePhoto } from './ChangePhoto';

export class Task extends Component {

    constructor(props) {
        super(props);
        
        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);

        this.state = {
            user: user, 
            tasks: [],
            initialTasks: [],
            title: 'All Tasks',
            activeProjectId: '',
            isHideClosedTask: false,
            isLoading: true
        }
    }

    componentDidMount() {
        
        this.getUserById(this.state.user.id);
      
    }


    getUserById =(id)=> {
        axios.get(config.serverUrl + "/api/people/getbyid/" + id).then(response=> {
            

            this.setState({
                activeProjectId: response.data.activeProjectId,
                isHideClosedTask: response.data.isHideClosedTask,
            })

            if (this.state.isHideClosedTask) {
                if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
                    this.getAllAndOpenTask();
                } else {
                    this.getByProjectAndOpenTask(this.state.activeProjectId);
                }
            }
            else {

                if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
                    this.getAllTask();
                } else {
                    this.getTaskByProject(this.state.activeProjectId);
                }
            }    

            this.setState({
                isLoading: false
            })

                
            
        });
    }

    mapTask = (response) => {

        let tasks = [];

        for(let i=0; i < response.data.length; i++) {

            let task = {};

            task.id = response.data[i].id;
            task.category = response.data[i].category; 
            task.tracker = response.data[i].tracker;
            task.title = response.data[i].title;
            task.priority = response.data[i].priority;
            task.assignee = response.data[i].assignee;
            task.status = response.data[i].status;
            task.createdDate = moment(response.data[i].createdDate).format("MM/DD/YYYY hh:mm:ss");

            tasks.push(task);
        }

        return tasks;
    }


    getAllTask = () => {
        axios.get(config.serverUrl + "/api/task/getall").then(response=> {
            
            let tasks = this.mapTask(response);

            this.setState({
                tasks: tasks,
                initialTasks: tasks
            })
        })
    }

    getAllAndOpenTask = () => {
        axios.get(config.serverUrl + "/api/task/getallandopentask").then(response=> {

            let tasks = this.mapTask(response);

            this.setState({
                tasks: tasks,
                initialTasks: tasks
            })
        })
    }


    getTaskByProject = (projectId) => {
        axios.get(config.serverUrl + "/api/task/getbyproject/" + projectId).then(response=> {
            let tasks = this.mapTask(response);
            this.setState({
                tasks: tasks,
                initialTasks: tasks
            })
        })
    }


    getByProjectAndOpenTask = (projectId) => {
        axios.get(config.serverUrl + "/api/task/getbyprojectandopentask/" + projectId).then(response=> {
            let tasks = this.mapTask(response);
            this.setState({
                tasks: tasks,
                initialTasks: tasks
            })
        })
    }


    addTask =()=> {
        this.props.history.push("/add-task");
    }


    taskDetail =(id)=> {
        this.props.history.push("/task-detail/" + id);
    }


    refreshTask = () => {
        
        this.getUserById(this.state.user.id);
        this.setState({
            title: "All Tasks"
        })        
    }


    onCategoryFilter = (category) => {

        let filteredTasks = this.state.initialTasks.filter(t => t.category.toLowerCase()
            .includes(category.toLowerCase()));
        
        if (category == 'All')
        {
            this.setState( {
                tasks: this.state.initialTasks,
                title: 'All Tasks'
            })
        }
        else {
            this.setState( {
                tasks: filteredTasks,
                title: category + 's'
            })
        }
    }


    onStatusFilter = (status) => {

        let filteredTasks = this.state.initialTasks.filter(t => t.status.toLowerCase()
            .includes(status.toLowerCase()));
        
        if (status == 'All')
        {
            this.setState( {
                tasks: this.state.initialTasks,
                title: 'All Tasks'
            })
        }
        else {
            this.setState( {
                tasks: filteredTasks,
                title: status + " Tasks"
            })
        }
    }


    onAssignedToMeFilter = () => {

        let filteredTasks = this.state.initialTasks.filter(t => t.assignee.toLowerCase()
            .includes(this.state.user.fullName.toLowerCase()));
        
        this.setState({
            tasks: filteredTasks,
            title: this.state.user.fullName + " Tasks"
        })
    }



    onPriorityFilter = (priority) => {

        let filteredTasks = this.state.initialTasks.filter(t => t.priority.toLowerCase()
            .includes(priority.toLowerCase()));
        
        this.setState({
            tasks: filteredTasks,
            title: priority + " Priority Tasks"
        })

    }

    

    onSearchChange = (e) => {

        let filteredTasks = this.state.initialTasks.filter(t => t.tracker.toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
                t.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
                t.priority.toLowerCase().includes(e.target.value.toLowerCase()) ||
                t.assignee.toLowerCase().includes(e.target.value.toLowerCase())
            );
        
        if (e.target.value == '')
        {
            this.setState( {
                tasks: this.state.initialTasks
            })
        }
        else {
            this.setState( {
                tasks: filteredTasks
            })
    
        }
        
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
        this.state.initialTasks.sort(this.dynamicSort(columnName));
    }


    renderTracker = (category, tracker) => {
        if (category == 'Feature') {
            return(
                <span class="label label-success"><b>{tracker}</b></span>
            )
        } else if (category == 'Bug') {
            return(
                <span class="label label-danger"><b>{tracker}</b></span>
            )
        } else if (category == "Other") {
            return(
                <span class="label label-warning"><b>{tracker}</b></span>
            )
        }
    }



    render() {

        const ExcelFile = ReactExport.ExcelFile;
        const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
        const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

        const fontStyle = {
            fontWeight:'normal'
        }
        
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
                    {this.state.title} ({this.state.tasks.length})
                </h1>
                <ol class="breadcrumb">
                    <button class="btn btn-primary" onClick={this.addTask}>Create New Task</button>
                </ol>
                </section>
                <br></br>

                <section class="content">
                
                <div class="row">
                   
                   <div class="col-md-12">
                       <div class="box box-default">
                       
                           
                           <div class="box-body">

                           <div class="btn-group">
                                <button class="btn btn-default" type="button">Task Category</button>
                                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                <span class="caret"></span>
                                
                                </button>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="#" onClick={()=>this.onCategoryFilter("All")}>All</a></li>
                                    <li><a href="#" onClick={()=>this.onCategoryFilter("Feature")}>Feature</a></li>
                                    <li><a href="#" onClick={()=>this.onCategoryFilter("Bug")}>Bug</a></li>
                                    <li><a href="#" onClick={()=>this.onCategoryFilter("Other")}>Other</a></li>
                                    
                                </ul>
                            </div>
                            &nbsp; &nbsp;

                          
                           <div class="btn-group">
                                <button class="btn btn-default" type="button">Task Status</button>
                                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                <span class="caret"></span>
                                
                                </button>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="#" onClick={()=>this.onStatusFilter("All")}>All</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("New")}>New</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("In Progress")}>In Progress</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("Resolved")}>Resolved</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("Testing")}>Testing</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("Rework")}>Rework</a></li>
                                    <li><a href="#" onClick={()=>this.onStatusFilter("Closed")}>Closed</a></li>
                                    
                                </ul>
                            </div>

                            &nbsp;&nbsp;&nbsp;&nbsp;
                                 
                            {this.state.isLoading ? 
                            <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Loading ...</span>
                            : null
                            }
                      
                             <div class="pull-right">
                                    <button class="btn btn-default" type="button" name="refresh" aria-label="refresh" title="Refresh" onClick={this.refreshTask}>
                                        <i class="fa fa-refresh"></i>
                                    </button>
                                   
                                    <div class="btn-group">
                                        <button class="btn btn-default" type="button">
                                             <i class="fa fa-filter"></i>&nbsp;Filter
                                        </button>
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                        <span class="caret"></span>
                                        
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#" onClick={this.onAssignedToMeFilter}>Assigned To Me</a></li>
                                            <li><a href="#" onClick={()=>this.onPriorityFilter("High")}>High Priority</a></li>
                                            <li><a href="#" onClick={()=>this.onPriorityFilter("Normal")}>Normal Priority</a></li>
                                            <li><a href="#" onClick={()=>this.onPriorityFilter("Low")}>Low Priority</a></li>
                                            
                                        </ul>
                                    </div>

                                    <div class="btn-group">
                                        <button class="btn btn-default" type="button">
                                            <i class="fa  fa-sort-alpha-asc"></i>&nbsp;Sort 
                                        </button>
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                        <span class="caret"></span>
                                        
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#" onClick={()=>this.sortTask("tracker")}>Tracker</a></li>
                                            <li><a href="#" onClick={()=>this.sortTask("title")}>Title</a></li>
                                            <li><a href="#" onClick={()=>this.sortTask("priority")}>Priority</a></li>
                                            <li><a href="#" onClick={()=>this.sortTask("assignee")}>Assignee</a></li>
                                            <li><a href="#" onClick={()=>this.sortTask("status")}>Status</a></li>
                                            <li><a href="#" onClick={()=>this.sortTask("createdDate")}>Created Date</a></li>
                                        </ul>
                                    </div>


                                    <div class="export btn-group">
                                       
                                        <ExcelFile element={ <button class="btn btn-default" data-toggle="dropdown" type="button">
                                            <i class="fa fa-download"></i> 
                                            </button>}>

                                            <ExcelSheet data={this.state.tasks} name="Tasks">
                                                <ExcelColumn label="Tracker" value="tracker"/>
                                                <ExcelColumn label="Title" value="title"/>
                                                <ExcelColumn label="Priority" value="priority"/>
                                                <ExcelColumn label="Assignee" value="assignee"/>
                                                <ExcelColumn label="Status" value="status"/>
                                                <ExcelColumn label="Created Date" value="createdDate"/>
                                                
                                            </ExcelSheet>
                                        </ExcelFile>


                                     </div>    
                                     
                                     
                               </div>
                               <div class="pull-right search">
                                   <input class="form-control" type="text" placeholder="Search" onChange={this.onSearchChange}/>
                               </div>
                            
                               <br/>
                               <br/>
                               <br/>
                           
                        <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                          <tbody>
                           <tr>
                            <th style={{width:'8%'}}><u>TRACKER</u></th>   
                            <th style={{width:'40%'}}><u>TITLE</u></th>
                            <th style={{width:'10%'}}><u>PRIORITY</u></th>
                            <th style={{width:'10%'}}><u>ASSIGNEE</u></th>
                            <th style={{width:'8%'}}><u>STATUS</u></th>
                            <th style={{width:'12%'}}><u>CREATED DATE</u></th>   
                            
                          </tr>
                        
                         {this.state.tasks.map(t=>
                          <tr style={fontStyle}>
                              <td>
                                {this.renderTracker(t.category, t.tracker)}
                              </td>
                              <td><a href="#" onClick={()=>this.taskDetail(t.id)}>{t.title}</a></td>
                              <td>{t.priority}</td>
                              <td>{t.assignee}</td>
                              <td>{t.status}</td>
                              <td>{t.createdDate}</td>
                          </tr>
                          )}
                       
                        </tbody></table>
               
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