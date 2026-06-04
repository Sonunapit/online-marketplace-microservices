export default function ProductTable({
  products,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-xl">

        <thead>
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="p-3">
                {product.title}
              </td>

              <td className="p-3">
                ₹ {product.priceAmount}
              </td>

              <td className="p-3">
                {product.stock || 0}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}