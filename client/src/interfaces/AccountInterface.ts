export interface AccountInfo {
    email: string
    name: string
    token: string
}

export interface Login {
    email: string
    password: string
}

export interface CreateUser {
    email: string
    name: string
    password: string
}