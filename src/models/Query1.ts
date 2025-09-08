import { AlertType, MovementType } from "@prisma/client"


export class Query1 {
    page:number
    limit: number
    search: string
    category: string
    stockStatus: AlertType

}

export class Query2 {
    limit: number
    sort: string
    period: string
}

export class Query3 {
    type: AlertType
}


export class Query4 {
    page: number
    limit: number
    search: string
    type: MovementType
    productId: string
    dateFrom: Date
    dateTo: Date
}