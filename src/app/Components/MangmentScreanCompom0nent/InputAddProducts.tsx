"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { listOfProducts } from "@/app/utils/listofProducts";
const InputAddProducts = () => {
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    ads: 0,
    discount: 0,
    tax: 0,
    total: 0,
    categorie: "",
  });

  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  const changeState = (e: any, name: string) => {
    const value =
      name === "title" || name === "category"
        ? e.target.value
        : Number(e.target.value) || 0;
    setProductData({ ...productData, [name]: value });
  };

  useEffect(() => {
    if (productData.price > 0) {
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

  const handleAddBroducts = () => {
    if (
      productData.title.trim() === "" ||
      productData.price === 0 ||
      count <= 0
    ) {
      console.log("error must field the required field");
    } else {
      for (let i = 0; i < count; i++) {
        const newProduct = {
          title: productData.title,
          price: productData.title,
          ads: productData.ads,
          tax: productData.tax,
          discount: productData.discount,
          total: productData.total,
          categorie: productData.categorie,
          CreatedAt: new Date(),
           
        };
      }
    }
  };

  return (
    <div className="mt-5  max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Product Management
      </h1>

      {/* Product Information Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Product Title"
            variant="outlined"
            value={productData.title}
            onChange={(e) => changeState(e, "title")}
          />
          <TextField
            fullWidth
            id="categorie"
            value={productData.categorie}
            name="categorie"
            label="Category"
            variant="outlined"
            onChange={(e) => changeState(e, "categorie")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <TextField
            fullWidth
            value={productData.price}
            type="number"
            id="price"
            name="price"
            label="Price"
            variant="outlined"
            onChange={(e) => changeState(e, "price")}
            InputProps={{ inputProps: { min: 0 } }}
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
            InputProps={{ inputProps: { min: 0 } }}
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
            InputProps={{ inputProps: { min: 0 } }}
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
            InputProps={{ inputProps: { min: 0 } }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField
            fullWidth
            type="number"
            value={count}
            id="count"
            name="count"
            label="Quantity"
            variant="outlined"
            onChange={(e) => setCount(+e.target.value)}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
            <span className="font-medium text-gray-700">Total:</span>
            <span
              className={`text-xl font-bold ${
                productData.total !== 0 ? "text-green-600" : "text-gray-400"
              }`}
            >
              {productData.total !== 0
                ? `$${productData.total.toFixed(2)}`
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="contained"
            color="success"
            size="large"
            className="w-full md:w-auto"
            onClick={handleAddBroducts}
          >
            Create Product
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Search Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <TextField
            fullWidth
            id="search"
            value={search}
            type="search"
            name="search"
            label="Search term 🔍"
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2"
          />
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
            <Button variant="contained" className="w-full">
              By Title
            </Button>
            <Button variant="contained" className="w-full">
              By Category
            </Button>
          </div>
        </div>
      </div>

      {/* Delete All Section - Will appear when products exist */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {/* Conditional rendering when products exist */}
        {false && (
          <Button
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
