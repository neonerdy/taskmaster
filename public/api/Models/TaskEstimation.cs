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