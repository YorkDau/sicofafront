import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, PerfilAuth } from "../../../auth/services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProgramacionService } from "src/app/pages/private/abogado/services/programacion.service";
import { CodigosRespuesta } from "src/app/constants";
import { CalendarEvent } from "angular-calendar";
import { ItemProgramacionInterface } from "src/app/interfaces/programacion.interface";

interface Card {
  title: string;
  description: string;
  icon: string;
  route: string;
  visible: boolean;
  requiredProfileName?: string;
  description2: string;
  
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  cards: Card[] = [
    {
      title: "PRE-Solicitudes",
      description:
        "Registrar un nuevo caso de restablecimiento de derechos en el sistema de información SIGFA.",
      icon: "add_circle",
      route: "recepcion-auxiliar",
      visible: false,
      requiredProfileName: "Auxiliar",
      description2:"(Menor - Adulto Mayor)",
    },
    {
      title: "Solicitudes VCF",
      description:
        "Registrar un nuevo caso de violencia intrafamiliar o fijación de cuota alimentación en el sistema de información SIGFA.",
      icon: "add_circle_outline",
      route: "ciudadano",
      visible: false,
      requiredProfileName: "Auxiliar",
      description2:""
    },
  ];

  isAuxiliarSelected: boolean = false;
  public selectedProfileDisplayName: string | null = null;
  private destroy$: Subject<void> = new Subject<void>();
  public eventosCalendario: CalendarEvent[] = [];
  public listaProgramaciones: ItemProgramacionInterface[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private programacionService: ProgramacionService,
  ) {}

  ngOnInit(): void {
    this.authService.selectedComisaria$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkIfAuxiliarProfileIsSelected();
        this.obtenerAudiencias();
      });
    this.obtenerAudiencias();
    this.checkIfAuxiliarProfileIsSelected();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private obtenerAudiencias() {
    this.programacionService.obtenerAgendaGeneral(this.authService.id_comisaria).subscribe({
      next: (result) => {
        if (result && result.statusCode === CodigosRespuesta.OK) {
          this.listaProgramaciones = result.data || [];
          this.actualizarEventosCalendario();
        }
      },
      error: () => {
        //this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      },
    });
  }

  private actualizarEventosCalendario() {
    this.eventosCalendario = this.listaProgramaciones.map((programacion) => {
      return {
        start: this.convertDate(programacion.fechaHoraInicial + ""),
        title: `
            Inicia: ${(programacion.fechaHoraInicial + "").split("T").join(" ")} -
            Finaliza: ${(programacion.fechaHoraFinal + "")
              .split("T")
              .join(" ")} Solicitud #${
              programacion.codigoSolicitud
            } Programacion #${programacion.idProgramacion} Audiencia #${programacion.audiencia}
            `,
        color: {
          primary: programacion.esAgendaTarea ? "#1e90ff" : "#b5b5b5",
          secondary: "#b5b5b5",
        },
      };
    });
  }

  /**
   * @description funcion para convertir a una fecha valida
   * 'yyyy/MM/dd'
   */
  private convertDate(fecha: string): Date {
    const [dia, mes, anio, hora, minutos, segundos] = fecha
      .split("/")
      .join(":")
      .split(" ")
      .join(":")
      .split(":")
      .map((element) => +element);
    return new Date(anio, mes - 1, dia, hora, minutos, segundos);
  }

  private checkIfAuxiliarProfileIsSelected(): void {
    const selectedComisariaId = this.authService.getselectComisariaValue(
      this.authService.id_comisaria,
    );
    const currentSelectedProfileName = this.authService.getselectProfileName();
    const allUserProfiles: PerfilAuth[] = this.authService.perfilesList;

    this.selectedProfileDisplayName = currentSelectedProfileName;

    this.cards = this.cards.map((card) => {
      const isCardVisible = card.requiredProfileName
        ? card.requiredProfileName === currentSelectedProfileName
        : true;
      return { ...card, visible: isCardVisible };
    });
    const activeAuxProfileForSelectedComisaria = allUserProfiles.find(
      (p) => p.idComisaria === selectedComisariaId && p.perfil === "AUX",
    );
    this.isAuxiliarSelected = !!activeAuxProfileForSelectedComisaria;
  }

  goToCardRoute(route: string): void {
    this.router.navigate([route]);
  }
}
