using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MySqlConnector;
using Section15.DbContexts;
using Section15.Models;

namespace Section15.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly ChiuDbContext context;

    public ShiftController(ChiuDbContext context)
        {
            this.context = context;
        }

        // GET: api/Shift
        [HttpGet]
        public async Task<ActionResult<Shift>> GetLastestShift()
        {
            var shift = await context.Shifts.OrderBy((rep) => rep.Id).LastOrDefaultAsync();
            if (shift != null && shift.Status == "running")
            {
                shift.IsActive = IsShiftActive(shift);
            }

            return shift;
        }

        private bool IsShiftActive(Shift shift)
        {
          var currentTime = DateTime.Now;
          currentTime = currentTime.AddHours(-12);
          return currentTime < shift.StartTime;
        }

        // PUT: api/Shift/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShift(int id, Shift shift)
        {
            if (id != shift.Id)
            {
                return BadRequest();
            }

            context.Entry(shift).State = EntityState.Modified;

            try
            {
                shift.EndTime = DateTime.Now;
                await context.SaveChangesAsync();
                ExportData();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Shift
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Shift>> PostShift(Shift shift)
        {
            shift.StartTime = DateTime.Now;
            context.Shifts.Add(shift);
            ExportData();
            await context.SaveChangesAsync();

            return shift;
        }

        private bool ShiftExists(int id)
        {
            return context.Shifts.Any(e => e.Id == id);
        }

        public void ExportData()
        {
            var connectionString = "server=localhost;port=3306;database=chiudb;user=dbadmin;password=Dangdeptrai97";
            var date = DateTime.Now;
            string file = $"D:\\data\\{date.Year}{date.Month}{date.Day}.sql";
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
              using (MySqlCommand cmd = new MySqlCommand())
              {
                using (MySqlBackup mb = new MySqlBackup(cmd))
                {
                  cmd.Connection = conn;
                  conn.Open();
                  mb.ExportToFile(file);
                  conn.Close();
                }
              }
            }
        }
    }
}
