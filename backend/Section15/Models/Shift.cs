using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Shift
    {
        public int Id { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; }
        public int? Summary { get; set; }
        public bool IsActive { get; set; }
    }
}
