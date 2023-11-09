"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";
import { FormEvent } from "react";
import Footer from "../../../components/Footer/page";

export default function Contact() {

    const Router = useRouter();

    const handleSubmitMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const lastName = (document.getElementsByClassName("main--section--contact--form--input--lastname")[0] as HTMLInputElement);
        const firstName = (document.getElementsByClassName("main--section--contact--form--input--firstname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("main--section--contact--form--input--email")[0] as HTMLInputElement);
        const message = (document.getElementsByClassName("main--section--contact--form--textarea--message")[0] as HTMLTextAreaElement);

        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        if (lastName.value == "" || firstName.value == "" || email.value == "" || message.value == "") {
            
            spanMessage.textContent = "Veuillez renseigner tous les champs";
            asideError.classList.add("active_error");

            setTimeout(() => {
                asideError.classList.remove("active_error");
            }, 2500);
        }

        else {
            
            const response = await fetch("http://127.0.0.1:8000/api/sendcontactmail/", {

                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    lastName: lastName.value,
                    firstName: firstName.value,
                    email: email.value,
                    message: message.value
                })
            });

            const responseData = await response.json();
            
            if (responseData.hasOwnProperty("success")) {
                
                spanMessage.textContent = "Message envoyé avec succès";
                asideError.classList.add("active");

                setTimeout(() => {
                    asideError.classList.remove("active");
                }, 2500);
            }

            else {

                spanMessage.textContent = "Erreur lors de l'envoi du message";
                asideError.classList.add("active_error");

                setTimeout(() => {
                    asideError.classList.remove("active_error");
                }, 2500);
            }
        }

    };

    return (
        <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>

            <aside className="aside aside--error aside--translate">
                <span className="aside--error--span">

                </span>
            </aside>

            <section className="main--section--contact">

                <h2 className="main--section--add--product--h2">Contact</h2>

                <form className="main--section--contact--form" method="POST" onSubmit={handleSubmitMessage}>

                    <div className="main--section--contact--form--div--wrap">
                        <label htmlFor="main--section--contact--form--input--lastname" className="main--section--contact--form--label--lastname">
                            Nom:
                        </label>
                        <input type="text" className="main--section--contact--form--input--lastname" name="main--section--contact--form--input--lastname" id="main--section--contact--form--input--lastname"/>
                    </div>

                    <div className="main--section--contact--form--div--wrap">
                        <label htmlFor="main--section--contact--form--input--firstname" className="main--section--contact--form--label--firstname">
                            Prénom:
                        </label>
                        <input type="text" className="main--section--contact--form--input--firstname" name="main--section--contact--form--input--firstname" id="main--section--contact--form--input--firstname"/>
                    </div>

                    <div className="main--section--contact--form--div--wrap">
                        <label htmlFor="main--section--contact--form--input--email" className="main--section--contact--form--label--email">
                            Email:
                        </label>
                        <input type="email" className="main--section--contact--form--input--email" name="main--section--contact--form--input--email" id="main--section--contact--form--input--email"/>
                    </div>

                    <div className="main--section--contact--form--div--wrap">
                        <label htmlFor="main--section--contact--form--textarea--message" className="main--section--contact--form--textarea--label">
                            Message:
                        </label>
                        <textarea className="main--section--contact--form--textarea--message" name="main--section--contact--form--textarea--message" id="main--section--contact--form--textarea--message">
                            
                        </textarea>
                    </div>

                    <button type="submit" className="main--section--contact--form--button--submit" name="main--section--contact--form--button--submit">Envoyer</button>
                </form>
            </section>

            <Footer />
        </main>
    );
}