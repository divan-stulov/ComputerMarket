using ComputerMarketBack.Api.Authentication.Contracts;
using ComputerMarketBack.Entities;
using ComputerMarketBack.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ComputerMarketBack.Api.Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController(ComputerMarketDbContext db, IOptions<JwtOptions> jwtOptions) : ControllerBase
    {
        [HttpPost("register/buyer")]
        public IActionResult RegisterBuyer(RegisterBuyerContract contract)
        {
            bool emailTaken = db.Users.Any(u => u.Email == contract.Email);
            if (emailTaken)
            {
                return Conflict("Пользователь с таким email уже существует");
            }

            var user = new User
            {
                Email = contract.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(contract.Password),
                Role = "buyer",
                CreatedAt = DateTime.Now
            };

            db.Users.Add(user);
            db.SaveChanges();

            var buyer = new Buyer
            {
                UserId = user.Id,
                FullName = contract.FullName,
                Phone = contract.Phone
            };

            db.Buyers.Add(buyer);
            db.SaveChanges();

            return Ok("Регистрация покупателя успешна");
        }

        [HttpPost("register/seller")]
        public IActionResult RegisterSeller(RegisterSellerContract contract)
        {
            bool emailTaken = db.Users.Any(u => u.Email == contract.Email);
            if (emailTaken)
            {
                return Conflict("Пользователь с таким email уже существует");
            }

            if (contract.Type != "individual" && contract.Type != "organization")
            {
                return BadRequest("Тип должен быть individual или organization");
            }

            if (contract.Type == "individual" && contract.FullName == null)
            {
                return BadRequest("Для физлица необходимо указать полное имя");
            }

            if (contract.Type == "organization" && contract.CompanyName == null)
            {
                return BadRequest("Для организации необходимо указать название компании");
            }

            var user = new User
            {
                Email = contract.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(contract.Password),
                Role = "seller",
                CreatedAt = DateTime.Now
            };

            db.Users.Add(user);
            db.SaveChanges();

            var seller = new Seller
            {
                UserId = user.Id,
                Type = contract.Type,
                FullName = contract.FullName,
                CompanyName = contract.CompanyName,
                Phone = contract.Phone,
                Address = contract.Address
            };

            db.Sellers.Add(seller);
            db.SaveChanges();

            return Ok("Регистрация продавца успешна");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginContract contract)
        {
            var user = db.Users.FirstOrDefault(u => u.Email == contract.Email);

            if (user == null)
            {
                return Unauthorized("Неверный email или пароль");
            }


            bool passwordCorrect = BCrypt.Net.BCrypt.Verify(contract.Password, user.PasswordHash);
            if (!passwordCorrect)
            {
                return Unauthorized("Неверный email или пароль");
            }


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Value.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtOptions.Value.Issuer,
                audience: jwtOptions.Value.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            string tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        [HttpGet("profile/buyer")]
        [Authorize(Roles = "buyer")]
        public IActionResult GetBuyerProfile()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var buyer = db.Buyers.FirstOrDefault(b => b.UserId == userId);
            if (buyer == null)
            {
                return NotFound("Покупатель не найден");
            }

            return Ok(new
            {
                buyer.FullName,
                buyer.Phone
            });
        }

        [HttpGet("profile/seller")]
        [Authorize(Roles = "seller")]
        public IActionResult GetSellerProfile()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var seller = db.Sellers.FirstOrDefault(s => s.UserId == userId);
            if (seller == null)
            {
                return NotFound("Продавец не найден");
            }

            return Ok(new
            {
                seller.Type,
                seller.FullName,
                seller.CompanyName,
                seller.Phone,
                seller.Address
            });
        }
    }
}
