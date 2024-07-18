using System;
namespace Section15.Requests
{
    public class GetOrdersRequest
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
