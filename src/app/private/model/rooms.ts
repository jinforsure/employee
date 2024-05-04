export interface Rooms{
    id? : number;
    name? : string;
    type? : string;
    location? : string;
    maintenance_status? : string;
    capacity? :number;
    createdAt? : Date;
    updatedAt? : Date;
    category?: string; // Ajouter la propriété category
  subcategory?: string; // Ajouter la propriété subcategory
  state?:string;
  benefit_id?:number | null;
  checked?: boolean;
}