import React from "react";
import InfoAccount from "../Components/informaitionAccount/InfoAccount";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "../utils/verifyToken";
import { redirect } from "next/navigation";
import { tokenName } from "../utils/tokenName";

const AcountInfoPage = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore)?.get(tokenName);
  const payload = verifyTokenForPage(token?.value || "");
  


  if (!token) {
    redirect("/");
  }
  return (
    <div>
      <InfoAccount id={payload?.id} email={payload?.email}  name={payload?.name}/>
    </div>
  );
};

export default AcountInfoPage;
