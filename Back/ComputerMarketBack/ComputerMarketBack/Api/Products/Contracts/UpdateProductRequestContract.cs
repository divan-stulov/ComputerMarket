namespace ComputerMarketBack.Api.Products.Contracts
{
    public class UpdateProductRequestContract
    {
        public string? InventoryNumber { get; init; }
        public string? Name { get; init; }
        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
        public int? TypeId { get; init; }
        public int? ManufacturerId { get; init; }
        public int? WarrantyMonths { get; init; }
        public decimal? Price { get; init; }
        public int? StockQuantity { get; init; }
    }
}
