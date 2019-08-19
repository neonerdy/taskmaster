using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TaskMaster.Models;

namespace TaskMaster.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AttachmentController : Controller
    {
       private AppDbContext context;

        public AttachmentController() 
        {
            context = new AppDbContext();
        }
    


        [HttpPost,DisableRequestSizeLimit]  
        public async Task<IActionResult> UploadFile(IFormFile file)  
        {  
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(),"Resources");

            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fullPath = Path.Combine(pathToSave, fileName);
        
            using (var stream = new FileStream(fullPath, FileMode.Create))  
            {  
                await file.CopyToAsync(stream);  
            }  

        
            return Ok(new { fullPath });;  
        }  


        [HttpGet("{id}")]
        public async Task<IActionResult> GetByTaskId(Guid id)
        {
            var attachments = await context.Attachments
                .Where(a=>a.TaskId == id).ToListAsync();

            return Ok(attachments);
        }


        [HttpPost]
        public async Task<IActionResult> Save([FromBody] Attachment attachment)
        {
            attachment.ID = Guid.NewGuid();
            attachment.UploadedDate = DateTime.Now;
            context.Add(attachment);    

            var result = await context.SaveChangesAsync();
            return Ok(result);          
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var attachment = await context.Attachments.FindAsync(id);
            context.Remove(attachment);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }

    }

}