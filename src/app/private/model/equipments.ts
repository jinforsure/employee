export interface Equipments{
    id? : number |null;
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
    category?: string; // Ajouter la propriété category
  subcategory?: string; // Ajouter la propriété subcategory
  state?:string;
  benefit_id?:number | null;
}