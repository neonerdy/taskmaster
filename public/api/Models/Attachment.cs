
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