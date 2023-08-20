export default function Header(props: any) {
    
    return (
        <header className="header">
        <h1 className="header--h1">
          <span className="header--h1--span1">
            FAIS
            <div className="header--h1--span1--div">Fais, oui, du verbe "faire", agit!</div>
          </span>
          <span className="header--h1--span2">
            MOI
            <div className="header--h1--span2--div">Moi, pas au voisin, pas à tante Simone</div>
          </span>
          <span className="header--h1--span3">
            UN
            <div className="header--h1--span3--div">Un, deux, trois .. déjà UN, après on verra</div>
          </span>
          <span className="header--h1--span4">
            PRIX!
            <div className="header--h1--span4--div">Prix, et oui, on est pas là pour la gloire non plus!</div>
          </span>
        </h1>
      </header>
    );
}