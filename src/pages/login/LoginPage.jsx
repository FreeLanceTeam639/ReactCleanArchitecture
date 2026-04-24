import { useState } from 'react';
import { ArrowLeft, ArrowRight, AtSign, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import AnimatedCharactersLoginPage from '../../components/ui/animated-characters-login-page.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { getBillingCheckoutState } from '../../shared/lib/storage/billingCheckoutStorage.js';
import { useLoginForm } from '../../features/auth/hooks/useLoginForm.js';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.jsx';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';

function LoginAlert({ message, type }) {
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

export default function LoginPage({ navigate }) {
  const { t } = useI18n();
  const [focusMode, setFocusMode] = useState('');
  const checkoutState = getBillingCheckoutState();
  const checkoutPlanLabel = resolveCheckoutPlanLabel(checkoutState?.planKey, t);
  const checkoutCycleLabel = checkoutState?.billingPeriod === 'yearly' ? t('Yearly') : t('Monthly');
  const {
    form,
    showPassword,
    rememberMe,
    requiresTwoFactor,
    maskedTwoFactorEmail,
    isSubmitting,
    feedback,
    setFieldValue,
    setShowPassword,
    setRememberMe,
    submitLogin
  } = useLoginForm(navigate);

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
      panelClassName="animatedAuthPanelLogin"
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
      title={t('Welcome back!')}
      subtitle={t('Please enter your details')}
      notice={
        checkoutState ? (
          <div className="authCheckoutNotice">
            <span className="authCheckoutEyebrow">{t('Checkout session')}</span>
            <strong>{checkoutPlanLabel} {t('plan selected')}</strong>
            <p>{t('Sign in now and you will continue directly to the secure payment page.')} {checkoutCycleLabel}</p>
          </div>
        ) : null
      }
      alert={<LoginAlert message={feedback.message} type={feedback.type} />}
      footer={
        <p className="animatedAuthSwitch">
          {t("Don't have an account?")}{' '}
          <button
            type="button"
            className="animatedAuthInlineLink interactive"
            onClick={() => navigate(ROUTES.register)}
          >
            {t('Sign up')}
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
      isPasswordVisible={showPassword}
      hasPasswordValue={Boolean(form.password)}
    >
      <form className="animatedAuthForm" onSubmit={submitLogin}>
        <AuthField label={t('Email or Username')} icon={AtSign}>
          <input
            type="text"
            className="animatedAuthTextInput"
            value={form.emailOrUserName}
            onChange={(event) => setFieldValue('emailOrUserName', event.target.value)}
            onFocus={() => setFocusMode('identity')}
            onBlur={() => setFocusMode('')}
            placeholder={t('Please enter your email or username')}
            autoComplete="username"
            required
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
            placeholder={t('Please enter your password')}
            autoComplete="current-password"
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

        <div className="animatedAuthMetaRow">
          <label className="animatedAuthRememberRow">
            <input
              className="checkboxInput"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>{t('Remember me')}</span>
          </label>

          <button
            type="button"
            className="animatedAuthInlineLink interactive"
            onClick={() => navigate(ROUTES.forgotPassword)}
          >
            {t('Forgot password?')}
          </button>
        </div>

        {requiresTwoFactor ? (
          <AuthField label={t('Verification code')} icon={LockKeyhole}>
            <input
              type="text"
              inputMode="numeric"
              className="animatedAuthTextInput"
              value={form.twoFactorCode}
              onChange={(event) => setFieldValue('twoFactorCode', event.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={maskedTwoFactorEmail ? `${t('Code sent to')} ${maskedTwoFactorEmail}` : t('Enter 4-digit code')}
              autoComplete="one-time-code"
              required
            />
          </AuthField>
        ) : null}

        <button type="submit" className="animatedAuthSubmit interactive" disabled={isSubmitting}>
          <span>{isSubmitting ? t('Signing In...') : requiresTwoFactor ? t('Verify and sign in') : t('Sign In')}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </AnimatedCharactersLoginPage>
  );
}
