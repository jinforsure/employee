export interface Reservation{
    id? : number;
    equipmentId? : number;
    roomId? : number;
    name? : string;
    category? : string;
    subCategory? : string;
    departDate? : string;
    departHour? : string ;
    returnHour? : string;
    createdAt? : Date;
    updatedAt? : Date;
}