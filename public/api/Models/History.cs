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
    public class History
    {
        public Guid ID { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public People User { get; set; }
        public DateTime Date { get; set; }
        public string ActivityLog { get; set; }
        public Task Task { get; set; }
        
        
    }
}

