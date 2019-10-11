import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModuleSettingComponent } from './test-module-setting.component';

describe('TestModuleSettingComponent', () => {
  let component: TestModuleSettingComponent;
  let fixture: ComponentFixture<TestModuleSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestModuleSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestModuleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
