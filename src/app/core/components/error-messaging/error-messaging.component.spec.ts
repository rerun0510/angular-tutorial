import { TranslateTestingModule } from 'ngx-translate-testing';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessagingComponent } from './error-messaging.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorMessagingService } from '../../services/error-messaging.service';
import { By } from '@angular/platform-browser';

describe('ErrorMessagingComponent', () => {
  let component: ErrorMessagingComponent;
  let fixture: ComponentFixture<ErrorMessagingComponent>;
  let errorMessagingServiceSpy: { clearMessageProperty: jasmine.Spy; getMessageProperty: jasmine.Spy };

  beforeEach(async(() => {
    errorMessagingServiceSpy = jasmine.createSpyObj('ErrorMessagingService', [
      'clearMessageProperty',
      'getMessageProperty'
    ]);
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateTestingModule.withTranslations({ ja: require('src/assets/i18n/ja.json') })],
      providers: [{ provide: ErrorMessagingService, useValue: errorMessagingServiceSpy }],
      declarations: [ErrorMessagingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#constructor', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#ngOnInit', () => {
    it('should init', () => {
      component.ngOnInit();
      expect(errorMessagingServiceSpy.clearMessageProperty.calls.count()).toBeGreaterThan(1);
    });

    it('should error display message', () => {
      const errorMessageProperty = 'errMessage.http.badRequest';
      const expectedValue = '入力情報が正しくありません。';

      errorMessagingServiceSpy.getMessageProperty.and.returnValue(errorMessageProperty);
      fixture.detectChanges();

      const htmlParagraphElement: HTMLParagraphElement = fixture.debugElement.query(By.css('p')).nativeElement;
      expect(htmlParagraphElement.innerText).toEqual(expectedValue);
    });
  });
});
