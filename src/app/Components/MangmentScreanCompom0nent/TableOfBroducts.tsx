"use client";
import React, { useEffect, useState } from "react";
// import { listOfProducts } from "@/app/utils/listofProducts";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { domineName } from "@/app/utils/tokenName";
import DialogEditProducts from "./EditProductDialog";

interface IProducts {
  id: number;
  title: string;
  price: number;
  ads: number;
  discount: number;
  tax: number;
  total: number;
  categorie: string;
}

const TableOfProducts = () => {
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [id, setId] = useState("0");
  const [search, setSearch] = useState({
    searchBy: "searchByTitle",
    searchAbout: "",
    blaceholderSearch: "search by title",
  });
  const [listOfProducts, setListOfProducts] = useState([
    {
      id: 0,
      title: "",
      price: 0,
      ads: 0,
      discount: 0,
      tax: 0,
      total: 0,
      categorie: "",
    },
  ]);
  const [editProduct, setEditProduct] = useState({
    id: 0,
    title: "",
    price: 0,
    ads: 0,
    discount: 0,
    tax: 0,
    total: 0,
    categorie: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await axios.get(`${domineName}/api/products`);
        let data = await response.data.data;
        const listpro: IProducts[] = data.map((pro: IProducts) => {
          return {
            id: pro.id,
            title: pro.title,
            price: pro.price,
            ads: pro.ads,
            discount: pro.discount,
            tax: pro.tax,
            total: pro.total,
            categorie: pro.categorie,
          };
        });

        setListOfProducts(listpro);
      } catch (error) {
        return;
      }
    };
    fetch();
  }, []);
  // Calculate totals for each product
  const productsWithTotals = listOfProducts.map((product) => ({
    ...product,
    total: product.price + product.ads + product.tax - product.discount,
  }));

  const handleDeleteProduct = async (id: number) => {
    try {
      if (confirm("are u sure u want delete this products")) {
        await axios.delete(`${domineName}/api/products/${id}`);
        // console.log("deleted");
        location.reload();
      }
    } catch (error) {
      return;
      // console.log(error);
    }
  };
  const handleEditProduct = async (id: number, product: IProducts) => {
    setEditProduct(product);
    setId(`${id}`);
    setOpenEditProductDialog(true);
  };
  const handleSearchByCategory = async () => {
    if (!search.searchAbout.trim()) {
      location.reload();
      return;
    }
    try {
      const res = await axios.get(
        `${domineName}/api/products/search?searchByCategory=${search.searchAbout}`
      );
      // console.log("res = ", await res.data.data);
      const data: IProducts[] = await res.data.data;
      setListOfProducts(data);
    } catch (error) {
      console.log("error : ", error);
    }
  };
  const handleSearchByTitle = async () => {
    if (!search.searchAbout.trim()) {
      location.reload();
      return;
    }
    try {
      const res = await axios.get(
        `${domineName}/api/products/search?searchByTitle=${search.searchAbout}`
      );
      // console.log("res = ", await res.data.data);
      const data: IProducts[] = await res.data.data;
      setListOfProducts(data);
    } catch (error) {
      return;
      // console.log("error : ", error);
    }
  };

  return (
    <div className="p-4">
      <DialogEditProducts
        open={openEditProductDialog}
        setOpen={setOpenEditProductDialog}
        id={id}
        product={editProduct}
      />

      {/* Search Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Search Products
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <TextField
          fullWidth
          id="search"
          value={search.searchAbout}
          type="search"
          name="search"
          label={`${search.blaceholderSearch} term 🔍`}
          variant="outlined"
          onChange={(e: any) =>
            setSearch({ ...search, searchAbout: e.target.value })
          }
          className="md:col-span-2"
        />
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
          <Button
            variant="contained"
            className="w-full"
            onClick={() => {
              setSearch({ ...search, searchBy: "searchByTitle" });
              setSearch({ ...search, blaceholderSearch: "search by title" });
              handleSearchByTitle();
            }}
          >
            By Title
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => {
              setSearch({ ...search, searchBy: "searchByCategory" });
              setSearch({ ...search, blaceholderSearch: "search by category" });
              handleSearchByCategory();
            }}
          >
            By Category
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              {/* <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Created at
              </th> */}
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Ads
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Tax
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {productsWithTotals.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              productsWithTotals.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    ${product.ads.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    ${product.tax.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                    -${product.discount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    ${product.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {product.categorie || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <div className="flex justify-end space-x-2 gap-2.5">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon fontSize="small" />}
                        className="!min-w-0 !p-1"
                        onClick={() => handleEditProduct(product.id, product)}
                      >
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={
                          <DeleteIcon fontSize="small" sx={{ margin: "2px" }} />
                        }
                        className="!min-w-0 !p-1"
                        onClick={() => {
                          handleDeleteProduct(product.id);
                        }}
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOfProducts;
