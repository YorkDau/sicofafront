import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedFunctions } from '../functions';

@Component({
  selector: 'aurora-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class AuroraTableComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() clickRow = new EventEmitter<any[]>();
  @Output() clickRefresh = new EventEmitter<any>();

  @Input() multipleSelection: boolean = false;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() showTableOnlyOnSearch: boolean = false;

  @Input() columns: AuroraTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actionColumnName: string = 'Acciones';
  @Input() actions: AuroraActionColumn[] = [];
  @Input() valueSearch: string = '';
  @Input() actionsOrientation: 'start' | 'end' | 'center' = 'center';
  @Input() actionsRecepcion: boolean = false;
  @Input() actionsGestionDominios: boolean = false;
  @Input() actionsGestionGrupos: boolean = false;


  displayedColumns: string[] = this.columns.map((value) => {
    return value.name;
  });

  dataSource = new MatTableDataSource<Set<any>>();
  selected = new Set<any>();
  showTable: boolean = true;
  currentUser!: UserInterface | undefined;

  constructor(
    public router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private authService: AuthService,
    ) {
    this.paginatorIntl.itemsPerPageLabel = 'Registros por página';
  }

  ngOnChanges() {
    this.ngOnInit();
    this.applyFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {
    this.setShowTable();
    this.setActionsOnData();
    this.selected = new Set<any>();
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    //Si no viene el parametro de columnas por defecto, se llena desde el parámetro "data"
    if (this.columns.length == 0 && this.dataSource.data.length > 0) {
      for (const key in this.data[0]) {
        if (
          Object.prototype.hasOwnProperty.call(this.data[0], key) &&
          !key.toLowerCase().includes('_id')
        ) {
          this.columns.push({
            name: key.toLowerCase(),
            title: SharedFunctions.toTitleCase(key),
          });
        }
      }
    }
    this.displayedColumns = this.columns.map((value) => {
      return value.name;
    });
  }

  setActionsOnData() {
    const arrayActionsVisualizar = this.actions.slice();
    let validarPerfil = false;

    if(!(this.authService.currentUserValue?.perfil === 'COM') 
        && !this.actionsRecepcion
        && !this.actionsGestionDominios
        && !this.actionsGestionGrupos){
      validarPerfil = true;
      arrayActionsVisualizar.pop();
    };
    if (
      this.actions &&
      Array.isArray(this.actions) &&
      this.actions.length &&
      this.data &&
      Array.isArray(this.data) &&
      this.data.length
    ) {
      this.data.forEach((element, idx) => {
        this.data[idx]['actions'] = arrayActionsVisualizar;
        if(this.data[idx]['retormar_solicitud'] && validarPerfil)
        this.data[idx]['actions'] = this.actions;
      });
    }
  }

  applyFilter() {
    this.valueSearch = this.valueSearch.trim().toLowerCase();
    this.dataSource.filter = this.valueSearch;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.setShowTable();
  }

  /**
   * Para determinar si se verán los datos de la tabla
   * @returns
   */
  setShowTable() {
    if (this.showTableOnlyOnSearch) {
      this.showTable = this.valueSearch ? true : false;
    }
  }

  addRowToItems(row: any) {
    if (this.multipleSelection) {
      if (this.selected.has(row)) {
        this.selected.delete(row);
      } else {
        this.selected.add(row);
      }
    } else {
      if (this.selected.has(row)) {
        this.selected.clear();
      } else {
        this.selected.clear();
        this.selected.add(row);
      }
    }
    this.clickRow.emit(Array.from(this.selected));
  }

  render(item: AuroraTableColumn, row: any) {
    let element: any = {};
    let result: any = '';
    for (const column in row) {
      if (Object.prototype.hasOwnProperty.call(row, column)) {
        element[column] = row[column] ? row[column] : '';
      }
    }
    let value = element[item.name];
    if (item.render) {
      result = item.render(value, row);
    } else if (typeof value == 'string' && isNaN(Number(value))) {
      result = value;
    } else if (!isNaN(Number(value))) {
      result = Number(value);
      result = result == Infinity ? value + '' : result;
    } else {
      result = JSON.stringify(value);
    }
    result += '';
    return result ? result : '';
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface AuroraTableColumn {
  name: string;
  title?: string;
  render?: (value: any, row?: any) => string;
}

export class AuroraActionColumn {
  imagen?: string;
  icon?: string;
  iconClass?:
    | 'material-icons-rounded'
    | 'material-icons-outline'
    | 'material-icons-sharp' = 'material-icons-outline';
  iconColor?: string = '#138496';
  tooltip?: string;
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' = 'right';
  accion!: (row: any, router: Router) => any;
}
