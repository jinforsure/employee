export interface Rooms{
    id? : number;
    benefitId? :2;
    name? : string;
    type? : string;
    location? : string;
    maintenance_status? : string;
    capacity? :number;
    createdAt? : Date;
    updatedAt? : Date;
    category?: String; // Ajouter la propriété category
    subcategory?: string; // Ajouter la propriété subcategory
    state?:string;
    benefit_id?:number | null;
    checked?: boolean;
    reservation_State?:string;
    description?:string;
    occupied?:string;
    free?:string;

 departHour: string; 
 departDate:Date;
 returnHour:string;

}