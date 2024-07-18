SELECT ingredient.name AS ingredientName, 

        SUM(recipe.amount * list.totalQuantity) AS ingredientQuantity

FROM ingredient 

INNER JOIN recipe ON ingredient.id = recipe.ingredientId
INNER JOIN (SELECT product.Id, Name, SUM(Quantity) AS totalQuantity FROM chiudb.receiptdetail INNER JOIN chiudb.product
ON chiudb.receiptdetail.productId = chiudb.product.id
GROUP BY Name) list ON list.id=recipe.productId
GROUP BY ingredientName