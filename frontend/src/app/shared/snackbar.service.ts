import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';





export enum SNACK_BAR_MESSAGE_TYPE {
  success = 'green-success-snackbar',
  warning = 'orange-warning-snackbar',
  error = 'red-error-snackbar',
  default = 'default-snackbar'
}
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
 
  public showSnackBar(context: string, message: string) {
    this.snackBar.open(message, '', {
      duration: 1000,
      panelClass: [context || SNACK_BAR_MESSAGE_TYPE.default],
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  public showErrorMessage(message: string) {
    this.showSnackBar(SNACK_BAR_MESSAGE_TYPE.error, message);
  }

  public showSuccessMessage(message: string) {
    this.showSnackBar(SNACK_BAR_MESSAGE_TYPE.success, message);
  }

  public showWarningMessage(message: string) {
    this.showSnackBar(SNACK_BAR_MESSAGE_TYPE.warning, message);
  }

  public showDefaultMessage(message: string) {
    this.showSnackBar(SNACK_BAR_MESSAGE_TYPE.default, message);
  }

  public showServiceFailureMessage(serviceName: string, error: ErrorEvent) {
    const errorMessage = error.message ? error.message : error.error.message;
    const errorLabel = `${serviceName} service has failed: ${errorMessage}`;
    this.showErrorMessage(errorLabel);
  }
  
}
