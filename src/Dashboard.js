
import React, {Component} from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Setting } from './Setting';
import axios from 'axios';
import config from './Config'
import { ChangePhoto } from './ChangePhoto';

export class Dashboard extends Component
{
    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);
       
        this.state = {
           user: user,
           project: {},
           projects: 0,
           bugs: 0,
           features: 0,
           others: 0,
           activeProjectId: '',
           isHideClosedTask: false,
           isShowAssignedToMe: false,
           isLoading: true
        }
    }


    componentDidMount() {
                 
        this.getUserTaskCount(this.state.user.id);
    }


    getUserTaskCount = (id) => {
        
        axios.get(config.serverUrl + "/api/people/getbyid/" + id).then(response=> {
         
            this.getProjectById(response.data.activeProjectId);
            this.getProjectCount(response.data.activeProjectId);
            this.getBugsCount(response.data.activeProjectId);
            this.getFeaturesCount(response.data.activeProjectId);
            this.getOthersCount(response.data.activeProjectId);
        

            this.setState({
                activeProjectId: response.data.activeProjectId,
                isHideClosedTask: response.data.isHideClosedTask,
                isShowAssignedToMe: response.data.isShowAssignedToMe,
                isLoading: false
            })

        });
    }


    getProjectById = (id) => {
        axios.get(config.serverUrl + "/api/project/getbyid/" + id).then(response=> {
            this.setState({
                project: response.data
            })

        });
    }


    getProjectCount = (projectId) => {
       
        if (projectId == '00000000-0000-0000-0000-000000000000') {
            axios.get(config.serverUrl + "/api/project/getprojectcount").then(response=> {
                this.setState({
                    projects: response.data
                })
            });
        } else {
            this.setState({
                projects: 1
            })
        }

    }

    getBugsCount = (projectId) => {

        if (projectId == '00000000-0000-0000-0000-000000000000') {
            axios.get(config.serverUrl + "/api/task/gettaskcount/bug").then(response=> {
                this.setState({
                    bugs: response.data
                })
            });
        } else {
            axios.get(config.serverUrl + "/api/task/gettaskcountbyproject/bug/" + projectId).then(response=> {
                this.setState({
                    bugs: response.data
                })
            });
        }
    }


    getFeaturesCount = (projectId) => {

        if (projectId == '00000000-0000-0000-0000-000000000000') {
            axios.get(config.serverUrl + "/api/task/gettaskcount/feature").then(response=> {
                this.setState({
                    features: response.data
                })
            });
        } else {
            axios.get(config.serverUrl + "/api/task/gettaskcountbyproject/feature/" + projectId).then(response=> {
                this.setState({
                    features: response.data
                })
            });
        }
    } 

    getOthersCount = (projectId) => {

        if (projectId == '00000000-0000-0000-0000-000000000000') {
            axios.get(config.serverUrl + "/api/task/gettaskcount/other").then(response=> {
                this.setState({
                    others: response.data
                })
            });
        } else {
            axios.get(config.serverUrl + "/api/task/gettaskcountbyproject/other/" + projectId).then(response=> {
                this.setState({
                    others: response.data
                })
            });
        }
    }



   
    addTask =()=> {
        this.props.history.push("/add-task");
    }



    render() {

        const style0 = {
            width:'8%'
        }

        const style1 = {
            width:'10%'
        }

        const style2 = {
            width:'40%'
        }

        const fontStyle = {
            fontWeight:'normal'
        }
        
        const heightStyle = {
            minHeight: '959.8px'
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
                    Dashboard
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
                       <div class="box-header with-border">
                        <h3 class="box-title">
                            {this.state.project != null ? 
                                <span>{this.state.project.projectName}</span>
                              : null
                            }  
                        </h3>
                            <div class="box-tools pull-right">
                                {this.state.isLoading ? 
                                    <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Loading ...</span>
                                    : null
                                }
                            </div>
                        </div>
                           
                           <div class="box-body">

                              <div class="row">
                        <div class="col-lg-3 col-xs-6">
                            <div class="small-box bg-purple">
                            <div class="inner">
                                <h3>{this.state.projects}</h3>
                                <p>Projects</p>
                            </div>
                                <div class="small-box-footer"/>
                                  
                                </div>
                        </div>

                        <div class="col-lg-3 col-xs-6">
                            <div class="small-box bg-green">
                            <div class="inner">
                                <h3>{this.state.features}</h3>
                                <p>Features</p>
                            </div>
                                <div class="small-box-footer"/>
                            </div>
                        </div>


                        <div class="col-lg-3 col-xs-6">
                            <div class="small-box bg-maroon">
                            <div class="inner">
                                <h3>{this.state.bugs}</h3>
                                <p>Bugs</p>
                            </div>
                          
                                <div class="small-box-footer"/>
                            </div>
                        </div>

                        <div class="col-lg-3 col-xs-6">
                            <div class="small-box bg-orange">
                            <div class="inner">
                                <h3>{this.state.others}</h3>
                                <p>Others</p>
                            </div>
                                <div class="small-box-footer"/>
                            </div>
                        </div>
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