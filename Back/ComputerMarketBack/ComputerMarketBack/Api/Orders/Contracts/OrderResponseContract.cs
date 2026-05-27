namespace ComputerMarketBack.Api.Orders.Contracts
{
    public class OrderResponseContract
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public DateTime OrderedAt { get; set; }
    }
}
