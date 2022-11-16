import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPageComponent } from './sign-in-page.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInRequestDto } from '../../models/dtos/requests/sign-in-request-dto';
import { SignInResponseDto } from '../../models/dtos/responses/sign-in-response-dto';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { TitleI18Service } from 'src/app/shared/services/title-i18.service';
import { of } from 'rxjs';
import { UrlConst } from '../../constants/url-const';

describe('SignInPageComponent', () => {
  const expectedSignInRequestDto: SignInRequestDto = createExpectedRequestDto();
  const expectedSignInResponseDto: SignInResponseDto = createExpectedResponseDto();
  let component: SignInPageComponent;
  let fixture: ComponentFixture<SignInPageComponent>;
  let accountServiceSpy: { signIn: jasmine.Spy; setUser: jasmine.Spy };
  let titleI18ServiceSpy: { setTitle: jasmine.Spy };
  let router: Router;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['signIn', 'setUser']);
    titleI18ServiceSpy = jasmine.createSpyObj('TitleI18Service', ['setTitle']);

    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        TranslateTestingModule.withTranslations({ ja: require('src/assets/i18n/ja.json') }),
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: TitleI18Service, useValue: titleI18ServiceSpy }
      ],
      declarations: [SignInPageComponent]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    setupBrowserLanguage('ja');
  });

  describe('#constructor', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#ngAfterViewChecked', () => {
    it('should set title', () => {
      component.ngAfterViewChecked();
      expect(titleI18ServiceSpy.setTitle.calls.count()).toBeGreaterThan(1);
    });
  });

  describe('#signIn', () => {
    it('should not sign in', () => {
      accountServiceSpy.signIn.and.returnValue(of(null));
      component.clickSignInButton();
      expect(accountServiceSpy.setUser.calls.count()).toEqual(0);
    });

    it('should sign in', () => {
      accountServiceSpy.signIn.and.returnValue(of(expectedSignInResponseDto));
      spyOn(router, 'navigate');

      component.clickSignInButton();

      expect(accountServiceSpy.setUser.calls.count()).toEqual(1);
      expect(router.navigate).toHaveBeenCalledWith([UrlConst.SLASH + UrlConst.PATH_PRODUCT_LISTING]);
    });
  });

  describe('#getLanguage', () => {
    const privateMethodName = 'getLanguage';

    it('lang without hyphen', () => {
      const language = 'ja';
      const expectedLanguage = 'ja';
      expect(component[privateMethodName](language)).toEqual(expectedLanguage);
    });

    it('lang with hyphen', () => {
      const language = 'ja-JP';
      const expectedLanguage = 'ja';
      expect(component[privateMethodName](language)).toEqual(expectedLanguage);
    });
  });
});

function createExpectedRequestDto(): SignInRequestDto {
  return { Username: 'Username', Password: 'Password' };
}

function createExpectedResponseDto(): SignInResponseDto {
  return {
    userAccount: 'userAccount',
    userName: 'userName',
    userLocale: 'ja-JP',
    userLanguage: 'ja',
    userTimezone: 'Asia/Tokyo',
    userTimezoneOffset: '+0900',
    userCurrency: 'JPY'
  };
}

function setupBrowserLanguage(language: string) {
  const defineGetter = '__defineGetter__';
  window.navigator[defineGetter]('language', () => {
    return language;
  });
}
