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

using System;

namespace TaskMaster.Models
{
    public class Project
    {
        public Guid ID { get; set; }
        public string ProjectName { get; set; }
        public Guid ProjectManagerId { get; set; } 
        public People ProjectManager { get; set; }
        public string Initial { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Description { get; set; } 
        public string Status { get; set; }
        
    }
}