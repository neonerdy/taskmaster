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
    public class Comment
    {
        public Guid ID { get; set; }
        public Guid TaskId { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid CommenterId { get; set; }
        public People Commenter { get; set; }
        public string Message { get; set; }        
    }

}