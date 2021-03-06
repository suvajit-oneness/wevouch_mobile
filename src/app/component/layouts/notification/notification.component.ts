import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public userInfo : any  = '';
  public notificationList : any = [];
  public notificationCount : number = 0;

  constructor(private _api:ApiService, private _loader: NgxUiLoaderService) { 
    localStorage.setItem('is_notification', 'false');
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getNotifications();
  }

  getNotifications() {
    if(this.userInfo?._id) {
      setInterval(()=>{
        // console.log('notification component:' +this.notificationList.length);
        this.notificationCount = 0;
        this._api.notificationList(this.userInfo._id).subscribe(
          res => {
            let array = Array()
            for (let index = (res.length-1); index >= 0; index--) {
              if (res[index].cleared === false) {
                array.push(res[index]);
                if(res[index].status === true) {
                  this.notificationCount += 1;
                  localStorage.setItem('is_notification', 'true');
                }
              }
            }
            this.notificationList = array;
            // console.log(this.notificationList);
            
          }, err => {}
        )
      },5000);
    }
  }

  changeNotificationStatus(notificationId: any = '', status: boolean = false) {
    if (localStorage.getItem('is_notification') === 'true') {
      let mainForm: any = {};
      mainForm = {
        notificationId: notificationId,
        userId : this.userInfo._id, 
        status: status
      };
      
      this._api.updateNotificationStatus(mainForm).subscribe(
        res => {
          localStorage.setItem('is_notification', 'false');
        }, err => {}
      )
    }
  }

  clearAllNotification(notificationId: any = '', cleared: boolean = true) {
    this._loader.startLoader('loader');
    let mainForm: any = {};
    mainForm = {
      notificationId: notificationId,
      userId : this.userInfo._id, 
      cleared: cleared
    };
    
    this._api.clearNotification(mainForm).subscribe(
      res => {
        console.log(res);
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

}
