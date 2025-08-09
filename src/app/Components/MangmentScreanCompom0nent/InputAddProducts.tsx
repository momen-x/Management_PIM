"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { domineName } from "@/app/utils/tokenName";
import { useRouter } from "next/navigation";
// import { listOfProducts } from "@/app/utils/listofProducts";

interface ProductFormProps {
  userId: string | number;
}

const InputAddProducts = ({ userId }: ProductFormProps) => {
  const router = useRouter();
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    ads: 0,
    discount: 0,
    tax: 0,
    total: 0,
    categorie: "",
  });

  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showDellteAllbtn, setShowDellteAllbtn] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${domineName}/api/products`);
        setShowDellteAllbtn(response.data.meta.count);
      } catch (error) {
        // console.log(error);
        return;
      }
    };
    fetch();
  }, []);

  const changeState = (e: any, name: string) => {
    const value =
      name === "title" || name === "categorie"
        ? e.target.value
        : Number(e.target.value) || 0;
    setProductData({ ...productData, [name]: value });
  };

  // Calculate total automatically
  useEffect(() => {
    if (
      productData.price > 0 &&
      productData.ads >= 0 &&
      productData.tax >= 0 &&
      productData.discount >= 0
    ) {
      const total =
        productData.price +
        productData.ads +
        productData.tax -
        productData.discount;
      setProductData((prev) => ({ ...prev, total: Math.max(0, total) }));
    } else {
      setProductData((prev) => ({ ...prev, total: 0 }));
    }
  }, [
    productData.price,
    productData.ads,
    productData.tax,
    productData.discount,
  ]);

  const validateForm = () => {
    if (!productData.title.trim()) {
      setError("Product title is required");
      return false;
    }
    if (productData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    if (productData.discount < 0) {
      setError("Discount cannot be negative");
      return false;
    }
    if (productData.ads < 0) {
      setError("Ads cost cannot be negative");
      return false;
    }
    if (productData.tax < 0) {
      setError("Tax cannot be negative");
      return false;
    }
    if (count <= 0) {
      setError("Quantity must be greater than 0");
      return false;
    }
    const ads = productData.ads ?? 0;
    const dis = productData.discount ?? 0;
    const price = productData.price;
    const tax = productData.tax ?? 0;
    const total = price + ads + tax - dis;

    if (total <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const createSingleProduct = async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      const body = {
        title: productData.title,
        price: productData.price,
        ads: productData.ads ?? 0,
        discount: productData.discount ?? 0,
        tax: productData.tax ?? 0,
        categorie: productData.categorie,
        userId: userId,
      };

      const response = await axios.post(`${domineName}/api/products`, body);
      // console.log("????>>>>>>>>>>>>>> : ", await response.data);

      return true;
    } catch (error: any) {
      // if (error.response?.data?.message) {
      // setError(error.response.data.message);
      // } else if (error.response?.data?.errors) {
      // Handle validation errors from API
      const errorMessages = error.response.data.errors
        .map((err: any) => `${err.field}: ${err.message}`)
        .join(", ");
      setError(errorMessages);
      // } else {
      setError("Failed to add product. Please try again later.");
      // }
      return false;
    }
  };

  const handleAddProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let successCount = 0;

      // Add products based on count
      for (let i = 0; i < count; i++) {
        const success = await createSingleProduct();
        if (success) {
          successCount++;
        } else {
          break; // Stop if one fails
        }
      }

      if (successCount > 0) {
        setSuccess(`Successfully added ${successCount} product(s)!`);
        router.refresh();
        // Reset form
        setProductData({
          title: "",
          price: 0,
          ads: 0,
          discount: 0,
          tax: 0,
          total: 0,
          categorie: "",
        });
        // router.refresh();
        location.reload();
        setCount(1);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    try {
      if (confirm("are u sure u want delete all products ? ")) {
        await axios.delete(`${domineName}/api/products`);
        // console.log("deleted");
        setShowDellteAllbtn(0);
        location.reload();
      }
    } catch (error) {
      setError("error try agin");
      return;
      // console.log("error : ", error);
    }
  };

  return (
    <div className="mt-5 max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Product Management
      </h1>

      <Box component="form" onSubmit={handleAddProducts}>
        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {/* Product Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              required
              id="title"
              name="title"
              label="Product Title"
              variant="outlined"
              value={productData.title}
              onChange={(e) => changeState(e, "title")}
              disabled={loading}
            />
            <TextField
              fullWidth
              id="categorie"
              value={productData.categorie}
              name="categorie"
              label="Category"
              type="text"
              variant="outlined"
              onChange={(e) => changeState(e, "categorie")}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <TextField
              fullWidth
              required
              value={productData.price}
              type="number"
              id="price"
              name="price"
              label="Price"
              variant="outlined"
              onChange={(e) => changeState(e, "price")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              type="number"
              value={productData.ads}
              id="ads"
              name="ads"
              label="Ads Cost"
              variant="outlined"
              onChange={(e) => changeState(e, "ads")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              value={productData.tax}
              type="number"
              id="tax"
              name="tax"
              label="Tax"
              variant="outlined"
              onChange={(e) => changeState(e, "tax")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              disabled={loading}
            />
            <TextField
              fullWidth
              value={productData.discount}
              type="number"
              id="discount"
              name="discount"
              label="Discount"
              variant="outlined"
              onChange={(e) => changeState(e, "discount")}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              required
              type="number"
              value={count}
              id="count"
              name="count"
              label="Quantity"
              variant="outlined"
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              InputProps={{ inputProps: { min: 1 } }}
              disabled={loading}
            />
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
              <span className="font-medium text-gray-700">Total per item:</span>
              <span
                className={`text-xl font-bold ${
                  productData.total > 0 ? "text-green-600" : "text-gray-400"
                }`}
              >
                {productData.total > 0
                  ? `$${productData.total.toFixed(2)}`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              className="w-full md:w-auto"
              disabled={
                loading || !productData.title.trim() || productData.price <= 0
              }
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Adding {count > 1 ? `${count} Products...` : "Product..."}
                </>
              ) : (
                `Create ${count > 1 ? `${count} Products` : "Product"}`
              )}
            </Button>
          </div>
        </div>
      </Box>

      {/* Delete All Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {showDellteAllbtn > 0 && (
          <Button
            onClick={handleDeleteAllProducts}
            variant="contained"
            color="error"
            className="w-full md:w-auto"
          >
            Delete All Products
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputAddProducts;
