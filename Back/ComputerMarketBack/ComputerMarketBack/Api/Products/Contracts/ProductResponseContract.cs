namespace ComputerMarketBack.Api.Products.Contracts
{
    public class ProductResponseContract
    {
        public int Id { get; init; }
        public required string InventoryNumber { get; init; }
        public required string Name { get; init; }
        public required string Description { get; init; }
        public required string ImageUrl { get; init; }
        public decimal Price { get; init; }
        public int WarrantyMonths { get; init; }
        public int StockQuantity { get; init; }
        public int TypeId { get; init; }
        public int ManufacturerId { get; init; }
        public required string ProductType { get; init; }
        public required string Manufacturer { get; init; }
        public required string SellerName { get; init; }
    }
}
