"use client";

import arrowLeft from "../../../../public/assets/images/arrow-left.svg";

import Image from "next/image";
import Link from "next/link";

import { DataContext, UserContext } from "@/app/layout";
import { useEffect, useContext, useState } from "react"

import { Product } from "@/app/layout";

export interface ISpecificProduct {
    productFound: Array<Product>;
};

export default function ProductId({ params }: { params: {product_id: string}}) {

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [getProduct, setGetProduct] = useState<ISpecificProduct>({productFound: []});

    const fetchProduct = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getproducts/${params.product_id}`)
        const data = await response.json();
        dataContext.setProduct(data);
        setGetProduct(data);
    };

    const handleSubmitOffer = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        const valueOffer = (document.getElementsByClassName("main--article--specific--product--section--offer--div--input")[0] as HTMLInputElement);

        const asideErrorOffer: Element = document.getElementsByClassName("aside aside--error aside--error--offer")[0];
        const spanElementError: Element = document.getElementsByClassName("aside--error--span")[0];

        if (userContext.user_jwt == "") {

            spanElementError.textContent = "Veuillez vous authentifier pour emettre une offre";
            asideErrorOffer.classList.add("active");

            setTimeout(() => {
                asideErrorOffer.classList.remove("active");
            }, 3000);
        }

        else if (userContext.user_jwt.length > 0) {

            if (valueOffer.value !== "") {

                const response = await fetch("http://127.0.0.1:8000/api/insertoffer", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${userContext.user_jwt}`
                    },
                    body: JSON.stringify({
                        offer_submitted: valueOffer.value,
                        user_id: userContext.user_id,
                        product_id: params.product_id,
                        offer_accepted: 0
                    })
                });

                const data = await response.json();
                
                if (data.response == true) {

                    spanElementError.textContent = "Offre envoyée avec succès!";
                    asideErrorOffer.classList.add("aside--success", "active_success");

                    setTimeout(() => {
                        asideErrorOffer.classList.remove("aside--success", "active_success");
                    }, 3000);
                }
            }

            else {

                spanElementError.textContent = "Champs vide, veuillez saisir une offre";
                asideErrorOffer.classList.add("active");

                setTimeout(() => {
                    asideErrorOffer.classList.remove("active");
                }, 3000);
            }
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    console.log(getProduct);

    return (
        <main className="main">

            <Link className="main--anchor--back" href="/">
                <Image className="main--anchor--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--anchor--back--span">Retour</span>
            </Link>

            {getProduct.productFound[0] !== undefined ?
            (
            <article className="main--article--specific--product">
                <h1 className="main--article--specific--product--h1">
                    {getProduct.productFound[0].product_name}
                    <span className="main--article--specific--product--h1--span"></span>
                </h1>

                <section className="main--article--specific--product--section--images">
                    <div className="main--article--specific--product--section--images--div--main">
                        <Image
                            className="main--article--specific--product--section--images--div--main--img"
                            src="/assets/images/one.jpg"
                            alt="main-image"
                            fill
                        />
                    </div>

                    <div className="main--article--specific--product--section--images--div--others--wrap">
                        <div className="main--article--specific--product--section--images--div--others">

                            <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap">
                                <Image
                                    className="main--article--specific--product--section--images--div--others--grid--element--img"
                                    src="/assets/images/two.jpg"
                                    alt="other-image"
                                    fill
                                />
                            </div>

                            <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap">
                                <Image
                                    className="main--article--specific--product--section--images--div--others--grid--element--img"
                                    src="/assets/images/three.jpg"
                                    alt="other-image"
                                    fill
                                />
                            </div>

                            <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap">
                                <Image
                                    className="main--article--specific--product--section--images--div--others--grid--element--img"
                                    src="/assets/images/four.jpg"
                                    alt="other-image"
                                    fill
                                />
                            </div>
                        </div>
                    </div>
                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                </section>

                <section className="main--article--specific--product--section--description">
                    <div className="main--article--specific--product--section--description--div--description">
                        <p className="main--article--specific--product--section--description--div--description--p">
                            {getProduct.productFound[0].product_description}
                        </p>
                    </div>
                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                </section>

                <section className="main--article--specific--product--section--offer">
                    <div className="main--article--specific--product--section--offer--div">

                        <aside className="aside aside--error aside--error--offer">
                            <span className="aside--error--span">

                            </span>
                        </aside>

                        <div className="main--article--specific--product--section--offer--div--input--wrap">
                            <input className="main--article--specific--product--section--offer--div--input" type="number" name="main--article--specific--product--section--offer--div--input" id="main--article--specific--product--section--offer--div--input"
                            />

                            <span className="main--article--specific--product--section--offer--div--input--span">€</span>

                        </div>

                        <button className="main--article--specific--product--section--offer--div--button" type="submit" name="main--article--specific--product--section--offer--div--button" id="main--article--specific--product--section--offer--div--button" onClick={handleSubmitOffer}>Faire offre!</button>

                    </div>
                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                </section>


            </article>
            ):
            <>
            </>
            }
        </main>
    );
}