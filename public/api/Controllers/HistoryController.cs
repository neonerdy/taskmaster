

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
    public class HistoryController : Controller
    {
        public AppDbContext context;
        public HistoryController() 
        {
            context = new AppDbContext();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByTaskId(Guid id)
        {
            var histories = await context.Histories
             .Include(h=>h.User)
             .Where(h=>h.TaskId == id)
             .OrderBy(h=>h.Date)
             .Select(h=>new {
                    h.ID,
                    User = h.User.FullName,
                    Date = h.Date,
                    ActivityLog = h.ActivityLog
                }).ToListAsync();
              
            return Ok(histories); 
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            var user = await context.People.FindAsync(userId);
            if (user.Role == "Tester")
            {
            
                var histories = await context.Histories

                .Include(h=>h.User)
                .Include(h=>h.Task)
                .Where(h=>h.Task.TesterId == userId && h.Task.Status != "Closed" && h.ActivityLog =="Changed to Testing" && h.UserId != userId)
                .OrderByDescending(h=>h.Date)
                .Select(h=>new {
                        h.ID,
                        User = h.User.FullName,
                        UserPhoto = h.User.Photo,
                        Tracker = h.Task.Tracker,
                        Date = h.Date,
                        ActivityLog = h.ActivityLog
                    }).ToListAsync();
                
                return Ok(histories);
            } 
            else 
            {
                 var histories = await context.Histories
                
                .Include(h=>h.User)
                .Include(h=>h.Task)
                .Where(h=>h.Task.AssigneeId == userId && h.Task.Status != "Closed" 
                    &&  h.ActivityLog != "Changed to Closed" && h.UserId != userId)
                .OrderByDescending(h=>h.Date)
                .Select(h=>new {
                        h.ID,
                        User = h.User.FullName,
                        UserPhoto = h.User.Photo,
                        Tracker = h.Task.Tracker,
                        Date = h.Date,
                        ActivityLog = h.ActivityLog
                    }).ToListAsync();
                
                return Ok(histories);
            }
        }


        [HttpGet("{projectId}/{userId}")]
        public async Task<IActionResult> GetByProjectAndUserId(Guid projectId, Guid userId)
        {
            var user = await context.People.FindAsync(userId);
            if (user.Role == "Tester")
            {
                var histories = await context.Histories
                    .Include(h=>h.User)
                    .Include(h=>h.Task)
                    .Where(h=>h.Task.ProjectId == projectId && h.Task.TesterId == userId && h.Task.Status != "Closed" 
                        && h.ActivityLog =="Changed to Testing"  && h.UserId != userId)
                    .OrderByDescending(h=>h.Date)
                    .Select(h=>new {
                            h.ID,
                            User = h.User.FullName,
                            UserPhoto = h.User.Photo,
                            Tracker = h.Task.Tracker,
                            Date = h.Date,
                            ActivityLog = h.ActivityLog
                        }).ToListAsync();
                    
                    return Ok(histories);

            }
            else 
            {
                var histories = await context.Histories
                    .Include(h=>h.User)
                    .Include(h=>h.Task)
                    .Where(h=>h.Task.ProjectId == projectId && h.Task.AssigneeId == userId && h.Task.Status != "Closed" 
                        &&  h.ActivityLog != "Changed to Closed" && h.UserId != userId)
                    .OrderByDescending(h=>h.Date)
                    .Select(h=>new {
                            h.ID,
                            User = h.User.FullName,
                            UserPhoto = h.User.Photo,
                            Tracker = h.Task.Tracker,
                            Date = h.Date,
                            ActivityLog = h.ActivityLog
                        }).ToListAsync();
                    
                    return Ok(histories);

            }


        }



    }

}