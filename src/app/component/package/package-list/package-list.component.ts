import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
declare var Razorpay: any;
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  title = 'angularowlslider';
  productList: any = {
    loop: true,
    stagePadding:45,
    margin: 15,
    nav: false,
    dots: false,
    autoplay:false,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1.02,
			},
			600:{
				items:1.02,
			},
			760:{
				items:1.02,
			}
    },
  }

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  
  public packages : any = ''
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public purchaseOptions: any = {};
  public packageName: any = '';
  public thankYouTab: boolean = false;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.getPackageList();
  }

  getPackageList() {
    this._api.packageList().subscribe(
      res => {
        this._loader.startLoader('loader');
        res.forEach((element :any) => {
          element.description = element.description.split(".");
        });
        this.packages = res;
        console.log(res);
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  initPay(packageId : any) {
    this._api.packageDetail(packageId).subscribe(
      res => {
        console.log(res);
        let prefilledData = {
          'name': this.userInfo.name,
          'email': this.userInfo.email,
          'contact': this.userInfo.mobile
        }
        let userId = this.userInfo._id;
        let subscriptionId = res._id;
        this.packageName = res.name;
        let packageTicket = res.ticketCount;
        let packageExpiry = res.expiryDate;
        this.purchaseOptions = {
          "key": environment.rzp_key_id,
          "amount": res.amount*100,
          "currency": "INR",
          "name": "WeVouch",
          "description": res.name + " Subscription",
          "image": "../assets/images/logo-icon.png",
          "handler": (response : any) => {
            console.log(response._id);
            this._api.updateUserDetails(userId, {'subscriptionId': subscriptionId}).subscribe(
              res => {
                console.log(res);
                // this._router.navigate(['/profile/details']);
                const formData = {
                  "userId" : userId, 
                  "subscriptionId" : subscriptionId, 
                  "transactionId" : response.razorpay_payment_id, 
                  "transactionAmount" : res.subscription.amount
                }
                this._api.addTransaction(formData).subscribe();
                const notificationForm = {
                  "title": "Plan subscription", 
                  "userId": userId, 
                  "description": "Dear "+this.userInfo.name+", you have successfully subscribed to our "+this.packageName+" Plan of "+packageTicket+" tickets yearly. Your plan expires on "+packageExpiry
                }
                this._api.addNotification(notificationForm).subscribe();
                const notificationForm2 = {
                  "title": "Subscription Upgrade", 
                  "userId": userId, 
                  "description": "Dear "+this.userInfo.name+", your subscription has been successfully upgraded to "+this.packageName+" plan. We are glad you are enjoying our services."
                }
                this._api.addNotification(notificationForm2).subscribe();
                Swal.fire({
                  title: 'Purchased!',
                  text: 'Your payment is successfull. Payment Id: '+response.razorpay_payment_id+' .Please note the payment Id',
                  icon: 'success',
                  confirmButtonText: 'Done!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.thankYouTab = true;
                  }
                })
              }, err => {}
            )
            
          },
          "prefill": prefilledData,
          "notes": {
            // "subscription": "Buying subscription"
          },
          "theme": {
            "color": "#00c0c9"
          }
        }
        var rzp1 = new Razorpay(this.purchaseOptions);
        rzp1.open();
      }, err => {}
    );
    
    
  }

}
