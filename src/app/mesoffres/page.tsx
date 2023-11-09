"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";
import { FunctionContext, UserContext } from "../layout";
import Footer from "../../../components/Footer/page";

import arrowTop from "../../../public/assets/images/arrow-top.svg";

export default function MyOffers() {

    const Router = useRouter();

    const userContext = useContext(UserContext);
    const functionContext = useContext(FunctionContext);

    const [getOffers, setOffers] = useState<Array<any>>([]);
    const [getOffersCopy, setOffersCopy] = useState<Array<any>>([]);

    console.log(userContext);

    const handleSentClick = async (e: React.FormEvent<EventTarget>) => {

        const receivedButton = document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--received")[0];
        const sentButton = document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--sent")[0];

        receivedButton.classList.remove("active");
        sentButton.classList.remove("active");
        sentButton.classList.add("active");

        const response = await fetch(`http://127.0.0.1:8000/api/getuserofferssent/${userContext.user_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.user_jwt}`
            }
        });

        const responseData = await response.json();
        
        if (responseData.flag == true) {

            setOffers(responseData.getOffersSent);
            setOffersCopy(responseData.getOffersSent);
        }
    };

    const handleReceivedClick = async (e: React.FormEvent<EventTarget>) => {

        const receivedButton = document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--received")[0];
        const sentButton = document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--sent")[0];

        receivedButton.classList.remove("active");
        sentButton.classList.remove("active");
        receivedButton.classList.add("active");

        const response = await fetch(`http://127.0.0.1:8000/api/getuseroffersreceived/${userContext.user_id}`, {

            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.user_jwt}`
            }
        });

        const responseData = await response.json();
        
        if (responseData.flag == true) {

            setOffers(responseData.getOffersReceived);
            setOffersCopy(responseData.getOffersReceived);
        }
    }

    const handleChangeOptionFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        if (e.target.value == "-") {

            setOffers(getOffersCopy);
        }

        else if (e.target.value == "accepted") {

            const filteredAccepted = getOffersCopy.filter( elem => elem.offer_accepted == 1);
            setOffers(filteredAccepted);
        }

        else if (e.target.value == "refused") {

            const filteredRefused = getOffersCopy.filter( elem => elem.offer_accepted == -1);
            setOffers(filteredRefused);
        }

        else if (e.target.value == "in-progress") {

            const filteredInProgress= getOffersCopy.filter( elem => elem.offer_accepted == 0);
            setOffers(filteredInProgress);
        }

        else if (e.target.value == "negotiate") {

            const filteredNegotiate = getOffersCopy.filter( elem => elem.offer_accepted == 2);
            setOffers(filteredNegotiate);
        }
    };

    useEffect(() => {
        const receivedButton = (document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--received")[0] as HTMLButtonElement);
        receivedButton.click();

        window.addEventListener("scroll", () => functionContext.scrollDivArrowAppear(200));
    }, []);

    console.log(getOffers);

    return(
        <main className="main">

            <button className="main--button--back" onClick={() => {Router.back()}}>
                <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                <span className="main--button--back--span">Retour</span>
            </button>

            <section className="main--section--myoffers--display">

                <h2 className="main--section--myoffers--display--h2">
                    Mes offres
                </h2>

                <div className="main--section--myoffers--display--first--div">

                    <button className="main--section--myoffers--display--first--div--anchor--received" onClick={handleReceivedClick}>
                        Reçues
                    </button>

                    <button className="main--section--myoffers--display--first--div--anchor--sent" onClick={handleSentClick}>
                        Envoyées
                    </button>

                </div>

                <section className="main--section--myoffers--display--section--filters">

                    <label htmlFor="main--section--myoffers--display--section--filters--select" className="main--section--myoffers--display--section--filters--label">Filtres: </label>

                    <select name="main--section--myoffers--display--section--filters--select" id="main--section--myoffers--display--section--filters--select" className="main--section--myoffers--display--section--filters--select" onChange={handleChangeOptionFilter}>
                        <option value="-">Toutes</option>
                        <option value="accepted">Acceptées</option>
                        <option value="refused">Refusées</option>
                        <option value="in-progress">En cours</option>
                        <option value="negotiate">En négociation</option>
                    </select>

                </section>

                <ul className="main--section--myoffers--display--ul">

                    {getOffers.map( (elem, ind) => 
                        
                        <Link key={ind} className="main--section--myoffers--display--ul--a" href={`/mesoffres/${elem.offerId}`}>
                        <li className={elem.hasOwnProperty("offer_accepted") && elem.offer_accepted == 1 ? 
                        "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li active--accepted" : 

                        elem.hasOwnProperty("offer_accepted") && elem.offer_accepted == 2 ? 
                        "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li active--negotiate" :

                        elem.hasOwnProperty("offer_accepted") && elem.offer_accepted == -1 ?
                        "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li active--refused" :
                        
                        "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li"}>

                            <span className="main--section--myproducts--display--ul--li--span">
                                {elem.product_name}
                            </span>

                            <div className="main--section--myproducts--display--ul--li--div--img">
                                <Image
                                    className="main--section--myproducts--display--ul--li--img"
                                    src={`http://127.0.0.1:8000/assets/images/${elem.product_photos?.split(',')[0]}`}
                                    alt="small--image--preview"
                                    width={0}
                                    height={0}
                                    unoptimized={true}
                                />
                            </div>

                            <span className="main--section--myoffers--display--ul--li--span--offer">
                                {elem.offer_submitted}€
                            </span>

                        </li>
                        </Link>
                    )}

                </ul>
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