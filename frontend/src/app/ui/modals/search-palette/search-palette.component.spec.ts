import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPaletteComponent } from './search-palette.component';

describe('SearchPaletteComponent', () => {
  let component: SearchPaletteComponent;
  let fixture: ComponentFixture<SearchPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPaletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
