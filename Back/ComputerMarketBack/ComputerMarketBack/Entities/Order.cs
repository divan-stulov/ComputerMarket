using System;
using System.Collections.Generic;

namespace ComputerMarketBack.Entities;

public partial class Order
{
    public int Id { get; set; }

    public int BuyerId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = null!;

    public DateTime OrderedAt { get; set; }

    public virtual Buyer Buyer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
