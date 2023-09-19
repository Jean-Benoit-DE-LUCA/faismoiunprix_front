"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useContext, useState, useEffect, SyntheticEvent, FormEvent } from "react";

import arrowLeft from "../../../../public/assets/images/arrow-left.svg";

import { DataContext, UserContext } from "../../../app/layout";

export default function OfferId({ params }: {params: {offer_id: string}}) {

    const userContext = useContext(UserContext);
    const dataContext = useContext(DataContext);
    console.log(dataContext);

    const Router = useRouter();

    const [getOffer, setOffer] = useState<Array<any>>([]);
    const [countUpdateOffer, setCountUpdateOffer] = useState<number>(0);

    const [imagesNamesProduct, setImagesNamesProduct] = useState<Array<string|undefined>>([]);
    const [imageName, setImageName] = useState<string|null>("");

    const fetchOffer = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/getoffer/${params.offer_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.user_jwt}`
            }
        })

        const data = await response.json();
        setOffer(data.getOfferId);

        if (data.getOfferId.product_photos !== null) {
            setImagesNamesProduct(data.getOfferId[0].product_photos.split(','));
            setImageName(data.getOfferId[0].product_photos.split(',')[0]);
        }
    };

    const handleClickDivOtherImage = (e: React.FormEvent<EventTarget>) => {

        const anchorMainImage = (document.getElementsByClassName("main--article--specific--product--section--images--div--main--anchor")[0] as HTMLAnchorElement);
        
        setImageName((e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].getAttribute("data-img"));

        (e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].src = anchorMainImage.href;
        (e.currentTarget as HTMLImageElement).getElementsByTagName("img")[0].setAttribute("data-img", anchorMainImage.href.replace("http://127.0.0.1:8000/assets/images/", ""));
    }

    const handleFocusInputNegotiate = (e: React.FormEvent<EventTarget>) => {
        const noRadioInput = (document.getElementsByClassName("main--article--section--offer--received--accept--div--yes--no--div--no--input")[0] as HTMLInputElement);

        noRadioInput.click();
    };

    const handleSubmitAcceptNegotiateOffer = (e: React.FormEvent<EventTarget>) => {

        e.preventDefault();
        
        const yesNoInputRadio = (document.getElementsByName("main--article--section--offer--received--accept--div--yes--no--div--radio") as NodeListOf<HTMLInputElement>);

        const divConfirm = (document.getElementsByClassName("main--article--section--offer--received--confirm--div")[0] as Element);
        const questionSpan = (document.getElementsByClassName("main--article--section--offer--received--confirm--div--span")[0] as Element);

        Array.from(yesNoInputRadio).forEach( (elem) => {
            
            if (elem.checked && elem.value == "yes") {
                
                questionSpan.textContent = `Vous acceptez l'offre de ${getOffer[0].userFirstName} ?`;
                divConfirm.classList.add("active");
            }
        });

        const spanYesConfirm = (document.getElementsByClassName("main--article--section--offer--received--confirm--div--yes--no--span--yes")[0] as Element);
        
        spanYesConfirm.addEventListener("click", handleClickYesConfirm);

    };

    const handleClickYesConfirm = async (e: MouseEventInit) => {

        console.log(getOffer[0].offerProductId);
        console.log(getOffer[0].offerId);

        const divYesNo = (document.getElementsByClassName("main--article--section--offer--received--confirm--div--yes--no")[0] as Element);
        divYesNo.classList.add("active");

        const questionSpan = (document.getElementsByClassName("main--article--section--offer--received--confirm--div--span")[0] as Element);
        questionSpan.textContent = "Offre acceptée!"

        const divConfirm = (document.getElementsByClassName("main--article--section--offer--received--confirm--div")[0] as Element);
        divConfirm.classList.add("active_success");

        const response = await fetch("http://127.0.0.1:8000/api/updateproductofferofferaccepted", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `Bearer ${userContext.user_jwt}`
            },
            body: JSON.stringify({
                product_id: getOffer[0].offerProductId,
                offer_id: getOffer[0].offerId
            })
        });

        const responseData = await response.json();
        
        if (responseData.flag == true) {

            dataContext.setAddProductCount(1);

            setTimeout(() => {
                divConfirm.classList.remove("active", "active_success");
                setCountUpdateOffer(countUpdateOffer + 1);
            }, 2000);
        }
    };

    const handleCloseContactDiv = () => {

        const divContact: Element = document.getElementsByClassName("main--article--section--offer--received--accepted--contact--div ")[0];

        divContact.classList.remove("active");

        
    };

    const handleClickContactUser = (e: SyntheticEvent) => {

        e.preventDefault;
        const divContact: Element = document.getElementsByClassName("main--article--section--offer--received--accepted--contact--div ")[0];

        divContact.classList.add("active");

        const chatContactWrap: Element = document.getElementsByClassName("main--article--section--offer--received--accepted--chat--div")[0];

        chatContactWrap.scrollTop = chatContactWrap.scrollHeight;
    };

    const handleSendMessageContact = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const inputMessage = (document.getElementsByClassName("main--article--section--offer--received--accepted--contact--div--input")[0] as HTMLInputElement);

        if (inputMessage.value != "") {

            insertMessageDiv(
                userContext.user_firstname,
                inputMessage.value,
                new Date().toLocaleString()
            );

            const response = await fetch("http://127.0.0.1:8000/api/insertoffermessage", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${userContext.user_jwt}`
                },
                body: JSON.stringify({
                    offer_id: params.offer_id,
                    username_message: userContext.user_firstname,
                    content_message: inputMessage.value
                })
            });

            inputMessage.value = "";
        }

        else {

           inputMessage.placeholder = "Tapez un message"; 
        }
    };

    const getMessagesConversation = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getoffersmessages/${params.offer_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.user_jwt}`
            }
        });

        const responseData = await response.json();

        if (responseData.messagesByOfferId.length > 0) {

            for (let i = 0; i < responseData.messagesByOfferId.length; i++) {

                insertMessageDiv(
                    responseData.messagesByOfferId[i].username_message,
                    responseData.messagesByOfferId[i].content_message,
                    responseData.messagesByOfferId[i].created_at
                );
            }
        }
    };

    const insertMessageDiv = (username: string, usermessage: string, date: string) => {

        const brElemOne = document.createElement("br");
        const brElemTwo = document.createElement("br");

        const spanUser = document.createElement("span");
        spanUser.setAttribute("class", "main--article--section--offer--received--accepted--chat--div--span--username");
        spanUser.textContent = username + ": ";

        const spanMessage = document.createElement("span");
        spanMessage.setAttribute("class", "main--article--section--offer--received--accepted--chat--div--span--message");
        spanMessage.textContent = usermessage;

        const brElemThree = document.createElement("br");

        const spanDateTime = document.createElement("span");
        spanDateTime.setAttribute("class", "main--article--section--offer--received--accepted--chat--div--span--currentdate");
        spanDateTime.textContent = date;

        const divContactWrap: Element = document.getElementsByClassName("main--article--section--offer--received--accepted--chat--div--span--message--wrap")[0];

        divContactWrap.append(brElemOne);
        divContactWrap.append(brElemTwo);
        divContactWrap.append(spanUser);
        divContactWrap.append(spanMessage);
        divContactWrap.append(brElemThree);
        divContactWrap.append(spanDateTime);

        const chatContactWrap: Element = document.getElementsByClassName("main--article--section--offer--received--accepted--chat--div")[0];

        chatContactWrap.scrollTop = chatContactWrap.scrollHeight;
        
    };

    useEffect(() => {
        fetchOffer();
        getMessagesConversation();
    }, [countUpdateOffer]);

    console.log(getOffer);
    console.log(userContext);

    return (
        <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>

                {getOffer !== null ?
                (
                    <article className="main--article--specific--offer">

                        <h1 className="main--article--specific--product--h1">
                            {getOffer[0] !== undefined ? getOffer[0].product_name : <></>}
                            <span className="main--article--specific--product--h1--span"></span>
                        </h1>

                        {getOffer[0] !== undefined && getOffer[0].product_photos == null ?
                        
                        (
                            <section className="main--article--specific--product--section--images">

                                <div className="main--article--specific--product--section--images--div--main">
                                    <Image
                                        className="main--article--specific--product--section--images--div--main--img"
                                        src="/assets/images/no_image.png"
                                        alt="main-image"
                                        fill
                                        priority={true}
                                        sizes="50px" />
                                </div>
                                <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>

                            </section>
                        ):
                        
                        <section className="main--article--specific--product--section--images">

                            {imageName !== "" ?

                            (
                                <div className="main--article--specific--product--section--images--div--main">
                                    <Link className="main--article--specific--product--section--images--div--main--anchor" href={`http://127.0.0.1:8000/assets/images/${imageName}`} target="_blank">
                                        <Image
                                            className="main--article--specific--product--section--images--div--main--img"
                                            src={`http://127.0.0.1:8000/assets/images/${imageName}`}
                                            unoptimized={true}
                                            alt="main-image"
                                            fill
                                            priority={true}
                                            sizes="50px" />
                                    </Link>
                                </div>
                            ) :

                            <>
                            </>
                            
                            }

                            {getOffer[0] !== undefined && getOffer[0].product_photos.split(',').length >= 2 ?

                                (
                                    <>
                                        <div className="main--article--specific--product--section--images--div--others--wrap">

                                            <div className="main--article--specific--product--section--images--div--others">

                                                {imagesNamesProduct.slice(1).map(elem => 
                                                
                                                <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap"
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
                                ) :

                                <>
                                </>
                            }
                        </section>

                        }

                        {getOffer[0] !== undefined && getOffer[0].product_description !== null ?

                            (
                                <section className="main--article--specific--product--section--description">
                                    <div className="main--article--specific--product--section--description--div--description">
                                        <p className="main--article--specific--product--section--description--div--description--p">
                                            {getOffer[0].product_description}
                                        </p>
                                    </div>
                                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                </section>
                            ) :
                            <>
                            </>

                        }

                        {getOffer[0] !== undefined && getOffer[0].offer_accepted == 0 ?

                            (
                                <section className="main--article--section--offer--received">

                                    <div className="main--article--section--offer--received--confirm--div">
                                        <span className="main--article--section--offer--received--confirm--div--span">Êtes-vous sûr ?</span>
                                        <div className="main--article--section--offer--received--confirm--div--yes--no">
                                            <span className="main--article--section--offer--received--confirm--div--yes--no--span--yes">OUI</span>
                                            <span className="main--article--section--offer--received--confirm--div--yes--no--span--no">NON</span>
                                        </div>
                                    </div>

                                    <span className="main--article--section--offer--received--span">Offre reçue de
                                    <span className="main--article--section--offer--received--span--span">
                                        &nbsp;{getOffer[0].userFirstName}</span>
                                    </span>
                                    
                                    <span className="main--article--section--offer--received--span--number">
                                        {getOffer[0].offer_submitted}€
                                    </span>

                                    <form className="main--article--section--offer--received--form--accept--negotiate" name="main--article--section--offer--received--form--accept--negotiate" onSubmit={handleSubmitAcceptNegotiateOffer}>

                                        <div className="main--article--section--offer--received--accept--div">

                                            <span className="main--article--section--offer--received--accept--div--span">
                                                Accepter ?
                                            </span>

                                            <div className="main--article--section--offer--received--accept--div--yes--no--div">
                                                
                                                <input className="main--article--section--offer--received--accept--div--yes--no--div--yes--input" type="radio" name="main--article--section--offer--received--accept--div--yes--no--div--radio" id="main--article--section--offer--received--accept--div--yes--no--div--yes--input" value="yes"/>

                                                <label htmlFor="main--article--section--offer--received--accept--div--yes--no--div--yes--input" className="main--article--section--offer--received--accept--div--yes--no--div--yes--label">
                                                    OUI
                                                </label>
                                                
                                                <input className="main--article--section--offer--received--accept--div--yes--no--div--no--input" type="radio" name="main--article--section--offer--received--accept--div--yes--no--div--radio" id="main--article--section--offer--received--accept--div--yes--no--div--no--input" value="no"/>

                                                <label htmlFor="main--article--section--offer--received--accept--div--yes--no--div--no--input" className="main--article--section--offer--received--accept--div--yes--no--div--no--label">
                                                    NON
                                                </label>

                                            </div>

                                        </div>

                                        <div className="main--article--section--offer--received--accept--div--negotiate--div">
                                                
                                            <span className="main--article--section--offer--received--accept--div--span">
                                                Négocier ?
                                            </span> 

                                            <input className="main--article--section--offer--received--accept--div--negotiate--div--input" type="number" name="main--article--section--offer--received--accept--div--negotiate--div--input" id="main--article--section--offer--received--accept--div--negotiate--div--input" onFocus={handleFocusInputNegotiate}/>

                                        </div>

                                        <button type="submit" className="main--article--section--offer--received--form--accept--negotiate--button--submit">Valider</button>

                                    </form>

                                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                </section>
                            ) :
                                
                                <section className="main--article--section--offer--received--accepted">
                                    
                                    
                                    <div className="main--article--section--offer--received--accepted--contact--div">


                                        <form className="main--article--section--offer--received--accepted--contact--div--form" name="main--article--section--offer--received--accepted--contact--div--form" onSubmit={handleSendMessageContact}>

                                            <div className="main--article--section--offer--received--accepted--contact--div--h3--wrap">
                                                <h3 className="main--article--section--offer--received--accepted--contact--div--h3">
                                                    Discussion
                                                </h3>
                                                <span className="cross--span" onClick={handleCloseContactDiv}>x</span>
                                            </div>

                                            <div className="main--article--section--offer--received--accepted--chat--div">

                                                <div className="main--article--section--offer--received--accepted--chat--div--span--message--wrap">
                                                    
                                                        {/*<br/><br/>
                                                        <span className="main--article--section--offer--received--accepted--chat--div--span--username">Jean-Benoit: </span>
                                                        <span className="main--article--section--offer--received--accepted--chat--div--span--message">Coucou la forme, je vous contacte au sujet de l'offre que vous m'avez faites</span>
                                                        <br/>
                                                        <span className="main--article--section--offer--received--accepted--chat--div--span--currentdate">
                                                            {new Date().toLocaleString()}
                                                        </span>*/}
                                                </div>

                                            </div>

                                            <input type="text" className="main--article--section--offer--received--accepted--contact--div--input" id="main--article--section--offer--received--accepted--contact--div--input" name="main--article--section--offer--received--accepted--contact--div--input"/>

                                            <button type="submit" className="main--article--section--offer--received--accepted--contact--div--button" id="main--article--section--offer--received--accepted--contact--div--button" name="main--article--section--offer--received--accepted--contact--div--button">Envoyer</button>

                                        </form>

                                    </div>
                                    
                                    <span className="main--article--section--offer--received--accepted--span">
                                        Offre de {getOffer[0] !== undefined  && getOffer[0].userFirstName !== undefined ? getOffer[0].userFirstName : ""} d'un montant de {getOffer[0] !== undefined  && getOffer[0].offer_submitted !== undefined ? getOffer[0].offer_submitted : ""}€ acceptée
                                    </span>

                                    <button type="button" className="main--article--section--offer--received--accepted--button" name="main--article--section--offer--received--accepted--button" onClick={handleClickContactUser}>Contacter {getOffer[0] !== undefined  && getOffer[0].userFirstName !== undefined ? getOffer[0].userFirstName : ""}</button>

                                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                </section>

                        }

                    </article>
                        
                ):
                <>
                </>
                }

        </main>
    );
}