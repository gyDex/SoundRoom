import { makeAutoObservable, toJS } from "mobx";

class MobileMenuStore {
    isActive: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleMenu() {
        this.isActive = !this.isActive;
        console.log('click')
    }

    changeActive(active: boolean) {
        this.isActive = active;
    }
} 

export const mobileMenuStore = new MobileMenuStore();