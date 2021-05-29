import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestSettingComponent } from './test-setting.component';

describe('TestSettingComponent', () => {
  let component: TestSettingComponent;
  let fixture: ComponentFixture<TestSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
