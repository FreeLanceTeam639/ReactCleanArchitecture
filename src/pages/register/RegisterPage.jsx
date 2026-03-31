import { useState } from 'react';
import { ArrowLeft, ArrowRight, AtSign, Eye, EyeOff, Globe2, LockKeyhole, Phone, UserRound } from 'lucide-react';
import AnimatedCharactersLoginPage from '../../components/ui/animated-characters-login-page.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { getBillingCheckoutState } from '../../shared/lib/storage/billingCheckoutStorage.js';
import { useRegisterForm } from '../../features/auth/hooks/useRegisterForm.js';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.jsx';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';
import CountrySelect from '../../shared/ui/CountrySelect.jsx';
import PhoneNumberField from '../../shared/ui/PhoneNumberField.jsx';

function RegisterAlert({ message, type }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'success' ? 'authAlert success' : 'authAlert error'}>{message}</div>;
}

function resolveCheckoutPlanLabel(planKey, t) {
  if (String(planKey || '').toLowerCase() === 'growth') {
    return t('Growth');
  }

  if (String(planKey || '').toLowerCase() === 'free') {
    return t('Free');
  }

  return t('Starter');
}

function AuthField({ label, icon: Icon, children }) {
  return (
    <label className="animatedAuthField">
      <span className="animatedAuthFieldLabel">{label}</span>
      <div className="animatedAuthFieldControl">
        {Icon ? <Icon className="animatedAuthFieldIcon" aria-hidden="true" /> : null}
        {children}
      </div>
    </label>
  );
}

export default function RegisterPage({ navigate }) {
  const { t } = useI18n();
  const [focusMode, setFocusMode] = useState('');
  const checkoutState = getBillingCheckoutState();
  const checkoutPlanLabel = resolveCheckoutPlanLabel(checkoutState?.planKey, t);
  const checkoutCycleLabel = checkoutState?.billingPeriod === 'yearly' ? t('Yearly') : t('Monthly');
  const {
    form,
    countries,
    isCountriesLoading,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    feedback,
    setFieldValue,
    setCountryValue,
    setShowPassword,
    setShowConfirmPassword,
    submitRegister
  } = useRegisterForm(navigate);

  const homeAction = (
    <button
      type="button"
      className="animatedAuthHomeButton interactive"
      onClick={() => navigate(ROUTES.home)}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      <span>{t('Return home')}</span>
    </button>
  );

  return (
    <AnimatedCharactersLoginPage
      shellClassName="animatedAuthShellLogin"
      stageClassName="animatedAuthStageLogin"
      panelShellClassName="animatedAuthPanelShellLogin"
      panelClassName="animatedAuthPanelLogin animatedAuthPanelRegister"
      topBar={
        <div className="animatedAuthTopActions">
          {homeAction}
          <LanguageSwitcher className="animatedAuthLanguageSwitcher" />
        </div>
      }
      brand={
        <BrandLogo
          href={ROUTES.home}
          className="brand animatedAuthBrand animatedAuthBrandMobileOnly"
          onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
        />
      }
      eyebrow=""
      title={t('Register')}
      subtitle={t('Every account starts as a client account and can unlock job posting after verification.')}
      notice={
        checkoutState ? (
          <div className="authCheckoutNotice">
            <span className="authCheckoutEyebrow">{t('Checkout session')}</span>
            <strong>{checkoutPlanLabel} {t('plan selected')}</strong>
            <p>{t('Create your account, then sign in once and we will continue to the payment page.')} {checkoutCycleLabel}</p>
          </div>
        ) : null
      }
      alert={<RegisterAlert message={feedback.message} type={feedback.type} />}
      footer={
        <p className="animatedAuthSwitch">
          {t('Already have an account?')}{' '}
          <button
            type="button"
            className="animatedAuthInlineLink interactive"
            onClick={() => navigate(ROUTES.login)}
          >
            {t('Sign In')}
          </button>
        </p>
      }
      heroBrand={
        <BrandLogo
          href={ROUTES.home}
          className="brand animatedAuthStageBrand"
          onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
        />
      }
      heroEyebrow=""
      heroTitle=""
      heroDescription=""
      heroHighlights={[]}
      heroPanelEyebrow=""
      heroPanelTitle=""
      heroPanelStatus=""
      heroPanelDescription=""
      isTyping={focusMode === 'identity'}
      isPasswordVisible={showPassword || showConfirmPassword}
      hasPasswordValue={Boolean(form.password || form.confirmPassword)}
    >
      <form className="animatedAuthForm animatedAuthRegisterForm" onSubmit={submitRegister}>
        <div className="animatedAuthGrid">
          <AuthField label={t('First Name')} icon={UserRound}>
            <input
              type="text"
              className="animatedAuthTextInput"
              value={form.firstName}
              onChange={(event) => setFieldValue('firstName', event.target.value)}
              onFocus={() => setFocusMode('identity')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please enter first name')}
              autoComplete="given-name"
              required
            />
          </AuthField>

          <AuthField label={t('Last Name')} icon={UserRound}>
            <input
              type="text"
              className="animatedAuthTextInput"
              value={form.lastName}
              onChange={(event) => setFieldValue('lastName', event.target.value)}
              onFocus={() => setFocusMode('identity')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please enter last name')}
              autoComplete="family-name"
              required
            />
          </AuthField>

          <AuthField label={t('User Name')} icon={AtSign}>
            <input
              type="text"
              className="animatedAuthTextInput"
              value={form.userName}
              onChange={(event) => setFieldValue('userName', event.target.value)}
              onFocus={() => setFocusMode('identity')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please enter user name')}
              autoComplete="username"
              required
            />
          </AuthField>

          <AuthField label={t('Your Email')} icon={AtSign}>
            <input
              type="email"
              className="animatedAuthTextInput"
              value={form.email}
              onChange={(event) => setFieldValue('email', event.target.value)}
              onFocus={() => setFocusMode('identity')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please enter your email')}
              autoComplete="email"
              required
            />
          </AuthField>

          <AuthField label={t('Country')} icon={Globe2}>
            <CountrySelect
              value={form.country}
              countries={countries}
              onChange={setCountryValue}
              disabled={isCountriesLoading}
              required
              placeholder={t('Select your country')}
              className="animatedAuthSelectInput"
            />
          </AuthField>

          <AuthField label={t('Phone Number')} icon={Phone}>
            <PhoneNumberField
              countryValue={form.country}
              countries={countries}
              value={form.phoneNumber}
              onChange={(value) => setFieldValue('phoneNumber', value)}
              disabled={isCountriesLoading}
              required
              placeholder="501234567"
              className="animatedAuthPhoneField"
            />
          </AuthField>

          <AuthField label={t('Password')} icon={LockKeyhole}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="animatedAuthTextInput animatedAuthPasswordInput"
              value={form.password}
              onChange={(event) => setFieldValue('password', event.target.value)}
              onFocus={() => setFocusMode('password')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please enter password')}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="animatedAuthPasswordToggle interactive"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setShowPassword((currentState) => !currentState)}
              aria-label={showPassword ? t('Hide password') : t('Show password')}
              title={showPassword ? t('Hide password') : t('Show password')}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </AuthField>

          <AuthField label={t('Retype Password')} icon={LockKeyhole}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="animatedAuthTextInput animatedAuthPasswordInput"
              value={form.confirmPassword}
              onChange={(event) => setFieldValue('confirmPassword', event.target.value)}
              onFocus={() => setFocusMode('password')}
              onBlur={() => setFocusMode('')}
              placeholder={t('Please retype password')}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="animatedAuthPasswordToggle interactive"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setShowConfirmPassword((currentState) => !currentState)}
              aria-label={showConfirmPassword ? t('Hide password') : t('Show password')}
              title={showConfirmPassword ? t('Hide password') : t('Show password')}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </AuthField>
        </div>

        <button type="submit" className="animatedAuthSubmit interactive" disabled={isSubmitting}>
          <span>{isSubmitting ? t('Creating Account...') : t('Join Now')}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </AnimatedCharactersLoginPage>
  );
}
