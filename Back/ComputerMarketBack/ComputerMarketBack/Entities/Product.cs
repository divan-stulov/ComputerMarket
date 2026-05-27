using System;
using System.Collections.Generic;

namespace ComputerMarketBack.Entities;

public partial class Product
{
    public int Id { get; set; }

    public string InventoryNumber { get; set; } = null!;

    public int TypeId { get; set; }

    public int ManufacturerId { get; set; }

    public int SellerId { get; set; }

    public string Name { get; set; } = null!;

    public int WarrantyMonths { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public virtual Manufacturer Manufacturer { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Seller Seller { get; set; } = null!;

    public virtual ProductType Type { get; set; } = null!;
}
