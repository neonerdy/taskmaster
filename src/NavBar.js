
import React, {Component} from 'react';
import {Link,NavLink} from 'react-router-dom';

export class NavBar extends Component {

  

  statusClick =(status)=> {
    alert(status);
  }


    render() {



        return(

            <aside class="main-sidebar">
            <section class="sidebar">


            
              <ul class="sidebar-menu" data-widget="tree">
            
           
                <li class="header">MAIN NAVIGATION</li>
             
                <li>
                  <Link to="/dashboard">
                      <i class="fa fa-desktop"></i>
                      <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link to="/project">
                    <i class="fa fa-calendar-check-o"></i>
                    <span>Projects</span>
                  </Link>
                </li>

                <li>
                  <Link to="/people">
                    <i class="fa fa-user"></i>
                    <span>Teams</span>
                   
                  </Link>
                </li>

                <li>
                  <Link to="/file">
                    <i class="fa fa-files-o"></i>
                    <span>Files</span>
                   
                  </Link>
                </li>
           

                <li>
                  <Link to="/task">
                    <i class="fa fa-clone"></i>
                    <span>Tasks</span>
                   
                  </Link>
                </li>


       
              </ul>
            </section>
          </aside>

        )
    }
}