

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
    public class ProjectController : Controller
    {

        private AppDbContext context;
        
        public ProjectController() 
        {
            context = new AppDbContext();
        }        
        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await context.Projects
                .Include(p=>p.ProjectManager)
                .Select(p=>new {
                    p.ID,
                    p.ProjectName,
                    p.Initial,
                    ProjectManager = p.ProjectManager.FullName,
                    p.Description,
                    p.Status,
                    p.CreatedDate
                })
                .OrderBy(p=>p.ProjectName)
                .ToListAsync();
            
            return Ok(projects);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var project = await context.Projects.FindAsync(id);
            
            return Ok(project);
        }

        
        [HttpGet]
        public async Task<IActionResult> GetProjectCount()
        {
            var projects = await context.Projects
                .ToListAsync();
            
            return Ok(projects.Count);
        }



        [HttpPost]
        public async Task<IActionResult> Save([FromBody]Project project)
        {
            project.ID = Guid.NewGuid();
            project.Status = "New";
            project.CreatedDate = DateTime.Now;
            context.Add(project);    

            var result = await context.SaveChangesAsync();
            return Ok(result);

        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Project project)
        {
            context.Update(project);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var project = await context.Projects.FindAsync(id);
            context.Remove(project);
            var result = await context.SaveChangesAsync();

            return Ok(result);

        }



    }

}