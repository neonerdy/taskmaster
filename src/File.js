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
import ReactExport from 'react-export-excel'
import { Header } from './Header';
import { NavBar } from './NavBar';
import config from './Config';
import axios from 'axios';
import moment from 'moment';
import { Footer } from './Footer';
import { Setting } from './Setting';
import { ChangePhoto } from './ChangePhoto';


export class File extends Component 
{

    constructor(props) {
        super(props);

        this.fileTxt = React.createRef();
    
        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson)

        this.state = {
            error: {},
            user: user,
            activeProjectId: '',
            projects: [],
            documents: [],
            initialUploadedFiles: [],
            uploadedFiles: [],
            files: '',
            uploadPercentage: '',
            barPercentage: '',
            isLoading: true,
            fileId: '',
            fileName: ''
        }
    }

    componentDidMount() {

        this.getAllProjects();
        this.getUserById(this.state.user.id);
    }


    onFileChange = (e) => {
        this.setState({
            files: e.target.files
        });
    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getUserById =(id)=> {
        axios.get(config.serverUrl + "/api/people/getbyid/" + id).then(response=> {
           
            this.setState({
                activeProjectId: response.data.activeProjectId,
            })
           
            if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
                this.getAllFiles();
            } else {
                this.getFilesByProject(this.state.activeProjectId);
            }

            this.setState({
                isLoading: false
            })
            
        });
    }

    getFiles = () => {

        if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
            this.getAllFiles();
        } else {
            this.getFilesByProject(this.state.activeProjectId);
        }
    }


    getAllProjects =() => {
        axios.get(config.serverUrl + "/api/project/getall").then(response=> {
            this.setState({
                projects: response.data
            })
        });
    }


    mapFiles = (response) => {

        let uploadedFiles = [];

        for(let i=0; i < response.data.length;i++) {
            
            let file = {};

            file.id = response.data[i].id;
            file.fileName = response.data[i].fileName;
            file.size = response.data[i].size;
            file.type = response.data[i].type;
            file.uploader = response.data[i].uploader;
            file.uploadedDate = moment(response.data[i].uploadedDate).format("MM/DD/YYYY hh:mm:ss");
            
            uploadedFiles.push(file);

        }

        return uploadedFiles;

    }


    getAllFiles = () => {
        axios.get(config.serverUrl +  "/api/file/getall").then(response=> {
           
            let uploadedFiles = this.mapFiles(response);
           
            this.setState({

                initialUploadedFiles: uploadedFiles,
                uploadedFiles: uploadedFiles
            })
        })
    }


    getFilesByProject = (projectId) => {

        
        axios.get(config.serverUrl +  "/api/file/getbyproject/" + projectId).then(response=> {
       
            let uploadedFiles = this.mapFiles(response);
       
            this.setState({
                initialUploadedFiles: uploadedFiles,
                uploadedFiles: uploadedFiles
            })
        })
    }


    getFileExt = (fileName) => {
        var ext = fileName.split('.').pop();
        if(ext == fileName) return "";
        return ext;
    }



    saveFile = () => {

        let fileInKb = Math.ceil(this.state.files[0].size/1024);

        let file = {
            projectId: this.state.activeProjectId,
            fileName: this.state.files[0].name,
            type: this.getFileExt(this.state.files[0].name).toLowerCase(),
            size: fileInKb + ' KB',
            uploaderId: this.state.user.id
        }

        
        axios.post(config.serverUrl + "/api/file/save", file).then(response=> {
            this.getFiles(); 
        })
    }
 

    deleteFile = (id) => {
        axios.delete(config.serverUrl + "/api/file/delete/" + id).then(response=> {
            this.getFiles();
        })
    }

    getFileId = (id, fileName) => {
        this.setState({
            fileId: id,
            fileName: fileName
        })
    }


    validate = () => {

        let isValid = true;
        let error = {};

        if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
            error.projectName = 'Project name is required';
            isValid = false;
        }

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
     
       let isValid = this.validate();

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
                        uploadPercentage: percentDone + "%",
                        barPercentage: percentDone + "%"
                    })
                    
                }
            }
            ).then(()=> {
                    console.log('SUCCESS UPLOAD FILE!!');
                    this.saveFile();
            })
            .catch(()=> {
                console.log('UPLOAD FILE FAILURE!!');
            });
       }         
    }


    doneUpload =()=> {
        
        this.fileTxt.current.value = '';
        this.setState({
            error: {},
            uploadPercentage: '',
            barPercentage: '0%',
            files: ''
        })

        if (this.state.activeProjectId == '00000000-0000-0000-0000-000000000000') {
            this.getAllFiles();
        } else {
            this.getFilesByProject(this.state.activeProjectId);
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


    sortFile = (columnName) => {
        this.state.initialUploadedFiles.sort(this.dynamicSort(columnName));
    }


    openNewTab = (fileName)=> {
        window.open(fileName, '_blank');
    }


    onSearchChange = (e) => {

        let filteredFiles = this.state.initialUploadedFiles.filter(f => f.fileName.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
            f.size.toLowerCase().includes(e.target.value.toLowerCase()) ||
            f.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
            f.uploader.toLowerCase().includes(e.target.value.toLowerCase()) ||
            f.uploadedDate.toLowerCase().includes(e.target.value.toLowerCase())
        );

        if (e.target.value == '')
        {
            this.setState( {
                uploadedFiles: this.state.initialUploadedFiles
            })
        }
        else {
            this.setState( {
                uploadedFiles: filteredFiles
            })
    
        }
        
    }


    refresFile = () => {
        this.getFiles();
    }

    openNewTab = (fileName)=> {
        window.open(fileName, '_blank');
    }


    renderIcon = (file) => {

     
        let fileName = '/api/Resources/' + file.fileName;
        let fileIcon = '';
        let iconColor = '';

        if (file.type.toLowerCase() == 'xls' || file.type.toLowerCase() == 'xlsx') {
            fileIcon = 'fa fa-file-excel-o';
            iconColor = 'green';
        } else if (file.type.toLowerCase() == 'doc' || file.type.toLowerCase() == 'docx') {
            fileIcon = 'fa fa-file-word-o';
            iconColor = 'blue';
        }
        else if (file.type.toLowerCase() == 'ppt' || file.type.toLowerCase() == 'pptx') {
            fileIcon = 'fa fa-file-powerpoint-o';
            iconColor = 'red';
        } else if (file.type.toLowerCase() == 'pdf') {
            fileIcon = 'fa fa-file-pdf-o';
            iconColor = 'red';
        } else if (file.type.toLowerCase() == 'zip' || file.type.toLowerCase() == 'rar') {
            fileIcon = 'fa fa-file-zip-o';
            iconColor = 'navy';
        } else if (file.type.toLowerCase() == 'jpg' || file.type.toLowerCase() == 'jpeg' || file.type.toLowerCase() == 'png') {
            fileIcon = 'fa fa-file-image-o';
            iconColor = 'purple';
        } else if (file.type.toLowerCase() == 'mp4' || file.type.toLowerCase() == 'mov'
            || file.type.toLowerCase() == 'wmv' || file.type.toLowerCase() == 'flv'
            || file.type.toLowerCase() == 'wma' || file.type.toLowerCase() == '3gp'
            || file.type.toLowerCase() == '3gpp' || file.type.toLowerCase() == 'avi') {
        
            fileIcon = 'fa fa-file-video-o';
            iconColor = 'orange';
        }
        else {
            fileIcon = 'fa fa-file-o';
            iconColor = 'brown';
        }
      
        if (file.type.toLowerCase() == 'pdf') {
            return (
                <a href="#!" onClick={()=>this.openNewTab(fileName)}>
                    <i class={fileIcon} style={{color: iconColor}}></i>&nbsp; {file.fileName}
                </a>
            )
        } else {
            return(
                <a href={fileName}><i class={fileIcon} style={{color: iconColor}}></i>&nbsp; {file.fileName}</a>
            )
        }

    }


    render() {

        const ExcelFile = ReactExport.ExcelFile;
        const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
        const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


        const style1 = {
            width:'50%'
        }

        const style2 = {
            width:'10%'
        }

        
        const style3 = {
            width:'20%'
        }

        const fontStyle = {
            fontWeight:'normal'
        }
        

        const heightStyle = {
            minHeight: '959.8px'
        }

        const buttonStyle = {
            height: '34px'
        }

        const attachmentStyle = {
            width: '470px'
        }

        const modalStyle = {
            width: '500px'
        }

        const errStyle = {
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


                <div id="uploadFile" class="modal fade" role="dialog">
                        <div class="modal-dialog" style={modalStyle}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" onClick={this.doneUpload}>&times;</button>
                                    <h4 class="modal-title">Upload File</h4>
                                </div>
                                
                                <div class="uploadFile-ui">
                                    
                                    <div class="modal-body row">
                                    
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label style={{fontWeight:'normal'}}>Project</label>
                                            <select class="form-control" name="activeProjectId" onChange={this.onValueChange} value={this.state.activeProjectId} style={{fontWeight:'normal'}}>
                                                <option value="00000000-0000-0000-0000-000000000000">All Project</option>
                                                {this.state.projects.map(p=> 
                                                    <option key={p.id} value={p.id}>{p.projectName}</option>
                                                )}
                                            </select>
                                            <br/>        
                                            <span style={errStyle}>{this.state.error.projectName}</span> 
                                         </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div id="divFile" class="form-group">
                                             <label style={{fontWeight:'normal'}}>File</label>
                                            <input type="file" name="file" onChange={this.onFileChange} class="btn btn-default" style={attachmentStyle} ref={this.fileTxt}/>  
                                            <div class="progress">
                                                <div class="progress-bar progress-bar active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.barPercentage}}></div>
                                            </div>
                                            {this.state.uploadPercentage}
                                        </div>
                                        <span style={errStyle}>{this.state.error.fileName}</span>
                                    </div>
                                        
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal" onClick={this.doneUpload}>Close</button>
                                        <button type="button" class="btn btn-primary" id="btnUpload" onClick={this.uploadAttachment}>Upload</button>
                                    </div>
                            
                                </div>
                                
                            </div>
                         

                        </div>
                        
                </div>


                <div id="deleteFile" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Delete</h4>
                            </div>
                            <div class="modal-body">
                                Are you sure want to delete {this.state.fileName} ?
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default pull-left"  data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-danger" onClick={()=>this.deleteFile(this.state.fileId)} data-dismiss="modal">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>

                
                    <section class="content-header">
                        <h1>
                            Files ({this.state.uploadedFiles.length})
                        </h1>
                        <ol class="breadcrumb">
                            <button class="btn btn-primary"  data-toggle="modal" data-target="#uploadFile">Upload New File</button>
                        </ol>
                    </section>
                    <br></br>

                    <section class="content">
                        
                       
                
                       <div class="box box-default">
                           <div class="box-body">

                           {this.state.isLoading ? 
                            <span><i className="fa fa-spinner fa-spin"></i>&nbsp;Loading ...</span>
                            : null
                            }
                    
                           <div class="pull-right">
                            <button class="btn btn-default" type="button" name="refresh" aria-label="refresh" title="Refresh" onClick={this.refresFile}>
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
                                    <li><a href="#" onClick={()=>this.sortFile("fileName")}>File Name</a></li>
                                    <li><a href="#" onClick={()=>this.sortFile("size")}>Size</a></li>
                                    <li><a href="#" onClick={()=>this.sortFile("type")}>Type</a></li>
                                    <li><a href="#" onClick={()=>this.sortFile("uploader")}>Uploader</a></li>
                                    <li><a href="#" onClick={()=>this.sortFile("uploadedDate")}>Uploaded Date</a></li>
                                </ul>
                            </div>

                            <div class="export btn-group">
                                
                            <ExcelFile element={ <button class="btn btn-default" data-toggle="dropdown" type="button">
                                        <i class="fa fa-download"></i> 
                                    </button>}>

                                    <ExcelSheet data={this.state.uploadedFiles} name="Files">
                                        <ExcelColumn label="File Name" value="fileName"/>
                                        <ExcelColumn label="Size" value="size"/>
                                        <ExcelColumn label="Type" value="type"/>
                                        <ExcelColumn label="Uploader" value="uploader"/>
                                        <ExcelColumn label="Uploaded Date" value="uploadedDate"/>
                                    </ExcelSheet>
                                </ExcelFile>

                            </div>     
                        </div>
                        
                        <div class="pull-right search">
                            <input class="form-control" type="text" placeholder="Search" onChange={this.onSearchChange}/>
                        </div>

                            <br/><br/><br/>

                           <div class="box-body table-responsive no-padding">
                            <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th style={style1}><u>FILE NAME</u></th>
                                <th><u>SIZE</u></th>
                                <th><u>TYPE</u></th>
                                <th><u>UPLOADER</u></th>
                                <th><u>UPLOADED DATE</u></th> 
                                <th><u>ACTION</u></th> 
                                
                            </tr>

                            {this.state.uploadedFiles.map(f=> 
                            <tr style={fontStyle} id={f.id}>
                                <td>
                                    {this.renderIcon(f)}
                                </td>
                                <td>{f.size}</td>
                                <td>{f.type}</td>
                                <td>{f.uploader}</td>
                                <td>{f.uploadedDate}</td>
                                <td>
                                   <a href="#" data-toggle="modal" data-target="#deleteFile" onClick={()=>this.getFileId(f.id, f.fileName)}>Delete</a>
                                </td>
                            </tr>
                            )}

                            
                            </tbody></table>
           
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