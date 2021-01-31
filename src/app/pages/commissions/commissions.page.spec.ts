import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommissionsPage } from './commissions.page';

describe('CommissionsPage', () => {
  let component: CommissionsPage;
  let fixture: ComponentFixture<CommissionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
