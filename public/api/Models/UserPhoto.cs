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
    public class  UserPhoto
    {
        public Guid UserId { get; set; }
        public string Photo { get; set; }
    }
}