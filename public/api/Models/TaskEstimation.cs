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
using System.Collections.Generic;

namespace TaskMaster.Models
{
    public class TaskEstimation
    {
        public Guid TaskId { get; set; }
        public int Estimation { get; set; }
        public string EstimationUnit { get; set; }

    }

}