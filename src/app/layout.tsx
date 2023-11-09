'use client';

import './style.css';

import { createContext, useState, useEffect} from 'react';

import Header from '../../components/Header/page';

import { IUserData } from './connexion/page';
import Footer from '../../components/Footer/page';

export interface Product {
  id: number;
  product_name: string;
  product_description: string;
  product_place: string;
  product_delivery: number;
  product_photos: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface DContext {
  data: Array<Product>;
  setAddProductCount: any;
  getProduct: any;
  setProduct: any;
  spinnerActive: boolean
  setSpinnerIsActive: any;
}

export interface IFunctionContext {
  scrollDivArrowAppear: any;
  clickBackTop: any;
}

export interface UContext {
  user_mail: {userMail: string, setUserMail: any}
}

export const DataContext = createContext<DContext>({
  data: [],
  setAddProductCount: () => {},
  getProduct: [],
  setProduct: () => {},
  spinnerActive: false,
  setSpinnerIsActive: (bool: boolean) => {}
});

export const UserContext = createContext<IUserData>({
  user_mail: "",
  user_name: "",
  user_firstname: "",
  user_address: "",
  user_zip: NaN,
  user_city: "",
  user_phone: "",
  user_id: NaN,
  user_role: "",
  user_jwt: "",
  setUserData: () => {}
});

export const FunctionContext = createContext<IFunctionContext>({
  scrollDivArrowAppear: function() {},
  clickBackTop: function() {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [dataProducts, setDataProducts] = useState<Array<Product>>([]);
  const [addProductCount, setAddProductCount] = useState<number>(0);
  const [getProduct, setGetProduct] = useState<Array<any>>([]);
  const [spinnerActive, setSpinnerActive] = useState<boolean>(false);
  const [userData, setUserData] = useState<IUserData>({user_mail: "", user_name: "", user_firstname: "", user_address: "", user_zip: NaN, user_city: "", user_phone: "", user_id: NaN, user_role: "", user_jwt: "", setUserData: () => {}});

  const updateProductCount = (valueCount: number) => {
    setAddProductCount(addProductCount + valueCount);
  }

  const updateUserData = (valueMail: string, valueName: string, valueFirstName: string, valueAddress: string, valueZip: number, valueCity: string, valuePhone: string, valueId: number, valueRole: string, valueJwt: string) => {
    setUserData({
      user_mail: valueMail,
      user_name: valueName,
      user_firstname: valueFirstName,
      user_address: valueAddress,
      user_zip: valueZip,
      user_city: valueCity,
      user_phone: valuePhone,
      user_id: valueId,
      user_role: valueRole,
      user_jwt: valueJwt,
      setUserData: () => {}
    });
  };

  const updateGetProduct = (productArray: Array<any>) => {
    setGetProduct(productArray);
    /*const newArray = new Array().concat(productArray);
    setGetProduct(newArray);*/
  };

  const setSpinnerActiveFunction = (bool: boolean) => {
    setSpinnerActive(bool);
  }

  const handleScrollDivAppear = (scrollNum: number) => {
    
    if (document.documentElement.contains(document.getElementsByClassName("arrow--top--scroll--div")[0]) !== false) {

      const divArrowTop = (document.getElementsByClassName("arrow--top--scroll--div")[0] as HTMLDivElement);

      if (document.documentElement.scrollTop > scrollNum) {

        divArrowTop.classList.add("active");
      }

      else if (document.documentElement.scrollTop < scrollNum) {

        divArrowTop.classList.remove("active");
      }
      
    }
  };

  const handleClickBackTop = () => {

    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
    getProduct: getProduct,
    setProduct: updateGetProduct,
    spinnerActive: spinnerActive,
    setSpinnerIsActive: setSpinnerActiveFunction
  };

  const objUserContext: IUserData = {
    user_mail: userData.user_mail,
    user_name: userData.user_name,
    user_firstname: userData.user_firstname,
    user_address: userData.user_address,
    user_zip: userData.user_zip,
    user_city: userData.user_city,
    user_phone: userData.user_phone,
    user_id: userData.user_id,
    user_role: userData.user_role,
    user_jwt: userData.user_jwt,
    setUserData: updateUserData
  };

  const objFunctionContext: IFunctionContext = {
    scrollDivArrowAppear: handleScrollDivAppear,
    clickBackTop: handleClickBackTop,
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
          <DataContext.Provider value={objDataContext}>
            <Header />
              <UserContext.Provider value={objUserContext}>
                <FunctionContext.Provider value={objFunctionContext}>
                  {children}
                </FunctionContext.Provider>
              </UserContext.Provider>
          </DataContext.Provider>
        </div>
      </body>

    </html>
  )
}
