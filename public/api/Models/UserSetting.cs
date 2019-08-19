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
    public class  UserSetting
    {
        public Guid UserId { get; set; }
        public Guid ActiveProjectId { get; set; }
        public bool IsHideClosedTask { get; set; }
        
    }
}