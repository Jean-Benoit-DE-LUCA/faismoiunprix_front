"use client"

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import { FormEvent, useContext, useState } from "react";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";

import { UserContext, DataContext } from "../layout";
import Footer from "../../../components/Footer/page";

export default function Add() {

    const Router = useRouter();

    const userContext = useContext(UserContext);
    const dataContext = useContext(DataContext);

    const [getCity, setCity] = useState<string>(userContext.user_city);

    const handleAddProductSubmit = async (e: FormEvent<HTMLFormElement>) => {

        const inputNameProduct = document.getElementsByClassName("main--section--add--product--form--input--name")[0];
        const textareaDescriptionProduct: any = document.getElementsByClassName("main--section--add--product--form--textarea--description")[0];
        const inputPlaceProduct = document.getElementsByClassName("main--section--add--product--form--input--place")[0];
        const deliveryRadioProduct = document.getElementsByName("main--section--add--product--form--checkbox--delivery");
        const inputImagesProduct: HTMLCollectionOf<Element> = document.getElementsByClassName("main--section--add--product--form--input--file");
    
        e.preventDefault();

        const arrayImages: Array<any> = [];
        const dataImages = new FormData();

        Array.from(inputImagesProduct).forEach( (elem: any) => {

            if (elem.files.length !== 0) {
                let numImage: number = Number(elem.name.replace("main--section--add--product--form--input--file--", "").trim());
                arrayImages.push({numImage, pathImage: `/assets/images/${elem.files[0].name}`});
                dataImages.append(`image${numImage.toString()}`, elem.files[0]);
            }
        });
    
        let flag: boolean = false
        let nameClassRadioDelivery: string = "";
        Array.from(deliveryRadioProduct).forEach( (input) => {
    
            if ((input as HTMLInputElement).checked) {
    
                flag = true;
                nameClassRadioDelivery = (input as HTMLInputElement).value;
            }
        });
    
        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];
    
        if ((inputNameProduct as HTMLInputElement).value == "" || (inputPlaceProduct as HTMLInputElement).value == "" || textareaDescriptionProduct.value == "" || !flag) {
    
            spanMessage.textContent = "Veuillez remplir tous les champs";
            asideError.classList.add("active");
    
            setTimeout(() => {
                asideError.classList.remove("active");
            }, 3000);
        }
    
        else if ((inputNameProduct as HTMLInputElement).value.length > 0 && (inputPlaceProduct as HTMLInputElement).value.length > 0 && textareaDescriptionProduct.value.length > 0 && flag) {
    
            spanMessage.textContent = "Produit ajouté avec succès";
            asideError.classList.add("aside--success", "active_success");
    
            setTimeout(() => {
                asideError.classList.remove("aside--success", "active_success");
            }, 3000);
    
            const radioValueChecked = (document.getElementsByClassName(nameClassRadioDelivery)[0] as HTMLInputElement);

            const response = await fetch("http://127.0.0.1:8000/api/insertproduct", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.user_jwt}`
                },
                body: JSON.stringify({
                    name_product: (inputNameProduct as HTMLInputElement).value,
                    description_product: textareaDescriptionProduct.value,
                    place_product: (inputPlaceProduct as HTMLInputElement).value,
                    delivery_product: radioValueChecked.value.replace("main--section--add--product--form--input--delivery--", ""),
                    user_id: userContext.user_id
                })
            });
            
            const data = await response.json();

            if (data.response == true) {

                dataContext.setSpinnerIsActive(true)

                dataImages.append("lastInsertId", data.lastInsertId);

                const responseImages = await fetch(`http://127.0.0.1:8000/api/insertproductimages/folder/${data.lastInsertId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${userContext.user_jwt}`
                    },
                    body: dataImages
                });

                dataContext.setAddProductCount(1);

                setTimeout(() => {
                    dataContext.setSpinnerIsActive(false);
                    Router.push("/");
                }, 3000);
            }

            if (data.response == false) {

                asideError.classList.remove("aside--success", "active_success");

                spanMessage.textContent = "Erreur d'authentification";
                asideError.classList.add("active");
        
                setTimeout(() => {
                    asideError.classList.remove("active");
                }, 3000);
            }
        };
    };

    const arrayImagesNumbers: Array<any> = [
        {id: 1, name: "Image 1"},
        {id: 2, name: "Image 2"},
        {id: 3, name: "Image 3"}
    ];

    const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement> | any, inputNumber: number) => {
        
        const nameImage = e.target.value.replace("C:\\fakepath\\", "").trim();
        e.currentTarget.parentElement.getElementsByClassName("main--section--add--product--form--label--file--span")[0].textContent = nameImage;

        const anchorMainImage = (document.getElementsByClassName("main--article--specific--product--section--images--div--main--anchor")[0] as HTMLAnchorElement);

        const imgElements = (document.getElementsByClassName("image--number"));
        
        for (const imgElement of imgElements) {

            if (imgElement.classList.contains(`img--${inputNumber}`)) {

                const fileReader = new FileReader();

                fileReader.onload = (e) => {

                   (imgElement as HTMLImageElement).src = e.target?.result as string;
                   (imgElement as HTMLImageElement).setAttribute("data-img", e.target?.result as string);

                   if (inputNumber == 0) {

                        anchorMainImage.href = e.target?.result as string;
                   }
                }

                fileReader.readAsDataURL(e.target.files[0]);
            }
        }
    };

    const handleClickCrossDelete = (e: React.MouseEvent<HTMLElement>) => {
        
        const currentImg = (e.currentTarget.parentElement?.getElementsByTagName("img")[0] as HTMLImageElement);

        const currentImgNumberAttribute = currentImg.getAttribute("data-img-number");
        
        const inputFiles = (document.getElementsByClassName("main--section--add--product--form--input--file") as HTMLCollectionOf<HTMLInputElement>);

        for (const input of inputFiles) {

            if (input.id.includes(`file--${currentImgNumberAttribute}`)) {

                input.value = "";

                (input.parentElement?.getElementsByClassName("main--section--add--product--form--label--file--span")[0] as HTMLSpanElement
                ).textContent = "Choisir une image";
            }
        }

        if (currentImgNumberAttribute == "0") {

            const anchorMainImage = (document.getElementsByClassName("main--article--specific--product--section--images--div--main--anchor")[0] as HTMLAnchorElement);

            anchorMainImage.href = "http://localhost:3000/assets/images/no_image.png";
        }


        currentImg.src = "http://localhost:3000/assets/images/no_image.png";
        currentImg.setAttribute("data-img", "http://localhost:3000/assets/images/no_image.png");

    }

    const handleClickMainImage = (e: React.MouseEvent<HTMLAnchorElement>) => {

        if (e.currentTarget.href.startsWith("data")) {

            e.preventDefault();

            const newWindow = window.open();
            newWindow?.document.write(`<iframe src=${e.currentTarget.href} frameborder="0" style="border:0; width: 100%; height: 100%" allowfullscreen></iframe>`)
        }
    };

    if (userContext.user_jwt !== "") {
        return (
            <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>
                
                <section className="main--section--add--product main--section--add--product--add--page">
                    <h2 className="main--section--add--product--h2">Ajouter un produit</h2>

                    <form className="main--section--add--product--form" method="POST" onSubmit={handleAddProductSubmit}>

                        <div className="main--section--add--product--form--input--wrap">
                            <label className="main--section--add--product--form--label--name" htmlFor="main--section--add--product--form--input--name">Nom du produit:</label>
                            <input className="main--section--add--product--form--input--name" type="text" name="main--section--add--product--form--input--name" id="main--section--add--product--form--input--name"/>
                        </div>

                        <div className="main--section--add--product--form--input--wrap">
                            <label className="main--section--add--product--form--label--description" htmlFor="main--section--add--product--form--textarea--description">Description
                            </label>
                            <textarea className="main--section--add--product--form--textarea--description" name="main--section--add--product--form--textarea--description" id="main--section--add--product--form--textarea--description" placeholder="Décrivez votre produit">
                            </textarea>
                        </div>


                        {/**/}


                        <>
                                <section className="main--article--specific--product--section--images">
                                    <div className="main--article--specific--product--section--images--div--main add--product">
                                        <a className="main--article--specific--product--section--images--div--main--anchor" href="http://localhost:3000/assets/images/no_image.png" target="_blank" onClick={handleClickMainImage}>
                                            <Image
                                                className="main--article--specific--product--section--images--div--main--img img--0 image--number"
                                                src="http://localhost:3000/assets/images/no_image.png"
                                                data-img="http://localhost:3000/assets/images/no_image.png"
                                                data-img-number="0"
                                                unoptimized={true}
                                                alt="main-image"
                                                fill
                                                priority={true}
                                                sizes="50px"
                                            />
                                        </a>

                                        <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                       
                                    </div>
                                    {/*<span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>*/}
                                

                                
                                    <div className="main--article--specific--product--section--images--div--others--wrap">
                                        <div className="main--article--specific--product--section--images--div--others add--product--others">

                                        {Array.from(Array(2).keys()).map( elem => 

                                            <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap--wrap">
                                                <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap">

                                                <Image
                                                    className={`main--article--specific--product--section--images--div--others--grid--element--img img--${elem+1} image--number`}
                                                    src="http://localhost:3000/assets/images/no_image.png"
                                                    unoptimized={true}
                                                    data-img="http://localhost:3000/assets/images/no_image.png"
                                                    data-img-number={elem+1}
                                                    alt="other-image"
                                                    fill
                                                    priority={true}
                                                    sizes="50px"
                                                />
                                                
                                                </div>

                                                <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                                
                                            </div>
                                            
                                        )}
                                        
                                        </div>
                                    </div>
                                <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                </section>
                                </>






                        {/**/ }


                        <div className="main--section--add--product--form--input--wrap main--section--add--product--form--input--wrap--images">
                            <label className="main--section--add--product--form--label--file--title">Images
                            </label>

                            {arrayImagesNumbers.map( (elem, ind) => 
                                <div key={elem.id} className="main--section--add--product--form--label--file--wrap">

                                    <label className="main--section--add--product--form--label--file" htmlFor={`main--section--add--product--form--input--file--${ind}`}>{elem.name}
                                    </label>

                                    <span className="main--section--add--product--form--label--file--span">Choisir une image</span>

                                    <input className={`main--section--add--product--form--input--file`} type="file" name={`main--section--add--product--form--input--file--${ind}`} id={`main--section--add--product--form--input--file--${ind}`} onChange={(e) => handleInputFileChange(e, ind)}/>

                                </div>
                            )}

                        </div>

                        <div className="main--section--add--product--form--input--wrap">
                            <label className="main--section--add--product--form--label--place" htmlFor="main--section--add--product--form--input--place">Lieu:</label>
                            <input className="main--section--add--product--form--input--place" type="text" name="main--section--add--product--form--input--place" id="main--section--add--product--form--input--place" value={getCity} onChange={(e) => setCity(e.target.value)}/>
                        </div>

                        <fieldset className="main--section--add--product--form--fieldset">
                            <legend>
                                Livraison:
                            </legend>

                                <label className="main--section--add--product--form--label--delivery--yes" htmlFor="main--section--add--product--form--input--delivery--yes">Oui</label>
                                <input className="main--section--add--product--form--input--delivery--yes" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--yes" value="main--section--add--product--form--input--delivery--yes"/>
                            
                                <label className="main--section--add--product--form--label--delivery--no" htmlFor="main--section--add--product--form--input--delivery--no">Non</label>
                                <input className="main--section--add--product--form--input--delivery--no" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--no" value="main--section--add--product--form--input--delivery--no"/>

                        </fieldset>

                        <button className="main--section--add--product--form--submit" name="main--section--add--product--form--submit" id="main--section--add--product--form--submit">Valider</button>
                    </form>
                </section>

                <aside className="aside aside--error">
                    <span className="aside--error--span">

                    </span>
                </aside>

                <Footer />
            </main>
        );
    }

    if (userContext.user_jwt == "") {

        return redirect("/?prod=false");
    }

}