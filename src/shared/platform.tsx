'use client'
import React, { useEffect, useState } from "react";

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
        window.onresize=function(){
            console.log('resize ')
            setPlatform(calcPlatform())
        }
        setPlatform(calcPlatform());
    }, [])
    return platform;
}

export function PlatformUi(props: { mobile?: any, pc?: any, ipod?: any }) {
    const platform = usePlatform();
    console.log(platform)
    let ui = null;
    switch (platform) {
        case Platform.Pc:
            ui = props.pc;
            break;
        case Platform.Ipod:
            ui = props.ipod || props.pc;
            break;
        case Platform.Mobile:
            ui = props.mobile;
            break;
    }
    if (ui) {
        return <React.Suspense>{ui}</React.Suspense> ;
    } else {
        return <div>loading</div>
    }

}