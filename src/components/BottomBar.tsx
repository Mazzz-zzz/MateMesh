import React from "react";
import { useNavigate } from "react-router-dom";
import { House, Gear, User } from "@phosphor-icons/react";

import "./BottomBar.css";

interface BottomBarProps {
    activePath: string;
}

export const BottomBar = ({ activePath }: BottomBarProps): JSX.Element => {
    const navigate = useNavigate();

    const navigateTo = (path: string) => {
        navigate(path);
    }

    return (
        <div className="bottom-bar">
            <div className="inner-bar">
                <div className="icons">
                    <House className={`icon ${activePath === '/home' ? 'active' : ''}`} size={44} weight="fill" onClick={() => navigateTo('/home')} />
                    <User className={`icon ${activePath === '/profile' ? 'active' : ''}`} size={44} weight="fill" onClick={() => navigateTo('/profile')} />
                    <Gear className={`icon ${activePath === '/settings' ? 'active' : ''}`} size={44} weight="fill" onClick={() => navigateTo('/settings')} />
                </div>
            </div>
        </div>
    );
};