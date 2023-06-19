import { DateTime } from 'luxon'
import fetch from 'node-fetch'
import { OpenValue, ReservationValue } from './types'

export const getTimables = async (date: DateTime, ressourceId: number) => {
    const res = await fetch(
        `http://localhost:8080/timetables?date=${date.toISODate()}&resourceId=${ressourceId}`
    )
    return await res.json()
}

export const getReservations = async (date: DateTime, ressourceId: number) => {
    const res = await fetch(
        `http://0.0.0.0:8080/reservations?date=${date.toISODate()}&resourceId=${ressourceId}`
    )

    return await res.json()
}

export const isOpen = (
    date: DateTime,
    timetables: { open: boolean; timetables: OpenValue[] }
): boolean => {
    if (!timetables.open) {
        return false
    }
    return timetables.timetables.reduce((acc: boolean, v: OpenValue) => {
        return (
            (date <= DateTime.fromFormat(v.closing, 'yyyy-MM-dd HH:mm:ss') &&
                date >=
                    DateTime.fromFormat(v.opening, 'yyyy-MM-dd HH:mm:ss')) ||
            acc
        )
    }, false)
}

export const isReserved = (
    date: DateTime,
    reservations: { reservations: ReservationValue[] }
) => {
    return reservations.reservations.reduce(
        (acc: boolean, v: ReservationValue) => {
            return (
                (date >=
                    DateTime.fromFormat(
                        v.reservationStart,
                        'yyyy-MM-dd HH:mm:ss'
                    ) &&
                    date <=
                        DateTime.fromFormat(
                            v.reservationEnd,
                            'yyyy-MM-dd HH:mm:ss'
                        )) ||
                acc
            )
        },
        false
    )
}
