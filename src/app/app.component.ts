import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotteryService } from './services/lottery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  manager!: string;
  players: string[] = [];
  balance!: string;
  lotteryForm!: FormGroup;
  enterText = 'Enter';
  pickWinnerText = 'Pick a winner';

  constructor(
    private formBuilder: FormBuilder,
    private lotteryService: LotteryService
  ) { }

  ngOnInit(): void {
    this.loadForm();
    this.loadContract();
  }

  loadForm() : void {
    this.lotteryForm = this.formBuilder.group({
      etherAmount: ['0', [
        Validators.required
      ]]
    });
  }

  loadContract(): void {
    this.lotteryService.loadMetamask().then(resp =>{
      this.lotteryService.getManager().then(resp =>{
        this.manager = resp ? resp : 'ERROR';
      });
      this.lotteryService.getPlayers().then(resp =>{
        this.players = resp ? resp : [];
      });
      this.lotteryService.getBalance().then(resp =>{
        this.balance = resp ? resp : 'ERROR';
      });
    });
  }

  onSubmit() {
    this.enterText = 'Waiting...';
    this.lotteryService.newPlayer(this.lotteryForm.value.etherAmount).then(resp => {
      this.enterText = 'Enter';
      if (resp) {
        this.loadContract();
        this.lotteryForm.patchValue({ etherAmount: '0' })
        alert("Good luck my friend!");
      } else {
        alert('Sorry!, there are some errors.');
      }
    });
  }

  pickWinner() {
    this.pickWinnerText = 'Waiting...';
    this.lotteryService.pickWinner().then(resp => {
      this.pickWinnerText = 'Pick a winner';
      if (resp) {
        this.loadContract();
        alert("A winner has been picked!");
      } else {
        alert('Sorry!, there are some errors.');
      }
    });
  }


}
