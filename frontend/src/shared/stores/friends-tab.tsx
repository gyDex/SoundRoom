import { makeAutoObservable } from "mobx";

export type FriendTabType = 'add' | 'send' | 'list';

class FriendsTabStore {
    private friendTab:FriendTabType  = 'add'

    constructor() {
        makeAutoObservable(this);
    }

    switchTab = (type: FriendTabType) => {
        this.friendTab = type;
    }

    get FriendTab() {
        return this.friendTab;
    }
}

export const friendsTabStore = new FriendsTabStore();