import { Component, inject } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";

const EnRevisionPorStepEnum = {
  'AUX': 0,
  'PSI': 1,
  'TSO': 1,
  'ABO': 2,
  'COM': 3,
}

@Component({
  selector: 'app-en-revision-por',
  templateUrl: './en-revision-por.component.html',
  styleUrls: ['./en-revision-por.component.scss'],
})
export class EnRevisionPorComponent {
  _auth: AuthService;

  constructor(auth: AuthService) {
    this._auth = auth;
  }

  get step() {
    const { perfil } = this._auth?.currentUserValue ?? { perfil: 'AUX' };
    const key = (perfil) as keyof typeof EnRevisionPorStepEnum;
    return EnRevisionPorStepEnum[key];
  }
}