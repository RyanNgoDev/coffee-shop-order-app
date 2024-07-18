using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? Price { get; set; }
        public int? CategoryId { get; set; }
    }
}
