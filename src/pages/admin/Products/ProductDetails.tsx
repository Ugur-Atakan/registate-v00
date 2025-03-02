import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import instance from "../../../http/instance";
import toast from "react-hot-toast";

export default function ProductDetails() {
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const productId = location.state.productId;

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
         const response = await instance.get(`/admin/product/${productId}/details`);
           setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product details", error);
         toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }



    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-medium">Product Information</h2>
                        <p className="text-sm text-gray-500">
                            Basic product information
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {product.name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Description
                        </label>
                        <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {product.description}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Price
                        </label>
                        <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            {product.price}
                        </p>
                    </div>
                   </div>
            </div>
        </div>
    );
}

