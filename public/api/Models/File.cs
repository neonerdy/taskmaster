

using System;

namespace TaskMaster.Models
{
    public class File
    {
        public Guid ID { get; set; }
        public Guid ProjectId { get; set; }
        public string FileName { get; set; }
        public string Type { get; set; }
        public string Size { get; set; }
        public Guid UploaderId { get; set; }
        public People Uploader { get; set; }
        public DateTime UploadedDate { get; set; }
        
    }

}