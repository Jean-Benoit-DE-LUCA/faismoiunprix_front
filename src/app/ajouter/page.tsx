"use client"

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { FormEvent, useContext} from "react";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";

import { UserContext } from "../layout";

const handleAddProductSubmit = (e: FormEvent<HTMLFormElement>) => {

    const inputNameProduct = document.getElementsByClassName("main--section--add--product--form--input--name")[0];
    const inputPlaceProduct = document.getElementsByClassName("main--section--add--product--form--input--place")[0];
    const deliveryRadioProduct = document.getElementsByName("main--section--add--product--form--checkbox--delivery");

    e.preventDefault();

    let flag: boolean = false
    let nameClassRadioDelivery: string = "";
    Array.from(deliveryRadioProduct).forEach( (input) => {

        if ((input as HTMLInputElement).checked) {

            flag = true;
            nameClassRadioDelivery = (input as HTMLInputElement).value;
        }
    });

    if ((inputNameProduct as HTMLInputElement).value == "" || (inputPlaceProduct as HTMLInputElement).value == "" || !flag) {

        const asideError = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        spanMessage.textContent = "Veuillez remplir tous les champs";
        asideError.classList.add("active");

        setTimeout(() => {
            asideError.classList.remove("active");
        }, 3000);
    }

};

export default function Add() {

    const userContext = useContext(UserContext);

    if (userContext.user_jwt !== "") {
        return (
            <main className="main">

                <aside className="aside aside--error">
                    <span className="aside--error--span">

                    </span>
                </aside>

                <Link className="main--anchor--back" href="/">
                    <Image className="main--anchor--back--img" src={arrowLeft} alt="arrow-left-image"/>
                    <span className="main--anchor--back--span">Retour</span>
                </Link>
                
                <section className="main--section--add--product main--section--add--product--add--page">
                    <h2 className="main--section--add--product--h2">Ajouter un produit</h2>

                    <form className="main--section--add--product--form" method="POST" onSubmit={handleAddProductSubmit}>

                        <div className="main--section--add--product--form--delivery--yes--wrap">
                            <label className="main--section--add--product--form--label--name" htmlFor="main--section--add--product--form--input--name">Nom du produit:</label>
                            <input className="main--section--add--product--form--input--name" type="text" name="main--section--add--product--form--input--name" id="main--section--add--product--form--input--name"/>
                        </div>

                        <div className="main--section--add--product--form--delivery--no--wrap">
                            <label className="main--section--add--product--form--label--place" htmlFor="main--section--add--product--form--input--place">Lieu:</label>
                            <input className="main--section--add--product--form--input--place" type="text" name="main--section--add--product--form--input--place" id="main--section--add--product--form--input--place"/>
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
            </main>
        );
    }

    if (userContext.user_jwt == "") {

        sessionStorage.setItem("errorAuth", "Veuillez vous authentifier afin d'ajouter un produit");

        return redirect("/");
    }

}