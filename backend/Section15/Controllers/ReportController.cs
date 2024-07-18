using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Section15.DbContexts;
using Section15.Models;
using Section15.Requests;

namespace Section15.Controllers
{
  public class ReportController : ControllerBase
  {
    private readonly ChiuDbContext context;

    public ReportController(ChiuDbContext context)
    {
      this.context = context;
    }

    public List<QuantityReport> GetProductQuantities(GetReportRequest request)
    {
      var receiptsByDate = context.Receipts.Where((rep) =>
                DateTime.Compare((DateTime)rep.Time, request.FromDate) >= 0
                && DateTime.Compare((DateTime)rep.Time, request.ToDate) <= 0).ToList();
      var receiptDetails = context.ReceiptDetails.Where(detail => receiptsByDate.Any(r => r.Id == detail.ReceiptId)).ToList();
      var productQuantities = receiptDetails?.GroupBy(detail => detail.ProductId)
        .Select(product => new QuantityReport
        {
          Id = product.Key,
          Name = GetProductNameById(product.Key),
          Quantity = product.Where((p) => p.ProductId == product.Key).Sum((p) => p.Quantity)
        })
        .ToList();

      return productQuantities;
    }

    private string GetProductNameById(int? id)
    {
      var product = context.Products.Find(id);
      return product?.Name;
    }

    public List<QuantityReport> GetIngredientQuantity(GetReportRequest request)
    {
      var productQuantities = this.GetProductQuantities(request);
      var ingredients = new List<QuantityReport>();
      productQuantities?.ForEach(product =>
      {
        var tempIngredient = context.Recipes.Where(recipe => recipe.ProductId == product.Id).ToList();
        var tempQuantity = tempIngredient?.Select(ingredient => new QuantityReport
        {
          Id = ingredient.IngredientId,
          Quantity = product.Quantity * ingredient.Amount
        });
        ingredients.AddRange(tempQuantity);
      });

      return ingredients.GroupBy(ingredient => ingredient.Id).Select(ingredient => new QuantityReport
      {
        Id = ingredient.Key,
        Name = GetIngredientNameById(ingredient.Key),
        Quantity = ingredient.Where(i => i.Id == ingredient.Key).Sum(i => i.Quantity)
      }).ToList();
    }

    private string GetIngredientNameById(int? id)
    {
      var ingredient = context.Ingredients.Find(id);
      return ingredient?.Name;
    }

    public List<Shift> GetShiftsByDate(GetReportRequest request)
    {
      return context.Shifts.Where((rep) =>
                DateTime.Compare((DateTime)rep.StartTime, request.FromDate) >= 0
                && DateTime.Compare((DateTime)rep.StartTime, request.ToDate) <= 0).ToList();
    }
  }
}
