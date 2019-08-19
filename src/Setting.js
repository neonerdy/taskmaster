import React, {Component} from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import config from './Config';

export class Setting extends Component {


    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson)

        this.state = {
            user: user,
            projects: [],
            activeProjectId: user.activeProjectId,
            isHideClosedTask: false
        }
    }

    componentDidMount() {
        this.getAllProjects();
        this.getPeopleById(this.state.user.id);

    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onHideClosedTaskChecked =()=> {
        this.setState({isHideClosedTask: !this.state.isHideClosedTask});
    }


    getPeopleById =(id)=> {
        axios.get(config.serverUrl + "/api/people/getbyid/" + id).then(response=> {
            this.setState({
                activeProjectId: response.data.activeProjectId,
                isHideClosedTask: response.data.isHideClosedTask
            })
          });
    }



    getAllProjects =() => {
        axios.get(config.serverUrl + "/api/project/getall").then(response=> {
            this.setState({
                projects: response.data
            })
        });
    }


    updateSetting = () => {

        var userSetting = {
            userId: this.state.user.id,
            activeProjectId: this.state.activeProjectId,
            isHideClosedTask: this.state.isHideClosedTask
        }

        axios.post(config.serverUrl + "/api/people/updatesetting", userSetting).then(response=> {
            
        });


    }





    render() {

        return(
            
            <div id="updateSetting" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Settings</h4>
                        </div>
                        <div class="modal-body row">
                            
                            <div class="col-md-6">
                                <div id="divAddUnit" class="form-group">
                                    <label style={{fontWeight:'normal'}}>Active Project</label> 
                                    
                                    <select class="form-control" name="activeProjectId" onChange={this.onValueChange} value={this.state.activeProjectId} style={{fontWeight:'normal'}}>
                                         <option value="00000000-0000-0000-0000-000000000000">All Project</option>
                                         {this.state.projects.map(p=> 
                                            <option key={p.id} value={p.id}>{p.projectName}</option>
                                         )}
                                    </select>                                                                                                      
                                    </div>
                                    <label style={{fontWeight:'normal'}}>Task</label> 
                                <div class="checkbox">
                                    <label>
                                        {this.state.isHideClosedTask? 
                                            <input type="checkbox" name="isHideClosedTask" checked onChange={this.onHideClosedTaskChecked}/> 
                                            :  <input type="checkbox" name="isHideClosedTask" onChange={this.onHideClosedTaskChecked}/>
                                        } Hide Closed Task
                                        </label>
                                </div>
                                                          </div>
                            
                            <div class="col-md-6">

                            
                        
                            </div>            

                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default pull-left"  data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={()=>this.updateSetting()} data-dismiss="modal">Update Setting</button>
                        </div>
                        

                    </div>
                </div>
             </div>

        )


    }



}