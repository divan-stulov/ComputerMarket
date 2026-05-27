using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ComputerMarketBack.Api.Products.Controllers
{
    [Route("api/product-types")]
    [ApiController]
    public class ProductTypesController(ComputerMarketDbContext db) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var types = db.ProductTypes
                .Select(t => new { t.Id, t.Name })
                .ToList();

            return Ok(types);
        }
    }
}
