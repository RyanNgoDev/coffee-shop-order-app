using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace Section15.Models
{
    public partial class ReceiptDetail
    {
    [JsonIgnore]
        public int Id { get; set; }
    [JsonIgnore]
        public int? ReceiptId { get; set; }
        public int? ProductId { get; set; }
        public int? Price { get; set; }
        public int? Quantity { get; set; }

        public Product Product { get; set; }
    }
}
