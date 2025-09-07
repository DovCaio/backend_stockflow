export enum MovementType {
  IN,
  OUT
}
export class StockMovement {

  type: MovementType
  quantity: number
  reason?: string
  note?: string
  createdAt?: Date
  updatedAt?: Date

}