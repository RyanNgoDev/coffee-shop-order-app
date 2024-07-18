using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public string OtherInfo { get; set; }
    }
}
