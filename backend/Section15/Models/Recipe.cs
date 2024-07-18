using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class Recipe
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public int? IngredientId { get; set; }
        public int? Amount { get; set; }
        public string Note { get; set; }
    }
}
