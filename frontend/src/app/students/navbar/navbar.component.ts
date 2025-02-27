import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userName: string = '';
  
  constructor( private router: Router, private authService: AuthService) {}

  ngOnInit(){
    const storeduser:any = (localStorage.getItem('loggedInUser'));
    let user = JSON.parse(storeduser);
    this.userName=user.name;
  }
  

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    let storeduser:any= localStorage.getItem('sessionID');
    this.authService.logout(storeduser).subscribe(
      (response)=>{
          console.log('Logged OUt');
      },
      (error)=>{
        console.log(error);
      }
    )
    this.router.navigate(['auth/login']);
    localStorage.removeItem('loggedInUser');
  }
}
