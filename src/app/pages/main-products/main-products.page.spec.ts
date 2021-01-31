import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainProductsPage } from './main-products.page';

describe('MainProductsPage', () => {
  let component: MainProductsPage;
  let fixture: ComponentFixture<MainProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
