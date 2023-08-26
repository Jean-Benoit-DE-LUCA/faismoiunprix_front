'use client';

import './style.css';

import { createContext, useState, useEffect, useContext } from 'react';

import Header from '../../components/Header/page';

import { IUserData } from './connexion/page';

export interface Product {
  id: number;
  product_name: string;
  /*product_price: string;*/
  product_description: string;
  product_place: string;
  product_delivery: number;
  created_at: string;
  updated_at: string;
}

export interface DContext {
  data: Array<Product>;
  setAddProductCount: any;
  getProduct: any;
  setProduct: any;
}

export interface UContext {
  user_mail: {userMail: string, setUserMail: any}
}

export const DataContext = createContext<DContext>({
  data: [],
  setAddProductCount: () => {},
  getProduct: [],
  setProduct: () => {}
});

export const UserContext = createContext<IUserData>({
  user_mail: "",
  user_name: "",
  user_jwt: "",
  setUserData: () => {}
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [dataProducts, setDataProducts] = useState<Array<Product>>([]);
  const [addProductCount, setAddProductCount] = useState<number>(0);
  const [getProduct, setGetProduct] = useState<Array<any>>([]);

  const [userData, setUserData] = useState<IUserData>({user_mail: "", user_name: "", user_jwt: "", setUserData: () => {}});

  const updateProductCount = (valueCount: number) => {
    setAddProductCount(addProductCount + valueCount);
  }

  const updateUserData = (valueMail: string, valueName: string, valueJwt: string) => {
    setUserData({
      user_mail: valueMail,
      user_name: valueName,
      user_jwt: valueJwt,
      setUserData: () => {}
    });
  };

  const updateGetProduct = (productArray: Array<any>) => {
    setGetProduct(productArray);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/getproducts");
      const data = await response.json();
      setDataProducts(data);
    };
    fetchProducts();
  }, [addProductCount]);

  const objDataContext: DContext = {
    data: dataProducts,
    setAddProductCount: updateProductCount,
    getProduct: [],
    setProduct: updateGetProduct
  };

  const objUserContext: IUserData = {
    user_mail: userData.user_mail,
    user_name: userData.user_name,
    user_jwt: userData.user_jwt,
    setUserData: updateUserData
  };

  return (
    <html lang="en">

      <head>
        <title>FAIS MOI UN PRIX!</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet"/>
      </head>

      <body>
        <div className="container">
          <Header>
          </Header>
            <DataContext.Provider value={objDataContext}>
              <UserContext.Provider value={objUserContext}>
                {children}
              </UserContext.Provider>
            </DataContext.Provider>
        </div>
      </body>

    </html>
  )
}
