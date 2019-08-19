
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TaskMaster.Models;

namespace TaskMaster.Controllers
{
    [Route("api/[controller]/[action]")]
    public class PeopleController : Controller
    {
        private AppDbContext context = null;
        public PeopleController() 
        {
            context = new AppDbContext();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id) 
        {
            var people = await context.People.FindAsync(id);
            return Ok(people);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var people = await context.People
                .Where(p=>p.Role != "Admin")
                .OrderBy(p=>p.FullName)
                .ToListAsync();
            
            return Ok(people);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] People people)
        {
            var user = await context.People
                .Where(p=>p.UserName == people.UserName && p.Password == people.Password)
                .SingleOrDefaultAsync();

            return Ok(user);
        }



        [HttpPost]
        public async Task<IActionResult> Save([FromBody] People people)
        {
            people.ID = Guid.NewGuid();
            context.Add(people);    

            var result = await context.SaveChangesAsync();
            return Ok(result);

        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]People people)
        {
            context.Update(people);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSetting([FromBody] UserSetting userSetting)
        {
            var user = await context.People.FindAsync(userSetting.UserId);
            user.ActiveProjectId = userSetting.ActiveProjectId;
            user.IsHideClosedTask = userSetting.IsHideClosedTask;
            
            context.Update(user);

            var result = await context.SaveChangesAsync();
            return Ok(result);
        }


        [HttpPut]
        public async Task<IActionResult> UpdatePhoto([FromBody] UserPhoto userPhoto)
        {
            var user = await context.People.FindAsync(userPhoto.UserId);
            user.Photo = userPhoto.Photo;
            context.Update(user);

            var result = await context.SaveChangesAsync();
            return Ok(result);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var people = await context.People.FindAsync(id);
            context.Remove(people);
            var result = await context.SaveChangesAsync();

            return Ok(result);

        }


        




        
    }

}