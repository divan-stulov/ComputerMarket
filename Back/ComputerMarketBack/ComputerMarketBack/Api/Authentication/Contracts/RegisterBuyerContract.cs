namespace ComputerMarketBack.Api.Authentication.Contracts
{
    public class RegisterBuyerContract
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public string? Phone { get; set; }
    }
}
