import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {
  @Input() totalElements: number = 0;
  @Input() current: number = 0;
  @Output() currentChange: EventEmitter<number> = new EventEmitter();
  @Input() maxPage: number = 0;
  
  constructor() { }
  
  increasePage(){
    if(this.current>=this.maxPage)
      return;
    
    this.current++;
    this.currentChange.emit(this.current);
  }

  decreasePage(){
    if(this.current<=1)
      return;

    this.current--;
    this.currentChange.emit(this.current); 
  }

}
