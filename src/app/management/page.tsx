import React from "react";
import InputAddProducts from "../Components/MangmentScreanCompom0nent/InputAddProducts";
import TableOfBroducts from "../Components/MangmentScreanCompom0nent/TableOfBroducts";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "../utils/verifyToken";
import { tokenName } from "../utils/tokenName";

const ManagementPage = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore)?.get(tokenName);
  const payload = verifyTokenForPage(token?.value || "");

  return (
    <div className="min-h-screen bg-gray-50">
      {payload?.id ? (
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Product Management
            </h1>
            <p className="text-gray-600 mt-2">
              Add and manage your products in the inventory
            </p>
          </header>

          <div className="grid gap-8">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Add New Product
              </h2>
              <InputAddProducts userId={payload?.id }/>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Product Inventory
              </h2>
              <div className="overflow-x-auto">
                <TableOfBroducts />
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-6">
              You must be logged in to view this page.
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
