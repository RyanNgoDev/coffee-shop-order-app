using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Receipt
    {
        public int Id { get; set; }
        public int? Total { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public int? UserId { get; set; }
        public int? Discount { get; set; }
        public int? Summary { get; set; }
        public int? PrintCount { get; set; }
        public bool? IsDiscountApplied { get; set; }
        public string Note { get; set; }
        public DateTime? Time { get; set; }
        public int? ShiftId { get; set; }
        public string Table { get; set; }
        public int? OrderId { get; set; }
        public DateTime? PrintTime { get; set; }
        public string Coupon { get; set; }

        public IEnumerable<ReceiptDetail> ReceiptDetails { get; set; }
    }
}
