"use client";

import Image from "next/image";

import { DataContext } from "@/app/layout";
import { useEffect, useContext, useState } from "react"

import { Product } from "@/app/layout";

export interface ISpecificProduct {
    productFound: Array<Product>;
};

export default function ProductId({ params }: { params: {product_id: string}}) {

    const dataContext = useContext(DataContext);

    const [getProduct, setGetProduct] = useState<ISpecificProduct>({productFound: []});

    const fetchProduct = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getproducts/${params.product_id}`)
        const data = await response.json();
        dataContext.setProduct(data);
        setGetProduct(data);
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    console.log(getProduct.productFound[0]);

    return (
        <main className="main">

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

                        <div className="main--article--specific--product--section--offer--div--input--wrap">
                            <input className="main--article--specific--product--section--offer--div--input" type="number" name="main--article--specific--product--section--offer--div--input" id="main--article--specific--product--section--offer--div--input"
                            />

                            <span className="main--article--specific--product--section--offer--div--input--span">€</span>

                        </div>

                        <button className="main--article--specific--product--section--offer--div--button" type="submit" name="main--article--specific--product--section--offer--div--button" id="main--article--specific--product--section--offer--div--button">Faire offre!</button>

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