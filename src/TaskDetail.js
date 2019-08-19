/*--------------------------------------------------
 *
 *  Task Master
 * 
 *  Task Manager For Software Development
 * 
 *  Version : 1.0
 *  Author  : Ariyanto
 *  E-mail  : neonerdy@gmail.com
 * 
 *  © 2019, Under Apache Licence  
 * 
 *--------------------------------------------------
 */

import React, {Component} from 'react';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { Setting } from './Setting';

import axios from 'axios';
import config from './Config';
import moment from 'moment';
import { ChangePhoto } from './ChangePhoto';

export class TaskDetail extends Component
{
    constructor(props) {
        super(props);

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson);

        this.closeBtn = React.createRef();
        this.commentAddCloseBtn = React.createRef();
        this.commentUpdateloseBtn = React.createRef();

        this.workLogCloseBtn = React.createRef();
        this.estimationCloseBtn = React.createRef();
        
        this.fileTxt = React.createRef();
        this.loggedDateText = React.createRef();

        this.state = {
            user: user,
            error: {},
            id: '',
            project: '',
            tracker: '',
            category: '',
            title: '',
            priority: '',
            reporter: '',
            assignee: '',
            tester: '',
            module: '',
            platform: '',
            version: '',
            createdDate: '',
            modifiedDate: '',
            closedDate: '',
            status: '',
            description: '',
            totalTimeSpentInHour: 0,
            attachments: [],
            comments: [],
            histories: [],
            commentId: '',
            message: '',
            workLogs: [],
            loggedDate: moment(Date.now()).format("MM/DD/YYYY"),
            timeSpent: '',
            unit: '',
            files: '',
            displayProgress: '',
            barPercentage: '',
            uploadPercentage: '',
            estimation: '',
            estimationUnit: '',
            estimationInHour: '',
            isLoading: true
        }
    }

    componentDidMount() {

        let id = this.props.match.params.id;

     
        this.getTaskById(id);
        this.getAttachmentByTaskId(id);
        this.getCommentByTaskId(id);
        this.getHistoriesByTaskId(id);
        this.getWorkLogByTaskId(id);

    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onFileChange = (e) => {
        this.setState({
            files: e.target.files
        });
    }

    onLoggedDateChange = (e) => {
        this.setState({
            loggedDate : e.target.value
        })
    }

    onTimeSpentChange = (e) => {
        this.setState({
            timeSpent : e.target.value
        })
    }


    getTaskById = (id) => {
        axios.get(config.serverUrl + "/api/task/getbyid/" + id).then(response=> {
            this.setState({
                id: response.data.id,
                project: response.data.projectName,
                category: response.data.category,
                tracker: response.data.tracker,
                title: response.data.title,
                priority: response.data.priority,
                reporter: response.data.reporter,
                assignee: response.data.assignee,
                tester: response.data.tester,
                module: response.data.module,
                platform: response.data.platform,
                version: response.data.version,
                createdDate: response.data.createdDate,
                modifiedDate: response.data.modifiedDate,
                closedDate: response.data.closedDate,
                status: response.data.status,
                description: response.data.description,
                totalTimeSpentInHour: response.data.totalTimeSpentInHour,
                estimation: response.data.estimation,
                estimationUnit: response.data.estimationUnit,
                estimationInHour: response.data.estimationInHour,
                isLoading: false
            })
      })
        
    }

    getCommentByTaskId = (id) => {
        axios.get(config.serverUrl + "/api/comment/getbytaskid/" + id).then(response=> {
            this.setState({
                comments: response.data
            })
        })
    }

    getHistoriesByTaskId = (id) => {
        axios.get(config.serverUrl + "/api/history/getbytaskid/" + id).then(response=> {
            this.setState({
                histories: response.data
            })
        })
    }

    getWorkLogByTaskId = (id) => {
        axios.get(config.serverUrl + "/api/worklog/getbytaskid/" + id).then(response=> {
            this.setState({
                workLogs: response.data
            })
        })
    }


    updateStatus = (status) => {

        let id = this.props.match.params.id;
        axios.get(config.serverUrl + "/api/task/updatestatus/" + id + "/" + status + "/" + this.state.user.id).then(response=> {
            this.getTaskById(id);
            this.getHistoriesByTaskId(id);
        })
    }

    assignedTaskToMe = () => {

        let id = this.props.match.params.id;
        let userId = this.state.user.id;

        axios.get(config.serverUrl + "/api/task/assignedtasktome/" + id + "/" + userId).then(response=> {
            this.getTaskById(id);
            this.getHistoriesByTaskId(id);
        })
    }


    assignedTesterToMe = () => {

        let id = this.props.match.params.id;
        let userId = this.state.user.id;

        axios.get(config.serverUrl + "/api/task/assignedtestertome/" + id + "/" + userId).then(response=> {
            this.getTaskById(id);
            this.getHistoriesByTaskId(id);
        })
    }


    addTask =()=> {
        this.props.history.push("/add-task");
    }

    editTask = (id) => {
        this.props.history.push("/edit-task/" + id);
    }

    refreshTask = (id) => {

        this.getTaskById(id);
        this.getAttachmentByTaskId(id);
        this.getCommentByTaskId(id);
        this.getHistoriesByTaskId(id);
        this.getWorkLogByTaskId(id);
    }

    deleteTask = (id) => {
        axios.delete(config.serverUrl + "/api/task/delete/" + id).then(response=> {
            this.closeBtn.current.click();
            this.props.history.push("/task");
        })
    }


    validateEstimation = () => {

        let isValid = true;
        let error = {};
             
        if (this.state.estimation == '') {
            error.estimation = 'is required';
            isValid = false;
        }
        if (this.state.estimationUnit == '') {
            error.estimationUnit = 'is required';
            isValid = false;
        }

        this.setState({
            error: error
        })

        return isValid;
    }

    closeEstimation = () => {
        this.setState({
            error: {},
            estimation: this.state.estimation,
            estimationUnit: this.state.estimationUnit
        })
    }


    updateEstimation = () => {

        let isValid = this.validateEstimation();

        if (isValid)
        {
            let taskEstimation = {
                taskId: this.state.id,
                estimation: this.state.estimation,
                estimationUnit: this.state.estimationUnit
            }

            axios.put(config.serverUrl + "/api/task/updateestimation",  taskEstimation).then(response=> {
                this.estimationCloseBtn.current.click();
                this.getTaskById(this.state.id);
            })
        }
    }


    validateComment = () => {

        let isValid = true;
        let error = {};
             
        if (this.state.message == '') {
            error.message = 'is required';
            isValid = false;
        }

        this.setState({
            error: error
        })

        return isValid;

    }


    saveComment = () => {

        let isValid = this.validateComment();
        if (isValid)
        {
            var comment = {
                taskId : this.state.id,
                commenterId: this.state.user.id,
                message: this.state.message
            }

            axios.post(config.serverUrl + "/api/comment/save", comment).then(response=> {
                this.commentAddCloseBtn.current.click();
                this.getCommentByTaskId(this.state.id);
                this.getHistoriesByTaskId(this.state.id);
            })
        }
    }

    editComment = (id) => {
                
        axios.get(config.serverUrl + "/api/comment/getbyid/" + id).then(response=> {
            this.setState({
                commentId: response.data.id,
                message: response.data.message
            })

        })
    }


    updateComment = () => {
       
       
        let isValid = this.validateComment();
        if (isValid)
        {
            var comment = {
                id: this.state.commentId,
                taskId: this.state.id,
                commenterId: this.state.user.id,
                message: this.state.message,
                createdDate: this.state.createdDate
            }
         
            axios.put(config.serverUrl + "/api/comment/update", comment).then(response=> {
                this.commentUpdateloseBtn.current.click();
                this.getCommentByTaskId(this.state.id);
            })
        }
    }



    deleteComment = (id) => {
        axios.delete(config.serverUrl + "/api/comment/delete/" + id).then(response=> {
            this.getCommentByTaskId(this.state.id);
        })
    }

    closeComment = () => {
        this.setState({
            error: {},
            message: ''
        })
    }



    validateWorkLog = () => {

        let isValid = true;
        let error = {};
      
       
        if (this.loggedDateText.current.value == '') 
        {
            error.loggedDate = 'is required';
            isValid = false;
        }
        if (this.state.timeSpent == '') {
            error.timeSpent = 'is required';
            isValid = false;
        }

        if (this.state.unit == '') {
            error.unit = 'is required';
            isValid = false;
        }

        this.setState({
            error: error
        })

        return isValid;
    }

    
    closeWorkLog = () => {
      
        this.loggedDateText.current.value = '';
      
        this.setState({
            error: {},
            timeSpent: '',
            unit: ''
        })
    }


    saveWorkLog = () => {


        let isValid = this.validateWorkLog();
        
        if (isValid)
        {

            let workLog = {
                taskId: this.state.id,
                loggedDate: this.loggedDateText.current.value,
                userId: this.state.user.id,
                timeSpent: this.state.timeSpent,
                unit: this.state.unit
            }
        
            axios.post(config.serverUrl + "/api/worklog/save", workLog).then(response=> {
                this.workLogCloseBtn.current.click();
                                
                this.getWorkLogByTaskId(this.state.id);
                this.getTaskById(this.state.id);
                
            })
        }

    }

 


    deleteWorkLog = (id) => {

        axios.delete(config.serverUrl + "/api/worklog/delete/" + id).then(response=> {
            this.getWorkLogByTaskId(this.state.id);
            this.getTaskById(this.state.id);
        })
    }



    calculateTimeSpent = (totalTimeSpentInHour) => {

        var day = 0;
        var hour = 0;
        
        if (totalTimeSpentInHour > 0)
        {
            if (totalTimeSpentInHour >= 8){
                day = parseInt(totalTimeSpentInHour / 8);
                hour = parseInt(totalTimeSpentInHour % 8);

                if (hour == 0) {
                    return(
                        <span>{day}d</span>
                    )    
                } else {
                    return(
                        <span>{day}d {hour}h</span>
                    )
                }
            }else{
                hour = parseInt(totalTimeSpentInHour);
                return(
                    <span>{hour}h</span>
                )
            }
        }

    }


    getFileExt = (fileName) => {
        var ext = fileName.split('.').pop();
        if(ext == fileName) return "";
        return ext;
    }

    
    getAttachmentByTaskId = (taskId) => {

        axios.get(config.serverUrl + "/api/attachment/getbytaskid/" + taskId).then(response=> {
            this.setState({
                attachments: response.data
            })
        })

    }


    
    saveAttachment = () => {

        let attachment = {
            taskId: this.state.id,
            fileName: this.state.files[0].name,
            type: this.getFileExt(this.state.files[0].name),
            size: this.state.files[0].size
        }
     
        axios.post(config.serverUrl + "/api/attachment/save", attachment).then(response=> {
            this.getAttachmentByTaskId(this.state.id);
        })
    }


    deleteAttachment = (attachmentId) => {
        axios.delete(config.serverUrl + "/api/attachment/delete/" + attachmentId).then(response=> {
            this.getAttachmentByTaskId(this.state.id)
        })
    }



    doneUpload =()=> {
        
        this.fileTxt.current.value = '';
        this.setState({
            error: {},
            uploadPercentage: '',
            barPercentage: '0%',
            files: ''
        })
    }


    validateUpload = () => {

        let isValid = true;
        let error = {};

        if (this.state.files[0] == undefined) {
            error.fileName = 'File name is required';
            isValid = false;
        }

        this.setState({
            error: error
        })

        return isValid;

    }


    uploadAttachment = () => {

        let isValid = this.validateUpload();
        
        if (isValid)
        {
     
            let formData = new FormData();
            
            formData.append('file', this.state.files[0]);

            axios.post(config.serverUrl + "/api/attachment/uploadfile",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent)=> {
                    var percentDone = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                    this.setState({
                        displayProgress: 'true',
                        uploadPercentage: percentDone + "%",
                        barPercentage: percentDone + "%"
                    })
                    
                }
            }
            ).then(()=> {
                    console.log('SUCCESS UPLOAD ATTACHMENT !!');
                    this.saveAttachment();
            })
            .catch(()=> {
                console.log('UPLOAD ATTACHMENT FAILURE !!');
            });
        
        }
         


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



    renderStatus = (status) => {
        if (status == "New") {
            return(
                <i class="fa fa-circle-o text-blue"></i>
            )
        }else if (status == "In Progress") {
            return(
                <i class="fa fa-circle-o text-orange"></i>
            )
        } else if (status == "Resolved") {
            return(
                <i class="fa fa-circle-o text-green"></i>
            )
        } else if (status == "Testing") {
            return(
                <i class="fa fa-circle-o text-purple"></i>
            )
        } else if (status == "Rework") {
            return(
                <i class="fa fa-circle-o text-maroon"></i>
            )
        } else if (status == "Closed") {
            return(
                <i class="fa fa-circle-o text-aqua"></i>
            )
        }
    }


    openNewTab = (fileName)=> {
        window.open(fileName, '_blank');
    }


    renderAttachment = (attachment) => {

           if (attachment.type.toLowerCase() == 'jpg' || attachment.type.toLowerCase() == "jpeg" || attachment.type.toLowerCase() == 'png') {
            
            let fileName = '/api/Resources/' + attachment.fileName;
            let size = attachment.size;
            
            return(
                <li>
                    <span class="mailbox-attachment-icon has-img"><img src={fileName}/></span>
                    <div class="mailbox-attachment-info">
                        <a href="#!" onClick={()=>this.openNewTab(fileName)} class="mailbox-attachment-name">{attachment.fileName}</a>
                            <span class="mailbox-attachment-size">
                            {Math.ceil(size/1024)} KB<br/>{moment(this.state.uploadedDate).format("MM/DD/YYYY hh:mm")}
                            <a href="#!" class="btn btn-default btn-xs pull-right" onClick={()=>this.deleteAttachment(attachment.id)}>
                                <i class="fa fa-trash-o"></i></a>
                            </span>
                    </div>
                </li>
            )
        }
        else {

            let fileName = '/api/Resources/' + attachment.fileName;
            let size = attachment.size;
            let fileIcon = '';

            if (attachment.type.toLowerCase() == 'pdf') {
                fileIcon = 'fa fa-file-pdf-o';
            }
            else if (attachment.type.toLowerCase() == 'doc' || attachment.type.toLowerCase() == 'docx') {
                fileIcon = 'fa fa-file-word-o';
            }
            else if (attachment.type.toLowerCase() == 'xls' || attachment.type.toLowerCase() == 'xlsx') {
                fileIcon = 'fa fa-file-excel-o';
            }
            else if (attachment.type.toLowerCase() == 'rar' || attachment.type.toLowerCase() == 'zip') {
                fileIcon = 'fa fa-file-archive-o';
            }
            else if (attachment.type.toLowerCase() == 'txt') {
                fileIcon = 'fa fa-file-text-o';
            }
            else if (attachment.type.toLowerCase() == 'ppt' || attachment.type.toLowerCase() == 'pptx') {
                fileIcon = 'fa fa-file-powerpoint-o';
            }
            else if (attachment.type.toLowerCase() == 'html' || attachment.type.toLowerCase() == 'xml'
                || attachment.type.toLowerCase() == 'css' || attachment.type.toLowerCase() == 'js'
                || attachment.type.toLowerCase() == 'json') {
                
                fileIcon = 'fa fa-file-code-o';
            }
            else if (attachment.type.toLowerCase() == 'mp4' || attachment.type.toLowerCase() == 'mov'
                || attachment.type.toLowerCase() == 'wmv' || attachment.type.toLowerCase() == 'flv'
                || attachment.type.toLowerCase() == 'wma' || attachment.type.toLowerCase() == '3gp'
                || attachment.type.toLowerCase() == '3gpp' || attachment.type.toLowerCase() == 'avi') {
                
               fileIcon = 'fa fa-file-video-o';
            }
            else if (attachment.type.toLowerCase() == 'wav' || attachment.type.toLowerCase() == 'mp3'
                || attachment.type.toLowerCase() == 'aac' || attachment.type.toLowerCase() == 'wma') {
            
                fileIcon = 'fa fa-file-audio-o';
            }
            else {
                fileIcon = 'fa fa-file-o';
            }
            
                                    
            return(
                <li>
                    <span class="mailbox-attachment-icon"><i class={fileIcon}></i></span>
                    <div class="mailbox-attachment-info">
                        
                        {attachment.type.toLowerCase() == 'pdf'?
                            <a href="#!" onClick={()=>this.openNewTab(fileName)} class="mailbox-attachment-name">{attachment.fileName}</a>
                            : <a href={fileName} class="mailbox-attachment-name">{attachment.fileName}</a>
                        }
                        <span class="mailbox-attachment-size">
                        {Math.ceil(size/1024)} KB {attachment.uploadedDate}
                        <a href="#!" class="btn btn-default btn-xs pull-right" onClick={()=>this.deleteAttachment(attachment.id)}>
                            <i class="fa fa-trash-o"></i></a>
                        </span>
                    </div>
                </li>
            )
            
        }

    }



    render() {

        const heightStyle = {
            minHeight: '959.8px'
        }

        const buttonStyle = {
            height: '34px'
        }

        const fontStyle = {
            fontWeight: 'normal'
        }

        const popupStyle = {
            width: '800px'
        }

        const attachmentStyle = {
            width: '470px'
        }

        const modalStyle = {
            width: '500px'
        }

        const barStyle = {
            display: 'none',
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
                    <br/>
                    <h1>
                        Task Detail
                    </h1>
                    <ol class="breadcrumb">
                        <button class="btn btn-primary" onClick={this.addTask}>Create New Task</button>
                    </ol>
                    </section>
                  
                    <section class="content">


                   <div id="addComment" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={popupStyle}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.closeComment}>&times;</button>
                                    <h4 class="modal-title">Add Comment</h4>
                                </div>
                                <div class="modal-body">
                                    
                                <textarea class="form-control" rows="8" name="message" value={this.state.message} onChange={this.onValueChange}></textarea>
                                </div>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.message}</span>
                                <div></div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal" onClick={this.closeComment} ref={this.commentAddCloseBtn}>Close</button>
                                    <button type="button" class="btn btn-primary" onClick={this.saveComment}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="editComment" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={popupStyle}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.closeComment}>&times;</button>
                                    <h4 class="modal-title">Edit Comment</h4>
                                </div>
                                <div class="modal-body">
                                <input type="hidden" name="id" value={this.state.commentId} onChange={this.onValueChange}/>    
                                <textarea class="form-control" rows="8" name="message" 
                                    onChange={this.onValueChange} value={this.state.message}></textarea>
                                </div>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span style={errStyle}>{this.state.error.message}</span>
                               <div></div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal" onClick={this.closeComment} ref={this.commentUpdateloseBtn}>Close</button>
                                    <button type="button" class="btn btn-primary" onClick={this.updateComment}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>

                       <div id="addAttachment" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={modalStyle}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.doneUpload}>&times;</button>
                                    <h4 class="modal-title">Attachment</h4>
                                </div>
                                
                                <div class="addAttachment-ui">
                                    
                                    <div class="modal-body row">
                                    <div class="col-md-12">
                                            <div id="divFile" class="form-group">
                                                  <input type="file" name="file" onChange={this.onFileChange} class="btn btn-default" style={attachmentStyle} ref={this.fileTxt}/>  
                                                  <div class="progress">
                                                <div class="progress-bar progress-bar active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.barPercentage}}></div>
                                            </div>
                                            {this.state.uploadPercentage}
                                          
                                            </div>
                                            <span style={errStyle}>{this.state.error.fileName}</span>
                                        </div>
                                   

                                        <div id="errorAddAttachment" class="form-group col-md-12"></div>     
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default pull-left" onClick={this.doneUpload} data-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary" id="btnUpload" onClick={this.uploadAttachment}>Upload</button>
                                    </div>
                            
                                </div>
                                
                            </div>
                         

                        </div>
                        
                </div>

              

                <div id="addWorkLog" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={{width: '350px'}}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.closeWorkLog}>&times;</button>
                                    <h4 class="modal-title">Add Work Log</h4>
                                </div>
                                <div class="addWorkLog-ui">

                                        <div class="modal-body row">
                                            <input type="hidden" name="id" value=""/>
                                    
                                            <div class="col-md-12">
                                                    <div class="form-group">
                                                            
                                                        <label style={{fontWeight:'normal'}}>Date</label>
                                                        <span class="input-group-btn">
                                                            <div class="input-group date" data-provide="datepicker" data-date-autoclose="true" data-date-today-highlight="true">
                                                                <input type="text" name="loggedDate" class="form-control" style={{width: '280px'}} 
                                                                    ref={this.loggedDateText}/>
                                                                <div class="input-group-addon">
                                                                    <span class="fa fa-calendar"></span>
                                                                </div>
                                                            </div>
                                            
                                                        </span>
                                                    </div>
                                                    <span style={errStyle}>{this.state.error.loggedDate}</span>
                                            </div>
                                            <div class="col-md-12">&nbsp;</div>
                                            <div class="col-md-6">
                                                    <div id="divAddTimeSpent" class="form-group">
                                                        <label style={{fontWeight:'normal'}}>Time Spent</label> 
                                                        <input type="text" class="form-control" name="timeSpent" onChange={this.onTimeSpentChange} value={this.state.timeSpent} style={{fontWeight:'normal'}}/>   
                                                    </div>
                                                    <span style={errStyle}>{this.state.error.timeSpent}</span>
                                                </div>
                                    
                                            <div class="col-md-6">
                                                <div id="divAddUnit" class="form-group">
                                                    <label style={{fontWeight:'normal'}}>Unit</label> 
                                                        <select class="form-control" name="unit" onChange={this.onValueChange} value={this.state.unit} style={{fontWeight:'normal'}}>
                                                            <option value="-1"></option>
                                                            <option value="h">Hour</option>
                                                            <option value="d">Day</option>
                                                        </select>                                                                                                      
                                                </div>
                                                <span style={errStyle}>{this.state.error.unit}</span> 
                                            </div>                                    
                                        </div>
                                    
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" onClick={this.closeWorkLog} ref={this.workLogCloseBtn}>Close</button>
                                            <button type="button" class="btn btn-primary" onClick={this.saveWorkLog}>Save Work Log</button>
                                        </div>
                                        
                             
                                </div>
                            </div>
                        </div>
                </div>



                <div id="updateEstimation" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={{width: '350px'}}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.closeEstimation}>&times;</button>
                                    <h4 class="modal-title">Estimation</h4>
                                </div>
                                <div class="addWorkLog-ui">

                                        <div class="modal-body row">
                                   
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label style={{fontWeight:'normal'}}>Estimation</label> 
                                                    <input type="text" class="form-control" name="estimation" onChange={this.onValueChange} value={this.state.estimation} style={{fontWeight:'normal'}}/>                                                                                                      
                                                </div>
                                                <span style={errStyle}>{this.state.error.estimation}</span>
                                            </div>
                                    
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label style={{fontWeight:'normal'}}>Unit</label> 
                                                        <select class="form-control" name="estimationUnit" onChange={this.onValueChange} value={this.state.estimationUnit} style={{fontWeight:'normal'}}>
                                                            <option value=""></option>
                                                            <option value="h">Hour</option>
                                                            <option value="d">Day</option>
                                                        </select>                                                                                                      
                                                </div>
                                                <span style={errStyle}>{this.state.error.estimationUnit}</span>
                                            </div>                                    
                                        </div>
                                    
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" onClick={this.closeEstimation} ref={this.estimationCloseBtn}>Close</button>
                                            <button type="button" class="btn btn-primary" onClick={this.updateEstimation}>Update Estimation</button>
                                        </div>
                                        
                             
                                </div>
                            </div>
                        </div>
                </div>

                

                <div id="deleteTask" class="modal fade">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Delete Task</h4>
                                </div>
                                <div class="modal-body">
                                    Are you sure want to delete this task?
                                </div>
                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default pull-left"  data-dismiss="modal" ref={this.closeBtn}>Close</button>
                                    <button type="button" class="btn btn-danger" onClick={()=>this.deleteTask(this.state.id)}>Yes</button>
                                </div>
                                

                            </div>
                        </div>
                </div>

                

                        <div class="row">
                        
                            <div class="col-md-12">
                                <div class="box box-default">
                                    <br/>
                                    <div class="box-header with-border">
                                   
                                     {this.state.isLoading ? 
                                        <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Loading ...</span>
                                        : <h3 class="box-title">{this.renderTracker(this.state.category, this.state.tracker)}&nbsp;&nbsp;{this.state.title}</h3>
                                      }
 
                                     </div>

                                    <section class="content">


                                    <div class="pull-right">
                                      <button class="btn btn-default" type="button" onClick={()=>this.editTask(this.state.id)}><i class="fa fa-pencil-square-o"></i>
                                            &nbsp;Edit
                                        </button>
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#addComment">Comment</button>
                                            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#addAttachment">Attachment</button>
                                            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#updateEstimation">Estimation</button>
                                            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#addWorkLog">Work Log</button>
                                               
                                        </div>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <div class="btn-group">
                                            <button class="btn btn-default" style={buttonStyle} type="button" onClick={()=>this.refreshTask(this.state.id)}><i class="fa fa-refresh"></i></button>    
                                            <button class="btn btn-default" style={buttonStyle} type="button" data-toggle="modal" data-target="#deleteTask">
                                                    <i class="fa fa-trash-o"></i>
                                            </button>
                                            
                                        </div>
                                        <div class="btn-group">
                                                <button class="btn btn-default" type="button">Update Status</button>
                                                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style={buttonStyle}>
                                                    <span class="caret"></span>
                                                
                                                </button>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li><a href="#!" onClick={()=>this.updateStatus("New")}>New</a></li>
                                                    <li><a href="#!" onClick={()=>this.updateStatus("In Progress")}>In Progress</a></li>
                                                    <li><a href="#!" onClick={()=>this.updateStatus("Resolved")}>Resolved</a></li>
                                                    <li><a href="#!" onClick={()=>this.updateStatus("Testing")}>Testing</a></li>
                                                    <li><a href="#!" onClick={()=>this.updateStatus("Rework")}>Rework</a></li>
                                                    <li><a href="#!" onClick={()=>this.updateStatus("Closed")}>Closed</a></li>
                                                    
                                                </ul>
                                        </div>
                                        </div>

                                        <br/><br/>

                             
                          
                            <section class="content">
             
                                <div class = "row">
                                    <div class="col-md-6">
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Project</label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.project}</label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Category</label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.category}</label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Priority</label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.priority}</label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Reporter</label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.reporter}</label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Assignee </label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.assignee}</label>
                                            <br/><a href="#!" onClick={this.assignedTaskToMe}>Assign to me</a> <br/></div>
                                        </div>
                                      
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Tester </label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.tester}</label>
                                            <br/><a href="#!" onClick={this.assignedTesterToMe}>Assign to me</a> <br/></div>
                                    </div>
                                    
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Module </label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.module}</label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Platform </label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.platform}</label></div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-lg-3"><label style={fontStyle}>Version</label> </div>
                                            <div class="col-lg-6"><label style={fontStyle}>{this.state.version}</label></div>
                                        </div>
                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Created Date </label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{moment(this.state.createdDate).format("MM/DD/YYYY hh:mm")}</label></div>
                                        </div>
                                        <div class="row">
                                                <div class="col-lg-3">
                                                    <label style={fontStyle}>Modified Date </label> </div>
                                                <div class="col-lg-6">
                                                    {this.state.modifiedDate != null? 
                                                    <label style={fontStyle}>{moment(this.state.modifiedDate).format("MM/DD/YYYY hh:mm")}</label>
                                                    : (
                                                        null     
                                                    )}
                                                </div>
                                        </div>
                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Closed Date </label> </div>
                                                <div class="col-lg-6">
                                                    {this.state.closedDate != null? 
                                                    <label style={fontStyle}>
                                                        {moment(this.state.closedDate).format("MM/DD/YYYY hh:mm")}
                                                    </label>
                                                    : (
                                                       null    
                                                    )}
                                                </div>
                                        </div>
                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Status</label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{this.renderStatus(this.state.status)}&nbsp;{this.state.status}</label></div>
                                        </div>
                                    
                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Estimation </label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{this.calculateTimeSpent(this.state.estimationInHour)}</label></div>
                                        </div>

                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Time Spent </label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{this.calculateTimeSpent(this.state.totalTimeSpentInHour)}</label></div>
                                        </div>

                                        
                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Time Left </label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{this.calculateTimeSpent(this.state.estimationInHour - this.state.totalTimeSpentInHour)}</label></div>
                                        </div>

                                        <div class="row">
                                                <div class="col-lg-3"><label style={fontStyle}>Progress </label> </div>
                                                <div class="col-lg-6"><label style={fontStyle}>{Math.ceil((this.state.totalTimeSpentInHour/this.state.estimationInHour) * 100)}%</label></div>
                                        </div>


                                        
                                    </div>
                                  
                                </div>


                         </section>

                         <br></br>


                            <div class="box-header with-border">
                            
                                <h3 class="box-title"><b>Description</b></h3>
                                <div class="box-tools pull-right">
                                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                    </button>
                                </div>

                            </div>

                            <div class="box-body">

                                <div class="row">
                                    <div class="col-md-12">
                                        <div className="memo">{this.state.description}</div>
                                    </div>
                                </div>

                            </div>


                            <br/><br/>                    


                                {/* Attachment */}

                                <div class="box-header with-border">
                                    <h3 class="box-title"><b>Attachments ({this.state.attachments.length}) </b></h3>
                                    <div class="box-tools pull-right">
                                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="box-body">
                                        
                                    <div class="row">
                                        <div class="col-md-12">
                                            <ul class="mailbox-attachments clearfix">
                                            {this.state.attachments.map(a=>          
                                                <div>{this.renderAttachment(a)}</div>
                                                )}      
                                            </ul>
                                        </div>    
                                    </div>

                                </div>    


                              <br/><br/>


                                  <div class="box-header with-border" >
                                    <h3 class="box-title"><b>Activity</b></h3>
                                    <div class="box-tools pull-right">
                                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                </div>

                                <br/>


                                  <div class="nav-tabs-custom">
                                        <ul class="nav nav-tabs">
                                            <li class="active"><a href="#tab_comment" data-toggle="tab" aria-expanded="true" style={fontStyle}>Comments</a></li>
                                            <li class=""><a href="#tab_history" data-toggle="tab" aria-expanded="true" style={fontStyle}>Histories</a></li>
                                            <li class=""><a href="#tab_worklog" data-toggle="tab" aria-expanded="true" style={fontStyle}>Work Logs</a></li>
                                            
                                        </ul>
                                        <div class="tab-content">
                        
                                            <div class="tab-pane active" id="tab_comment">

                                                <div class="box-body">
                                                    <div class="row">
                                                    <div class="col-md-12">
                                                        {this.state.comments.map(c=> 
                                                        <div> 
                                                        <div><b>{c.commenter}</b> - {moment(this.state.commendDate).format("MM/DD/YYYY hh:mm")}</div>
                                                        <br/>
                                                        <div className="memo">{c.message}</div> 
                                                        <br/>
                                                        <div><a href="#!" onClick={()=>this.editComment(c.id)}  data-toggle="modal" data-target="#editComment">Edit</a>&nbsp;|&nbsp;
                                                             <a href="#!" onClick={()=>this.deleteComment(c.id)}>Delete</a></div>
                                                            <br/>
                                                        </div>
                                                        )}
                                                    
                                                    </div>
                                                    </div>
                                                </div>
                                            

                                            </div>
                                            <div class="tab-pane" id="tab_history">

                                                 <div class="box-body">
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            {this.state.histories.map(h=> 
                                                            <div> 
                                                            <div>{h.user} {h.activityLog} at {moment(h.date).format('MM/DD/YYYY hh:mm')}</div> 
                                                            <br/>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="tab-pane" id="tab_worklog">
                                                <div class="box-body">
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            {this.state.workLogs.map(w=> 
                                                            <div> 
                                                            <div>{w.user} logged {w.timeSpent}{w.unit} at {moment(w.loggedDate).format("MM/DD/YYYY")}</div> 
                                                            <div><a href="#!" onClick={()=>this.deleteWorkLog(w.id)}>Delete</a></div>
                                                            <br/>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                </div>






                                    </section>


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