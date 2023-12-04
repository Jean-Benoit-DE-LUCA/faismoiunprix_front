"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";
import arrowTop from "../../../public/assets/images/arrow-top.svg";
import Footer from "../../../components/Footer/page";
import { useContext, useEffect, useState } from "react";
import { FunctionContext, UserContext } from "../layout";
import { IUserData } from "../connexion/page";

export default function Profile() {

    const Router = useRouter();

    const functionContext = useContext(FunctionContext);
    const userContext = useContext(UserContext);

    const [getValue, setValue] = useState<IUserData>({
        user_mail: userContext.user_mail,
        user_name: userContext.user_name,
        user_firstname: userContext.user_firstname,
        user_address: userContext.user_address,
        user_zip: userContext.user_zip,
        user_city: userContext.user_city,
        user_phone: userContext.user_phone,
        user_id: userContext.user_id,
        user_role: userContext.user_role,
        user_jwt: userContext.user_jwt,
        setUserData: userContext.setUserData
    });

    const handleChangeValueProfile = (nameValue: string, e: React.ChangeEvent<HTMLInputElement>) => {

        const newObj = Object.assign({}, getValue);
        (newObj as any)[nameValue] = e.target.value;
        setValue(newObj);
    };

    const handleClickSpanPlaceHolder = (e: React.MouseEvent<HTMLSpanElement>) => {
        const inputPassword = (document.getElementsByClassName("main--section--signup--form--input--password")[0] as HTMLInputElement);

        e.currentTarget.classList.add("active");
        inputPassword.focus();
    };

    const handleSubmitUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        
        const formName = (document.getElementsByClassName("main--section--signup--form--input--name")[0] as HTMLInputElement);
        const formFirstName = (document.getElementsByClassName("main--section--signup--form--input--firstname")[0] as HTMLInputElement);
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
            formAddress.value == "" ||
            formZip.value == "" ||
            formCity.value == "" ||
            formPhone.value == "" ||
            formPassword.value == "" ||
            formPasswordConfirm.value == "")

            {
                spanMessage.textContent = "Veuillez renseigner tous les champs";
                asideError.classList.add("active_error");

                setTimeout(() => {
                    asideError.classList.remove("active_error");
                }, 2500);
                
            }

        else if (formPassword.value !== formPasswordConfirm.value) {

            spanMessage.textContent = "Les mots de passe ne coincident pas";
            asideError.classList.add("active_error");

            setTimeout(() => {
                asideError.classList.remove("active_error");
            }, 2500);
        }

        else {

            const response = await fetch(`http://127.0.0.1:8000/api/updateuser/${userContext.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: formName.value,
                    firstName: formFirstName.value,
                    address: formAddress.value,
                    zip: formZip.value,
                    city: formCity.value,
                    phone: formPhone.value,
                    password: formPassword.value
                })
            })

            const responseData = await response.json();

            if (responseData.flag) {

                spanMessage.textContent = "Profil modifié avec succès";
                asideError.classList.add("active");

                setTimeout(() => {
                    asideError.classList.remove("active");
                    Router.push('/');
                }, 2500);
            }

            else if (!responseData.flag) {

                spanMessage.textContent = "Erreur durant le processus de modification";
                asideError.classList.add("active_error");

                setTimeout(() => {
                    asideError.classList.remove("active_error");
                }, 2500);
            }
        }
    };

    useEffect(() => {
            window.addEventListener("scroll", () => functionContext.scrollDivArrowAppear(200));
            console.log(getValue);
    }, [getValue])

    if (userContext.user_jwt !== "") {

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
    
                <section className="main--section--signup--login--connection main--section--signup--connection main--section--profile">
                    <h2 className="main--section--myproducts--display--h2">Profil</h2>
    
                    <form className="main--section--form--profile" name="main--section--form--profile" method="POST" onSubmit={handleSubmitUpdateProfile}>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--name" htmlFor="main--section--signup--form--input--name">Nom:</label>
                            <input className="main--section--signup--form--input--name" name="main--section--signup--form--input--name" id="main--section--signup--form--input--name" onChange={(e) => handleChangeValueProfile("user_name", e)} value={getValue.user_name}/>
                        </div>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--firstname" htmlFor="main--section--signup--form--input--firstname">Prénom:</label>
                            <input className="main--section--signup--form--input--firstname" name="main--section--signup--form--input--firstname" id="main--section--signup--form--input--firstname" onChange={(e) => handleChangeValueProfile("user_firstname", e)} value={getValue.user_firstname}/>
                        </div>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--address" htmlFor="main--section--signup--form--input--address">Adresse:</label>
                            <input className="main--section--signup--form--input--address" name="main--section--signup--form--input--address" id="main--section--signup--form--input--address" onChange={(e) => handleChangeValueProfile("user_address", e)} value={getValue.user_address}/>
                        </div>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--zip" htmlFor="main--section--signup--form--input--zip">Code Postal:</label>
                            <input className="main--section--signup--form--input--zip" name="main--section--signup--form--input--zip" id="main--section--signup--form--input--zip" type="number" onChange={(e) => handleChangeValueProfile("user_zip", e)} value={getValue.user_zip}/>
                        </div>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--city" htmlFor="main--section--signup--form--input--city">Ville:</label>
                            <input className="main--section--signup--form--input--city" name="main--section--signup--form--input--city" id="main--section--signup--form--input--city" type="text" onChange={(e) => handleChangeValueProfile("user_city", e)} value={getValue.user_city}/>
                        </div>
    
                        <div className="main--section--login--connection--form--email--wrap">
                            <label className="main--section--signup--form--label--phone" htmlFor="main--section--signup--form--input--phone">Téléphone:</label>
                            <input className="main--section--signup--form--input--phone" name="main--section--signup--form--input--phone" id="main--section--signup--form--input--phone" type="number" onChange={(e) => handleChangeValueProfile("user_phone", e)} value={getValue.user_phone}/>
                        </div>
    
                        <div className="main--section--login--connection--form--password--wrap">
                            <label className="main--section--signup--form--label--password" htmlFor="main--section--signup--form--input--password">Mot de passe:</label>
                            <div className="main--section--login--connection--form--password--wrap--input--wrap">
                                <input className="main--section--signup--form--input--password" name="main--section--signup--form--input--password" id="main--section--signup--form--input--password" type="password"/>
                                
                                <div className="main--section--login--connection--form--password--wrap--input--wrap--span--wrap" onClick={handleClickSpanPlaceHolder}>
                                    <span className="main--section--login--connection--form--password--wrap--input--wrap--span" onClick={handleClickSpanPlaceHolder}>Entrez votre mot de passe habituel ou saisissez un nouveau mot de passe</span>
                                </div>
                            </div>
                        </div>
    
                        <div className="main--section--login--connection--form--password--wrap">
                            <label className="main--section--signup--form--label--password_confirmation" htmlFor="main--section--signup--form--input--password_confirmation">Confirmer:</label>
                            <input className="main--section--signup--form--input--password_confirmation" name="main--section--signup--form--input--password_confirmation" id="main--section--signup--form--input--password_confirmation" type="password"/>
                        </div>
    
                        <button className="main--section--signup--form--submit--button form--submit--button--profile" type="submit" name="main--section--signup--form--submit--button" id="main--section--signup--form--submit--button">Modifier</button>
    
                    </form>
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

    else if (userContext.user_jwt == "") {

        return redirect("/?prof=false");
    }
}