"use client";

import arrowLeft from "../../../../public/assets/images/arrow-left.svg";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataContext, UserContext } from "@/app/layout";
import { useEffect, useContext, useState, Fragment } from "react"

import { Product } from "@/app/layout";
import Footer from "../../../../components/Footer/page";

export interface ISpecificProduct {
    productFound: Array<Product>;
};

export default function ProductId({ params }: { params: {product_id: string}}) {

    const Router = useRouter();

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [getProduct, setGetProduct] = useState<ISpecificProduct>({productFound: []});

    const [imagesNamesProduct, setImagesNamesProduct] = useState<Array<string|undefined>>([]);
    const [imageName, setImageName] = useState<string|null>("");

    const fetchProduct = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getproducts/${params.product_id}`)
        const data = await response.json();
        dataContext.setProduct(data);
        setGetProduct(data);

        console.log(data);

        if (data.productFound[0].product_photos !== null) {
            setImagesNamesProduct(data.productFound[0].product_photos.split(','));
            setImageName(data.productFound[0].product_photos.split(',')[0]);
        }
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

    const handleClickDivOtherImage = (e: React.FormEvent<EventTarget>) => {

        const anchorMainImage = (document.getElementsByClassName("main--article--specific--product--section--images--div--main--anchor")[0] as HTMLAnchorElement);
        
        setImageName((e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].getAttribute("data-img"));

        (e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].src = anchorMainImage.href;
        (e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].setAttribute("data-img", anchorMainImage.href.replace("http://127.0.0.1:8000/assets/images/", ""));
    };

    const handleDeleteProduct = async (e: React.MouseEvent, product_id: string) => {

        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        const asideError = (document.getElementsByClassName("aside aside--error")[0] as HTMLElement);
        const spanError = (document.getElementsByClassName("aside--error--span--confirm")[0] as HTMLSpanElement);
        const divConfirm = (document.getElementsByClassName("aside--error--div--confirm")[0] as HTMLDivElement);

        spanError.textContent = "Êtes-vous sur de supprimer ce produit?";
        divConfirm.classList.add("active");
        asideError.classList.add("active");

        
    };

    const handleYesConfirm = async (e: React.MouseEvent<HTMLSpanElement>, product_id: string) => {

        e.preventDefault();
        
        const asideError = (document.getElementsByClassName("aside aside--error")[0] as HTMLElement);
        const spanError = (document.getElementsByClassName("aside--error--span--confirm")[0] as HTMLSpanElement);
        const divConfirm = (document.getElementsByClassName("aside--error--div--confirm")[0] as HTMLDivElement);

        const response = await fetch(`http://127.0.0.1:8000/api/deleteproduct/${product_id}`, {

            method: "DELETE",
        });

        const responseData = await response.json();

        divConfirm.classList.remove("active");

        if (responseData.flag) {

            spanError.textContent = "Produit retiré avec succès";
            asideError.classList.remove("aside", "aside--error");
            asideError.classList.add("aside--success", "active_success");
        }

        else if (!responseData.flag) {

            spanError.textContent = "Erreur lors de la suppression du produit";
            asideError.classList.remove("aside--success", "active_success");
            asideError.classList.add("aside", "aside--error", "active");
        }

        setTimeout(() => {

            asideError.classList.remove("active", "active_success");
            Router.push("/produits/mesproduits");
        }, 2500);
    };

    const handleNoConfirm = () => {

        const asideError = (document.getElementsByClassName("aside aside--error")[0] as HTMLElement);

        asideError.classList.remove("active");
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    console.log(userContext);
    console.log(getProduct);

    return (
        <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>

            <aside className="aside aside--error error--confirm">
                <span className="aside--error--span--confirm">
                    Etes vous sur de supprimer ce produit?
                </span>
                <div className="aside--error--div--confirm">
                    <span className="yes--confirm" onClick={(e) => handleYesConfirm(e, params.product_id)}>Oui</span>
                    <span className="no--confirm" onClick={handleNoConfirm}>Non</span>
                </div>
            </aside>

            {getProduct.productFound[0] !== undefined ?
            
            (
            <article className="main--article--specific--product">

                {userContext.user_id == getProduct.productFound[0].user_id ?

                    <Link href={`/produits/${params.product_id}/modifier`} className="main--article--specific--product--update--anchor">
                        Modifier
                    </Link>

                    :

                    <>
                    </>
                }


                <h1 className="main--article--specific--product--h1">
                    {getProduct.productFound[0].product_name}
                    <span className="main--article--specific--product--h1--span"></span>
                </h1>

                <div className="main--article--specific--product--section--images--description--wrap">

                    {getProduct.productFound[0].product_photos == null ?

                    (   
                        
                        <section className="main--article--specific--product--section--images">
                            <div className="main--article--specific--product--section--images--div--main">
                                <Image
                                    className="main--article--specific--product--section--images--div--main--img"
                                    src="/assets/images/no_image.png"
                                    alt="main-image"
                                    fill
                                    priority={true}
                                    sizes="50px"
                                />
                            </div>
                            <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                    </section>
                    ):

                    <section className="main--article--specific--product--section--images">
                        <span className="main--article--specific--product--section--description--div--description--p--title">Photos</span>
                        <div className="main--article--specific--product--section--images--div--main">
                            <a className="main--article--specific--product--section--images--div--main--anchor" href={`http://127.0.0.1:8000/assets/images/${imageName}`} target="_blank">
                            <Image
                                className="main--article--specific--product--section--images--div--main--img"
                                src={`http://127.0.0.1:8000/assets/images/${imageName}`}
                                unoptimized={true}
                                alt="main-image"
                                fill
                                priority={true}
                                sizes="50px"
                            />
                            </a>
                        </div>
                        
                        {getProduct.productFound[0].product_photos.split(',').length >= 2 ?

                        (
                        <>
                        <div className="main--article--specific--product--section--images--div--others--wrap">
                            <div className="main--article--specific--product--section--images--div--others">

                                {imagesNamesProduct.slice(1).map( elem => 
                                    
                                    <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap product--id" 
                                    onClick={handleClickDivOtherImage}>

                                    <Image
                                        className="main--article--specific--product--section--images--div--others--grid--element--img"
                                        src={`http://127.0.0.1:8000/assets/images/${elem}`}
                                        unoptimized={true}
                                        data-img={elem}
                                        alt="other-image"
                                        fill
                                        priority={true}
                                        sizes="50px"
                                    />

                                    </div>

                                )}

                            </div>
                        </div>
                        <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                        </>

                        ):

                        <>
                        </>

                        }
                    </section>
                    }

                    <section className="main--article--specific--product--section--description">
                        <div className="main--article--specific--product--section--description--div--description">

                            <span className="main--article--specific--product--section--description--div--description--p--title">Description</span>
                            <p className="main--article--specific--product--section--description--div--description--p">
                                {getProduct.productFound[0].product_description}
                            </p>
                        </div>
                        <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                    </section>

                    {userContext.user_id == getProduct.productFound[0].user_id ?

                        <Link href="" className="main--article--specific--product--update--anchor delete" onClick={(e) => handleDeleteProduct(e, params.product_id)}>
                            Supprimer
                        </Link>

                        :

                        <>
                        </>
                    }

                </div>

                {getProduct.productFound[0].user_id !== userContext.user_id ?
                
                    (

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

                    ) : 

                    <>
                    </>
                }


            </article>
            ):
            <>
            </>
            }

            <Footer />
        </main>
    );
}