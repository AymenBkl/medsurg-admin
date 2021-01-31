import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddcategoryPage } from './addcategory.page';

describe('AddcategoryPage', () => {
  let component: AddcategoryPage;
  let fixture: ComponentFixture<AddcategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddcategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
