"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import arrowLeft from "../../../../public/assets/images/arrow-left.svg";

import { useContext, useEffect, useState } from "react";
import { DataContext, Product, UserContext } from "../../../app/layout";

export default function MyProducts() {

    const Router = useRouter();

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);
    console.log(userContext);
    
    const [myProducts, setMyProducts] = useState<Array<Product>>([]);

    const fetchMyProducts = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getmyproducts/${userContext.user_id}`);

        const responseData = await response.json();
        setMyProducts(responseData);
    }

    /*const fetchMyProducts = () => {
        const newArrayMyProducts: Array<Product> = [];
        dataContext.data.forEach( (elem, ind) => {
            if (elem.user_id == userContext.user_id) {
                newArrayMyProducts[ind] = elem;
            }
        });
        setMyProducts(newArrayMyProducts);
    };*/

    useEffect(() => {
        fetchMyProducts();
    }, []);

    return (
        <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>

            <section className="main--section--myproducts--display">

                <h2 className="main--section--myproducts--display--h2">
                    Mes produits
                </h2>

                <ul className="main--section--myproducts--display--ul">
                    
                    {myProducts.map( elem =>
                        <Link key={elem.id} className="main--section--myproducts--display--ul--a" href={`/produits/${elem.id}`}>
                            <li className="main--section--myproducts--display--ul--li">
                                <span className="main--section--myproducts--display--ul--li--span">
                                    {elem.product_name}
                                </span>
                                <div className="main--section--myproducts--display--ul--li--div--img">
                                    <Image
                                        className="main--section--myproducts--display--ul--li--img"
                                        src={`http://127.0.0.1:8000/assets/images/${elem.product_photos?.split(',')[0]}`}
                                        alt="small--image--preview"
                                        width={0}
                                        height={0}
                                        unoptimized={true}
                                    />
                                </div>
                            </li>
                        </Link>
                    )}
    
                </ul>

            </section>
        </main>
    );
}