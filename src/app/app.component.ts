import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 import * as Stomp from 'stompjs';
 import * as SockJS from 'sockjs-client';
 import * as Socket from 'socket.io-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  amount: number;
  interest: number;
  period: number;
  monthlyPayment: number;
  private stompClient;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }
 

  

  calculate() {
    this.http.post<any>('http://localhost:8080/simulate',{
      amount: this.amount,
      interest: this.interest,
      period: this.period
    }).subscribe(data => {
        this.monthlyPayment = data.monthlyPayment;
    });
  }

  getAllCashedValues() {
    this.http.get<Map<String, Object>>("http://localhost:8080/simulate/all-cashed-simulations").subscribe(data  => {
      console.log( data);
      Object.keys(data).forEach(key => {

      });
    })
  }


  initializeWebSocketConnection(): any {
    console.log('connected to ws ...');
  
     const ws = new SockJS("http://localhost:8080");
  
     this.stompClient = Stomp.over(ws);

     const copyStompClient = this.stompClient;

     const that = this;

      this.stompClient.connect({}, (frame) => {
      copyStompClient.subscribe("/queue/new-cashed-values", (data) => {
       console.log(JSON.parse(data.body));
      });
   }, (err) => {
       console.log(err);
    });
   }
  
    // const that = this;
  
    // this.stompClient.connect({}, (frame) => {
    //   that.stompClient.subscribe(`/queue/new-order`, (order) => {
    //     let userId = order.body.split(" ")[0];
    //     if (this.auth.readToken().userId != userId) {
    //       this.snackBar.open(order.body, "", {
    //         duration: 3000,
    //         verticalPosition: "top",
    //         horizontalPosition: "center"
    //       });
    //     }
    //   });
    // }, (err) => {
    //   console.log(err);
    // });
  



}
