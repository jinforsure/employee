export interface Reservation{
    id? : number;
    name? : string;
    equipmentsId? : number;
    roomsId? : number;
    state?:string;
    maintenance_status?:string;
    category? : string;
    subCategory? : string;
    departDate? : string;
    departHour? : string ;
    returnHour? : string;
    createdAt? : Date;
    updatedAt? : Date;
}