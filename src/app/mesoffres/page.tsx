"use client";

import { useContext, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import arrowLeft from "../../../public/assets/images/arrow-left.svg";
import { UserContext } from "../layout";

export default function MyOffers() {

    const Router = useRouter();

    const userContext = useContext(UserContext);

    const [getOffers, setOffers] = useState<Array<any>>([]);

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
        }

        /*const response = await fetch(`http://127.0.0.1:8000/api/getuserofferssent/${userContext.user_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${userContext.user_jwt}`
            }
        });

        const responseData = await response.json();
        
        if (responseData.flag == true) {

            setOffers(responseData.getOffersSent);
        }*/
    }

    useEffect(() => {
        const receivedButton = (document.getElementsByClassName("main--section--myoffers--display--first--div--anchor--received")[0] as HTMLButtonElement);
        receivedButton.click();
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

                <ul className="main--section--myoffers--display--ul">

                    {getOffers.map( (elem, ind) => 
                        
                        <Link key={ind} className="main--section--myoffers--display--ul--a" href={`/mesoffres/${elem.offerId}`}>
                        <li className={elem.hasOwnProperty("offer_accepted") && elem.offer_accepted == 1 ? "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li active--accepted" : "main--section--myproducts--display--ul--li main--section--myoffers--display--ul--li"}>

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
        </main>
    );
}