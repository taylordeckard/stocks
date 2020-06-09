import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { StatsRoutingModule } from './stats-routing.module';
import { StatsComponent } from './stats.component';
import { SortByPipe } from '../sort-by.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SymbolInputComponent } from './symbol-input/symbol-input.component';
import { FilterHighlightedPipe } from './filter-highlighted.pipe';
import { ColorizePipe } from './colorize.pipe';
import { DataRenderDirective } from './data-render.directive';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [
    StatsComponent,
    SortByPipe,
    SymbolInputComponent,
    FilterHighlightedPipe,
    ColorizePipe,
    DataRenderDirective,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    StatsRoutingModule
  ]
})
export class StatsModule { }
