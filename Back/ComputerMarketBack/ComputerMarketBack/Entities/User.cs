using System;
using System.Collections.Generic;

namespace ComputerMarketBack.Entities;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Buyer? Buyer { get; set; }

    public virtual Seller? Seller { get; set; }
}
