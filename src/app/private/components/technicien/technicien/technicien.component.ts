import { Component } from '@angular/core';
import { Benefit } from 'src/app/private/model/Benefit';
import { BenefitService } from 'src/app/private/services/benefit.service';
import { Route,Router } from '@angular/router';
@Component({
  selector: 'app-technicien',
  templateUrl: './technicien.component.html',
  styleUrls: ['./technicien.component.css']
})
export class TechnicienComponent {

  benefitCategories: string[] = [];

  constructor(
    private benefitService: BenefitService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadBenefitCategories();
  }

  loadBenefitCategories() {
    this.benefitService.getAllBenefit().subscribe((benefits: Benefit[]) => {
      // Obtenez les catégories distinctes des bénéfices récupérés
      this.benefitCategories = Array.from(new Set(benefits.map(benefit => benefit.category)))
                                  .filter(category => !!category) as string[];
    });
  }

  navigateToCategoryPage(category: string): void {
    // Rediriger vers la page spécifique en fonction de la catégorie du bénéfice
    if (category.toLowerCase() === 'equipments') {
      console.log(category);
      this.router.navigate(['technicien/maintenance-equipment']);
    } else if (category ==='Rooms'){
      this.router.navigate(['technicien/maintenance-room']);
     // this.router.navigate(['benefit/rooms']);
   }
  }

}

