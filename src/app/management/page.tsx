import React from "react";
import InputAddProducts from "../Components/MangmentScreanCompom0nent/InputAddProducts";
import TableOfBroducts from "../Components/MangmentScreanCompom0nent/TableOfBroducts";

const ManagementPage = () => {
  //to do
  // if user does not loggin can't arrive to InputAddProducts page and TableOfBroducts page
  const islogged = true;
  return (
    <div>
      {islogged ? (
        <>
          <InputAddProducts />
          <TableOfBroducts />
        </>
      ) : (
        <div className="h-screen w-3xl mx-auto">
          <h3 className=" h-screen flex justify-center items-center text-4xl font-bold
">
            must log in to show this page
          </h3>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
