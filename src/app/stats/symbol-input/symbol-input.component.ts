import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-symbol-input',
  templateUrl: './symbol-input.component.html',
  styleUrls: ['./symbol-input.component.scss']
})
export class SymbolInputComponent implements OnInit {

  @Output() public symbolAdded = new EventEmitter<string>();
  public symbolControl = new FormControl('', [Validators.required]);
  public faPlusCircle = faPlusCircle;

  constructor() { }

  ngOnInit(): void {
  }

  public addSymbol() {
    if (this.symbolControl.valid) {
      this.symbolAdded.emit(this.symbolControl.value.toUpperCase());
      this.symbolControl.setValue('');
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.keyCode === ENTER) {
      this.addSymbol();
    }
  }

}
