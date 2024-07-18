using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Section15.DbContexts;
using Section15.Models;

namespace Section15.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class RecipeController : ControllerBase
  {
    private readonly ChiuDbContext context;

    public RecipeController(ChiuDbContext context)
    {
      this.context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetByProduct(int id)
    {
      var recipes = await context.Recipes.ToListAsync();
      recipes = recipes.Where((r) => r.ProductId == id).ToList();

      if (!recipes.Any())
      {
        return NotFound();
      }

      return recipes;
    }

    // PUT: api/Product/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRecipe(int id, Recipe recipe)
    {
      if (id != recipe.Id)
      {
        return BadRequest();
      }

      context.Entry(recipe).State = EntityState.Modified;

      try
      {
        await context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!RecipeExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Product
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Product>> PostRecipe(Recipe recipe)
    {
      context.Recipes.Add(recipe);
      await context.SaveChangesAsync();

      return CreatedAtAction("GetRecipe", new { id = recipe.Id }, recipe);
    }

    // DELETE: api/Product/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
      var recipe = await context.Recipes.FindAsync(id);
      if (recipe == null)
      {
        return NotFound();
      }

      context.Recipes.Remove(recipe);
      await context.SaveChangesAsync();

      return NoContent();
    }

    private bool RecipeExists(int id)
    {
      return context.Recipes.Any(e => e.Id == id);
    }
  }
}
