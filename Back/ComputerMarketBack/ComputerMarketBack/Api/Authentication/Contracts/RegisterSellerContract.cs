namespace ComputerMarketBack.Api.Authentication.Contracts
{
    public class RegisterSellerContract
    {
        public required string Email { get; set; }
        public required string Password { get; set; }

        // "individual" или "organization"
        public required string Type { get; set; }

        // Заполняется если Type = "individual"
        public string? FullName { get; set; }

        // Заполняется если Type = "organization"
        public string? CompanyName { get; set; }

        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}
