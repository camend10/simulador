import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: ``
})
export class NopagefoundComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    const bodyTag = document.body;
    bodyTag.style.backgroundImage = "url('../../../assets/media/auth/bg1.jpg')";
  }
  ngOnDestroy(): void {
    const bodyTag = document.body;
    bodyTag.style.backgroundImage = "";
  }

}
