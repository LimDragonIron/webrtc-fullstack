"use client"
import { AccountInfo } from "@/interfaces"
import { create } from "zustand"
import { persist, devtools, createJSONStorage } from "zustand/middleware"

export type AccountState = {
    accountInfo: AccountInfo
}

export type AccountActions = {
    setAccountInfo: (info: AccountInfo) => void
}

export type AccountStore = AccountState & AccountActions

const defaultInitState: AccountState = {
    accountInfo: {
        email: "",
        name: "",
        token: "",
    },
}

export const useAccountStore = create<AccountStore>()(
    devtools(
        persist((set, get)=>({
            ...defaultInitState,
            setAccountInfo: (info: AccountInfo) => set(state => ({
                ...state,
                accountInfo: {
                    ...state.accountInfo,
                    ...info
                }
            })),
            }),
            {
                name: "account-info",
                storage: createJSONStorage(()=> sessionStorage)
            }
        ),
    ),
)