import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router) {
    this._loader.startLoader('loader');
  }
  public errorMessage = '';
  public confirmPassword : any = '';
  public mainSignUpForm: boolean = true;
  public accountConfirmation: boolean = false;
  public userEmail: any = '';
  public ageRestriction: number = 0;
  public firstNameVal: any = '';
  public lastNameVal: any = '';

  ngOnInit(): void {
    window.scrollTo(0,0);
    if(this._api.isAuthenticated()){
      this._router.navigate(['/home']);
    }
    this._loader.stopLoader('loader');
  }

  signUpUser(formData :any){
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if (this.ageRestriction >= 18) {
      if( formData?.valid ){
        if (this.confirmPassword == formData.value.password) {
          console.log(formData.value);
          let mainForm = formData.value;
          mainForm.name = this.firstNameVal+' '+this.lastNameVal
          mainForm.image = 'https://ui-avatars.com/api/?background=random&name='+formData.value.name;
          this._loader.startLoader('loader');
          console.log(mainForm);
          
          this._api.userSignupApi(mainForm).subscribe(
            res => {
              // this.errorMessage = res.message;
              console.log(res);
              if (res.error === false) {
                const notificationForm = {
                  "title": "Free Ticket Earn", 
                  "userId": res.user._id, 
                  "description": "You earn "+res.user.subscription.ticketCount+" tickets."
                }
                this._api.addNotification(notificationForm).subscribe(
                  res=> {console.log(res);}
                );
                this.userEmail = res.user.email;
                if (res.user.is_email_verified === true && res.user.is_mobile_verified === true) {
                  this._api.storeUserLocally(res.user);
                  // this._router.navigate(['/login']);
                } else {
                  this.accountConfirmation = true;
                  this.mainSignUpForm = false;
                }
              } else {
                this.errorMessage = res.message;
              }
              this._loader.stopLoader('loader');
            },
            err => {
              this.errorMessage = "something went wrong please try after sometimes";
              this._loader.stopLoader('loader');
            }
          )
        } else {
          this.errorMessage = "Password not matched";
        }
      }else{
        this.errorMessage = 'Please fill out all the details';
      }
    }
    
    // console.log('Form Data SUbmitted');
  }

  verifyAccount(formData : any) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      mainForm.email = this.userEmail;
      this._api.userAccountVerify(mainForm).subscribe(
        res => {
          console.log(res);
          this._api.storeUserLocally(res.data);
        }, err => {
          this.errorMessage = "Something went wrong! / Incorrect OTP!";
        }
      )
      this._loader.stopLoader("loader");
    }
    
  }

  confirmPasswordCheck(e :any) {
    this.confirmPassword = e.target.value;
  }

}
