using System;
using System.Collections.Generic;

#nullable disable

namespace Section15.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsManager { get; set; }
    }
}
