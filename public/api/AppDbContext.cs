
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

using TaskMaster.Models;

namespace TaskMaster
{
    public class AppDbContext : DbContext
    {

        public DbSet<People> People { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<WorkLog> WorkLogs { get; set; }


        public static string ConnectionString { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionBuilder)
        {
            optionBuilder.UseNpgsql(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<People>(entity => 
            {
                entity.ToTable("people");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.UserName).HasColumnName("user_name");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.FullName).HasColumnName("full_name");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.Address).HasColumnName("address");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Photo).HasColumnName("photo");
                entity.Property(e => e.ActiveProjectId).HasColumnName("active_project_id");
                entity.Property(e => e.IsHideClosedTask).HasColumnName("Is_hide_closed_task");
             });

            modelBuilder.Entity<Project>(entity => 
            {
                entity.ToTable("projects");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.ProjectName).HasColumnName("project_name");
                entity.Property(e => e.Initial).HasColumnName("initial");
                entity.Property(e => e.ProjectManagerId).HasColumnName("project_manager_id");
                entity.Property(e => e.CreatedDate).HasColumnName("created_date");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Status).HasColumnName("status");
             });


            modelBuilder.Entity<File>(entity => 
            {
                entity.ToTable("files");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.ProjectId).HasColumnName("project_id");
                entity.Property(e => e.FileName).HasColumnName("file_name");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Size).HasColumnName("size");
                entity.Property(e => e.UploaderId).HasColumnName("uploader_id");
                entity.Property(e => e.UploadedDate).HasColumnName("uploaded_date");
            });
           
             
            modelBuilder.Entity<Task>(entity => 
            {
                entity.ToTable("tasks");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.ProjectId).HasColumnName("project_id");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Tracker).HasColumnName("tracker");
                entity.Property(e => e.Title).HasColumnName("title");
                entity.Property(e => e.Priority).HasColumnName("priority");
                entity.Property(e => e.ReporterId).HasColumnName("reporter_id");
                entity.Property(e => e.AssigneeId).HasColumnName("assignee_id");
                entity.Property(e => e.TesterId).HasColumnName("tester_id");
                entity.Property(e => e.Platform).HasColumnName("platform");
                entity.Property(e => e.Module).HasColumnName("module");
                entity.Property(e => e.Version).HasColumnName("version");
                entity.Property(e => e.CreatedDate).HasColumnName("created_date");
                entity.Property(e => e.ModifiedDate).HasColumnName("modified_date");
                entity.Property(e => e.ClosedDate).HasColumnName("closed_date");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Estimation).HasColumnName("estimation");
                entity.Property(e => e.EstimationUnit).HasColumnName("estimation_unit");
                entity.Property(e => e.EstimationInHour).HasColumnName("estimation_in_hour");
                entity.Property(e => e.TotalTimeSpentInHour).HasColumnName("total_time_spent_in_hour");
            });
            

            modelBuilder.Entity<Attachment>(entity => 
            {
                entity.ToTable("attachments");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.TaskId).HasColumnName("task_id");
                entity.Property(e => e.FileName).HasColumnName("file_name");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Size).HasColumnName("size");
                entity.Property(e => e.UploadedDate).HasColumnName("uploaded_date");
            });

            modelBuilder.Entity<Comment>(entity => 
            {
                entity.ToTable("comments");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.TaskId).HasColumnName("task_id");
                entity.Property(e => e.CreatedDate).HasColumnName("created_date");
                entity.Property(e => e.CommenterId).HasColumnName("commenter_id");
                entity.Property(e => e.Message).HasColumnName("message");
            });

            modelBuilder.Entity<History>(entity => 
            {
                entity.ToTable("histories");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.TaskId).HasColumnName("task_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Date).HasColumnName("date");
                entity.Property(e => e.ActivityLog).HasColumnName("activity_log");
            });


            modelBuilder.Entity<WorkLog>(entity => 
            {
                entity.ToTable("worklogs");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.TaskId).HasColumnName("task_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.LoggedDate).HasColumnName("logged_date");
                entity.Property(e => e.TimeSpent).HasColumnName("time_spent");
                entity.Property(e => e.Unit).HasColumnName("unit");
                entity.Property(e => e.TimeSpentInHour).HasColumnName("time_spent_in_hour");
            });


            


      
        }

    }
}