using System;
using System.Collections.Generic;

namespace ComputerMarketBack.Entities;

public partial class Seller
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Type { get; set; } = null!;

    public string? FullName { get; set; }

    public string? CompanyName { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual User User { get; set; } = null!;
}
