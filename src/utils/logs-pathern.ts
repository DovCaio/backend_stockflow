export interface Infos {

    nome: string | undefined,
    currentStock: number | undefined
    newQtt?: number | undefined

}

export const logsPatherns = (type : "update" | "create" | "get", infos : Infos) => {
    if (!infos) throw Error("As infos não deveria ser nulas")

    switch (type) {
        
        case "create":
            return `Criado o produto de id: ${infos.nome} com a quantidade ${infos.currentStock}`
        case "get":
            return `Recuperado o produto ${infos.nome} com a quantidade ${infos.currentStock}`
        case "update":
            if (!infos.newQtt) throw Error("Deveria vir a nova quantidade.")
            return `Alterado o produto ${infos.nome} com a quantidade ${infos.currentStock} para ${infos.newQtt}`

    }


}