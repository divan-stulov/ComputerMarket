namespace ComputerMarketBack.Api.Orders.Contracts
{
    public class CreateOrderItemContract
    {
        public required int ProductId { get; set; }
        public required int Quantity { get; set; }
    }
}
