import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolInputComponent } from './symbol-input.component';

describe('SymbolInputComponent', () => {
  let component: SymbolInputComponent;
  let fixture: ComponentFixture<SymbolInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
