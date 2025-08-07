interface IList {
  title: string;
  price: number;
  CreatedAt: Date;
  total: number;
  ads: number;
  tax: number;
  discount: number;
  categorie: string;
}

 let listOfProducts: IList[] = [
  {
    title: "tv",
    price: 300,
    CreatedAt: new Date(),
    total: 0,
    ads: 10,
    tax: 10,
    discount: 30,
    categorie: "",
  },
  {
    title: "car",
    price: 1700,
    ads: 20,
    tax: 10,
    discount: 30,
    CreatedAt: new Date(),
    total: 0,
    categorie: "",
  },
  {
    title: "phone",
    price: 200,
    ads: 10,
    tax: 10,
    discount: 30,
    total: 0,
    categorie: "",
    CreatedAt: new Date(),
  },
  {
    title: "condation",
    price: 4500,
    ads: 10,
    tax: 0,
    discount: 10,
    total: 0,
    categorie: "",
    CreatedAt: new Date(),
  },
  {
    title: "bus",
    price: 1000,
    ads: 30,
    tax: 10,
    discount: 10,
    total: 0,
    categorie: "",
    CreatedAt: new Date(),
  },
];
