import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { Product } from "../types/Product";
import { getServices } from "../http/requests/companyRequests";

export interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
}

export const useDynamicProducts = () => {
  const [products, setProducts] = useState<DynamicProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const companySubscriptions = useAppSelector(
    (state) => state.company.selectedCompany?.subscriptions
  );

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        console.log("Company Subscriptions:", companySubscriptions);

        const fetchedProducts: DynamicProduct[] = await getServices();

        console.log("Fetched Products:", fetchedProducts);
        const updatedProducts = fetchedProducts.map((product) => {
          // Bu ürün için abonelik var mı diye kontrol et
          const matchingSubs = companySubscriptions.filter(
            (sub) => sub.product.id === product.id
          );

          // Eğer abonelik varsa ürüne isActiveProduct ekle
          if (matchingSubs.length > 0) {
            product.isActiveProduct = true;

            // Ürünün fiyatları arasında abonelikteki price id'si ile eşleşeni işaretle
            product.prices = product.prices.map((price) => {
              const priceMatch = matchingSubs.find(
                (sub) => sub.productPrice.id === price.id
              );
              if (priceMatch) {
                price.isActivePlan = true;
              }
              return price;
            });
          }

          return product;
        });

        setProducts(updatedProducts);
        console.log("Products all:", updatedProducts);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [companySubscriptions]);

  return { products, loading, setLoading };
};
