"use client"

import { Account } from "@/schema/signinSchema"
import { create } from "zustand"
import { persist, devtools, createJSONStorage } from "zustand/middleware"

export type AccountState = {
    accountInfo: Account
}

export type AccountActions = {
    setAccountInfo: (info: Account) => void
}

export type AccountStore = AccountState & AccountActions

const defaultInitState: AccountState = {
    accountInfo: {
        email: "",
        name: "",
        access_token: "",
    },
}

export const useAccountStore = create<AccountStore>()(
    devtools(
        persist((set, get)=>({
            ...defaultInitState,
            setAccountInfo: (info: Account) => set(state => ({
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