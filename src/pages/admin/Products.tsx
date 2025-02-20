//@ts-nocheck
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { ChevronDown, ChevronUp, Trash, Pencil } from "lucide-react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    stripeProductId: "",
    name: "",
    description: "",
    // features başlangıçta string, submit öncesinde array'e çevrilecek
    features: "",
    isFeatured: false,
    productType: "PRODUCT",
    price: {
      name: "",
      isDefault: false,
      stripePriceId: "",
      type: "one_time",
      recurring: {
        interval: "day",
        interval_count: 1,
      },
      // unit_amount'ı string olarak alıyoruz; submit öncesinde integer'a parse edeceğiz
      unit_amount: "",
      currency: "usd",
      lookup_key: "",
      description: "",
    },
  });

  const fetchProducts = async () => {
    const response = await instance.get("admin/products/all");
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // FormData'daki unit_amount'ı integer ve features'ı array'e dönüştürüyoruz
      const submissionData = {
        ...formData,
        price: {
          ...formData.price,
          unit_amount: parseInt(formData.price.unit_amount, 10),
        },
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
      };

      await axios.post(
        "http://localhost:5001/api/product/create-priced-product",
        submissionData
      );
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      alert("Error: " + error.message);
      setIsModalOpen(false);
      console.error(error);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Products</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add Product</h2>
            <input
              name="stripeProductId"
              placeholder="Stripe Product ID"
              value={formData.stripeProductId}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <select
              name="productType"
              value={formData.price.productType}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            >
              <option value="PRODUCT">Product</option>
              <option value="SERVICE">Service</option>
            </select>
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="features"
              placeholder="Features (comma-separated)"
              value={formData.features}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              Featured Product
            </label>

            <h3 className="text-md font-semibold mb-2">Price Details</h3>
            <input
              name="name"
              placeholder="Price Name"
              value={formData.price.name}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="unit_amount"
              placeholder="Price (in cents)"
              type="number"
              value={formData.price.unit_amount}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            />
            <input
              name="stripePriceId"
              placeholder="Stripe Price ID"
              value={formData.price.stripePriceId}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            />
            <select
              name="currency"
              value={formData.price.currency}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </select>
            <select
              name="type"
              value={formData.price.type}
              onChange={handlePriceChange}
              className="border p-2 w-full mb-2"
            >
              <option value="one_time">One Time</option>
              <option value="recurring">Recurring</option>
            </select>
            {formData.price.type === "recurring" && (
              <>
                <select
                  name="interval"
                  value={formData.price.recurring.interval}
                  onChange={handlePriceChange}
                  className="border p-2 w-full mb-2"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
                <input
                  name="interval_count"
                  placeholder="Interval Count"
                  type="number"
                  value={formData.price.recurring.interval_count}
                  onChange={handlePriceChange}
                  className="border p-2 w-full mb-2"
                />
              </>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

const ProductCard = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const deleteProduct = async () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      await instance.delete(`admin/products/${product.id}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-2">{product.description}</p>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium">Prices</h3>
          <div className="mt-2">
            {product.prices.length > 0 ? (
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {product.prices.map((price) => (
                    <tr key={price.id} className="border-b">
                      <td className="py-2">{price.type}</td>
                      <td className="py-2">
                        ${(price.unit_amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pricing details available.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded flex items-center">
          <Pencil size={16} className="mr-1" /> Edit
        </button>
        <button
          onClick={deleteProduct}
          className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center"
        >
          <Trash size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};
