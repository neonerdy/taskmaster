
using System;
using System.Collections.Generic;

namespace TaskMaster.Models
{
    public class Task
    {
        public Guid ID { get; set; }
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
        public string Category { get; set; }
        public string Tracker { get; set; }
        public string Title { get; set; }
        public string Priority { get; set; }
        public Guid ReporterId { get; set; }
        public People Reporter { get; set; }
        public Guid AssigneeId { get; set; }
        public People Assignee { get; set; }
        public Guid TesterId { get; set; }
        public People Tester { get; set; }
        public string Platform { get; set; }
        public string Module { get; set; }
        public string Version { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string Description { get; set; }
        public int Estimation { get; set; }
        public string EstimationUnit { get; set; }
        public int EstimationInHour { get; set; }
        public int TotalTimeSpentInHour { get; set; }

        public List<Attachment> Attachments { get; set; }
        public List<Comment> Comments { get; set; }
        public List<History> Histories { get; set; }
    }
}
