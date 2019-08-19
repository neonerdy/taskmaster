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
    public class  WorkLog
    {
        public Guid ID { get; set; }
        public Guid TaskId { get; set; }
        public DateTime LoggedDate { get; set; } 
        public People User { get; set; }
        public Guid UserId { get; set; }
        public int TimeSpent { get; set; }
        public string Unit  { get; set; }
        public int TimeSpentInHour { get; set; }

        

    }

}