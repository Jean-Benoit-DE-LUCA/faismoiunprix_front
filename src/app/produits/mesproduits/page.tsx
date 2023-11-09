"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import arrowLeft from "../../../../public/assets/images/arrow-left.svg";
import arrowTop from "../../../../public/assets/images/arrow-top.svg";
import noImage from "../../../../public/assets/images/no_image.png";

import { useContext, useEffect, useState } from "react";
import { DataContext, FunctionContext, Product, UserContext } from "../../../app/layout";

import Footer from "../../../../components/Footer/page";

export default function MyProducts() {

    const Router = useRouter();

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);
    const functionContext = useContext(FunctionContext);
    
    const [myProducts, setMyProducts] = useState<Array<Product>>([]);

    const fetchMyProducts = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getmyproducts/${userContext.user_id}`);

        const responseData = await response.json();
        setMyProducts(responseData);
    }

    useEffect(() => {
        fetchMyProducts();
        window.addEventListener("scroll", () => functionContext.scrollDivArrowAppear(200));
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
                                        src={elem.product_photos !== null ? `http://127.0.0.1:8000/assets/images/${elem.product_photos?.split(',')[0]}` : noImage}
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