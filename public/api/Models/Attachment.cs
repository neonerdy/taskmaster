
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
    public class  Attachment
    {
        public Guid ID { get; set; }
        public Guid TaskId { get; set; }
        public string FileName { get; set; }
        public string Type { get; set; }
        public double Size { get; set; }
        public DateTime UploadedDate { get; set; }
    }
}