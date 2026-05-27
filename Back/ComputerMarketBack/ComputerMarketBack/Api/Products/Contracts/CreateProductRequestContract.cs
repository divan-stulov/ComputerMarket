namespace ComputerMarketBack.Api.Products.Contracts
{
    public class CreateProductRequestContract
    {
        public required string InventoryNumber { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
        public required int TypeId { get; init; }
        public required int ManufacturerId { get; init; }
        public required int WarrantyMonths { get; init; }
        public required decimal Price { get; init; }
        public required int StockQuantity { get; init; }
    }
}
