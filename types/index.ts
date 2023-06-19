import { DateTime } from 'luxon'

export type GetRessourceIdParams = {
    ressourceId: number
    datetime: string
}

export type OpenValue = {
    opening: string
    closing: string
}

export type ReservationValue = {
    reservationStart: string
    reservationEnd: string
}
