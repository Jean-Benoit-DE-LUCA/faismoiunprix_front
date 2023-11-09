"use client";

import { ReactElement, useState, useContext, useEffect, SyntheticEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { DataContext, FunctionContext, UserContext } from "./layout";

import { Product } from "./layout";

import Footer from "../../components/Footer/page";

import arrowTop from "../../public/assets/images/arrow-top.svg";

export default function App(): ReactElement {

  interface IInputChange{
    value: string,
  }

  const params = useSearchParams();
  const Router = useRouter();

  const dataContext = useContext(DataContext);
  const userContext = useContext(UserContext);
  const functionContext = useContext(FunctionContext);

  const [val, setVal] = useState<IInputChange>({value: ""});

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal({value: e.target.value});
    filterInputFunc(e.target.value);
  };

  const filterInputFunc = (inputTyped: any = ""): Array<Product> => {
    let dataContextProductsCopy = [...dataContext.data];
    const filterInput = dataContextProductsCopy.filter( elem => elem.product_name.toLowerCase().includes(inputTyped.toLowerCase()));
    
    if (filterInput.length > 50) {

      const filterInputSliced = filterInput.slice(0, 50);
      return filterInputSliced;
    }

    return filterInput;
  }

  const handleLogout = (): void => {
    userContext.setUserData("", "", "", "", "", "", "", "", "", "");
  };

  const errorAuthFunc = () => {

    const asideError = document.getElementsByClassName("aside aside--error aside--error--auth")[0];
    const asideErrorSpan = document.getElementsByClassName("aside--error--span")[0];

    asideErrorSpan.textContent = sessionStorage.getItem("errorAuth");
    asideError.classList.add("active");

    Router.push("/");

    setTimeout(() => {

      asideError.classList.remove("active");
      sessionStorage.removeItem("errorAuth");
      //Router.push("/");
    }, 3000);
  };

  useEffect(() => {

    if (params.get("prof") == "false") {
      sessionStorage.setItem("errorAuth", "Veuillez vous authentifier afin d'accéder à votre profil");
    }

    else if (params.get("prod") == "false") {
      sessionStorage.setItem("errorAuth", "Veuillez vous authentifier afin d'ajouter un produit");
    }

    else if (params.get("upd") == "false") {
      sessionStorage.setItem("errorAuth", "Modification du produit impossible");
    }

    if (sessionStorage.getItem("errorAuth") !== null) {

      errorAuthFunc()
    }

    window.addEventListener("scroll", () => functionContext.scrollDivArrowAppear(400));

  }, []);

  return (
    
    <main className="main">

          <aside className="aside aside--error aside--error--auth">
            <span className="aside--error--span">
              
            </span>
          </aside>

      {userContext.user_jwt !== "" ? 
      (
        <>
        <p className="main--p">Bienvenue {userContext.user_firstname}!</p>
        
        <section className="main--section--myproducts--myoffers--div">
          <Link className="main--section--myproducts--myoffers--div--myprofile" href="/profil">Mon profil</Link>
          <Link className="main--section--myproducts--myoffers--div--myproducts" href="/produits/mesproduits">Mes produits</Link>
          <Link className="main--section--myproducts--myoffers--div--myoffers" href="/mesoffres">Mes offres</Link>

          <span className="main--article--specific--product--h1--span main--article--specific--product--section--span home--line--span"></span>
        </section>

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
        {filterInputFunc(val.value).map( (elem: {id: number, product_name: string, /*product_price: string, */product_place: string}) => 
          <Link className="main--ul--results--anchor" href={`/produits/${elem.id}`} key={elem.id}>
            <li className="main--ul--results--li">
              <span className="main--ul--results--li--span--name">{elem.product_name}</span>
              {/*<span className="main--ul--results--li--span--prix">{elem.product_price}€</span>*/}
              <span className="main--ul--results--li--span--place">{elem.product_place}</span>
            </li>
          </Link>
        )}
      </ul>

      <div className="arrow--top--scroll--div" onClick={functionContext.clickBackTop}>
        <Image
          className="arrow--top--scroll--div--img--arrow"
          src={arrowTop}
          alt="arrow-top"
          unoptimized
        />
      </div>

      <Footer />
      
    </main>
  );
}