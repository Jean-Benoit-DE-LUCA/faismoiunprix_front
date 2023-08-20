"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ReactElement, useState, useContext, useEffect } from "react";
import { SyntheticEvent } from "react";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";

import { DataContext, UserContext } from "../layout";

export interface IUserData {
    user_mail: string;
    user_name: string;
    user_jwt: string;
    setUserData: any
}

export default function Connection(): ReactElement {

    const Router = useRouter();

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const handleSubmitLogin = (e: SyntheticEvent) => {
        e.preventDefault();

        const mailInput = (document.getElementsByClassName("main--section--login--connection--form--input--email")[0] as HTMLInputElement);
        const passwordInput = (document.getElementsByClassName("main--section--login--connection--form--input--password")[0] as HTMLInputElement);

        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        if (mailInput.value.length == 0 || passwordInput.value.length == 0) {

            spanMessage.textContent = "Veuillez renseigner tous les champs";
            asideError.classList.add("active");

            setTimeout(() => {
                asideError.classList.remove("active");
            }, 1400);
        }

        else {

            const user_mail = mailInput.value;
            const user_password = passwordInput.value;

            fetchUser(user_mail, user_password);
        }
    };

    const fetchUser = async (user_mail: string, user_password: string) => {
        const response: Response = await fetch(`http://127.0.0.1:8000/api/getuser/${user_mail}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                user_password: user_password,
            })
        });

        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        const data = await response.json();
        
        if (data.hasOwnProperty("jwt")) {
            userContext.setUserData(user_mail, data.user_name, data.jwt);
            spanMessage.textContent = "Authentification réalisée avec succès";
            asideError.classList.add("aside--success", "active_success");

            setTimeout(() => {
                asideError.classList.remove("aside--success", "active_success");
            }, 1400);

            setTimeout(() => {
                Router.push("/");
            }, 1600);
        }

        if (data.hasOwnProperty("userFound") || data.hasOwnProperty("userPass")) {

            if (data.hasOwnProperty("userFound")) {
                spanMessage.textContent = "Utilisateur non enregistré";
            }

            if (data.hasOwnProperty("userPass")) {
                spanMessage.textContent = "Mot de passe non valide";
            }

            asideError.classList.add("active");
            setTimeout(() => {
                asideError.classList.remove("active");
            }, 1400);
        }
    };

    return (
        <main className="main">

            <Link className="main--anchor--back" href="/">
                <Image className="main--anchor--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--anchor--back--span">Retour</span>
            </Link>

            <aside className="aside aside--error">
                <span className="aside--error--span">

                </span>
            </aside>

            <section className="main--section--signup--login--connection">

                <h2 className="main--section--add--product--h2">S'authentifier</h2>

                <form onSubmit={handleSubmitLogin} className="main--section--login--connection--form" method="POST">

                    <div className="main--section--login--connection--form--email--wrap">
                        <label className="main--section--login--connection--form--label--email" htmlFor="main--section--login--connection--form--input--email">Email:</label>
                        <input className="main--section--login--connection--form--input--email" name="main--section--login--connection--form--input--email" id="main--section--login--connection--form--input--email"/>
                    </div>

                    <div className="main--section--login--connection--form--password--wrap">
                        <label className="main--section--login--connection--form--label--password" htmlFor="main--section--login--connection--form--input--password">Mot de passe:</label>
                        <input className="main--section--login--connection--form--input--password" name="main--section--login--connection--form--input--password" id="main--section--login--connection--form--input--password"/>
                    </div>

                    <button className="main--section--login--connection--form--submit" type="submit" name="main--section--login--connection--form--submit" id="main--section--login--connection--form--submit">Valider</button>

                </form>
            </section>
        </main>
    );
}