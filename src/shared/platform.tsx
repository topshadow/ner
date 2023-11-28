import { useEffect, useState } from "react";

export enum Platform {
    Pc = 1,
    Ipod,
    Mobile
}

function calcPlatform() {
    let width = window.screen.width;
    if (width > 400 && width < 1200) {
        return Platform.Ipod;
    } else if (width <= 400) {
        return Platform.Mobile
    } else {
        return Platform.Pc;
    }
}
export function usePlatform() {
    const [platform, setPlatform] = useState<Platform>();
    useEffect(() => {
        setPlatform(calcPlatform());
    }, [])
    return platform;
}