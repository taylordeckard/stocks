import {
	Directive,
	Input,
	OnInit,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';

@Directive({
	selector: '[appDataRender]',
})
export class DataRenderDirective implements OnInit {

	private _appDataRenderFrom: string;
	@Input() set appDataRenderFrom (val: string) {
		this._appDataRenderFrom = val;
	}

	constructor(
		private _template: TemplateRef<any>,
		private _vcr: ViewContainerRef,
	) {
	}

	public ngOnInit () {
		this._vcr.createEmbeddedView(this._template, {
			$implicit: this._appDataRenderFrom,
		});
	}

}

