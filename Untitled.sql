SELECT product.Id, Name, SUM(Quantity) AS totalQuantity FROM chiudb.receiptdetail INNER JOIN chiudb.product
ON chiudb.receiptdetail.productId = chiudb.product.id
GROUP BY Name 