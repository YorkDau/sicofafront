import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../../../services/abogado.service';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
})
export class TestimonialComponent implements OnInit, OnDestroy {
  public testimonial!: any;

  private tesimonialObs = this.abogadoService.testimonialBS$;
  private testimonialSub!: Subscription;

  constructor(private abogadoService: AbogadoService) {}

  ngOnDestroy(): void {
    if (this.testimonialSub) this.testimonialSub.unsubscribe();
  }

  ngOnInit(): void {
    this.testimonialSub = this.tesimonialObs.subscribe((t) => {
      console.log(t);

      this.testimonial = t;
    });
  }
}
