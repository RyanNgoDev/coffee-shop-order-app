using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Section15.DbContexts;
using Section15.Models;
using Section15.Requests;
using Microsoft.AspNetCore.Routing;
using System.Collections.ObjectModel;

namespace Section15.Controllers
{
    [Authorize]
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ChiuDbContext context;

        public OrderController(ChiuDbContext context)
        {
      this.context = context;
        }

        // GET: api/Order
        [HttpPost]
        [Route("get-by-date")]
        public async Task<ActionResult<IEnumerable<Receipt>>> GetOrderByDate(GetOrdersRequest request)
        {
            return await context.Receipts.Where((rep) =>
                DateTime.Compare((DateTime)rep.Time, request.FromDate) >= 0
                && DateTime.Compare((DateTime)rep.Time, request.ToDate) <= 0).ToListAsync();
        }

        // GET: api/Order/5
        [HttpGet("{shiftId}")]
        public async Task<ActionResult<IEnumerable<Receipt>>> GetReceipt(int shiftId)
        {
            var tempReceipts = await context.Receipts.Where((rep) => rep.ShiftId == shiftId).ToListAsync();
            var receipts = tempReceipts.Select(r => {
              var receiptDetails = context.ReceiptDetails.Where(d => d.ReceiptId == r.Id).ToList();
              r.ReceiptDetails = new Collection<ReceiptDetail>(receiptDetails);
              return r;
            });

            foreach(var receipt in receipts)
            {
              var receipDetails = receipt.ReceiptDetails.Select(d =>
              {
                d.Product = context.Products.FirstOrDefault(p => p.Id == d.ProductId);
                return d;
              }).ToList();

              receipt.ReceiptDetails = new Collection<ReceiptDetail>(receipDetails);
            }

            return receipts.ToList();
        }

    // GET: api/Order/5
    [HttpGet]
    [Route("lastest/{shiftId}")]
    public async Task<ActionResult<Receipt>> GetLastestReceipt(int shiftId)
    {
      return await context.Receipts.Where((rep) => rep.ShiftId == shiftId).OrderBy(rep => rep.Id).LastOrDefaultAsync();
    }

    // POST: api/Order
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    [Route("add-order")]
    public async Task<ActionResult<Receipt>> AddOrder(Receipt receipt)
    {
      var tempDetails = JsonConvert.DeserializeObject<ICollection<ReceiptDetail>>(JsonConvert.SerializeObject(receipt.ReceiptDetails));
      receipt.ReceiptDetails = null;

      context.Receipts.Add(receipt);
        await context.SaveChangesAsync();
      var details = from d in tempDetails
                    select new ReceiptDetail
                    {
                      Price = d.Price,
                      ProductId = d.Product.Id,
                      Quantity = d.Quantity,
                      ReceiptId = receipt.Id
                    };

      context.ReceiptDetails.AddRange(details);
      await context.SaveChangesAsync();

      return Ok(receipt);
      }

      [HttpGet]
      [Route("get-current-time")]
      public ActionResult<DateTime> GetCurrentTime()
      {
          return DateTime.Now;
      }
  }
}
