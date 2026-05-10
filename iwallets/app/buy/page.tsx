import { getProducts } from "@/lib/getProduct";
import BuyClient from "./BuyClient";

export default async function Page() {
  const products = await getProducts();

  return <BuyClient products={products} />;
}