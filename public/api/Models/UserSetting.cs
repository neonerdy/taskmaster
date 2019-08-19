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