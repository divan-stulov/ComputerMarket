using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ComputerMarketBack.Api.Products.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManufacturersController(ComputerMarketDbContext db) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var manufacturers = db.Manufacturers
                .Select(m => new { m.Id, m.Name, m.Country })
                .ToList();

            return Ok(manufacturers);
        }
    }
}
