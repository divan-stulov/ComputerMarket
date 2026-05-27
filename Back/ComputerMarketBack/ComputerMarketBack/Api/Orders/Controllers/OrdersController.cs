using ComputerMarketBack.Api.Orders.Contracts;
using ComputerMarketBack.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ComputerMarketBack.Api.Orders.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(ComputerMarketDbContext db) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "buyer")]
        public IActionResult Create(List<CreateOrderItemContract> contract)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var buyer = db.Buyers.FirstOrDefault(b => b.UserId == userId);
            if (buyer == null)
            {
                return NotFound("Покупатель не найден");
            }

            if (contract == null || contract.Count == 0)
            {
                return BadRequest("Корзина пуста");
            }

            foreach (var item in contract)
            {
                var product = db.Products.FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null)
                {
                    return NotFound($"Товар с id {item.ProductId} не найден");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest($"Недостаточно товара '{product.Name}' на складе");
                }

                var order = new Order
                {
                    BuyerId = buyer.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    TotalPrice = product.Price * item.Quantity,
                    Status = "pending",
                    OrderedAt = DateTime.Now
                };

                product.StockQuantity -= item.Quantity;

                db.Orders.Add(order);
            }

            db.SaveChanges();

            return Ok("Заказ оформлен");
        }

        [HttpGet("my")]
        [Authorize(Roles = "buyer")]
        public IActionResult GetMy()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var buyer = db.Buyers.FirstOrDefault(b => b.UserId == userId);
            if (buyer == null)
            {
                return NotFound("Покупатель не найден");
            }

            var orders = db.Orders
                .Include(o => o.Product)
                .Where(o => o.BuyerId == buyer.Id)
                .Select(o => new OrderResponseContract
                {
                    Id = o.Id,
                    ProductName = o.Product.Name,
                    ProductImageUrl = o.Product.ImageUrl,
                    Quantity = o.Quantity,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status,
                    OrderedAt = o.OrderedAt
                }).ToList();

            return Ok(orders);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "buyer")]
        public IActionResult Cancel(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var buyer = db.Buyers.FirstOrDefault(b => b.UserId == userId);
            if (buyer == null)
            {
                return NotFound("Покупатель не найден");
            }

            var order = db.Orders.FirstOrDefault(o => o.Id == id && o.BuyerId == buyer.Id);
            if (order == null)
            {
                return NotFound("Заказ не найден или не принадлежит вам");
            }

            if (order.Status != "pending")
            {
                return BadRequest("Можно отменить только заказ в статусе pending");
            }

            var product = db.Products.FirstOrDefault(p => p.Id == order.ProductId);
            if (product != null)
            {
                product.StockQuantity += order.Quantity;
            }

            db.Orders.Remove(order);
            db.SaveChanges();

            return Ok("Заказ отменён");
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "buyer")]
        public IActionResult UpdateStatus(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var buyer = db.Buyers.FirstOrDefault(b => b.UserId == userId);
            if (buyer == null)
            {
                return NotFound("Покупатель не найден");
            }

            var order = db.Orders.FirstOrDefault(o => o.Id == id && o.BuyerId == buyer.Id);
            if (order == null)
            {
                return NotFound("Заказ не найден или не принадлежит вам");
            }

            if (order.Status == "completed" || order.Status == "cancelled")
            {
                return BadRequest("Заказ уже завершён или отменён");
            }

            order.Status = order.Status switch
            {
                "pending" => "confirmed",
                "confirmed" => "shipped",
                "shipped" => "completed",
                _ => order.Status
            };

            db.SaveChanges();

            return Ok(new { order.Status });
        }
    }
}
