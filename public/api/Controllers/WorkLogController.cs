
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TaskMaster.Models;

namespace TaskMaster.Models
{
    [Route("api/[controller]/[action]")]
    public class WorkLogController : Controller
    {

        private AppDbContext context;
        public WorkLogController() 
        {
            context = new AppDbContext();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByTaskId(Guid id)
        {
             var workLogs = await context.WorkLogs
                .Include(w=>w.User)
                .Where(w=>w.TaskId == id)
                .Select(w=>new {
                    w.ID,
                    User = w.User.FullName,
                    LoggedDate = w.LoggedDate,
                    TimeSpent = w.TimeSpent,
                    Unit = w.Unit,
                    TimeSpentInHour = w.TimeSpentInHour
                })
                .OrderBy(t=>t.LoggedDate)
                .ToListAsync();
           
            return Ok(workLogs); 

        }

        
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] WorkLog workLog)
        {
            workLog.ID = Guid.NewGuid();

            if (workLog.Unit == "h") {
                workLog.TimeSpentInHour = workLog.TimeSpent;
            } else if (workLog.Unit == "d") {
                workLog.TimeSpentInHour = workLog.TimeSpent * 8;
            }
           
            var task = await context.Tasks.FindAsync(workLog.TaskId);
            task.TotalTimeSpentInHour = task.TotalTimeSpentInHour + workLog.TimeSpentInHour; 

            context.Add(workLog);
            context.Update(task);

            var result = await context.SaveChangesAsync();
            return Ok(result);

        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var workLog = await context.WorkLogs.FindAsync(id);
            context.Remove(workLog);
            
            var task = await context.Tasks.FindAsync(workLog.TaskId);
            task.TotalTimeSpentInHour = task.TotalTimeSpentInHour - workLog.TimeSpentInHour; 
            context.Update(task);

            var result = await context.SaveChangesAsync();


            return Ok(result);
        }


    }


}