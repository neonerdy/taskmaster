

using System;


namespace TaskMaster.Models
{
    public class People
    {
        public Guid ID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Photo { get; set; }
        public Guid ActiveProjectId { get; set; }
        public bool IsHideClosedTask { get; set; }
      }
}