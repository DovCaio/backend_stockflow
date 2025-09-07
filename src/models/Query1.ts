import { AlertType } from "@prisma/client"


export class Query1 {
    page:number
    limit: number
    search: string
    category: string
    stockStatus: AlertType

}