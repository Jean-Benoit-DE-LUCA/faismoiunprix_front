"use client";

import Link from "next/link";
import Image from "next/image";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";

import { SyntheticEvent, useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { FunctionContext, UserContext } from "../layout";
import Footer from "../../../components/Footer/page";

import arrowTop from "../../../public/assets/images/arrow-top.svg";

export default function Signup() {

    const Router = useRouter();

    const userContext = useContext(UserContext);
    const functionContext = useContext(FunctionContext);

    const handleSubmitSignUp = async (e: SyntheticEvent) => {
        e.preventDefault();
        
        const formName = (document.getElementsByClassName("main--section--signup--form--input--name")[0] as HTMLInputElement);
        const formFirstName = (document.getElementsByClassName("main--section--signup--form--input--firstname")[0] as HTMLInputElement);
        const formEmail = (document.getElementsByClassName("main--section--signup--form--input--email")[0] as HTMLInputElement);
        const formAddress = (document.getElementsByClassName("main--section--signup--form--input--address")[0] as HTMLInputElement);
        const formZip = (document.getElementsByClassName("main--section--signup--form--input--zip")[0] as HTMLInputElement);
        const formCity = (document.getElementsByClassName("main--section--signup--form--input--city")[0] as HTMLInputElement);
        const formPhone = (document.getElementsByClassName("main--section--signup--form--input--phone")[0] as HTMLInputElement);
        const formPassword = (document.getElementsByClassName("main--section--signup--form--input--password")[0] as HTMLInputElement);
        const formPasswordConfirm = (document.getElementsByClassName("main--section--signup--form--input--password_confirmation")[0] as HTMLInputElement);

        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        if (formName.value == "" ||
            formFirstName.value == "" ||
            formEmail.value == "" ||
            formAddress.value == "" ||
            formZip.value == "" ||
            formCity.value == "" ||
            formPhone.value == "" ||
            formPassword.value == "" ||
            formPasswordConfirm.value == "") {

            spanMessage.textContent = "Veuillez renseigner tous les champs";
            asideError.classList.add("active_error");

            setTimeout(() => {
                asideError.classList.remove("active_error");
            }, 1400);
            }

        else if (formPassword.value !== formPasswordConfirm.value) {

            spanMessage.textContent = "La confirmation du mot de passe n'est pas valide";
            asideError.classList.add("active_error");

            setTimeout(() => {
                asideError.classList.remove("active_error");
            }, 2000);
        }

        else if (formPassword.value == formPasswordConfirm.value) {

            const response = await fetch('http://127.0.0.1:8000/api/registeruser', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name: formName.value,
                    firstName: formFirstName.value,
                    email: formEmail.value,
                    address: formAddress.value,
                    zip: formZip.value,
                    city: formCity.value,
                    phone: formPhone.value,
                    password: formPassword.value,
                    password_confirmation: formPasswordConfirm.value
                })
            });

            const data = await response.json();

            console.log(data);
            
            if (data.flag == true) {

                spanMessage.textContent = data.message;
                asideError.classList.add("active");

                userContext.setUserData(data.user[0].user_mail, data.user[0].user_name, data.user[0].user_firstname, data.user[0].user_address, data.user[0].user_zip, data.user[0].user_city, data.user[0].user_phone, data.user[0].id, data.user[0].user_role, data.jwt);
    
                setTimeout(() => {
                    asideError.classList.remove("active");
                }, 2000);

                setTimeout(() => {
                    Router.push("/");
                }, 2200);
            }

            else if (data.flag == false) {

                spanMessage.textContent = data.message;
                asideError.classList.add("active_error");
    
                setTimeout(() => {
                    asideError.classList.remove("active_error");
                }, 2000);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", () => functionContext.scrollDivArrowAppear(200));
    }, []);

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

        <section className="main--section--signup--login--connection main--section--signup--connection">

            <h2 className="main--section--add--product--h2">S'inscrire</h2>

            <form onSubmit={handleSubmitSignUp} className="main--section--login--connection--form main--section--signup--form" method="POST" name="main--section--login--connection--form main--section--signup--form">

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--name" htmlFor="main--section--signup--form--input--name">Nom:</label>
                    <input className="main--section--signup--form--input--name" name="main--section--signup--form--input--name" id="main--section--signup--form--input--name"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--firstname" htmlFor="main--section--signup--form--input--firstname">Prénom:</label>
                    <input className="main--section--signup--form--input--firstname" name="main--section--signup--form--input--firstname" id="main--section--signup--form--input--firstname"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--email" htmlFor="main--section--signup--form--input--email">Email:</label>
                    <input className="main--section--signup--form--input--email" name="main--section--signup--form--input--email" id="main--section--signup--form--input--email" type="email"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--address" htmlFor="main--section--signup--form--input--address">Adresse:</label>
                    <input className="main--section--signup--form--input--address" name="main--section--signup--form--input--address" id="main--section--signup--form--input--address"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--zip" htmlFor="main--section--signup--form--input--zip">Code Postal:</label>
                    <input className="main--section--signup--form--input--zip" name="main--section--signup--form--input--zip" id="main--section--signup--form--input--zip" type="number"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--city" htmlFor="main--section--signup--form--input--city">Ville:</label>
                    <input className="main--section--signup--form--input--city" name="main--section--signup--form--input--city" id="main--section--signup--form--input--city" type="text"/>
                </div>

                <div className="main--section--login--connection--form--email--wrap">
                    <label className="main--section--signup--form--label--phone" htmlFor="main--section--signup--form--input--phone">Téléphone:</label>
                    <input className="main--section--signup--form--input--phone" name="main--section--signup--form--input--phone" id="main--section--signup--form--input--phone" type="number"/>
                </div>

                <div className="main--section--login--connection--form--password--wrap">
                    <label className="main--section--signup--form--label--password" htmlFor="main--section--signup--form--input--password">Mot de passe:</label>
                    <input className="main--section--signup--form--input--password" name="main--section--signup--form--input--password" id="main--section--signup--form--input--password" type="password"/>
                </div>

                <div className="main--section--login--connection--form--password--wrap">
                    <label className="main--section--signup--form--label--password_confirmation" htmlFor="main--section--signup--form--input--password_confirmation">Confirmer:</label>
                    <input className="main--section--signup--form--input--password_confirmation" name="main--section--signup--form--input--password_confirmation" id="main--section--signup--form--input--password_confirmation" type="password"/>
                </div>

                <button className="main--section--signup--form--submit--button" type="submit" name="main--section--signup--form--submit--button" id="main--section--signup--form--submit--button">Valider</button>

            </form>

            <Link className="main--section--signup--login--anchor" href="/connexion">
                <button className="main--section--signup--connection--button" type="button" name="main--section--signup--connection--button" id="main--section--signup--connection--button">Connexion</button>
            </Link>

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