"use client";

import { ReactElement, useState, useContext, useEffect } from "react";

import Link from "next/link";

import { DataContext, UserContext } from "./layout";

import { Product } from "./layout";
import { JsxElement } from "typescript";

export default function App(): ReactElement {

  interface IInputChange{
    value: string,
  }

  interface IProduct {
    products: Array<string|number|boolean>
  }

  const dataContext = useContext(DataContext);
  const userContext = useContext(UserContext);

  const [val, setVal] = useState<IInputChange>({value: ""});
  const [prod, setProd] = useState<IProduct>({products: []});
  const [getDataProducts, setDataProducts] = useState<Array<Product>>([]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal({value: e.target.value});
    filterInputFunc(e.target.value);
  };

  const filterInputFunc = (inputTyped: any = ""): Array<Product> => {
    let dataContextProductsCopy = [...dataContext.data];
    const filterInput = dataContextProductsCopy.filter( elem => elem.product_name.toLowerCase().includes(inputTyped.toLowerCase()));
    return filterInput;
  }

  const handleLogout = (): void => {
    userContext.setUserData("", "", "");
  };

  const errorAuthFunc = () => {

    const asideError = document.getElementsByClassName("aside aside--error aside--error--auth")[0];

    asideError.classList.add("active");

    setTimeout(() => {

      asideError.classList.remove("active");
      sessionStorage.removeItem("errorAuth");
    }, 3000);
  };

  useEffect(() => {

    if (sessionStorage.getItem("errorAuth") !== null) {

      errorAuthFunc()
    }
  }, [sessionStorage.getItem("errorAuth")]);

  return (
    
    <main className="main">

          <aside className="aside aside--error aside--error--auth">
            <span className="aside--error--span">
              Veuillez vous connecter afin d'ajouter un produit
            </span>
          </aside>

      {userContext.user_jwt !== "" ? 
      (
        <>
        <p className="main--p">Bienvenue {userContext.user_name}!</p>
        <section className="main--section--signup--login">
          <Link className="main--section--signup--login--anchor" href="" onClick={handleLogout}>Se déconnecter</Link>
          <span className="main--section--add--product--span">OU</span>
        </section>
        </>
      ):  
        <>
          <section className="main--section--signup--login">
            <Link className="main--section--signup--login--anchor" href="/connexion">S'inscrire / S'authentifier</Link>
            <span className="main--section--add--product--span">OU</span>
          </section>
        </>
      }

      <section className="main--section--add--product">
        <Link className="main--section--add--product--anchor" href="/ajouter">Ajouter un produit</Link>
        <span className="main--section--add--product--span">OU</span>
      </section>

      <section className="main--section">
        <div className="main--section--div">
          <span className="main--section--div--span">
            Fais une recherche, sélectionne l'article de ton choix, et fais une proposition! Si vous tombez d'accord, Bingo!
          </span>
        </div>
      </section>

      <section className="main--section--input">
        <input className="main--section--input--input" value={val.value} onChange={handleChangeInput} />
      </section>

      <section className="main--section--results">
        <h3 className="main--section--results--h3">
          Résultats: {filterInputFunc(val.value).length}
        </h3>
      </section>

      <ul className="main--ul--results">
        {filterInputFunc(val.value).map( (elem: {id: number, product_name: string, product_price: string, product_place: string}) => 
          <Link className="main--ul--results--anchor" href="" key={elem.id}>
            <li className="main--ul--results--li">
              <span className="main--ul--results--li--span--name">{elem.product_name}</span>
              <span className="main--ul--results--li--span--prix">{elem.product_price}€</span>
              <span className="main--ul--results--li--span--place">{elem.product_place}</span>
            </li>
          </Link>
        )}
      </ul>
      
    </main>
  );
}