using ComputerMarketBack.Api.Products.Contracts;
using ComputerMarketBack.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ComputerMarketBack.Api.Products.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(ComputerMarketDbContext db) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll([FromQuery] ProductFilterContract filter)
        {
            var query = db.Products
                .Include(p => p.Type)
                .Include(p => p.Manufacturer)
                .Include(p => p.Seller)
                .AsQueryable();

            if (filter.TypeId != null)
            {
                query = query.Where(p => p.TypeId == filter.TypeId);
            }

            if (filter.ManufacturerId != null)
            {
                query = query.Where(p => p.ManufacturerId == filter.ManufacturerId);
            }

            if (filter.MinPrice != null)
            {
                query = query.Where(p => p.Price >= filter.MinPrice);
            }

            if (filter.MaxPrice != null)
            {
                query = query.Where(p => p.Price <= filter.MaxPrice);
            }

            if (filter.SortBy == "price")
            {
                query = filter.SortOrder == "desc"
                    ? query.OrderByDescending(p => p.Price)
                    : query.OrderBy(p => p.Price);
            }

            if (filter.SortBy == "warranty")
            {
                query = filter.SortOrder == "desc"
                    ? query.OrderByDescending(p => p.WarrantyMonths)
                    : query.OrderBy(p => p.WarrantyMonths);
            }

            if (filter.SortBy == "name")
            {
                query = filter.SortOrder == "desc"
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name);
            }

            var products = query.Select(p => new ProductResponseContract
            {
                Id = p.Id,
                InventoryNumber = p.InventoryNumber,
                Name = p.Name,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                Price = p.Price,
                WarrantyMonths = p.WarrantyMonths,
                StockQuantity = p.StockQuantity,
                TypeId = p.TypeId,
                ManufacturerId = p.ManufacturerId,
                ProductType = p.Type.Name,
                Manufacturer = p.Manufacturer.Name,
                SellerName = p.Seller.CompanyName ?? p.Seller.FullName
            }).ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = db.Products
                .Include(p => p.Type)
                .Include(p => p.Manufacturer)
                .Include(p => p.Seller)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound("Товар не найден");
            }

            var response = new ProductResponseContract
            {
                Id = product.Id,
                InventoryNumber = product.InventoryNumber,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                WarrantyMonths = product.WarrantyMonths,
                StockQuantity = product.StockQuantity,
                ProductType = product.Type.Name,
                Manufacturer = product.Manufacturer.Name,
                SellerName = product.Seller.CompanyName ?? product.Seller.FullName
            };

            return Ok(response);
        }

        [HttpGet("my")]
        [Authorize(Roles = "seller")]
        public IActionResult GetMy()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var seller = db.Sellers.FirstOrDefault(s => s.UserId == userId);
            if (seller == null)
            {
                return NotFound("Продавец не найден");
            }

            var products = db.Products
                .Include(p => p.Type)
                .Include(p => p.Manufacturer)
                .Include(p => p.Seller)
                .Where(p => p.SellerId == seller.Id)
                .Select(p => new ProductResponseContract
                {
                    Id = p.Id,
                    InventoryNumber = p.InventoryNumber,
                    Name = p.Name,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    Price = p.Price,
                    WarrantyMonths = p.WarrantyMonths,
                    StockQuantity = p.StockQuantity,
                    TypeId = p.TypeId,
                    ManufacturerId = p.ManufacturerId,
                    ProductType = p.Type.Name,
                    Manufacturer = p.Manufacturer.Name,
                    SellerName = p.Seller.CompanyName ?? p.Seller.FullName
                }).ToList();

            return Ok(products);
        }

        [HttpPost]
        [Authorize(Roles = "seller")]
        public IActionResult Create(CreateProductRequestContract contract)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var seller = db.Sellers.FirstOrDefault(s => s.UserId == userId);
            if (seller == null)
            {
                return NotFound("Продавец не найден");
            }

            bool inventoryExists = db.Products.Any(p => p.InventoryNumber == contract.InventoryNumber);
            if (inventoryExists)
            {
                return Conflict("Товар с таким инвентарным номером уже существует");
            }

            var product = new Product
            {
                InventoryNumber = contract.InventoryNumber,
                Name = contract.Name,
                Description = contract.Description,
                ImageUrl = contract.ImageUrl,
                TypeId = contract.TypeId,
                ManufacturerId = contract.ManufacturerId,
                SellerId = seller.Id,
                WarrantyMonths = contract.WarrantyMonths,
                Price = contract.Price,
                StockQuantity = contract.StockQuantity,
                CreatedAt = DateTime.Now
            };

            db.Products.Add(product);
            db.SaveChanges();

            return Ok(product.Id);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "seller")]
        public IActionResult Update(int id, UpdateProductRequestContract contract)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var seller = db.Sellers.FirstOrDefault(s => s.UserId == userId);
            if (seller == null)
            {
                return NotFound("Продавец не найден");
            }

            var product = db.Products.FirstOrDefault(p => p.Id == id && p.SellerId == seller.Id);
            if (product == null)
            {
                return NotFound("Товар не найден или не принадлежит вам");
            }

            if (contract.InventoryNumber != null)
            {
                bool taken = db.Products.Any(p => p.InventoryNumber == contract.InventoryNumber && p.Id != id);
                if (taken)
                {
                    return Conflict("Товар с таким инвентарным номером уже существует");
                }

                product.InventoryNumber = contract.InventoryNumber;
            }

            if (contract.Name != null)
            {
                product.Name = contract.Name;
            }

            if (contract.Description != null)
            {
                product.Description = contract.Description;
            }

            if (contract.ImageUrl != null)
            {
                product.ImageUrl = contract.ImageUrl;
            }

            if (contract.TypeId != null)
            {
                product.TypeId = contract.TypeId.Value;
            }

            if (contract.ManufacturerId != null)
            {
                product.ManufacturerId = contract.ManufacturerId.Value;
            }

            if (contract.WarrantyMonths != null)
            {
                product.WarrantyMonths = contract.WarrantyMonths.Value;
            }

            if (contract.Price != null)
            {
                product.Price = contract.Price.Value;
            }

            if (contract.StockQuantity != null)
            {
                product.StockQuantity = contract.StockQuantity.Value;
            }

            db.SaveChanges();

            return Ok("Товар обновлён");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "seller")]
        public IActionResult Delete(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var seller = db.Sellers.FirstOrDefault(s => s.UserId == userId);
            if (seller == null)
            {
                return NotFound("Продавец не найден");
            }

            var product = db.Products.FirstOrDefault(p => p.Id == id && p.SellerId == seller.Id);
            if (product == null)
            {
                return NotFound("Товар не найден или не принадлежит вам");
            }

            db.Products.Remove(product);
            db.SaveChanges();

            return Ok("Товар удалён");
        }
    }
}
