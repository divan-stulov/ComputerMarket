namespace ComputerMarketBack.Api.Authentication.Contracts
{
    public class LoginContract
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
