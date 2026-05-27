namespace ComputerMarketBack.Api.Products.Contracts
{
    public class ProductFilterContract
    {
        public int? TypeId { get; init; }
        public int? ManufacturerId { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }
        public string? SortBy { get; init; }    // "price", "warranty", "name"
        public string? SortOrder { get; init; } // "asc", "desc"
    }
}
