using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Section15.DbContexts;
using Section15.Models;

namespace Section15.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly ChiuDbContext context;

        public CouponController(ChiuDbContext context)
        {
            this.context = context;
        }

        // GET: api/Coupon
        public async Task<ActionResult<IEnumerable<Coupon>>> GetProducts()
        {
          return await context.Coupons.ToListAsync();
        }

        // POST: api/Coupon
        [HttpPost]
        public async Task<ActionResult<Coupon>> Post(Coupon coupon)
        {
            context.Coupons.Add(coupon);
            await context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = coupon.Id }, coupon);
        }
    }
}
