import { MenuProps } from "antd";
import { musicMenuConfig } from "./musicMenuConfig";
import { mobileMenuStore } from "@/shared/stores/mobile-menu.store";

export const musicMenuItems: MenuProps["items"] = musicMenuConfig.map(
    ({ key, label, icon: Icon }) => ({
        key,
        label: (
            <button
                onClick={() => { mobileMenuStore.toggleMenu()}}
                className="w-full flex justify-between items-center"
            >
                <div className="flex gap-[10px]">
                    <Icon color="white" size={18} />
                    {label}
                </div>
            </button>
        ),
    })
);