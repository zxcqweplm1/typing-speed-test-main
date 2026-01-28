import mobileIcon from "./assets/images/logo-small.svg";
import trophy from "./assets/images/icon-personal-best.svg";
import { useEffect, useRef, useState } from "react";
import desktopIcon from "./assets/images/logo-large.svg";


const Header = ({wpm}: {wpm: number | null | undefined}) => {

  const bestRef = useRef<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('bestWpm');
    const stored = raw ? Number(raw) : 0;
    if(stored) {
      bestRef.current = stored;
      setBest(stored)
    }
  }, [wpm]);
  return (
    <div>
      <header className="p-2 my-3 flex flex-row justify-between items-center">
        <a href="/">
        <img src={mobileIcon} alt="icon" className="lg:hidden"/>
        <img src={desktopIcon} alt="icon" className="hidden lg:block"/>
        </a>
        <div className="flex flex-row">
          <img src={trophy} alt="trophy" />
          <p className="text-neutral-400 font-medium ml-3">
            <span className="lg:hidden">Best:</span> 
            <span className="lg:inline-flex hidden">Personal Best:</span> 
            <span className="text-neutral-0 ml-1 text-base">{best ?? 0} WPM</span>
          </p>
        </div>
      </header>
    </div>
  );
};

export default Header;
