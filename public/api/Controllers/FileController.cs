

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
    public class FileController : Controller
    {

        public AppDbContext context;

        public FileController()
        {
            context = new AppDbContext();;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await context.Files
                .Include(f=>f.Uploader)
                .Select(f=>new {
                    ID = f.ID,
                    FileName = f.FileName,
                    Type = f.Type,
                    Size= f.Size,
                    Uploader = f.Uploader.FullName,
                    UploadedDate = f.UploadedDate
                })
                .OrderByDescending(f=>f.UploadedDate)
                .ToListAsync();
            
            return Ok(projects);
        }



        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetByProject(Guid projectId)
        {
            var projects = await context.Files
                .Include(f=>f.Uploader)
                .Where(f=>f.ProjectId == projectId)
                .Select(f=>new {
                    ID = f.ID,
                    FileName = f.FileName,
                    Type = f.Type,
                    Size= f.Size,
                    Uploader = f.Uploader.FullName,
                    UploadedDate = f.UploadedDate
                })
                .OrderByDescending(f=>f.UploadedDate)
                .ToListAsync();
            
            return Ok(projects);
        }
        



        [HttpGet("{id}")]
        public async Task<IActionResult>  GetById(Guid id)
        {
            var project = await context.Files.FindAsync(id);
            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody]File file)
        {
            file.ID = Guid.NewGuid();
            file.UploadedDate = DateTime.Now;

            context.Add(file);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var file = await context.Files.FindAsync(id);
            context.Remove(file);
            var result = await context.SaveChangesAsync();

            return Ok(result);

        }



    }

}