import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-style-two',
  templateUrl: './footer-style-two.component.html',
  styleUrls: ['./footer-style-two.component.scss']
})
export class FooterStyleTwoComponent implements OnInit {
  startYear = 2021;
  currentYear: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

}
