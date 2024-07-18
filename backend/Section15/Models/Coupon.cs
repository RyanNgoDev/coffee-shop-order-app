using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Coupon
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int? DiscountPercent { get; set; }
    }
}
