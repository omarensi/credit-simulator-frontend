import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import * as Stomp from 'stompjs';
 import * as SockJS from 'sockjs-client';


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

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }
 

  

  calculate() {
    this.http.post<any>(this.apiUrl+'/simulate',{
      amount: this.amount,
      interest: this.interest,
      period: this.period
    }).subscribe(data => {
        this.monthlyPayment = data.monthlyPayment;
    });
  }

  getAllCashedValues() {
    this.http.get<Map<String, Object>>(this.apiUrl+"/simulate/all-cashed-simulations").subscribe(data  => {
      console.log( data);
      Object.keys(data).forEach(key => {

      });
    })
  }


  initializeWebSocketConnection(): any {
    console.log('connected to ws ...');
  
     const ws = new SockJS(this.apiUrl);
  
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
  

  



}
