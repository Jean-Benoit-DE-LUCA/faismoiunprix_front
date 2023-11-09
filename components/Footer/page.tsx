import Link from "next/link"

export default function Footer(props: any) {
    return (
        <footer className="footer">

            <ul className="footer--ul">
                <Link className="footer--ul--anchor--li" href={"/contact"}>
                    <li className="footer--ul--li">
                        Contact
                    </li>
                </Link>

                {/*<Link className="footer--ul--anchor--li" href={"/faq"}>
                    <li className="footer--ul--li">
                        FAQ
                    </li>
                </Link>*/}
            </ul>

        </footer>
    )
}