import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import config from './Config';


export class ChangePhoto extends Component {


    constructor(props) {
        super(props);

        this.fileTxt = React.createRef();

        var userJson = localStorage.getItem("user");
        var user = JSON.parse(userJson)

        this.state = {
            user: user,
            error: {},
            files: '',
            uploadPercentage: '',
            barPercentage: ''
        }
    }


    onFileChange = (e) => {
        this.setState({
            files: e.target.files
        });
    }


    updatePhoto = () => {

        var photo = {
            userId: this.state.user.id,
            photo:  this.state.files[0].name
        }

        axios.put(config.serverUrl + "/api/people/updatephoto", photo).then(response=> {

        })
    }


    validate = () => {

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
                    console.log('SUCCESS UPLOAD PHOTO !!');
                    this.updatePhoto();
            })
            .catch(()=> {
                console.log('UPLOAD PHOTO FAILURE!!');
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
    }



    render() {


        const modalStyle = {
            width: '500px'
        }

        const attachmentStyle = {
            width: '470px'
        }

        const errStyle = {
            color: 'darkred'
        }


        return(
            <div id="editPhoto" class="modal fade" role="dialog">
            <div class="modal-dialog" style={modalStyle}>
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Change Photo</h4>
                    </div>
                    
                    <div class="editPhoto-ui">
                        
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
                      
                         </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default pull-left" onClick={this.doneUpload} data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="btnUpload" onClick={this.uploadAttachment}>Upload</button>
                        </div>
                
                    </div>
                    
                </div>
                

            </div>
            
        </div>

        )
    }




}