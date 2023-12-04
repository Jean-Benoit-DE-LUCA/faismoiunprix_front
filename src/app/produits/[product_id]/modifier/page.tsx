"use client";

import arrowLeft from "../../../../../public/assets/images/arrow-left.svg";

import Image from "next/image";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";

import { DataContext, UserContext } from "@/app/layout";
import { useEffect, useContext, useState, Fragment } from "react"

import { Product } from "@/app/layout";
import Footer from "../../../../../components/Footer/page";

export interface ISpecificProduct {
    productFound: Array<Product>;
};

export default function ProductId({ params }: { params: {product_id: string}}) {

    const Router = useRouter();

    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [getProduct, setGetProduct] = useState<ISpecificProduct>({productFound: []});
    const [getCity, setCity] = useState<string>("");

    const [imagesNamesProduct, setImagesNamesProduct] = useState<Array<string|undefined>>([]);
    const [imageName, setImageName] = useState<string|null>("");

    const [arrayClassNumber, setArrayClassNumber] = useState<Array<number>>([]);


    const fetchProduct = async () => {

        const response = await fetch(`http://127.0.0.1:8000/api/getproducts/${params.product_id}`)
        const data = await response.json();
        dataContext.setProduct(data);
        setGetProduct(data);
        setCity(data.productFound[0].product_place);

        if (data.productFound[0].product_photos !== null) {
            setImagesNamesProduct(data.productFound[0].product_photos.split(','));
            setImageName("http://127.0.0.1:8000/assets/images/" + data.productFound[0].product_photos.split(',')[0]);


            let startNum = data.productFound[0].product_photos.split(',').length;
            const newArray = [];

            for (startNum; startNum < 3; startNum++) {

                newArray.push(startNum);
            }

            setArrayClassNumber(newArray);
            
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
        const mainImage = anchorMainImage.getElementsByTagName("img")[0];


        // STOCK CURRENT MAIN INPUT FILE && CURRENT OTHER CLICKED INPUT FILE //
        let mainCurrentInputFileTemp = (anchorMainImage.parentElement?.getElementsByClassName("input--0")[0] as HTMLInputElement).files;
        
        let otherImageClickedInputFileTemp = (e.currentTarget as any).parentElement.getElementsByClassName("input--file--new--picture")[0].files;



        // STOCK CURRENT MAIN IMG SRC //
        const mainCurrentImage = anchorMainImage.href;



        // OTHER IMG CLICKED PROPERTIES TO MAIN IMAGE //
        mainImage.src = (e.currentTarget as HTMLDivElement).getElementsByTagName("img")[0].getAttribute("data-img") as string;
        mainImage.setAttribute("data-img", (e.currentTarget as HTMLDivElement).getElementsByTagName("img")[0].getAttribute("data-img") as string);
        anchorMainImage.href = (e.currentTarget as HTMLDivElement).getElementsByTagName("img")[0].getAttribute("data-img") as string;


        // SWITCH INPUT FILES //
        (anchorMainImage?.parentElement?.getElementsByClassName("input--0")[0] as HTMLInputElement).files = otherImageClickedInputFileTemp;

        (((e.currentTarget as HTMLDivElement).parentElement as HTMLElement).getElementsByClassName("input--file--new--picture")[0] as HTMLInputElement).files = mainCurrentInputFileTemp;



        // MAIN IMG PROPERTIES TO OTHER IMAGE CLICKED //
        const otherImageClicked = (e.currentTarget as HTMLDivElement).getElementsByTagName("img")[0];
        otherImageClicked.src = mainCurrentImage;
        otherImageClicked.setAttribute("data-img", mainCurrentImage);

    }

    const handleClickCrossDelete = (e: React.MouseEvent<HTMLElement>) => {

        const currentInputFile = e.currentTarget.parentElement?.getElementsByTagName("input")[0];
        if (currentInputFile !== undefined) {
            currentInputFile.value = "";
        }
        
        const currentImg = (e.currentTarget.parentElement?.getElementsByTagName("img")[0] as HTMLImageElement);
        
        currentImg.src = "http://localhost:3000/assets/images/no_image.png"
        currentImg.setAttribute("data-img", "http://localhost:3000/assets/images/no_image.png");

        if (currentImg.parentElement?.tagName == "A") {

            const anchorCurrentImg = (currentImg.parentElement as HTMLAnchorElement);
            anchorCurrentImg.href = "http://localhost:3000/assets/images/no_image.png";
        }
    };

    const handleClickEditButton = (e: React.MouseEvent<HTMLHeadingElement>, element: string) => {

        if (element == "title") {

            const hElement = (e.currentTarget.parentElement as HTMLHeadingElement);
            const divInputNewTitle = (document.getElementsByClassName("title--update--product--input--div--wrap")[0] as HTMLDivElement);

            divInputNewTitle.classList.add("active");
            hElement.classList.add("active");
        }

        else if (element == "description") {

            const pElementDescription = (document.getElementsByClassName("main--article--specific--product--section--description--div--description--p update--description--element")[0] as HTMLParagraphElement);

            const textAreaElement = (document.getElementsByClassName("update--textarea--description--element")[0] as HTMLTextAreaElement);

            const editElement = (document.getElementsByClassName("title--update--product--img--wrap edit--description")[0]);
            const checkElement = (document.getElementsByClassName("title--update--product--input--check--button check--description")[0]);

            editElement.classList.add("active");
            checkElement.classList.add("active");
            pElementDescription.classList.add("active");
            textAreaElement.classList.add("active");


        }

    };

    const handleClickConfirmNew = (e: React.MouseEvent<HTMLDivElement>, element: string) => {

        if (element == "title") {
            const hElement = (document.getElementsByClassName("main--article--specific--product--h1 title--update--product")[0] as HTMLHeadingElement);
            const divInputNewTitle = (document.getElementsByClassName("title--update--product--input--div--wrap")[0] as HTMLDivElement);

            divInputNewTitle.classList.remove("active");
            hElement.classList.remove("active");

            const inputElementNewTitle = (document.getElementsByClassName("title--update--product--input")[0] as HTMLInputElement);

            const hElementSpanElement = (document.getElementsByClassName("title--update--product--span--title")[0] as HTMLSpanElement);
            hElementSpanElement.textContent = inputElementNewTitle.value;
        }
        
        else if (element == "description") {

            const pElementDescription = (document.getElementsByClassName("main--article--specific--product--section--description--div--description--p update--description--element")[0] as HTMLParagraphElement);

            const textAreaElement = (document.getElementsByClassName("update--textarea--description--element")[0] as HTMLTextAreaElement);

            const editElement = (document.getElementsByClassName("title--update--product--img--wrap edit--description")[0]);
            const checkElement = (document.getElementsByClassName("title--update--product--input--check--button check--description")[0]);

            pElementDescription.textContent = textAreaElement.value;

            editElement.classList.remove("active");
            checkElement.classList.remove("active");
            pElementDescription.classList.remove("active");
            textAreaElement.classList.remove("active");
        }
    };

    const handleChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        let currentImage = (e.currentTarget.parentElement?.parentElement?.getElementsByTagName("img")[0] as HTMLImageElement);

        if (e.currentTarget.classList.contains("img--0")) {

            currentImage = (document.getElementsByClassName("main--article--specific--product--section--images--div--main--img img--0")[0] as HTMLImageElement);
        }

        const fileReader = new FileReader();
        fileReader.onload = (e) => {

            currentImage.src = e.target?.result as string;
            currentImage.setAttribute("data-img", e.target?.result as string);

            if (currentImage.parentElement?.tagName == "A") {

                (currentImage.parentElement as HTMLAnchorElement).href = e.target?.result as string;
            }
        }

        fileReader.readAsDataURL((e.target as any).files[0]);
    };

    const handleClickMainImage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        
        if (e.currentTarget.href.startsWith("data")) {

            e.preventDefault();
            let newWindow = window.open();
            newWindow?.document.write(`<iframe src=${e.currentTarget.href} style="border: 0; width: 100%; height: 100%;" </iframe>`);
        }
    };

    const handleSubmitUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // GET NEW TITLE //

        const spanNewTitle = (document.getElementsByClassName("title--update--product--span--title")[0] as HTMLSpanElement);



        // GET NEW DESCRIPTION //

        const pNewContent = (document.getElementsByClassName("main--article--specific--product--section--description--div--description--p update--description--element")[0] as HTMLParagraphElement);



        // GET NEW PLACE //

        const inputPlace = (document.getElementsByClassName("main--section--add--product--form--input--place")[0] as HTMLInputElement);



        // GET DELIVERY OPTION YES / NO //


        const deliveryInputsRadio = (document.getElementsByName("main--section--add--product--form--checkbox--delivery"));
        
        let deliveryFlag = false;

        for (let i = 0; i < deliveryInputsRadio.length; i++) {

            if ((deliveryInputsRadio[i] as HTMLInputElement).checked) {
                
                if (deliveryInputsRadio[i].classList.value.includes("delivery--yes")) {

                    deliveryFlag = true;
                }
            }
        }



        // GET FILES NAMES ORDERED //

        const objectFilesNames = {};

        const img0 = (document.getElementsByClassName("img--0")[0]);
        const othersImgs = (document.getElementsByClassName("main--article--specific--product--section--images--div--others--grid--element--img") as HTMLCollectionOf<HTMLDivElement>);

        Object.defineProperty(objectFilesNames, 0, {
            value: img0.getAttribute("data-img"),
            writable: true,
            enumerable: true
        });

        for (let i = 0; i < othersImgs.length; i++) {

            Object.defineProperty(objectFilesNames, i+1, {
                value: othersImgs[i].getAttribute("data-img"),
                writable: true,
                enumerable: true
            });
        }




        // CREATE FORMDATA OBJECT WITH NEW PICTURES //
        
        const inputFiles = (document.getElementsByClassName("input--file--new--picture"));

        const formData = new FormData();

        for (let i = 0; i < inputFiles.length; i++) {

            if ((inputFiles[i] as any).files[0] !== undefined) {

                formData.append((inputFiles[i] as any).files[0].name + `_inp_${inputFiles[i].classList[1]}`, (inputFiles[i] as any).files[0]);
            }

        }

        


        // ADD ORDERED PICTURE NAMES TO FORMDATA //

        for (const [key, value] of Object.entries(objectFilesNames)) {

            formData.append(`_inp_input--${key}`, value as string);
        }




        // ADD OTHERS PROPERTIES TO UPDATE //

        formData.append("product_name", spanNewTitle.textContent as string);
        formData.append("product_description", pNewContent.textContent as string);
        formData.append("product_place", inputPlace.value);
        formData.append("product_delivery", deliveryFlag.toString());

        // -- //


        const response = await fetch(`http://127.0.0.1:8000/api/updateproduct/${params.product_id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userContext.user_jwt}`
            },
            body: formData
        });

        const responseData = await response.json();

        const asideError: Element = document.getElementsByClassName("aside aside--error")[0];
        const spanMessage: Element = asideError.getElementsByClassName("aside--error--span")[0];

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (responseData.hasOwnProperty('flag')) {

            if (responseData.flag) {

                spanMessage.textContent = "Modification effectuée avec succès";
                asideError.classList.add("aside--success", "active_success");
    
                setTimeout(() => {
                    asideError.classList.remove("aside--success", "active_success");
                }, 3000);
            }
    
            else if (!responseData.flag) {
    
                spanMessage.textContent = "Erreur lors de la modification du produit";
                asideError.classList.add("active");
    
                setTimeout(() => {
                    asideError.classList.remove("active");
                }, 3000);
            }
        }

        else if (responseData.hasOwnProperty('error')) {

            if (responseData.error.startsWith('Erreur d\'authentification')) {

                spanMessage.textContent = responseData.error;
                asideError.classList.add("active");
    
                setTimeout(() => {
                    asideError.classList.remove("active");
                }, 3000);
            }
        }

    };

    const handleClickOutsideDiv = (e: any) => {

        document.removeEventListener("click", handleClickOutsideDiv);

        const h1Element = (document.getElementsByClassName("main--article--specific--product--h1 title--update--product")[0] as HTMLHeadingElement);
        const divInputWrap = (document.getElementsByClassName("title--update--product--input--div--wrap")[0] as HTMLDivElement);
        const inputNewTitle = (document.getElementsByClassName("title--update--product--input")[0] as HTMLInputElement);

        const textAreaElement = (document.getElementsByClassName("update--textarea--description--element")[0] as HTMLTextAreaElement);
        const pElementDescription = (document.getElementsByClassName("main--article--specific--product--section--description--div--description--p")[0] as HTMLParagraphElement);
        const divEditImgWrapDescription = (document.getElementsByClassName("title--update--product--img--wrap edit--description")[0] as HTMLDivElement);
        const tickButtonDescription = (document.getElementsByClassName("title--update--product--input--check--button check--description")[0] as HTMLDivElement);

        const editImgs = (document.getElementsByClassName("title--update--product--img") as HTMLCollectionOf<HTMLImageElement>);


        if (h1Element !== undefined) {

            if (h1Element.classList.contains("active")) {

                if (e.target == inputNewTitle) {
    
                    inputNewTitle.focus();
                }
    
                else if (e.target !== editImgs[0]) {
    
                    if (h1Element.classList.contains("active")) {
        
                        h1Element.classList.remove("active");
                        divInputWrap.classList.remove("active");
                    }
                }

                else if (e.target == editImgs[0]) {

                    textAreaElement.classList.remove("active");
                    pElementDescription.classList.remove("active");
                    divEditImgWrapDescription.classList.remove("active");
                    tickButtonDescription.classList.remove("active");
                }
            }




            else if (textAreaElement.classList.contains("active")) {

                if (e.target == textAreaElement) {

                    textAreaElement.focus();
                }

                else if (e.target !== editImgs[1]) {

                    if (textAreaElement.classList.contains("active")) {

                        textAreaElement.classList.remove("active");
                        pElementDescription.classList.remove("active");
                        divEditImgWrapDescription.classList.remove("active");
                        tickButtonDescription.classList.remove("active");
                    }
                }
            }
        }

        document.addEventListener("click", handleClickOutsideDiv);
    }

    useEffect(() => {
        fetchProduct();

        document.addEventListener("click", handleClickOutsideDiv);
    }, []);



    if (dataContext.getProduct.productFound !== undefined && userContext.user_id == dataContext.getProduct.productFound[0].user_id) {

        return (
            <main className="main">
    
                <button className="main--button--back" onClick={() => {Router.back()}}>
                    <Image className="main--button--back--img" src={arrowLeft} alt="arrow-left-image"/>
                    <span className="main--button--back--span">Retour</span>
                </button>
    
                <aside className="aside aside--error">
                    <span className="aside--error--span">
    
                    </span>
                </aside>
    
                {getProduct.productFound[0] !== undefined ?
                
                (
                <article className="main--article--specific--product">
    
                    {userContext.user_id == getProduct.productFound[0].user_id ?
    
                        <span className="main--article--specific--product--update--title">Modifier votre annonce</span>
    
                    :
    
                        <>
                        </>
                    }
                    <form method="POST" className="form--update--product" name="form--update--product" id="form--update--product" onSubmit={handleSubmitUpdateProduct}>
                    
                        <h1 className="main--article--specific--product--h1 title--update--product">
                            
                                <span className="title--update--product--span--title">{getProduct.productFound[0].product_name}</span>
                                
                                <div className="title--update--product--img--wrap" onClick={(e) => handleClickEditButton(e, "title")}>
                                    <Image
                                        className="title--update--product--img"
                                        src="/assets/images/edit-icon.svg"
                                        alt="edit-icon"
                                        height={0}
                                        width={0}
                                    />
                                </div>
                            
                            
                            <span className="main--article--specific--product--h1--span"></span>
                        </h1>
    
                        <div className="title--update--product--input--div--wrap">
                            <input type="text" className="title--update--product--input" id="title--update--product--input" name="title--update--product--input" />
                            <div className="title--update--product--input--check--button" id="title--update--product--input--check--button" onClick={(e) => handleClickConfirmNew(e, "title")}>
                                <Image
                                    className="title--update--product--input--check--button--img"
                                    src="/assets/images/tick.svg"
                                    alt="tick"
                                    width={0}
                                    height={0}
                                />
                            </div>
                            <span className="span--line--input--new--title"></span>
                        </div>
    
                        <div className="main--article--specific--product--section--images--description--wrap">
    
                            {getProduct.productFound[0].product_photos == null ?
    
                            (   
                                    <>
                                    <section className="main--article--specific--product--section--images">
                                        <div className="main--article--specific--product--section--images--div--main">
                                            <a className="main--article--specific--product--section--images--div--main--anchor" href="http://localhost:3000/assets/images/no_image.png" target="_blank" onClick={handleClickMainImage}>
                                                <Image
                                                    className="main--article--specific--product--section--images--div--main--img img--0"
                                                    src="http://localhost:3000/assets/images/no_image.png"
                                                    data-img="http://localhost:3000/assets/images/no_image.png"
                                                    unoptimized={true}
                                                    alt="main-image"
                                                    fill
                                                    priority={true}
                                                    sizes="50px"
                                                />
                                            </a>
    
                                            <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                            <button type="button" className="button--input--file" name="button--input--file" id="button--input--file">
                                                <Image
                                                    className="button--input--file--img--arrow--top"
                                                    src="http://localhost:3000/assets/images/arrow-top.svg"
                                                    alt="arrow_top"
                                                    unoptimized={true}
                                                    width={0}
                                                    height={0}
                                                />
                                                <label htmlFor="input--file--new--picture input--0" className="input--file--new--picture--label"></label>
                                                <input type="file" className="input--file--new--picture input--0" name="input--file--new--picture input--0" id="input--file--new--picture input--0" onChange={handleChangeFileInput}/>
                                            </button>
                                        </div>
                                        {/*<span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>*/}
                                    
    
                                    
                                        <div className="main--article--specific--product--section--images--div--others--wrap">
                                            <div className="main--article--specific--product--section--images--div--others">
    
                                            {Array.from(Array(2).keys()).map( elem => 
    
                                                <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap--wrap">
                                                    <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap" 
                                                    onClick={handleClickDivOtherImage}>
    
                                                    <Image
                                                        className={`main--article--specific--product--section--images--div--others--grid--element--img img--${elem+1}`}
                                                        src="http://localhost:3000/assets/images/no_image.png"
                                                        unoptimized={true}
                                                        data-img="http://localhost:3000/assets/images/no_image.png"
                                                        alt="other-image"
                                                        fill
                                                        priority={true}
                                                        sizes="50px"
                                                    />
                                                    
                                                    </div>
    
                                                    <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                                    <button type="button" className="button--input--file" name="button--input--file" id="button--input--file">
                                                        <Image
                                                            className="button--input--file--img--arrow--top"
                                                            src="http://localhost:3000/assets/images/arrow-top.svg"
                                                            alt="arrow_top"
                                                            unoptimized={true}
                                                            width={0}
                                                            height={0}
                                                        />
                                                        <label htmlFor={`input--file--new--picture input--${elem+1}`} className="input--file--new--picture--label"></label>
                                                        <input type="file" className={`input--file--new--picture input--${elem+1}`} name={`input--file--new--picture input--${elem+1}`} id={`input--file--new--picture input--${elem+1}`} onChange={handleChangeFileInput}/>
                                                    </button>
                                                </div>
                                                
                                            )}
                                            
                                            </div>
                                        </div>
                                    <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                    </section>
                                    </>
    
                            ):  getProduct.productFound[0].product_photos !== null ?
    
                                    <section className="main--article--specific--product--section--images">
                                        <span className="main--article--specific--product--section--description--div--description--p--title">Photos</span>
                                        <div className="main--article--specific--product--section--images--div--main">
                                            <a className="main--article--specific--product--section--images--div--main--anchor" href={`${imageName}`} target="_blank" onClick={handleClickMainImage}>
                                            <Image
                                                className="main--article--specific--product--section--images--div--main--img img--0"
                                                src={`${imageName}`}
                                                data-img={`${imageName}`}
                                                unoptimized={true}
                                                alt="main-image"
                                                fill
                                                priority={true}
                                                sizes="50px"
                                            />
                                            </a>
    
                                            <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                            <button type="button" className="button--input--file" name="button--input--file" id="button--input--file">
                                                <Image
                                                    className="button--input--file--img--arrow--top"
                                                    src="http://localhost:3000/assets/images/arrow-top.svg"
                                                    alt="arrow_top"
                                                    unoptimized={true}
                                                    width={0}
                                                    height={0}
                                                />
                                                <label htmlFor="input--file--new--picture input--0" className="input--file--new--picture--label"></label>
                                                <input type="file" className="input--file--new--picture input--0" name="input--file--new--picture input--0" id="input--file--new--picture input--0" onChange={handleChangeFileInput}/>
                                            </button>
                                        </div>
                                        
                                        <>
                                        <div className="main--article--specific--product--section--images--div--others--wrap">
                                            <div className="main--article--specific--product--section--images--div--others">
    
                                                {imagesNamesProduct.slice(1).map( (elem, ind) => 
                                                    
                                                    <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap--wrap">
                                                        
                                                        <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap" 
                                                        onClick={handleClickDivOtherImage}>
    
                                                            <Image
                                                                className={`main--article--specific--product--section--images--div--others--grid--element--img img--${ind+1}`}
                                                                src={`http://127.0.0.1:8000/assets/images/${elem}`}
                                                                unoptimized={true}
                                                                data-img={`http://127.0.0.1:8000/assets/images/${elem}`}
                                                                alt="other-image"
                                                                fill
                                                                priority={true}
                                                                sizes="50px"
                                                            />
    
                                                        </div>
    
                                                        <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                                        <button type="button" className="button--input--file" name="button--input--file" id="button--input--file">
    
                                                            <Image
                                                                className="button--input--file--img--arrow--top"
                                                                src="http://localhost:3000/assets/images/arrow-top.svg"
                                                                alt="arrow_top"
                                                                unoptimized={true}
                                                                width={0}
                                                                height={0}
                                                            />
                                                            <label htmlFor={`input--file--new--picture input--${ind+1}`} className="input--file--new--picture--label"></label>
                                                            <input type="file" className={`input--file--new--picture input--${ind+1}`} name={`input--file--new--picture input--${ind+1}`} id={`input--file--new--picture input--${ind+1}`} onChange={handleChangeFileInput}/>
                                                        </button>
                                                    </div>
    
                                                )}
    
                                                {arrayClassNumber.map ( elem => 
    
                                                    <div key={elem} className="main--article--specific--product--section--images--div--others--grid--element--img--wrap--wrap">
    
                                                        <div className="main--article--specific--product--section--images--div--others--grid--element--img--wrap" 
                                                        onClick={handleClickDivOtherImage}>
    
                                                            <Image
                                                                className={`main--article--specific--product--section--images--div--others--grid--element--img img--${elem}`}
                                                                src="http://localhost:3000/assets/images/no_image.png"
                                                                unoptimized={true}
                                                                data-img="http://localhost:3000/assets/images/no_image.png"
                                                                alt="other-image"
                                                                fill
                                                                priority={true}
                                                                sizes="50px"
                                                            />
    
                                                        </div>
    
                                                        <button type="button" className="button--cross--delete" name="button--cross--delete" id="button--cross--delete" onClick={handleClickCrossDelete}>X</button>
                                                        <button type="button" className="button--input--file" name="button--input--file" id="button--input--file">
                                                            <Image
                                                                className="button--input--file--img--arrow--top"
                                                                src="http://localhost:3000/assets/images/arrow-top.svg"
                                                                alt="arrow_top"
                                                                unoptimized={true}
                                                                width={0}
                                                                height={0}
                                                            />
                                                            <label htmlFor={`input--file--new--picture input--${elem}`} className="input--file--new--picture--label"></label>
                                                            <input type="file" className={`input--file--new--picture input--${elem}`} name={`input--file--new--picture input--${elem}`} id={`input--file--new--picture input--${elem}`} onChange={handleChangeFileInput}/>
                                                        </button>
                                                    </div>
                                                )}
    
                                            </div>
                                        </div>
                                        <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
                                        </>
                                    </section>
    
                            :
    
                                <>
                                </>
                            }
    
                            <section className="main--article--specific--product--section--description update--description--section">
                                <div className="main--article--specific--product--section--description--div--description update--div">
    
                                    <span className="main--article--specific--product--section--description--div--description--p--title">Description</span>
                                    <p className="main--article--specific--product--section--description--div--description--p update--description--element">
                                        {getProduct.productFound[0].product_description}
                                    </p>
    
                                    <textarea className="update--textarea--description--element"></textarea>
    
                                    <div className="title--update--product--img--wrap edit--description" onClick={(e) => handleClickEditButton(e, "description")}>
                                    <Image
                                        className="title--update--product--img"
                                        src="/assets/images/edit-icon.svg"
                                        alt="edit-icon"
                                        height={0}
                                        width={0}
                                    />
                                    </div>
    
                                    <div className="title--update--product--input--check--button check--description" id="title--update--product--input--check--button" onClick={(e) => handleClickConfirmNew(e, "description")}>
                                        <Image
                                            className="title--update--product--input--check--button--img"
                                            src="/assets/images/tick.svg"
                                            alt="tick"
                                            width={0}
                                            height={0}
                                        />
                                    </div>
                                </div>
                                <span className="main--article--specific--product--h1--span main--article--specific--product--section--span"></span>
    
                                <div className="main--section--add--product--form--input--wrap update--product">
                                    <label className="main--section--add--product--form--label--place update--product" htmlFor="main--section--add--product--form--input--place">Lieu:</label>
                                    <input className="main--section--add--product--form--input--place" type="text" name="main--section--add--product--form--input--place" id="main--section--add--product--form--input--place" value={getCity} onChange={(e) => setCity(e.target.value)}/>
                                </div>
    
                                <fieldset className="main--section--add--product--form--fieldset update--product">
                                    <legend>
                                        Livraison:
                                    </legend>
    
                                    <label className="main--section--add--product--form--label--delivery--yes" htmlFor="main--section--add--product--form--input--delivery--yes">Oui</label>
    
                                    {getProduct.productFound[0].product_delivery == 1 ?
    
                                        <input className="main--section--add--product--form--input--delivery--yes" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--yes" value="main--section--add--product--form--input--delivery--yes" checked onChange={() => {}}/>
    
                                    :
    
                                        <input className="main--section--add--product--form--input--delivery--yes" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--yes" value="main--section--add--product--form--input--delivery--yes" onChange={() => {}}/>
                                    }
                                
                                    <label className="main--section--add--product--form--label--delivery--no" htmlFor="main--section--add--product--form--input--delivery--no">Non</label>
    
                                    {getProduct.productFound[0].product_delivery == 0 ?
    
                                        <input className="main--section--add--product--form--input--delivery--no" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--no" value="main--section--add--product--form--input--delivery--no" checked onChange={() => {}}/>
    
                                    :
    
                                        <input className="main--section--add--product--form--input--delivery--no" type="radio" name="main--section--add--product--form--checkbox--delivery" id="main--section--add--product--form--input--delivery--no" value="main--section--add--product--form--input--delivery--no" onChange={() => {}}/>
    
                                    }
    
                                </fieldset>
                            </section>
    
                        </div>
    
                        <button type="submit" className="submit--button--update--product" name="submit--button--update--product" id="submit--button--update--product">Valider les modifications</button>
                    </form>
                </article>
                ):
                <>
                </>
                }
    
                <Footer />
            </main>
        );
    }

    else {

        return redirect("/?upd=false");
    }

}