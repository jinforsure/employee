export interface Equipments{
    id? : number;
    benefitId? : 1;
    checked?: boolean;
    name? : string;
    type? : string;
    manufactuer? : string;
    model? : string;
    purchase_date? :Date;
    quantity? :number;
    price? :number;
    maintenance_status? :string;
    createdAt? : Date;
    updatedAt? : Date;
    category?: "Equipments"; // Ajouter la propriété category
    subcategory?: string; // Ajouter la propriété subcategory
    state?:string;
    benefit_id?:number | null;
    returned?:string;
    reservation_State?:string;
    description?:string;
    taken?:string;
}